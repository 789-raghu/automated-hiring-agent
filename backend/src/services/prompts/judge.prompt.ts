interface JudgePayloadItem {
  index: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswerId: string;
  difficulty: string;
  archetype: string;
  explanation: string;
}

export function buildJudgePrompt(
  batchPayload: JudgePayloadItem[],
  minScore: number,
  minPracticality: number,
  minDistractorQuality: number,
): string {
  return `You are a senior technical hiring assessor reviewing assessment questions.

Score each question 1–10 on:
- realism: Would a real developer encounter this? Is it production-realistic?
- distractorQuality: Are wrong answers plausible misconceptions, or obviously wrong?
- difficultyAccuracy: Does the difficulty label match the actual cognitive load?
- practicality: Does this predict real job performance? (trivia/memorization = low score)
- overallScore: Weighted average of the above

Set reject=true if: overallScore < ${minScore} OR practicality < ${minPracticality} OR distractorQuality < ${minDistractorQuality}

Questions to evaluate:
${JSON.stringify(batchPayload, null, 2)}

Return JSON only:
{
  "results": [
    { "index": 0, "realism": 8, "distractorQuality": 7, "difficultyAccuracy": 7, "practicality": 8, "overallScore": 7.5, "reject": false }
  ]
}`;
}
