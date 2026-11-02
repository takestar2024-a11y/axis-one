import Image from "next/image";

/**
 * AXIS ONE — the mark.
 *
 * The artwork is the brand's own logo: the arrow-through-"A" inside the
 * hexagon. It lives in `public/brand/` as a transparent PNG so the violet and
 * gold bloom composites on the page's black instead of sitting on a plate.
 *
 * `size` is the rendered height in pixels; the width follows the artwork's
 * ratio. The file is 215×247, so anything up to ~110px is still inside its
 * native resolution.
 */

const SRC = "/brand/axis-one-mark.png";
const NATIVE = { w: 215, h: 247 };

export function AxisMark({ size = 26 }: { size?: number }) {
  const height = size;
  const width = Math.round((NATIVE.w / NATIVE.h) * size);

  return (
    <Image
      className="axis-mark"
      src={SRC}
      alt=""
      width={width}
      height={height}
      priority
      aria-hidden="true"
    />
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
