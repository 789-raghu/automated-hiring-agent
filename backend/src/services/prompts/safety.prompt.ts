export function buildSafetyPrompt(question: string): string {
  return (
    `Is the following technical assessment question safe and appropriate for a ` +
    `professional hiring context? Answer only "safe" or "unsafe".\n\n` +
    `Question: ${question}`
  );
}
