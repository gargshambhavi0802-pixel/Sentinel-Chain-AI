// Amazon EventBridge integration for SentinelChain AI.
//
// Publishes domain events onto the "SentinelChainBus" custom event bus.
// The pre-provisioned "AIAnalysisCompletedRule" matches
// source="sentinel.ai" + detail-type="AIAnalysisCompleted" and forwards the
// event to the "SentinelChainAlerts" SNS topic, which fans out to email.
//
// Design rules:
//   - Reuses the SAME AWS configuration/credentials as Bedrock & Lambda
//     (region from AWS_REGION, credentials from the default SDK chain).
//   - NEVER throws. Notification delivery must never prevent a user from
//     receiving their AI analysis.

import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { randomUUID } from "node:crypto";
import type { DisruptionAnalysis } from "./sentinel";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AIAnalysisCompletedDetail extends DisruptionAnalysis {
  analysisId: string;
  timestamp: string;
  status: string;
  model?: string;
  userId?: string;
  email?: string;
  /** Highest-value action, derived from the first Bedrock recommendation. */
  recommendedAction?: string;
}

export interface PublishAIAnalysisInput {
  analysis: DisruptionAnalysis;
  userId?: string;
  email?: string;
}

// ---------------------------------------------------------------------------
// Amazon EventBridge client
// ---------------------------------------------------------------------------

const EVENT_SOURCE = "sentinel.ai";
const DETAIL_TYPE_AI_ANALYSIS_COMPLETED = "AIAnalysisCompleted";

// Same configuration as the Bedrock / Lambda clients: region from the
// environment, credentials resolved by the default AWS SDK credential chain
// (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) — no separate credential setup.
//
// Created lazily and cached, so the region is read after dotenv has populated
// the environment and no client is built for requests that never publish.
let eventBridge: EventBridgeClient | undefined;

function getClient(): EventBridgeClient {
  if (!eventBridge) {
    eventBridge = new EventBridgeClient({
      region: process.env.AWS_REGION,
    });
  }
  return eventBridge;
}

// ---------------------------------------------------------------------------
// Generic publisher
// ---------------------------------------------------------------------------

/**
 * Puts a single event on the SentinelChain event bus.
 * Resolves to `true` on success and `false` on any failure — it never rejects.
 */
async function publishEvent(
  detailType: string,
  detail: object
): Promise<boolean> {
  const eventBusName = process.env.EVENT_BUS_NAME;

  if (!eventBusName) {
    console.warn(
      "[EventBridge] EVENT_BUS_NAME is not set — skipping event publish."
    );
    return false;
  }

  try {
    const response = await getClient().send(
      new PutEventsCommand({
        Entries: [
          {
            EventBusName: eventBusName,
            Source: EVENT_SOURCE,
            DetailType: detailType,
            Detail: JSON.stringify(detail),
            Time: new Date(),
          },
        ],
      })
    );

    // PutEvents returns HTTP 200 even for per-entry failures, so the entry
    // result has to be inspected explicitly.
    if (response.FailedEntryCount && response.FailedEntryCount > 0) {
      const [entry] = response.Entries ?? [];
      console.error(
        `[EventBridge] Failed to publish "${detailType}" to ${eventBusName}: ` +
          `${entry?.ErrorCode ?? "UnknownError"} - ${entry?.ErrorMessage ?? "no details"}`
      );
      return false;
    }

    const [entry] = response.Entries ?? [];
    console.log(
      `[EventBridge] Published "${detailType}" to ${eventBusName} (EventId: ${entry?.EventId ?? "n/a"})`
    );
    return true;
  } catch (error) {
    console.error(
      `[EventBridge] Error publishing "${detailType}" to ${eventBusName}:`,
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

// ---------------------------------------------------------------------------
// Domain events
// ---------------------------------------------------------------------------

/**
 * Publishes the "AIAnalysisCompleted" event after Amazon Bedrock has returned
 * a valid analysis. Routed by AIAnalysisCompletedRule -> SentinelChainAlerts
 * (SNS) -> email subscription.
 *
 * Fire-and-forget by design: callers must NOT await this on the response path.
 * Failures are logged and swallowed.
 */
export async function publishAIAnalysisCompleted({
  analysis,
  userId,
  email,
}: PublishAIAnalysisInput): Promise<boolean> {
  const detail: AIAnalysisCompletedDetail = {
    ...analysis,
    analysisId: randomUUID(),
    timestamp: new Date().toISOString(),
    status: "COMPLETED",
    model: process.env.BEDROCK_MODEL_ID,
    ...(userId ? { userId } : {}),
    ...(email ? { email } : {}),
    ...(analysis.recommendations?.[0]?.title
      ? { recommendedAction: analysis.recommendations[0].title }
      : {}),
  };

  return publishEvent(DETAIL_TYPE_AI_ANALYSIS_COMPLETED, detail);
}
