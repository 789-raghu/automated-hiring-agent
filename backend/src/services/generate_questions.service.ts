import { CONFIG } from "./tools/groq_client";
import { generateAssessmentPlan } from "./tools/planner";
import { generateAllBatches } from "./tools/question_batch";
import type { GenerateAssessmentParams, Question } from "./tools/types";
import logger from "../config/logger";

export type { Question, GenerateAssessmentParams };

export async function generateAssessment(
  params: GenerateAssessmentParams,
): Promise<Question[]> {
  if (params.totalQuestions > CONFIG.MAX_QUESTIONS)
    throw new Error(
      `totalQuestions exceeds MAX_QUESTIONS (${CONFIG.MAX_QUESTIONS})`,
    );

  logger.info("[1/2] Generating assessment plan...");
  const planner = await generateAssessmentPlan(
    params.role,
    params.experience,
    params.totalQuestions,
    params.jobDescription,
  );
  logger.info("Topic distribution: %o", planner.distribution);

  logger.info("[2/2] Generating questions...");
  const questions = await generateAllBatches(planner, params);
  const final = questions.slice(0, params.totalQuestions);

  logger.info(`Done. ${final.length} questions generated.`);
  return final;
}
