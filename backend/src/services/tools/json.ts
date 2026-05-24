import { groq, MODELS, withRetry } from "./groq_client";

/** Strips markdown code fences and returns the first JSON object found. */
export function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf("{");
  if (start !== -1) return text.slice(start);
  return text;
}

/** Calls the repair model to fix malformed JSON. Only invoked after a parse failure. */
export async function repairJSON(badContent: string): Promise<string> {
  const completion = await withRetry(() =>
    groq.chat.completions.create({
      model: MODELS.REPAIR,
      messages: [
        {
          role: "system",
          content:
            "You fix malformed JSON. Return ONLY the corrected JSON object. No explanation, no markdown.",
        },
        { role: "user", content: `Fix this malformed JSON:\n\n${badContent}` },
      ],
      temperature: 0,
      max_tokens: 4096,
    }),
  );

  return completion.choices[0].message.content ?? badContent;
}
