import type { Question } from "./types";
import logger from "../../config/logger";

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

export function validateQuestion(question: Question): {
  passed: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!question.options.some((o) => o.id === question.correctAnswerId))
    errors.push("Correct answer missing from options");

  const texts = question.options.map((o) => normalizeText(o.text));
  if (new Set(texts).size !== texts.length) errors.push("Duplicate options");

  if (question.question.length > 600) errors.push("Question too long");

  const forbidden = ["all of the above", "none of the above"];
  for (const opt of question.options) {
    if (forbidden.some((p) => opt.text.toLowerCase().includes(p)))
      errors.push(`Forbidden option: "${opt.text}"`);
  }

  const definitionRx = [
    /^what is\s+[a-z]/i,
    /^what does\s+[a-z]/i,
    /^define\s+[a-z]/i,
    /^which of the following (is the |best )?(definition|description) of/i,
  ];
  for (const rx of definitionRx) {
    if (rx.test(question.question.trim()))
      errors.push("Definition-only question — requires scenario or reasoning");
  }

  const badDistractors = [
    "to crash",
    "to break",
    "to increase memory usage",
    "to slow down",
    "to disable",
    "it doesn't work",
    "nothing happens",
  ];
  for (const opt of question.options) {
    if (opt.id !== question.correctAnswerId) {
      const lower = opt.text.toLowerCase();
      if (badDistractors.some((d) => lower.startsWith(d)))
        errors.push(`Implausible distractor: "${opt.text}"`);
    }
  }

  return { passed: errors.length === 0, errors };
}

export function programmaticJudge(questions: Question[]): Question[] {
  const passed: Question[] = [];
  const failed: { q: string; errors: string[] }[] = [];

  for (const q of questions) {
    const { passed: ok, errors } = validateQuestion(q);
    if (ok) passed.push(q);
    else failed.push({ q: q.question.slice(0, 70), errors });
  }

  if (failed.length > 0) {
    logger.info(`Programmatic judge rejected ${failed.length} question(s):`);
    for (const f of failed) {
      logger.info(`  - "${f.q}..."`);
      for (const e of f.errors) logger.info(`      ${e}`);
    }
  }

  return passed;
}
