import { z } from "zod";

export const ARCHETYPES = [
  "Debugging",
  "Scenario",
  "Architecture",
  "Optimization",
  "Conceptual",
] as const;

export type Archetype = (typeof ARCHETYPES)[number];

export const OptionSchema = z.object({ id: z.string(), text: z.string() });

export const QuestionSchema = z.object({
  question: z.string(),
  options: z.array(OptionSchema).length(4),
  correctAnswerId: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  archetype: z.enum(ARCHETYPES),
  skills: z.array(z.string()),
  topic: z.string(),
  explanation: z.string(),
});

export const PlannerSchema = z.object({
  role: z.string(),
  experience: z.number(),
  distribution: z.record(z.string(), z.number()),
});

export type Question = z.infer<typeof QuestionSchema>;
export type Planner = z.infer<typeof PlannerSchema>;

export interface GenerateAssessmentParams {
  role: string;
  experience: number;
  totalQuestions: number;
  jobDescription: string;
}
