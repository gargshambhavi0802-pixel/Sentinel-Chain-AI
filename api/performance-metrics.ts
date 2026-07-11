import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPerformanceMetrics } from "./_lib/sentinel.js";

// Vercel Serverless Function -> GET /api/performance-metrics
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  return res.status(200).json(getPerformanceMetrics());
}
