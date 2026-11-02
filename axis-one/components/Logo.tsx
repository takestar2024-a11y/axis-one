/**
 * AXIS ONE — the mark.
 *
 * Drawn as vector rather than placed as the supplied artwork. The artwork is a
 * 215px raster carrying a lot of fine detail and bloom; at the 26–28px the
 * header needs it collapses into a smudge beside the wordmark. The same logo
 * — hexagon, the A, the axis driven up through it — holds its shape at any
 * size here, and costs no request.
 *
 * The full artwork is kept at `public/brand/axis-one-tile.png` for places that
 * want it at size, such as the business card.
 *
 * `size` is the rendered height in pixels.
 */

export function AxisMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="axis-mark"
      height={size}
      width={Math.round((112 / 118) * size)}
      viewBox="0 0 112 118"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* the hexagon */}
      <path
        d="M56 11 99 34.5v49L56 107 13 83.5v-49Z"
        stroke="var(--gold, #C9A227)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* the A */}
      <path
        d="M27 92 56 32l29 60"
        stroke="var(--purple-neon, #9D4EDD)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M34 72h44" stroke="#A95BE8" strokeWidth="6.5" strokeLinecap="round" />
      {/* the axis, through the mark and out the top */}
      <path d="M56 99V18" stroke="#E7B93A" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M56 2 68 25H44Z" fill="#E7B93A" />
    </svg>
  );
}

/** The mark plus the wordmark. */
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
