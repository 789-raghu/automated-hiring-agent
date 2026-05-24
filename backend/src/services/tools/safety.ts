import {
  groq,
  MODELS,
  CONFIG,
  withRetry,
  withConcurrency,
} from "./groq_client";
import { buildSafetyPrompt } from "../prompts/safety.prompt";
import type { Question } from "./types";
import logger from "../../config/logger";

export async function checkBatchSafety(
  questions: Question[],
): Promise<Question[]> {
  const checkTasks = questions.map((question) => async () => {
    try {
      const completion = await withRetry(() =>
        groq.chat.completions.create({
          model: MODELS.SAFETY,
          messages: [
            { role: "user", content: buildSafetyPrompt(question.question) },
          ],
          max_tokens: 10,
          temperature: 0,
        }),
      );

      const reply =
        completion.choices[0].message.content?.toLowerCase() ?? "safe";
      return {
        question,
        safe: reply.includes("safe") && !reply.includes("unsafe"),
      };
    } catch {
      return { question, safe: true };
    }
  });

  const results = await withConcurrency(checkTasks, CONFIG.CONCURRENCY);
  let flagged = 0;

  const safeQuestions = results
    .filter(({ question, safe }) => {
      if (!safe) {
        flagged++;
        logger.warn(`Safety flagged: "${question.question.slice(0, 60)}..."`);
      }
      return safe;
    })
    .map(({ question }) => question);

  if (flagged > 0) logger.warn(`Safety guard removed ${flagged} question(s)`);
  return safeQuestions;
}
