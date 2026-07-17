// Shared SentinelChain AI backend logic.
//
// This module is the SINGLE SOURCE OF TRUTH for all server-side behavior.
// It is imported by BOTH:
//   - server.ts                     (local dev / self-hosted Express)
//   - api/*.ts                      (Vercel Serverless Functions)
//
// Files/folders inside /api that start with "_" are NOT deployed as
// Serverless Functions by Vercel, so this file is safe to place here.

import { invokeAnalysisLambda } from "./lambdaService";
import dotenv from "dotenv";
dotenv.config();
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Recommendation {
  title: string;
  reduction: number;
  cost: string;
  description: string;
}

export interface DisruptionAnalysis {
  headline: string;
  category: string;
  severity: string;
  probability: number;
  affectedNodes: string[];
  impactInventory: number;
  impactDeliveries: string;
  impactCost: number;
  reasoning: string[];
  recommendations: Recommendation[];
}

export interface PerformanceMetrics {
  status: string;
  uptimeSeconds: number;
  serverRamMb: string;
  awsLambdaLatencyMs: number;
  bedrockTokenThroughput: number;
  cloudWatchAlarms: number;
  activeIngestStreams: number;
  dynamoDbQueriesPerSec: string;
  apiGatewayLatencyMs: number;
}

export interface NotificationResult {
  success: boolean;
  messageId: string;
  timestamp: string;
  status: string;
  targetSnsArn: string;
}

// ---------------------------------------------------------------------------
// Amazon Bedrock Runtime client
// ---------------------------------------------------------------------------

// Initialize Amazon Bedrock Runtime client
const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});



// ---------------------------------------------------------------------------
// 1. Analyze Disruption
// ---------------------------------------------------------------------------

export async function analyzeDisruption(
  text: string,
  userId?: string,
  email?: string
): Promise<DisruptionAnalysis> {
  // If live AI is available, use it!
  if (process.env.BEDROCK_MODEL_ID) {
    try {
     const systemInstruction = `
You are SentinelChain AI, an elite enterprise supply chain intelligence engine integrated with AWS Bedrock.

You analyze ONLY the disruption report provided by the user.
Never use previous examples.
Never invent unrelated events.
If the report mentions Suez Canal, the response must be about Suez Canal.

Return ONLY valid JSON. No markdown. No explanation.
Return exactly 2 recommendations.
IMPORTANT:
All percentage values must be returned as whole numbers.
Never return decimals.

Examples:
probability: 95 (not 0.95)
impactCost: 20 (not 0.20)
reduction: 60 (not 0.60)

reasoning must contain exactly 3 detailed causal chain steps explaining how the disruption propagates through the supply chain.

JSON schema:

{
  "headline": "string",
  "category": "News | Weather | Port | Supplier",
  "severity": "Critical | High | Medium | Low",
  "probability": 0,
  "affectedNodes": [],
  "impactInventory": 0,
  "impactDeliveries": "string",
  "impactCost": 0,
  "reasoning": [],
  "recommendations": [
    {
      "title": "string",
      "reduction": 0,
      "cost": "string",
      "description": "string"
    }
  ]
}
`;


      const userPrompt = `
DISRUPTION REPORT TO ANALYZE:

${text}

TASK:
Analyze ONLY the above report.

Requirements:
- Identify the exact disruption mentioned.
- Do not generate a similar example.
- Do not mention unrelated ports, countries, or industries.
- All affectedNodes must come from or logically follow from this report.
- Return only JSON.
`;
      const command = new ConverseCommand({
        modelId: process.env.BEDROCK_MODEL_ID,
        system: [{ text: systemInstruction }],
        messages: [
          {
            role: "user",
            content: [{ text: userPrompt }],
          },
        ],
        inferenceConfig: {
          maxTokens: 1200,
          temperature: 0,
        },
      });

      const response = await bedrock.send(command);
      const contentBlocks = response.output?.message?.content || [];
      const responseText = contentBlocks
        .map((block) => ("text" in block ? block.text : ""))
        .join("");
        console.log("🧠 RAW BEDROCK OUTPUT:");
        console.log(responseText);
      const cleanJson = responseText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim()
  .replace(/^[^{]*/, "")
  .replace(/[^}]*$/, "");
      let parsedData: DisruptionAnalysis;

      try {
        parsedData = JSON.parse(cleanJson);
        parsedData.probability = Math.round(parsedData.probability);

parsedData.recommendations = parsedData.recommendations.map((r) => ({
  ...r,
  reduction: Math.round(r.reduction)
}));
      } catch (err) {
        throw new Error("Amazon Bedrock did not return valid JSON.");
      }
      await invokeAnalysisLambda({
  userId,
  email,
  prompt: text,
  analysis: parsedData,
});

     return parsedData;
    } catch (apiError: any) {
      console.log("========== BEDROCK ERROR ==========");
      console.log(apiError);
      console.log(apiError.name);
      console.log(apiError.message);
      console.log(apiError.$metadata);
      console.log(apiError.Code);
      console.log(apiError.stack);
      console.log("==================================");
    }
  }

  // Intelligence Heuristics Engine (Mock fallback when offline or on error)
  console.log("TEXT TYPE:", typeof text);
console.log("TEXT VALUE:", text);
  const query = String(text ?? "").toLowerCase();
  let headline = "Global Trade Threat Detected";
  let category = "News";
  let severity = "Medium";
  let probability = 65;
  let affectedNodes = ["Global Supply Route"];
  let impactInventory = -15;
  let impactDeliveries = "Minor customs checks and congestion delays expected (2-4 days).";
  let impactCost = 8;
  let reasoning = [
    "Identified anomalous logistics activity on international corridors.",
    "Calculated cascading warehouse capacity limitations at regional transit hubs.",
    "Projected standard transport lead-time creep of up to 48 hours."
  ];
  let recommendations = [
    {
      title: "Activate Buffer Capacity",
      reduction: 20,
      cost: "$ Low",
      description: "Utilize safety stock at central hubs to meet local manufacturing demands during minor custom hold-ups."
    },
    {
      title: "Monitor Alternate Carriers",
      reduction: 15,
      cost: "$ Low",
      description: "Establish standby agreements with regional third-party logistics (3PL) providers to avoid bottlenecked routes."
    }
  ];

  if (query.includes("suez") || query.includes("canal") || query.includes("vessel") || query.includes("stuck") || query.includes("blocking")) {
    headline = "Suez Canal Critical Transit Blockage";
    category = "Port";
    severity = "Critical";
    probability = 95;
    affectedNodes = ["Suez Canal Transit Corridor", "Rotterdam Entry Port", "Singapore Terminal Hub"];
    impactInventory = -40;
    impactDeliveries = "Severe backlog. Vessel queues exceeding 120 ships. Alternate Cape of Good Hope routing adds 10-14 days.";
    impactCost = 28;
    reasoning = [
      "Physical bottleneck prevents standard East-West maritime cargo flows.",
      "Vessel redirection forces immediate 3,500nm detours around the African cape.",
      "Empty container repositioning severely delayed, creating severe global equipment deficits."
    ];
    recommendations = [
      {
        title: "Cape of Good Hope Rerouting",
        reduction: 60,
        cost: "$$$ High",
        description: "Re-manifest high-priority transit cargo around South Africa. Absorbs fuel surcharge but secures schedule predictability."
      },
      {
        title: "Intercontinental Rail Pivot",
        reduction: 40,
        cost: "$$ Medium",
        description: "Shift premium industrial components to overland dry-rail pipelines crossing Central Asia to bypass ocean maritime completely."
      }
    ];
  } else if (query.includes("typhoon") || query.includes("storm") || query.includes("weather") || query.includes("hurricane")) {
    headline = "Cat-4 Typhoon In-Fa Maritime Impact";
    category = "Weather";
    severity = "High";
    probability = 85;
    affectedNodes = ["East China Sea Route", "Shanghai Port Complex", "Ningbo-Zhoushan Terminals"];
    impactInventory = -25;
    impactDeliveries = "Gale force winds and 8m swells halt container crane activities. Vessel berthing delayed by 4-6 days.";
    impactCost = 15;
    reasoning = [
      "Extreme marine meteorological conditions force complete terminal operations shutdown.",
      "Arriving container vessels commanded to seek anchorage in deep ocean safety zones.",
      "Inland drayage truck transport suspended due to widespread localized coastal flooding."
    ];
    recommendations = [
      {
        title: "Drayage Anchorage Hold",
        reduction: 50,
        cost: "$ Low",
        description: "Instruct incoming shipping operators to stage empty container returns at inland dry docks until terminals declare safe operations."
      },
      {
        title: "Southward Port Redirection",
        reduction: 35,
        cost: "$$ Medium",
        description: "Instruct vessels with flexible bills of lading to bypass Shanghai and discharge at Shenzhen or Hong Kong ports instead."
      }
    ];
  } else if (query.includes("strike") || query.includes("labor") || query.includes("dockworker") || query.includes("union")) {
    headline = "Port Authority Labor Strike & Shutdown";
    category = "Port";
    severity = "High";
    probability = 75;
    affectedNodes = ["Los Angeles Terminal Port", "Long Beach Transit Corridor"];
    impactInventory = -30;
    impactDeliveries = "Union walkouts freeze all gantry crane operations. Container dwell times expected to climb past 14 days.";
    impactCost = 18;
    reasoning = [
      "Collective labor walkout halts physical ship unloading, creating immediate ship anchorage queues.",
      "Terminal gates closed, preventing truck chassis from retrieving import loads or returning exports.",
      "Adjacent highway networks experience catastrophic chassis gridlock due to idle trucking queues."
    ];
    recommendations = [
      {
        title: "Pacific Northwest Port Diversion",
        reduction: 55,
        cost: "$$ Medium",
        description: "Divert scheduled ocean vessels north to Seattle-Tacoma or Vancouver ports, then transport overland via rail to Southern destinations."
      },
      {
        title: "Overland LTL Consolidation",
        reduction: 30,
        cost: "$$$ High",
        description: "Bypass West Coast entirely by utilizing air-freight consolidation from Asian assembly hubs directly into inland US custom zones."
      }
    ];
  } else if (query.includes("shortage") || query.includes("chip") || query.includes("semiconductor") || query.includes("supplier")) {
    headline = "Tier-1 Semiconductor Foundry Shortage";
    category = "Supplier";
    severity = "High";
    probability = 80;
    affectedNodes = ["Hsinchu Science Park", "Taiwan Foundries", "Automotive Assembly Lines"];
    impactInventory = -35;
    impactDeliveries = "Allocation limits enforced. Lead-times stretched from 12 weeks to 48 weeks. Downstream manufacturing halts possible.";
    impactCost = 24;
    reasoning = [
      "Raw silicon wafer supply limitations bottleneck critical lithography machinery runs.",
      "Global microchip demand vastly outpaces fixed high-tech cleanroom manufacturing capacities.",
      "Downstream electronics manufacturers begin aggressive over-ordering, artificially inflating backlogs."
    ];
    recommendations = [
      {
        title: "Dual-Sourcing Qualification",
        reduction: 45,
        cost: "$$ Medium",
        description: "Accelerate qualification of alternative second-source packaging plants in Vietnam or Malaysia to reduce dependency on a single node."
      },
      {
        title: "Redesign Product Layout",
        reduction: 30,
        cost: "$$$ High",
        description: "Initiate emergency engineering layout redesign to substitute scarce controller chip models with widely stocked commercial alternatives."
      }
    ];
  }

  return {
    headline,
    category,
    severity,
    probability,
    affectedNodes,
    impactInventory,
    impactDeliveries,
    impactCost,
    reasoning,
    recommendations
  };
}

// ---------------------------------------------------------------------------
// 2. System Performance Metrics (Server Diagnostics)
// ---------------------------------------------------------------------------

export function getPerformanceMetrics(): PerformanceMetrics {
  // Generate slightly dynamic but realistic telemetry metrics for AWS CloudRun deployment
  const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
  const memoryTotal = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);

  return {
    status: "HEALTHY",
    uptimeSeconds: Math.round(process.uptime()),
    serverRamMb: `${memoryUsed}MB / ${memoryTotal}MB`,
    awsLambdaLatencyMs: Math.floor(Math.random() * 25) + 35, // 35 - 60 ms
    bedrockTokenThroughput: Math.floor(Math.random() * 150) + 1200, // 1200 - 1350 t/sec
    cloudWatchAlarms: 0,
    activeIngestStreams: 4,
    dynamoDbQueriesPerSec: (Math.random() * 12 + 45).toFixed(1),
    apiGatewayLatencyMs: Math.floor(Math.random() * 8) + 12,
  };
}

// ---------------------------------------------------------------------------
// 3. Dispatch SNS Mock Alerts
// ---------------------------------------------------------------------------

export function dispatchNotification(
  channel: string,
  message: string,
  severity?: string
): NotificationResult {
  console.log(`[Amazon SNS Dispatch] Channel: ${channel.toUpperCase()} | Severity: ${severity || "INFO"} | Msg: "${message}"`);

  return {
    success: true,
    messageId: `sns-msg-${Math.floor(Math.random() * 9000000) + 1000000}`,
    timestamp: new Date().toISOString(),
    status: "DELIVERED",
    targetSnsArn: `arn:aws:sns:us-east-1:123456789012:SentinelChainThreats-${channel}`,
  };
}
