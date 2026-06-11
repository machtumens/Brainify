import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import OpenAI from 'openai';

// Validate env vars at module load — warn and skip missing providers, never throw.
const PROVIDERS_CONFIG = [
  {
    name: 'gemini',
    key: process.env.GEMINI_API_KEY,
    available: Boolean(process.env.GEMINI_API_KEY),
  },
  {
    name: 'groq',
    key: process.env.GROQ_API_KEY,
    available: Boolean(process.env.GROQ_API_KEY),
  },
  {
    name: 'openrouter',
    key: process.env.OPENROUTER_API_KEY,
    available: Boolean(process.env.OPENROUTER_API_KEY),
  },
];

// Providers without keys are silently skipped at runtime.

async function callGemini(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callGroq(prompt) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  });
  return completion.choices[0].message.content;
}

async function callOpenRouter(prompt) {
  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  const completion = await client.chat.completions.create({
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    messages: [{ role: 'user', content: prompt }],
  });
  return completion.choices[0].message.content;
}

const PROVIDER_FNS = { gemini: callGemini, groq: callGroq, openrouter: callOpenRouter };

export async function callAI(prompt) {
  const available = PROVIDERS_CONFIG.filter((p) => p.available);
  if (available.length === 0) {
    throw new Error('AI service unavailable');
  }

  for (const { name } of available) {
    try {
      const text = await PROVIDER_FNS[name](prompt);
      return { text, provider: name };
    } catch {
      // continue to next provider regardless of error type
    }
  }

  throw new Error('AI service unavailable');
}

export function buildPrompt(instruction, context) {
  return `${instruction}\n\n--- CONTEXT ---\n${JSON.stringify(context, null, 2)}`;
}
