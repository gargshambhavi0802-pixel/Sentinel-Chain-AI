import type { VercelRequest, VercelResponse } from "@vercel/node";
import { analyzeDisruption } from "./_lib/sentinel";

// Vercel Serverless Function -> POST /api/analyze-disruption
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text } = req.body ?? {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Disruption report text is required." });
  }

  const result = await analyzeDisruption(text);
  return res.status(200).json(result);
}
