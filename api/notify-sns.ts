import type { VercelRequest, VercelResponse } from "@vercel/node";
import { dispatchNotification } from "./_lib/sentinel.js";

// Vercel Serverless Function -> POST /api/notify-sns
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { channel, message, severity } = req.body ?? {};
  if (!channel || !message) {
    return res.status(400).json({ error: "Notification channel and message are required." });
  }

  return res.status(200).json(dispatchNotification(channel, message, severity));
}
