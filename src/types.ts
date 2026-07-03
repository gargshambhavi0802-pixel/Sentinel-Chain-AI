/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Recommendation {
  title: string;
  reduction: number;
  cost: string; // e.g. "$ Low", "$$ Medium", "$$$ High"
  description: string;
}

export interface Disruption {
  id?: string;
  headline: string;
  category: "News" | "Weather" | "Port" | "Supplier";
  severity: "Critical" | "High" | "Medium" | "Low";
  probability: number; // 0 - 100
  affectedNodes: string[];
  impactInventory: number; // as a negative number, e.g. -35
  impactDeliveries: string;
  impactCost: number; // as a positive number, e.g. +22
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

export type IAMRoleType = "SystemAdministrator" | "LogisticsOfficer" | "SolutionsArchitect" | "SecurityAuditor";

export interface IAMRole {
  type: IAMRoleType;
  title: string;
  description: string;
  clearanceLevel: string;
  badgeColor: string;
  permissions: string[];
}
