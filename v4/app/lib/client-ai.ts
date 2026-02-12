/**
 * In-browser summarization (v4). No server API keys.
 * Uses Hugging Face Transformers.js; model runs in the user's browser.
 */

const MAX_INPUT_CHARS = 2000;

export async function summarizeInBrowser(text: string): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Summarization runs in the browser only");
  }
  const truncated = text.slice(0, MAX_INPUT_CHARS).trim();
  if (!truncated) return "No text to summarize.";

  const { pipeline } = await import("@huggingface/transformers");

  const summarizer = await pipeline("summarization");

  const result = await summarizer(truncated, {
    max_length: 150,
    min_length: 50,
    do_sample: false,
  });

  const arr = Array.isArray(result) ? result : [result];
  const first = arr[0];
  const summary =
    first && typeof first === "object" && "summary_text" in first
      ? String((first as { summary_text: string }).summary_text)
      : "";
  return summary || "Could not generate summary.";
}
