import { z } from "zod";
import { groq, MODELS, CONFIG, withRetry } from "./groq_client";
import { extractJSON } from "./json";
import { buildJudgePrompt } from "../prompts/judge.prompt";
import type { Question } from "./types";
import logger from "../../config/logger";

const LLMJudgeItemSchema = z.object({
  index: z.number(),
  realism: z.number().min(1).max(10),
  distractorQuality: z.number().min(1).max(10),
  difficultyAccuracy: z.number().min(1).max(10),
  practicality: z.number().min(1).max(10),
  overallScore: z.number().min(1).max(10),
  reject: z.boolean(),
});

const LLMJudgeSchema = z.object({ results: z.array(LLMJudgeItemSchema) });

export async function llmJudgeBatch(
  questions: Question[],
): Promise<Question[]> {
  const passed: Question[] = [];

  for (let i = 0; i < questions.length; i += CONFIG.JUDGE_BATCH_SIZE) {
    const batch = questions.slice(i, i + CONFIG.JUDGE_BATCH_SIZE);

    const batchPayload = batch.map((q, idx) => ({
      index: idx,
      question: q.question,
      options: q.options,
      correctAnswerId: q.correctAnswerId,
      difficulty: q.difficulty,
      archetype: q.archetype,
      explanation: q.explanation,
    }));

    const prompt = buildJudgePrompt(
      batchPayload,
      CONFIG.LLM_JUDGE_MIN_SCORE,
      CONFIG.LLM_JUDGE_MIN_PRACTICALITY,
      CONFIG.LLM_JUDGE_MIN_DISTRACTOR,
    );

    try {
      const completion = await withRetry(() =>
        groq.chat.completions.create({
          model: MODELS.JUDGE,
          messages: [
            {
              role: "system",
              content:
                "You are a strict technical assessment quality auditor. Return JSON only. No prose.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
          max_tokens: 1024,
          response_format: { type: "json_object" },
        }),
      );

      const content = completion.choices[0].message.content;
      if (!content) {
        passed.push(...batch);
        continue;
      }

      const judgeResult = LLMJudgeSchema.parse(
        JSON.parse(extractJSON(content)),
      );

      for (const result of judgeResult.results) {
        if (result.index >= batch.length) continue;
        if (result.reject) {
          logger.info(
            `Judge rejected [${batch[result.index].archetype}] ` +
              `"${batch[result.index].question.slice(0, 60)}..." ` +
              `(score: ${result.overallScore}/10, practicality: ${result.practicality}/10, ` +
              `distractor: ${result.distractorQuality}/10)`,
          );
        } else {
          passed.push(batch[result.index]);
        }
      }
    } catch (err) {
      logger.warn(
        `LLM judge error (passing batch through): ${(err as Error).message}`,
      );
      passed.push(...batch);
    }
  }

  return passed;
}
