import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * The only image the site loads through next/image is the mark, a 215px
     * PNG drawn at 20–34px. Resizing it on a server buys nothing and makes the
     * page depend on one: served unoptimised, the markup carries the file's
     * own path and the site works anywhere it is copied to.
     */
    unoptimized: true,
  },
};

export default nextConfig;
