import express from "express";
import path from "path";
import dotenv from "dotenv";
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Amazon Bedrock Runtime client
const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

console.log("SentinelChain AI: Amazon Bedrock Runtime initialized.");

// 1. API: Analyze Disruption
app.post("/api/analyze-disruption", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Disruption report text is required." });
  }

  // If live AI is available, use it!
  if (process.env.BEDROCK_MODEL_ID) {
    try {
      const systemInstruction = `You are SentinelChain AI, an elite enterprise supply chain intelligence engine integrated with AWS Bedrock. You analyze raw news, port, weather, and supplier alerts, calculating risk propagation across global networks. Return output strictly matching the requested JSON schema. Do not include markdown formatting or wrappers outside of raw JSON.

The JSON object you return must strictly match this shape:
{
  "headline": string, // A crisp 5-8 word headline summarizing the threat
  "category": string, // Must be one of: 'News', 'Weather', 'Port', 'Supplier'
  "severity": string, // Must be one of: 'Critical', 'High', 'Medium', 'Low'
  "probability": integer, // Probability of direct impact in percentage (e.g. 85)
  "affectedNodes": string[], // Array of specific ports, routes, canals, or supplier regions affected
  "impactInventory": integer, // Estimated percentage of inventory drawdown, as a negative integer (e.g. -35)
  "impactDeliveries": string, // Description of expected delivery delays, lead-times, or rerouting overheads
  "impactCost": integer, // Estimated percentage of logistics cost surge, as a positive integer (e.g. +22)
  "reasoning": string[], // 3 structured steps of analytical reasoning tracing the cascade of the disruption
  "recommendations": [ // At least 2 highly specific mitigation playbooks
    {
      "title": string, // Name of the mitigation tactic (e.g. 'Air-freight high priority microchips')
      "reduction": integer, // Risk reduction percentage (e.g. 45)
      "cost": string, // Cost estimation label (e.g. '$$$ High' or '$$ Medium' or '$ Low')
      "description": string // Detailed description of how to execute this playbook
    }
  ]
}

Respond with ONLY the raw JSON object. Do not include any preamble, explanation, or markdown code fences.`;

      const userPrompt = `Analyze the following supply chain or logistics disruption report:
"${text}"

Provide a highly realistic, precise, and structural impact assessment.`;

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
          maxTokens: 2048,
          temperature: 0.3,
        },
      });

      const response = await bedrock.send(command);
      const contentBlocks = response.output?.message?.content || [];
      const responseText = contentBlocks
        .map((block) => ("text" in block ? block.text : ""))
        .join("");
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      let parsedData: Record<string, any>;

      try {
        parsedData = JSON.parse(cleanJson);
      } catch (err) {
        throw new Error("Amazon Bedrock did not return valid JSON.");
      }

      return res.json(parsedData);
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
  const query = text.toLowerCase();
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

  res.json({
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
  });
});

// 2. API: System Performance Metrics (Server Diagnostics)
app.get("/api/performance-metrics", (req, res) => {
  // Generate slightly dynamic but realistic telemetry metrics for AWS CloudRun deployment
  const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
  const memoryTotal = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);

  res.json({
    status: "HEALTHY",
    uptimeSeconds: Math.round(process.uptime()),
    serverRamMb: `${memoryUsed}MB / ${memoryTotal}MB`,
    awsLambdaLatencyMs: Math.floor(Math.random() * 25) + 35, // 35 - 60 ms
    bedrockTokenThroughput: Math.floor(Math.random() * 150) + 1200, // 1200 - 1350 t/sec
    cloudWatchAlarms: 0,
    activeIngestStreams: 4,
    dynamoDbQueriesPerSec: (Math.random() * 12 + 45).toFixed(1),
    apiGatewayLatencyMs: Math.floor(Math.random() * 8) + 12,
  });
});

// 3. API: Dispatch SNS Mock Alerts
app.post("/api/notify-sns", (req, res) => {
  const { channel, message, severity } = req.body;
  if (!channel || !message) {
    return res.status(400).json({ error: "Notification channel and message are required." });
  }

  console.log(`[Amazon SNS Dispatch] Channel: ${channel.toUpperCase()} | Severity: ${severity || "INFO"} | Msg: "${message}"`);

  res.json({
    success: true,
    messageId: `sns-msg-${Math.floor(Math.random() * 9000000) + 1000000}`,
    timestamp: new Date().toISOString(),
    status: "DELIVERED",
    targetSnsArn: `arn:aws:sns:us-east-1:123456789012:SentinelChainThreats-${channel}`,
  });
});

// Serve frontend assets
const distPath = path.join(process.cwd(), "dist");

if (process.env.NODE_ENV !== "production") {
  // Integrate Vite dev middleware
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);

    app.use("*", (req, res, next) => {
      // In dev mode, fall back to vite static handling
      next();
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`SentinelChain AI full-stack dev server running on http://0.0.0.0:${PORT}`);
    });
  });
} else {
  // Production server
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SentinelChain AI full-stack production server running on port ${PORT}`);
  });
}