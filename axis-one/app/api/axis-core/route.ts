import {
  AxisCoreInputError,
  PLANES,
  SCALE_LABELS,
  SCALE_MAX,
  SCALE_MIN,
  SIGNALS,
  parseResponses,
  readAxis,
} from "@/lib/axis-core";

/** Generous for nine integers, small enough that nothing large gets buffered. */
const MAX_BODY_BYTES = 4_096;

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

/**
 * The question set. Exposed so the interface, and anything else that wants to
 * run a reading, share one definition of the instrument.
 */
export function GET() {
  return Response.json({
    scale: { min: SCALE_MIN, max: SCALE_MAX, labels: SCALE_LABELS },
    planes: PLANES,
    signals: SIGNALS,
  });
}

/** Score a completed sheet: `{ "responses": { "intent-1": 3, ... } }`. */
export async function POST(request: Request) {
  const raw = await request.text();

  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ error: "Request body too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return badRequest("Request body must be a JSON object.");
  }

  try {
    const responses = parseResponses((body as { responses?: unknown }).responses);
    return Response.json({ reading: readAxis(responses) });
  } catch (error) {
    if (error instanceof AxisCoreInputError) {
      return badRequest(error.message);
    }
    throw error;
  }
}
