import { NextResponse } from "next/server";
import { summarizeNews, isAIEnabled } from "@/app/lib/ai";
import { checkAiRateLimit } from "@/app/lib/rate-limit";

export const maxDuration = 25;

export async function POST(req: Request) {
  if (!isAIEnabled()) {
    return NextResponse.json(
      { error: "AI not configured", hint: "Set OPENAI_API_KEY or GEMINI_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  const rate = checkAiRateLimit(req);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests",
        hint: "Rate limit exceeded. Try again later.",
        retryAfter: rate.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfter ?? 3600),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const safeItems = items.slice(0, 15).map((n: { title?: string; description?: string; state?: string; pubDate?: string }) => ({
      title: typeof n.title === "string" ? n.title : "",
      description: typeof n.description === "string" ? n.description : "",
      state: typeof n.state === "string" ? n.state : undefined,
      pubDate: typeof n.pubDate === "string" ? n.pubDate : undefined,
    }));

    const { summary, provider } = await summarizeNews(safeItems);
    const res = NextResponse.json({ summary, provider });
    if (rate.remaining >= 0) {
      res.headers.set("X-RateLimit-Remaining", String(rate.remaining));
    }
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message === "NO_AI_KEY") {
      return NextResponse.json(
        { error: "No API key", hint: "Set OPENAI_API_KEY or GEMINI_API_KEY" },
        { status: 503 }
      );
    }
    console.error("AI summarize error:", e);
    return NextResponse.json(
      { error: "Summarization failed", detail: message },
      { status: 502 }
    );
  }
}
