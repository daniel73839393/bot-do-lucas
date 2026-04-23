import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

const openaiKey =
  process.env.OPENAI_API_KEY ?? process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const openaiBaseUrl =
  process.env.OPENAI_BASE_URL ?? process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

if (!openaiKey) {
  throw new Error(
    "Missing OpenAI key. Set OPENAI_API_KEY (Railway) or AI_INTEGRATIONS_OPENAI_API_KEY (Replit)."
  );
}

export const openai = new OpenAI({
  apiKey: openaiKey,
  ...(openaiBaseUrl ? { baseURL: openaiBaseUrl } : {}),
});

const geminiKey =
  process.env.GEMINI_API_KEY ?? process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const geminiBaseUrl =
  process.env.GEMINI_BASE_URL ?? process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

if (!geminiKey) {
  throw new Error(
    "Missing Gemini key. Set GEMINI_API_KEY (Railway) or AI_INTEGRATIONS_GEMINI_API_KEY (Replit)."
  );
}

export const gemini = new GoogleGenAI({
  apiKey: geminiKey,
  ...(geminiBaseUrl ? { httpOptions: { baseUrl: geminiBaseUrl } } : {}),
});

export const grokKey = process.env.GROK_API_KEY ?? "";
export const grokBaseUrl = process.env.GROK_BASE_URL ?? "https://api.x.ai/v1";

export const grok = grokKey
  ? new OpenAI({ apiKey: grokKey, baseURL: grokBaseUrl })
  : null;
