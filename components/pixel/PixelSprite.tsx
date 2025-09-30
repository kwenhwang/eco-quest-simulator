"use client";

import Image from "next/image";
import { useMemo } from "react";

import { getSpriteMetadata } from "./sprite-registry";

type PixelSpriteProps = {
  spriteId: string;
  alt: string;
  size?: number;
  className?: string;
  animated?: boolean;
  priority?: boolean;
};

export function PixelSprite({
  spriteId,
  alt,
  size = 64,
  className = "",
  animated = true,
  priority = false,
}: PixelSpriteProps) {
  const sprite = getSpriteMetadata(spriteId);

  const scaledSize = useMemo(() => ({
    width: size,
    height: size,
  }), [size]);

  if (!sprite) {
    // Gracefully degrade until registry is complete.
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-slate-800/60 text-xs text-slate-400 ${className}`}
        style={{ width: scaledSize.width, height: scaledSize.height }}
      >
        Missing sprite
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: scaledSize.width,
        height: scaledSize.height,
        imageRendering: "pixelated",
      }}
    >
      <Image
        src={sprite.src}
        alt={alt}
        width={sprite.pixelDensity}
        height={sprite.pixelDensity}
        sizes={`${scaledSize.width}px`}
        className={animated ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}
        style={{
          width: "100%",
          height: "100%",
        }}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
      />
    </div>
  );
}
