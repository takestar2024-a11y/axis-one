import { parseAnswers, readDiagnosis, type Lang } from "@/lib/diagnosis";
import { parseCompany, parseEmail, record } from "@/lib/leads";

/**
 * The free diagnosis: score an answer sheet, and keep the record.
 *
 * Scoring runs on the server so the arithmetic and the assumptions behind it
 * stay in one place, and so the answers are captured even when the visitor
 * never leaves an address. An email, when given, attaches to the same sheet.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 4_096;

/* Best-effort brake, per instance — see the note in app/api/axis-core/route.ts. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
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

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "Too many requests." }, { status: 429 });
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

  const { answers: rawAnswers, lang: rawLang, email: rawEmail, company: rawCompany } =
    body as Record<string, unknown>;

  const lang: Lang = rawLang === "ja" ? "ja" : "en";

  let answers;
  try {
    answers = parseAnswers(rawAnswers);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid answers." },
      { status: 400 },
    );
  }

  const reading = readDiagnosis(answers, lang);
  const email = parseEmail(rawEmail);
  const company = parseCompany(rawCompany);

  // Keeping the record must never cost the visitor their result.
  void record({
    kind: email ? "lead" : "diagnosis",
    lang,
    email,
    company,
    diagnosis: {
      industry: answers.industry,
      headcount: answers.headcount,
      maturity: answers.maturity,
      hours: answers.hours,
      hoursLow: reading.hoursLow,
      hoursHigh: reading.hoursHigh,
      recommendation: reading.recommendation,
    },
  });

  return Response.json({ reading });
}
