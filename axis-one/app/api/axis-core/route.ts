import Anthropic from "@anthropic-ai/sdk";
import {
  MAX_HISTORY,
  parseHistory,
  parseLang,
  systemPrompt,
  type ChatMessage,
} from "@/lib/axis-core";

/**
 * AXIS CORE — server proxy.
 *
 * The browser posts the conversation here; the API key never leaves the
 * server. When no key is configured the route answers 503 and the interface
 * falls back to its local knowledge core, so the assistant always replies.
 */

export const runtime = "nodejs";

const MODEL = "claude-opus-5";
/** Answers are capped at ~120 words by the brief, so the ceiling is small on purpose. */
const MAX_TOKENS = 1_024;
const MAX_BODY_BYTES = 16_384;

/* Best-effort abuse brake. In-memory, so it is per instance and resets on
   deploy — a shared store belongs here once this runs on more than one node. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Axis Core is not connected to a model.", fallback: true },
      { status: 503 },
    );
  }

  if (rateLimited(clientIp(request))) {
    return Response.json(
      { error: "Too many questions in a short window. Try again shortly." },
      { status: 429 },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ error: "Request body too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }

  const { messages: rawMessages, lang: rawLang } = body as {
    messages?: unknown;
    lang?: unknown;
  };

  let messages: ChatMessage[];
  try {
    messages = parseHistory(rawMessages);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid conversation." },
      { status: 400 },
    );
  }

  const lang = parseLang(rawLang);
  const client = new Anthropic();

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // A site FAQ is a simple task: low effort keeps it fast and cheap.
      output_config: { effort: "low" },
      // Frozen prefix — cached across visitors; the conversation follows it.
      system: [
        {
          type: "text",
          text: systemPrompt(lang),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.slice(-MAX_HISTORY),
      // If a safety classifier declines, the API re-runs the turn on a
      // fallback model inside the same call instead of returning nothing.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });

    if (response.stop_reason === "refusal") {
      return Response.json(
        {
          error:
            lang === "ja"
              ? "そのご質問にはお答えできません。別の聞き方でお試しください。"
              : "I can't answer that one. Try asking a different way.",
        },
        { status: 422 },
      );
    }

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!text) {
      return Response.json({ error: "Empty response.", fallback: true }, { status: 502 });
    }

    return Response.json({ text });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "The model is busy. Try again in a moment." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { error: "Axis Core is not connected to a model.", fallback: true },
        { status: 503 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      return Response.json(
        { error: "The model could not be reached.", fallback: true },
        { status: 502 },
      );
    }
    throw error;
  }
}
