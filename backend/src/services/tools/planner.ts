import { groq, MODELS, withRetry } from "./groq_client";
import { extractJSON } from "./json";
import { PlannerSchema, type Planner } from "./types";
import { buildPlannerPrompt } from "../prompts/planner.prompt";

export type { Planner };

export async function generateAssessmentPlan(
  role: string,
  experience: number,
  totalQuestions: number,
  jobDescription: string,
): Promise<Planner> {
  const prompt = buildPlannerPrompt(
    role,
    experience,
    totalQuestions,
    jobDescription,
  );

  const completion = await withRetry(() =>
    groq.chat.completions.create({
      model: MODELS.PLANNER,
      messages: [
        {
          role: "system",
          content: "You generate JSON only. No prose outside the JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 512,
      response_format: { type: "json_object" },
    }),
  );

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("Planner returned empty response");

  return PlannerSchema.parse(JSON.parse(extractJSON(content)));
}
