import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import {
  analyzeDisruption,
  getPerformanceMetrics,
  dispatchNotification,
} from "./api/_lib/sentinel";

// Load environment variables
dotenv.config();
console.log(
  "Access Key:",
  process.env.AWS_ACCESS_KEY_ID?.substring(0, 8)
);
console.log("AWS_REGION:", process.env.AWS_REGION);
console.log("AWS_ACCESS_KEY_ID exists:", !!process.env.AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY exists:", !!process.env.AWS_SECRET_ACCESS_KEY);

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. API: Analyze Disruption
// 1. API: Analyze Disruption
app.post("/api/analyze-disruption", async (req, res) => {

  console.log("🚀 API HIT");
  console.log("BODY:", req.body);

  const { text, userId, email } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Disruption report text is required." });
  }

  try {
    console.log("🤖 CALLING analyzeDisruption");

    const result = await analyzeDisruption(
  text,
  userId,
  email
);

    console.log("✅ analyzeDisruption DONE");
    console.log(result);

    res.json(result);

  } catch (error) {
    console.error("❌ ANALYZE ERROR:", error);

    res.status(500).json({
      error: "Failed to analyze disruption",
      details: error instanceof Error ? error.message : error,
    });
  }
});
// 2. API: System Performance Metrics (Server Diagnostics)
app.get("/api/performance-metrics", (req, res) => {
  res.json(getPerformanceMetrics());
});

// 3. API: Dispatch SNS Mock Alerts
app.post("/api/notify-sns", (req, res) => {
  const { channel, message, severity } = req.body;
  if (!channel || !message) {
    return res.status(400).json({ error: "Notification channel and message are required." });
  }

  res.json(dispatchNotification(channel, message, severity));
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
