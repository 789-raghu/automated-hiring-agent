export function buildPlannerPrompt(
  role: string,
  experience: number,
  totalQuestions: number,
  jobDescription: string,
): string {
  return `
You are an assessment architect for a technical hiring pipeline.

Create a topic distribution for a ${role} assessment at ${experience} years experience.
Total questions: ${totalQuestions}

JOB DESCRIPTION:
${jobDescription}

RULES:
- Allocate questions across 5–8 specific topics from the job description
- Weight by production frequency for this role at this experience level
- Numbers must sum to exactly ${totalQuestions}
- No "Basics", "General", or vague topics — be specific

Return STRICT JSON ONLY:
{
  "role": "${role}",
  "experience": ${experience},
  "distribution": {
    "React Hooks": 6,
    "State Management": 5,
    "Performance Optimization": 4,
    "TypeScript with React": 4,
    "Component Architecture": 3,
    "Async Patterns": 3
  }
}`;
}
