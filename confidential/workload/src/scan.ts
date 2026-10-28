// Sensitive-data scanner that runs inside the TEE. Findings carry only the
// type, offsets and a masked preview, so the raw values never leave the
// enclave even in the (encrypted) response.

export type FindingType = "credit_card" | "my_number" | "email" | "phone_jp";

export interface Finding {
  type: FindingType;
  start: number;
  end: number;
  masked: string;
}

export interface ScanReport {
  total: number;
  counts: Record<FindingType, number>;
  findings: Finding[];
}

interface Detector {
  type: FindingType;
  pattern: RegExp;
  valid?: (digits: string) => boolean;
}

// Order matters: earlier detectors win overlapping spans, so a 16-digit card
// number is not also reported as a 12-digit my number.
const detectors: Detector[] = [
  { type: "credit_card", pattern: /(?<!\d)\d(?:[ -]?\d){12,18}(?!\d)/g, valid: luhn },
  { type: "my_number", pattern: /(?<!\d)\d{4}[ -]?\d{4}[ -]?\d{4}(?!\d)/g, valid: myNumberCheck },
  { type: "email", pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
  { type: "phone_jp", pattern: /(?<!\d)0\d{1,4}-\d{1,4}-\d{3,4}(?!\d)|(?<!\d)0[789]0\d{8}(?!\d)/g },
];

export function scan(text: string): ScanReport {
  const findings: Finding[] = [];
  const taken: Array<[number, number]> = [];
  const overlaps = (s: number, e: number) => taken.some(([ts, te]) => s < te && e > ts);

  for (const d of detectors) {
    for (const m of text.matchAll(d.pattern)) {
      const start = m.index ?? 0;
      const end = start + m[0].length;
      if (overlaps(start, end)) continue;
      if (d.valid && !d.valid(m[0].replace(/\D/g, ""))) continue;
      taken.push([start, end]);
      findings.push({ type: d.type, start, end, masked: mask(d.type, m[0]) });
    }
  }

  findings.sort((a, b) => a.start - b.start);
  const counts: Record<FindingType, number> = { credit_card: 0, my_number: 0, email: 0, phone_jp: 0 };
  for (const f of findings) counts[f.type]++;
  return { total: findings.length, counts, findings };
}

export function luhn(digits: string): boolean {
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

// Check digit rule for the Japanese individual number (マイナンバー).
export function myNumberCheck(digits: string): boolean {
  if (!/^\d{12}$/.test(digits)) return false;
  let sum = 0;
  for (let n = 1; n <= 11; n++) {
    const p = Number(digits[11 - n]);
    const q = n <= 6 ? n + 1 : n - 5;
    sum += p * q;
  }
  const r = sum % 11;
  const check = r <= 1 ? 0 : 11 - r;
  return check === Number(digits[11]);
}

function mask(type: FindingType, value: string): string {
  if (type === "email") {
    const [local, domain] = value.split("@");
    return `${local[0]}***@${domain}`;
  }
  const digits = value.replace(/\D/g, "");
  return `${"*".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
}
