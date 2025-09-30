import type { PropsWithChildren } from "react";

function mergeClassNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type GlowFrameProps = PropsWithChildren<{
  glowColor?: string;
  borderColor?: string;
  className?: string;
  padding?: string;
}>;

/**
 * Provides a layered glowing frame used across HUD panels and quick dock cards.
 * Tailwind utility classes can be appended via `className`; the glow color defaults
 * to palette highlight tones but can be overridden per component.
 */
export function GlowFrame({
  children,
  glowColor = "rgba(245, 193, 91, 0.45)",
  borderColor = "rgba(148, 233, 210, 0.35)",
  className,
  padding = "16px",
}: GlowFrameProps) {
  return (
    <div
      className={mergeClassNames(
        "relative overflow-hidden rounded-3xl border",
        className,
      )}
      style={{
        borderColor,
        boxShadow: `var(--eco-glow-shadow, 0 12px 24px rgba(15, 23, 42, 0.35))`,
        padding,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 50% 0%, ${glowColor}, transparent 65%)`,
          mixBlendMode: "screen",
          opacity: 0.85,
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
