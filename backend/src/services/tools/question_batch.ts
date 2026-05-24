import crypto from "crypto";
import {
  groq,
  MODELS,
  CONFIG,
  withRetry,
  withConcurrency,
} from "./groq_client";
import logger from "../../config/logger";
import { extractJSON, repairJSON } from "./json";
import {
  QuestionSchema,
  type Question,
  type Planner,
  type GenerateAssessmentParams,
} from "./types";
import { buildQuestionBatchPrompt } from "../prompts/question_batch.prompt";

export const ARCHETYPES = [
  "Debugging",
  "Scenario",
  "Architecture",
  "Optimization",
  "Conceptual",
] as const;

export type Archetype = (typeof ARCHETYPES)[number];

const ARCHETYPE_WEIGHTS: Record<Archetype, number> = {
  Debugging: 0.3,
  Scenario: 0.3,
  Architecture: 0.15,
  Optimization: 0.1,
  Conceptual: 0.15,
};

interface BatchTask {
  topic: string;
  archetype: Archetype;
  count: number;
}

function generateId() {
  return crypto.randomBytes(6).toString("hex");
}

function buildArchetypePool(total: number): Archetype[] {
  const pool: Archetype[] = [];
  let remaining = total;
  const entries = Object.entries(ARCHETYPE_WEIGHTS) as [Archetype, number][];

  entries.forEach(([archetype, weight], idx) => {
    const isLast = idx === entries.length - 1;
    const count = isLast ? remaining : Math.round(total * weight);
    for (let i = 0; i < count; i++) pool.push(archetype);
    remaining -= count;
  });

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
}

export async function generateQuestionBatch(
  role: string,
  experience: number,
  topic: string,
  archetype: Archetype,
  count: number,
  jobDescription: string,
  existingQuestions: string[],
): Promise<Question[]> {
  const prompt = buildQuestionBatchPrompt(
    role,
    experience,
    topic,
    archetype,
    count,
    jobDescription,
    existingQuestions,
  );

  const completion = await withRetry(() =>
    groq.chat.completions.create({
      model: MODELS.GENERATOR,
      messages: [
        {
          role: "system",
          content: "Return strict JSON only. No prose outside the JSON object.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    }),
  );

  const rawContent = completion.choices[0].message.content;
  if (!rawContent) throw new Error("Generator returned empty response");

  let parsed: any;
  try {
    parsed = JSON.parse(extractJSON(rawContent));
  } catch {
    logger.warn("JSON parse failed — invoking repair model...");
    try {
      const repaired = await repairJSON(rawContent);
      parsed = JSON.parse(extractJSON(repaired));
    } catch {
      logger.warn("Repair failed — skipping batch");
      return [];
    }
  }

  const repaired: Question[] = [];

  for (const raw of parsed.questions ?? []) {
    try {
      if (!Array.isArray(raw.options)) continue;

      raw.options = raw.options.filter((o: any) => o?.text);

      while (raw.options.length < 4)
        raw.options.push({ id: generateId(), text: "Placeholder option" });

      raw.options = raw.options.slice(0, 4);
      raw.options = raw.options.map((o: any) => ({
        id: o.id || generateId(),
        text: o.text,
      }));

      if (!raw.options.some((o: any) => o.id === raw.correctAnswerId))
        raw.correctAnswerId = raw.options[0].id;

      raw.archetype = raw.archetype || archetype;

      repaired.push(QuestionSchema.parse(raw));
    } catch {
      // malformed beyond repair — silently drop
    }
  }

  return repaired;
}

function buildBatchTasks(planner: Planner): BatchTask[] {
  const total = Object.values(planner.distribution).reduce((s, n) => s + n, 0);
  const archetypePool = buildArchetypePool(total);
  let archetypeIdx = 0;
  const tasks: BatchTask[] = [];

  for (const [topic, topicCount] of Object.entries(planner.distribution)) {
    const batches = Math.ceil(topicCount / CONFIG.BATCH_SIZE);
    for (let i = 0; i < batches; i++) {
      const batchCount = Math.min(
        CONFIG.BATCH_SIZE,
        topicCount - i * CONFIG.BATCH_SIZE,
      );
      tasks.push({
        topic,
        archetype: archetypePool[archetypeIdx++ % archetypePool.length],
        count: batchCount,
      });
    }
  }

  return tasks;
}

export async function generateAllBatches(
  planner: Planner,
  params: GenerateAssessmentParams,
): Promise<Question[]> {
  const tasks = buildBatchTasks(planner);

  logger.info("Batch plan:");
  for (const t of tasks)
    logger.info(`  [${t.archetype.padEnd(14)}] ${t.topic} (${t.count}q)`);

  const results = await withConcurrency(
    tasks.map(
      (task) => () =>
        generateQuestionBatch(
          params.role,
          params.experience,
          task.topic,
          task.archetype,
          task.count,
          params.jobDescription,
          [],
        ),
    ),
    CONFIG.CONCURRENCY,
  );

  return results.flat();
}
