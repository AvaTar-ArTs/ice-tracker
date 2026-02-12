/**
 * Optional AI summarization (OpenAI or Google Gemini).
 * Set OPENAI_API_KEY or GEMINI_API_KEY in env to enable. No key = no AI.
 */

export type AIProvider = "openai" | "gemini";

const MAX_ITEMS_FOR_SUMMARY = 15;

function getProvider(): AIProvider | null {
  if (typeof process.env.OPENAI_API_KEY === "string" && process.env.OPENAI_API_KEY.length > 0) {
    return "openai";
  }
  if (typeof process.env.GEMINI_API_KEY === "string" && process.env.GEMINI_API_KEY.length > 0) {
    return "gemini";
  }
  return null;
}

export interface SummaryInputItem {
  title: string;
  description?: string;
  state?: string;
  pubDate?: string;
}

export async function summarizeNews(
  items: SummaryInputItem[]
): Promise<{ summary: string; provider: AIProvider }> {
  const provider = getProvider();
  if (!provider) {
    throw new Error("NO_AI_KEY");
  }

  const slice = items.slice(0, MAX_ITEMS_FOR_SUMMARY);
  const text = slice
    .map(
      (n) =>
        `- [${n.state ?? "N/A"}] ${n.title} (${n.pubDate ?? ""})\n  ${(n.description ?? "").slice(0, 200)}`
    )
    .join("\n");

  const systemPrompt = `You are a concise news summarizer for U.S. immigration enforcement (ICE/ERO) activity. Summarize the following list of ICE news headlines and short descriptions in 2-4 short paragraphs. Focus on: which states or regions appear most, types of operations (arrests, removals, etc.), and any notable patterns. Be factual and neutral. Do not make up details. If the list is empty or very short, say so briefly.`;

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY!;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text || "No items to summarize." },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI: ${res.status} ${err}`);
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const summary = data.choices?.[0]?.message?.content?.trim() ?? "No summary generated.";
    return { summary, provider: "openai" };
  }

  if (provider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY!;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n---\n\n${text || "No items to summarize."}` }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.3,
          },
        }),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini: ${res.status} ${err}`);
    }
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "No summary generated.";
    return { summary, provider: "gemini" };
  }

  throw new Error("NO_AI_KEY");
}

export function isAIEnabled(): boolean {
  return getProvider() !== null;
}
