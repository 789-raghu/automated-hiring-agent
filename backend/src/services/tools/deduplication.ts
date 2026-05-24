import { CONFIG, withConcurrency } from "./groq_client";
import type { Question } from "./types";
import logger from "../../config/logger";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

// Bag-of-words TF vector over hashed token indices (no API call needed).
// Swap for a real embeddings endpoint when available.
async function computeEmbedding(text: string): Promise<number[]> {
  const tokens = tokenize(text);
  const DIM = 512;
  const vec = new Array<number>(DIM).fill(0);
  for (const token of tokens) {
    let hash = 5381;
    for (let i = 0; i < token.length; i++)
      hash = ((hash << 5) + hash) ^ token.charCodeAt(i);
    vec[Math.abs(hash) % DIM] += 1;
  }
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / mag);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0,
    magA = 0,
    magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export async function deduplicateByEmbedding(
  questions: Question[],
): Promise<Question[]> {
  logger.info(`Computing ${questions.length} embeddings...`);

  const embeddings = await withConcurrency(
    questions.map((q) => () => computeEmbedding(q.question)),
    CONFIG.CONCURRENCY,
  );

  const keep = new Array(questions.length).fill(true) as boolean[];

  for (let i = 0; i < questions.length; i++) {
    if (!keep[i]) continue;
    for (let j = i + 1; j < questions.length; j++) {
      if (!keep[j]) continue;
      if (
        cosineSimilarity(embeddings[i], embeddings[j]) >
        CONFIG.SIMILARITY_THRESHOLD
      )
        keep[j] = false;
    }
  }

  const kept = questions.filter((_, i) => keep[i]);
  const removed = questions.length - kept.length;
  if (removed > 0)
    logger.info(`Removed ${removed} semantically duplicate question(s)`);
  return kept;
}
