"use client";

import React from "react";
import Image from "next/image";

type Props = {
  type: string;
  level: number;
  status?: "active" | "building" | "upgrading";
  addons?: string[];
  selected?: boolean;
  size?: "sm" | "md" | "lg";
  emojiFallback: string; // pass FACILITY_META[type].icon
  alt?: string;
};

/**
 * FacilitySprite renders a sprite from /public/eco-quest/sprites with graceful emoji fallback.
 * Expected asset path: /eco-quest/sprites/<type>/level-<n>/base.png
 * This component only concerns itself with the base sprite; callers can overlay progress/labels.
 */
export function FacilitySprite({ type, level, status, addons = [], selected = false, size = "md", emojiFallback, alt }: Props) {
  const [imgErr, setImgErr] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const lvl = Math.max(1, Math.min(4, Math.floor(level || 1)));
  const dimClass = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-12 h-12" : "w-8 h-8";
  const dimension = size === "sm" ? 24 : size === "lg" ? 48 : 32;

  function pickVariant(adds: string[]): string | null {
    // Lightweight mapping: prioritize visually distinct add-ons if assets exist
    const priority = [
      "solar_roof",
      "air_purifier",
      "ccs",
      "wastewater_treatment",
      "greywater_reuse",
      "wind_turbine_addon",
      "recycling_center_addon",
      "biogas_plant",
      "organic_cert",
    ];
    const hit = priority.find(a => adds.includes(a));
    if (!hit) return null;
    const map: Record<string, string> = {
      solar_roof: "solar",
      air_purifier: "filter",
      ccs: "ccs",
      wastewater_treatment: "wastewater",
      greywater_reuse: "greywater",
      wind_turbine_addon: "wind",
      recycling_center_addon: "recycle",
      biogas_plant: "biogas",
      organic_cert: "organic",
    };
    return map[hit] ?? null;
  }

  const variant = pickVariant(addons);
  const candidates = React.useMemo(() => {
    const arr: string[] = [];
    if (variant) arr.push(`/eco-quest/sprites/${type}/level-${lvl}/variant-${variant}.png`);
    arr.push(`/eco-quest/sprites/${type}/level-${lvl}/base.png`);
    return arr;
  }, [type, lvl, variant]);

  React.useEffect(() => { setIdx(0); setImgErr(false); }, [type, lvl, variant]);

  const src = candidates[idx];
  const ariaLabel = status ? `${alt ?? `${type} Lv.${lvl}`} (${status})` : alt ?? `${type} Lv.${lvl}`;
  const statusClass = status === "building" ? "animate-pulse" : status === "upgrading" ? "ring-2 ring-sky-400/80" : "";

  return (
    <div
      className={`relative inline-flex items-center justify-center ${selected ? "scale-110" : ""} ${statusClass}`.trim()}
      aria-label={ariaLabel}
      data-status={status}
    >
      {imgErr ? (
        <span className="text-3xl" aria-hidden>{emojiFallback}</span>
      ) : (
        <Image
          src={src}
          alt={ariaLabel}
          width={dimension}
          height={dimension}
          className={`${dimClass} object-contain select-none pointer-events-none`}
          draggable={false}
          onError={() => {
            if (idx < candidates.length - 1) setIdx(i => i + 1); else setImgErr(true);
          }}
          unoptimized
        />
      )}
    </div>
  );
}

export default FacilitySprite;
