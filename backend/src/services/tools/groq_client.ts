import Groq from "groq-sdk";
import dotenv from "dotenv";
import logger from "../../config/logger";

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables");
}

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const MODELS = {
  GENERATOR: "llama-3.3-70b-versatile",
  PLANNER: "llama-3.1-8b-instant",
  JUDGE: "llama-3.1-8b-instant",
  SAFETY: "llama-3.1-8b-instant",
  REPAIR: "llama-3.1-8b-instant",
} as const;

export const CONFIG = {
  BATCH_SIZE: 5,
  MAX_QUESTIONS: 30,
  SIMILARITY_THRESHOLD: 0.92,
  JUDGE_BATCH_SIZE: 5,
  LLM_JUDGE_MIN_SCORE: 6,
  LLM_JUDGE_MIN_PRACTICALITY: 5,
  LLM_JUDGE_MIN_DISTRACTOR: 5,
  CONCURRENCY: 1,
  RETRY_MAX: 5,
  RETRY_BASE_MS: 10000,
  MIN_REQUEST_GAP_MS: 5000,
};

let _lastCallAt = 0;

async function throttle() {
  const gap = Date.now() - _lastCallAt;
  if (gap < CONFIG.MIN_REQUEST_GAP_MS) {
    await new Promise((r) => setTimeout(r, CONFIG.MIN_REQUEST_GAP_MS - gap));
  }
  _lastCallAt = Date.now();
}

export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0;
  while (true) {
    await throttle();
    try {
      return await fn();
    } catch (err: any) {
      const status: number | undefined = err?.status;
      const retryable =
        status === 429 || (status !== undefined && status >= 500);
      if (!retryable || attempt >= CONFIG.RETRY_MAX) throw err;

      const delay = CONFIG.RETRY_BASE_MS * 2 ** attempt + Math.random() * 1000;
      logger.warn(
        `[retry ${attempt + 1}/${CONFIG.RETRY_MAX}] HTTP ${status} — ` +
          `waiting ${Math.round(delay / 1000)}s before next attempt...`,
      );
      await new Promise((r) => setTimeout(r, delay));
      attempt++;
    }
  }
}

export async function withConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      const idx = next++;
      results[idx] = await tasks[idx]();
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, worker),
  );
  return results;
}
