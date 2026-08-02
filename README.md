<div align="center">

# 🛡️ Sentinel-Chain-AI

An AI-powered security intelligence platform that analyzes applications, detects vulnerabilities, and provides actionable insights through an interactive dashboard.

### 🌐 Live Demo
https://sentinel-chain-dqou32y80-siddhigrg1201-2508s-projects.vercel.app

</div>

---

## Features

- 🔍 AI-powered security analysis
- 📊 Interactive dashboard
- 📈 Real-time insights
- 📱 Responsive design
- ⚡ Fast and modern UI

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Gemini API

## Installation

```bash
npm install
```

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_api_key
```

Run locally:

```bash
npm run dev
```

## Backend Architecture

All server-side logic lives in `api/_lib/sentinel.ts`, which is the single
source of truth shared by both runtimes:

- `server.ts` — Express server used for local dev and self-hosted production
- `api/*.ts` — Vercel Serverless Functions (files prefixed with `_` are not deployed as functions)

Supporting services:

| Module | Responsibility |
| --- | --- |
| `api/_lib/lambdaService.ts` | Invokes the analysis persistence Lambda |
| `api/_lib/dynamoService.ts` / `dynamodb.ts` | DynamoDB persistence |
| `api/_lib/eventBridgeService.ts` | Publishes domain events to Amazon EventBridge |

Amazon Cognito authentication is handled entirely on the client via AWS Amplify
(`src/awsConfig.ts`).

## Event Flow — AI Analysis Notifications

Once Amazon Bedrock returns a valid analysis, an `AIAnalysisCompleted` event is
published to a custom EventBridge bus, which fans out to email through SNS:

```
Frontend
   ↓  POST /api/analyze-disruption
Backend API  (server.ts | api/analyze-disruption.ts)
   ↓
analyzeDisruption()  →  Amazon Bedrock (Converse API)
   ↓
Valid AI analysis parsed
   ↓                                  ↘ (fire-and-forget, non-blocking)
AI response returned to frontend       publishAIAnalysisCompleted()
                                          ↓
                                       EventBridge bus: SentinelChainBus
                                          ↓  AIAnalysisCompletedRule
                                       SNS topic: SentinelChainAlerts
                                          ↓
                                       Email notification
```

Event contract:

| Field | Value |
| --- | --- |
| `source` | `sentinel.ai` |
| `detail-type` | `AIAnalysisCompleted` |
| `detail` | The Bedrock analysis (`headline`, `category`, `severity`, `probability`, `affectedNodes`, `impactInventory`, `impactDeliveries`, `impactCost`, `reasoning`, `recommendations`) plus `analysisId`, `timestamp`, `status`, `model`, `recommendedAction`, and `userId`/`email` when supplied |

Notes:

- The event is published **only** after Bedrock returns a valid analysis. The
  heuristic fallback path does not publish.
- Publishing is fire-and-forget and never awaited on the response path, so
  notifications cannot add latency to the API response.
- EventBridge failures are logged and swallowed — the AI response is always
  returned to the user regardless.

## Environment Variables

See `.env.example`. Server-side variables:

| Variable | Purpose |
| --- | --- |
| `AWS_REGION` | Region for all AWS SDK clients (`us-east-1`) |
| `AWS_ACCESS_KEY_ID` | Shared IAM credentials (Bedrock, Lambda, DynamoDB, EventBridge) |
| `AWS_SECRET_ACCESS_KEY` | Shared IAM credentials |
| `BEDROCK_MODEL_ID` | Bedrock model used for analysis; unset disables live AI |
| `EVENT_BUS_NAME` | EventBridge custom bus (`SentinelChainBus`); unset skips publishing |

Client-side (Vite) variables: `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`.

The IAM user must have `events:PutEvents` on the `SentinelChainBus` bus.

## Live Demo

https://sentinel-chain-dqou32y80-siddhigrg1201-2508s-projects.vercel.app
