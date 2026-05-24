import type { Archetype } from "../tools/types";

export const DIFFICULTY_DEFINITIONS = `
DIFFICULTY: easy=recall only, medium=apply concept, hard=debug/tradeoff/multi-concept (not answerable without deep understanding).
`;

export const ANTI_TRIVIA_RULES = `
FORBIDDEN: definition questions, syntax recall, "All/None of the above", implausible distractors.
REQUIRED: scenario/debug/tradeoff framing; distractors based on real developer misconceptions.
`;

export const ARCHETYPE_INSTRUCTIONS: Record<Archetype, string> = {
  Debugging:
    "Show a broken code snippet. Candidate finds the bug, root cause, or fix. Focus: stale closures, bad dependency arrays, race conditions, conditional hooks.",
  Scenario:
    "Present a real production situation. Candidate picks the correct approach. Focus: re-render bugs, API caching, optimistic updates, error boundaries.",
  Architecture:
    "Pose a design tradeoff. Correct answer fits the stated constraints, not universal best practice. Focus: Context vs Redux, composition vs prop drilling, code splitting.",
  Optimization:
    "Describe a perf symptom. Candidate identifies cause or fix. Focus: useMemo/useCallback misuse, inline object re-creation, large lists, main-thread blocking.",
  Conceptual:
    "Test deep WHY understanding, not surface definitions. Focus: reconciliation, fiber, stale closures, event delegation, tree-shaking. NEVER ask 'What is X?'",
};

export function buildQuestionBatchPrompt(
  role: string,
  experience: number,
  topic: string,
  archetype: Archetype,
  count: number,
  jobDescription: string,
  existingQuestions: string[],
): string {
  const recentQuestions = existingQuestions.slice(-10).join("\n");

  return `
You are a senior technical interviewer. Generate EXACTLY ${count} high-signal MCQ questions.

ROLE: ${role} (${experience} years experience)
TOPIC: ${topic}
${ARCHETYPE_INSTRUCTIONS[archetype]}

${DIFFICULTY_DEFINITIONS}

${ANTI_TRIVIA_RULES}

QUALITY REQUIREMENTS:
- Every question must be scenario-based, debugging-based, or tradeoff-based
- Correct answer must be unambiguously correct
- Every distractor must reflect a real developer misconception
- Explanation must state WHY correct answer is right AND why each wrong option is wrong

PREVIOUS QUESTIONS (avoid similar):
${recentQuestions || "None yet."}

JOB CONTEXT:
${jobDescription}

RETURN STRICT JSON ONLY — no markdown, no text outside the object:

{
  "questions": [
    {
      "question": "A scenario or debugging question — never a definition",
      "options": [
        {"id": "A", "text": "plausible misconception-based wrong answer"},
        {"id": "B", "text": "plausible misconception-based wrong answer"},
        {"id": "C", "text": "correct answer"},
        {"id": "D", "text": "plausible misconception-based wrong answer"}
      ],
      "correctAnswerId": "C",
      "difficulty": "hard",
      "archetype": "${archetype}",
      "skills": ["React Hooks", "Closures"],
      "topic": "${topic}",
      "explanation": "C is correct because... A is wrong because... B is wrong because... D is wrong because..."
    }
  ]
}`;
}
