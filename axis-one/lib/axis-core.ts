/**
 * Axis Core — the alignment engine behind AXIS ONE.
 *
 * A company is read across three planes: what it is for (Intent), the machine
 * underneath (System), and where that machine meets a person (Surface). Each
 * plane is scored from a handful of yes/no-ish signals, and the planes are
 * folded into a single alignment index.
 *
 * The engine is intentionally pure and dependency-free: the same module is
 * imported by the client component (for the question set and types) and by the
 * route handler (for scoring), so there is exactly one source of truth.
 */

export const SCALE_MIN = 0;
export const SCALE_MAX = 4;

/** Labels for the 0–4 response scale, indexed by value. */
export const SCALE_LABELS = [
  "Not true",
  "Rarely true",
  "Sometimes true",
  "Mostly true",
  "True today",
] as const;

export type PlaneId = "intent" | "system" | "surface";

export type Band = "aligned" | "holding" | "drifting" | "off-axis";

export interface Plane {
  id: PlaneId;
  /** 1-based position on the axis, top to bottom. */
  position: number;
  name: string;
  /** What the plane is, in one line. */
  claim: string;
  /** What goes wrong when this is the weakest plane. */
  drift: string;
}

export interface Signal {
  id: string;
  plane: PlaneId;
  /** Rated 0–4 by the respondent. */
  statement: string;
  /** The corrective move when this signal scores low. */
  move: string;
}

/** Signal id → response in [SCALE_MIN, SCALE_MAX]. */
export type Responses = Record<string, number>;

export interface PlaneReading {
  plane: PlaneId;
  name: string;
  /** 0–100. */
  score: number;
  band: Band;
  note: string;
}

export interface AxisReading {
  /** 0–100 alignment index. */
  index: number;
  band: Band;
  headline: string;
  summary: string;
  planes: PlaneReading[];
  /** Strongest plane. */
  anchor: PlaneReading;
  /** Weakest plane — where the work is. */
  drift: PlaneReading;
  /** Distance between the strongest and weakest plane, 0–100. */
  spread: number;
  /** Up to three concrete next moves, most urgent first. */
  moves: string[];
}

export const PLANES: readonly Plane[] = [
  {
    id: "intent",
    position: 1,
    name: "Intent",
    claim:
      "What the business is for, stated precisely enough to settle an argument.",
    drift:
      "Every function optimises locally. The company is busy, and nothing compounds.",
  },
  {
    id: "system",
    position: 2,
    name: "System",
    claim:
      "The machine underneath: the data, the models, and the loops that improve them.",
    drift:
      "AI stays a demo. Each release starts from zero because nothing accumulates.",
  },
  {
    id: "surface",
    position: 3,
    name: "Surface",
    claim: "Where the system meets a person: interface, latency, trust.",
    drift:
      "The capability exists and no one uses it. Rollout gets mistaken for adoption.",
  },
];

export const SIGNALS: readonly Signal[] = [
  {
    id: "intent-1",
    plane: "intent",
    statement:
      "A new hire could state what we win on — in one sentence — after their first week.",
    move: "Write the one-sentence claim and put it in front of the whole company before the next planning cycle.",
  },
  {
    id: "intent-2",
    plane: "intent",
    statement:
      "We can name the customer decision our product exists to make cheaper.",
    move: "Name the single decision you sell. Everything that does not serve it goes on a stop-doing list.",
  },
  {
    id: "intent-3",
    plane: "intent",
    statement:
      "When two priorities collide, we know which one loses without escalating.",
    move: "Publish the tie-breaker rule. One written axis beats three sets of OKRs.",
  },
  {
    id: "system-1",
    plane: "system",
    statement:
      "Our data sits close enough to the real work that a model trained on it would be worth deploying.",
    move: "Instrument the workflow first. Capture the decision, its context, and its outcome — that triple is the asset.",
  },
  {
    id: "system-2",
    plane: "system",
    statement:
      "Every AI feature we ship gets measurably better without a person rewriting it.",
    move: "Close one loop end to end: log outcomes, evaluate weekly, feed the result back into the model or prompt.",
  },
  {
    id: "system-3",
    plane: "system",
    statement:
      "In any given week we can tell whether the system is improving or merely changing.",
    move: "Stand up an eval set before the next feature. Without a baseline there is no progress, only motion.",
  },
  {
    id: "surface-1",
    plane: "surface",
    statement: "People use what we built without being told to.",
    move: "Move the capability into the path people already walk. Adoption you have to announce is not adoption.",
  },
  {
    id: "surface-2",
    plane: "surface",
    statement:
      "When the model is uncertain, the interface says so and the person stays in control.",
    move: "Design the failure state first. What the product does at low confidence decides whether it is trusted.",
  },
  {
    id: "surface-3",
    plane: "surface",
    statement:
      "The fastest route to the outcome runs through our product, not around it.",
    move: "Time the workaround. If a spreadsheet beats you, the surface is the problem — not the model.",
  },
];

const SIGNAL_IDS: ReadonlySet<string> = new Set(SIGNALS.map((s) => s.id));

const BAND_COPY: Record<Band, { label: string; headline: string }> = {
  aligned: {
    label: "Aligned",
    headline: "One axis. Everything hangs off it.",
  },
  holding: {
    label: "Holding",
    headline: "The axis holds — one plane is carrying the load.",
  },
  drifting: {
    label: "Drifting",
    headline: "Three efforts, three directions.",
  },
  "off-axis": {
    label: "Off axis",
    headline: "There is no axis yet. There are projects.",
  },
};

export function bandLabel(band: Band): string {
  return BAND_COPY[band].label;
}

/** Signals belonging to a plane, in declaration order. */
export function signalsFor(plane: PlaneId): Signal[] {
  return SIGNALS.filter((signal) => signal.plane === plane);
}

/** A blank response sheet — every signal at the bottom of the scale. */
export function emptyResponses(): Responses {
  return Object.fromEntries(SIGNALS.map((signal) => [signal.id, SCALE_MIN]));
}

function bandFor(score: number): Band {
  if (score >= 80) return "aligned";
  if (score >= 60) return "holding";
  if (score >= 35) return "drifting";
  return "off-axis";
}

function toPercent(mean: number): number {
  return Math.round((mean / SCALE_MAX) * 100);
}

export class AxisCoreInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AxisCoreInputError";
  }
}

/**
 * Validate untrusted input (an API body, a URL query, a saved draft) into a
 * complete response sheet. Throws {@link AxisCoreInputError} with a message
 * that is safe to show the caller.
 */
export function parseResponses(input: unknown): Responses {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new AxisCoreInputError("Expected `responses` to be an object.");
  }

  const entries = Object.entries(input as Record<string, unknown>);
  const unknownIds = entries
    .map(([id]) => id)
    .filter((id) => !SIGNAL_IDS.has(id));
  if (unknownIds.length > 0) {
    throw new AxisCoreInputError(
      `Unknown signal id(s): ${unknownIds.slice(0, 5).join(", ")}.`,
    );
  }

  const responses: Responses = {};
  for (const [id, value] of entries) {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new AxisCoreInputError(`Signal "${id}" must be an integer.`);
    }
    if (value < SCALE_MIN || value > SCALE_MAX) {
      throw new AxisCoreInputError(
        `Signal "${id}" must be between ${SCALE_MIN} and ${SCALE_MAX}.`,
      );
    }
    responses[id] = value;
  }

  const missing = SIGNALS.filter((signal) => !(signal.id in responses));
  if (missing.length > 0) {
    throw new AxisCoreInputError(
      `Missing signal(s): ${missing.map((s) => s.id).join(", ")}.`,
    );
  }

  return responses;
}

function readPlane(plane: Plane, responses: Responses): PlaneReading {
  const signals = signalsFor(plane.id);
  const mean =
    signals.reduce((total, signal) => total + responses[signal.id], 0) /
    signals.length;
  const score = toPercent(mean);
  const band = bandFor(score);

  return {
    plane: plane.id,
    name: plane.name,
    score,
    band,
    note: band === "aligned" || band === "holding" ? plane.claim : plane.drift,
  };
}

function summarise(
  index: number,
  anchor: PlaneReading,
  drift: PlaneReading,
  spread: number,
): string {
  if (spread === 0) {
    return anchor.score >= 60
      ? `All three planes read ${anchor.score}. The axis is even — the next move is depth, not balance.`
      : `All three planes read ${anchor.score}. Nothing is pulling ahead, which at this level means there is no axis yet, only three even efforts. Start at ${PLANES[0].name}; the other two inherit whatever you decide there.`;
  }
  if (spread >= 30) {
    return `${anchor.name} is doing the work at ${anchor.score}, while ${drift.name} sits at ${drift.score}. A ${spread}-point spread is where strategy leaks: the strongest plane keeps producing effort the weakest one cannot carry.`;
  }
  if (index >= 60) {
    return `The planes are within ${spread} points of each other, which means the system moves together. ${drift.name} is the lowest at ${drift.score} — that is the ceiling on everything above it.`;
  }
  return `Nothing is far ahead of anything else: ${spread} points separate ${anchor.name} from ${drift.name}. Evenly low is still low — start at ${drift.name} and pull the whole axis up behind it.`;
}

function selectMoves(responses: Responses, drift: PlaneReading): string[] {
  const ranked = [...SIGNALS]
    .map((signal, order) => ({ signal, order, score: responses[signal.id] }))
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      // Break ties toward the weakest plane, then declaration order.
      const aDrift = a.signal.plane === drift.plane ? 0 : 1;
      const bDrift = b.signal.plane === drift.plane ? 0 : 1;
      if (aDrift !== bDrift) return aDrift - bDrift;
      return a.order - b.order;
    })
    .filter(({ score }) => score <= SCALE_MAX - 2);

  if (ranked.length === 0) {
    return [
      `Nothing here is broken. Protect it: write down why the ${drift.name} plane holds, before the next reorg forgets.`,
    ];
  }

  return ranked.slice(0, 3).map(({ signal }) => signal.move);
}

/**
 * Fold a complete response sheet into a reading.
 *
 * The index deliberately is not a plain average. Alignment is limited by the
 * weakest plane, so the weakest plane is weighted:
 *
 *     index = 0.6 × mean(planes) + 0.4 × min(planes)
 */
export function readAxis(responses: Responses): AxisReading {
  const planes = PLANES.map((plane) => readPlane(plane, responses));
  const scores = planes.map((plane) => plane.score);
  const mean = scores.reduce((total, score) => total + score, 0) / scores.length;
  const lowest = Math.min(...scores);
  const index = Math.round(0.6 * mean + 0.4 * lowest);
  const band = bandFor(index);

  // Ties resolve to the plane closest to Intent, which is where work should start.
  const anchor = planes.reduce((best, plane) =>
    plane.score > best.score ? plane : best,
  );
  const drift = planes.reduce((worst, plane) =>
    plane.score < worst.score ? plane : worst,
  );
  const spread = Math.max(...scores) - lowest;

  return {
    index,
    band,
    headline: BAND_COPY[band].headline,
    summary: summarise(index, anchor, drift, spread),
    planes,
    anchor,
    drift,
    spread,
    moves: selectMoves(responses, drift),
  };
}
