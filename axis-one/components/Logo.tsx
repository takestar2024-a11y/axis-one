/**
 * AXIS ONE — the mark.
 *
 * A crosshair inside a ring: the axis (gold, vertical and horizontal) and the
 * centre point that the whole site argues for — "you are the axis". The same
 * geometry is the favicon (`app/icon.svg`), so the tab and the header agree.
 *
 * Drawn inline rather than loaded as a file: it is a few hundred bytes, it
 * inherits the page's colour tokens, and it never arrives a frame late.
 */

export function AxisMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      className="axis-mark"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9.25" stroke="var(--purple-neon, #9D4EDD)" strokeOpacity="0.55" />
      <path
        d="M12 1.5v21M1.5 12h21"
        stroke="var(--gold, #C9A227)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.1" fill="var(--gold, #C9A227)" />
    </svg>
  );
}

/** The mark plus the wordmark. `as` keeps the heading levels honest. */
export default function Logo({ size }: { size?: number }) {
  return (
    <>
      <AxisMark size={size} />
      <span className="wordmark">
        AXIS<i>·</i>ONE
      </span>
    </>
  );
}
