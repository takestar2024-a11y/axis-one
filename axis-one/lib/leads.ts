import { appendFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Where the assistant's records go.
 *
 * Two sinks, both optional, tried in order and never allowed to break the
 * request they belong to — a failed write must not cost the visitor an answer:
 *
 *   LEADS_WEBHOOK_URL  POST the record as JSON (Slack, Make, n8n, a CRM).
 *                      The only sink that works on serverless hosts.
 *   LEADS_FILE         Append one JSON object per line. Needs a writable disk,
 *                      so a VPS or a container with a volume, not Vercel.
 *
 * With neither set the record is written to the server log, so nothing is
 * silently dropped while the destination is still being decided.
 */

export type RecordKind = "diagnosis" | "lead" | "chat";

export interface LeadRecord {
  id: string;
  at: string;
  kind: RecordKind;
  lang: string;
  /** Present on "lead": what the visitor typed to be contacted. */
  email?: string;
  company?: string;
  /** Present on "diagnosis" and "lead": the answer sheet and headline result. */
  diagnosis?: {
    industry: string;
    headcount: string;
    maturity: string;
    hours: Record<string, number>;
    hoursLow: number;
    hoursHigh: number;
    recommendation: string;
  };
  /** Present on "chat": the exchange, so the real questions are visible. */
  messages?: Array<{ role: string; content: string }>;
}

const WEBHOOK = process.env.LEADS_WEBHOOK_URL;
const FILE = process.env.LEADS_FILE;

async function toWebhook(record: LeadRecord): Promise<boolean> {
  if (!WEBHOOK) return false;
  const response = await fetch(WEBHOOK, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(record),
    signal: AbortSignal.timeout(4_000),
  });
  return response.ok;
}

async function toFile(record: LeadRecord): Promise<boolean> {
  if (!FILE) return false;
  const path = resolve(FILE);
  await mkdir(dirname(path), { recursive: true });
  await appendFile(path, JSON.stringify(record) + "\n", "utf8");
  return true;
}

/**
 * Store one record. Resolves either way: callers must not await this for
 * correctness, only for ordering.
 */
export async function record(
  input: Omit<LeadRecord, "id" | "at">,
): Promise<void> {
  const entry: LeadRecord = {
    id: randomUUID(),
    at: new Date().toISOString(),
    ...input,
  };

  try {
    if (await toWebhook(entry)) return;
  } catch (error) {
    console.error("[leads] webhook failed", error);
  }

  try {
    if (await toFile(entry)) return;
  } catch (error) {
    console.error("[leads] file write failed", error);
  }

  console.info("[leads]", JSON.stringify(entry));
}

/** Loose shape check — enough to reject junk, not to validate deliverability. */
export function parseEmail(input: unknown): string | undefined {
  if (typeof input !== "string") return undefined;
  const value = input.trim();
  if (value.length < 5 || value.length > 254) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return undefined;
  return value;
}

export function parseCompany(input: unknown): string | undefined {
  if (typeof input !== "string") return undefined;
  const value = input.trim().slice(0, 120);
  return value === "" ? undefined : value;
}
