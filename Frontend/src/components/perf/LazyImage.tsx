"use client";
import React, { useState } from "react";
// ... rest of the file is fine as it was
// I'll just replace the whole file with "use client" added.

type BaseProps = {
  /** Use this if you have local/CDN variants like /img/hero -> tries .avif/.webp/.jpg */
  baseSrc?: string;
  /** Use this if you only have a single URL (e.g., pexels full URL with query) */
  src?: string;
  /** Optional very tiny preview (20–60px) */
  lqip?: string;
  /** Above-the-fold? */
  priority?: boolean;
  /** Optional responsive sets */
  srcSet?: string;
  sizes?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export default function LazyImage({
  baseSrc,
  src,
  alt = "",
  lqip,
  priority = false,
  srcSet,
  sizes,
  style,
  ...imgProps
}: BaseProps) {
  const [loaded, setLoaded] = useState(false);

  // If a direct src is provided, render a plain <img> (no <picture> sources).
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-ignore - fetchpriority is supported in modern browsers
        fetchpriority={priority ? "high" : "auto"}
        srcSet={srcSet}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        style={{
          filter: loaded ? "blur(0)" : "blur(12px)",
          transition: "filter .35s ease, opacity .25s ease",
          opacity: loaded ? 1 : 0.85,
          backgroundImage: lqip ? `url(${lqip})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          ...style,
          ...style,
        }}
        {...imgProps}
      />
    );
  }

  // Otherwise, try modern formats first using baseSrc
  if (!baseSrc) {
    console.warn("LazyImage: Provide either `src` or `baseSrc`.");
    return null;
  }

  return (
    <picture>
      <source srcSet={`${baseSrc}.avif`} type="image/avif" />
      <source srcSet={`${baseSrc}.webp`} type="image/webp" />
      <img
        src={`${baseSrc}.jpg`}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-ignore
        fetchpriority={priority ? "high" : "auto"}
        srcSet={srcSet}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        style={{
          filter: loaded ? "blur(0)" : "blur(12px)",
          transition: "filter .35s ease, opacity .25s ease",
          opacity: loaded ? 1 : 0.85,
          backgroundImage: lqip ? `url(${lqip})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          ...style,
        }}
        {...imgProps}
      />
    </picture>
  );
}
