// api/chat.js
import OpenAI from "openai";
import { WOODY_SYSTEM_PROMPT } from "../src/systemPrompt.js";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || "").trim();
    if (!OPENAI_API_KEY) {
      res.status(500).json({ error: "Missing OPENAI_API_KEY" });
      return;
    }

    const { message } = req.body || {};
    const userText = String(message || "").trim();

    if (!userText) {
      res.status(400).json({ error: "Missing message" });
      return;
    }

    const client = new OpenAI({ apiKey: OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      messages: [
        { role: "system", content: WOODY_SYSTEM_PROMPT },
        { role: "user", content: userText },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("api/chat.js error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
