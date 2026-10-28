import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  href?: string;
}

// Banner image with a slow ken-burns zoom, a light sheen sweep and a fade-up
// reveal when it scrolls into view. Keeps the native aspect ratio so the text
// baked into the artwork is never cropped. Motion is disabled for users who
// prefer reduced motion (see index.css).
export default function MotionImage({ src, alt, width, height, className = "", href }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frame = (
    <div
      ref={ref}
      className={`motion-frame relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 ${
        visible ? "is-visible" : ""
      } ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="motion-zoom absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="motion-sheen pointer-events-none absolute inset-0" />
    </div>
  );

  return href ? (
    <a href={href} className="block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
      {frame}
    </a>
  ) : (
    frame
  );
}
