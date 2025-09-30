"use client";

import { useMemo } from "react";

import { CreativeEnergyIcon, CreativeMoneyIcon, CreativePopulationIcon } from "@/components/CreativeResourceIcons";
import { GlowFrame } from "@/components/pixel/GlowFrame";
import type { NotificationSeverity } from "@/lib/game/types";

export interface RegionBarProps {
  title?: string;
  tick: number;
  started: boolean;
  sessionId: string | null;
  supabaseStatus: string;
  resources: {
    credits: number;
    energy: number;
    energyCapacity: number;
    population: number;
    ecoScore: number;
    water: number;
  };
  energyFacilityCount: number;
  onToggleStart: () => void;
  pulseSeverity?: NotificationSeverity | null;
}

export function RegionBar({
  title = "Eco Quest 시뮬레이션",
  tick,
  started,
  sessionId,
  supabaseStatus,
  resources,
  energyFacilityCount,
  onToggleStart,
  pulseSeverity = null,
}: RegionBarProps) {
  const energyLabel = useMemo(() => {
    if (resources.energyCapacity <= 0) {
      return `${Math.round(resources.energy)}⚡`;
    }
    return `${Math.round(resources.energy)}/${Math.round(resources.energyCapacity)}⚡`;
  }, [resources.energy, resources.energyCapacity]);

  const statusTone = started
    ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
    : "bg-emerald-500 text-slate-950 hover:bg-emerald-400";

  const pulseClass = pulseSeverity ? `eco-hud-pulse-${pulseSeverity}` : "";

  return (
    <GlowFrame
      className={`animate-eco-hud-enter eco-glass-panel eco-bevel-edge eco-hud-shell supports-[backdrop-filter]:backdrop-blur-xl ${pulseClass}`.trim()}
      borderColor="rgba(125, 211, 252, 0.35)"
      glowColor="rgba(148, 233, 210, 0.45)"
      padding="28px"
    >
      <div className="flex flex-col gap-4 text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">{title}</h1>
            <p className="text-sm text-slate-300">
              시즌 1 · {started ? "진행 중" : "대기 중"} · Tick {tick.toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleStart}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-200 ${statusTone}`}
          >
            {started ? "일시 정지" : "게임 시작하기"}
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <ResourceBadge
            variant="credits"
            label="크레딧"
            value={Math.round(resources.credits).toLocaleString()}
          />
          <ResourceBadge variant="energy" label="에너지" value={energyLabel} />
          <ResourceBadge
            variant="population"
            label="인구"
            value={`${Math.round(resources.population).toLocaleString()}명`}
          />
          <div className="eco-chip rounded-2xl border border-emerald-400/30 px-4 py-3 text-xs text-emerald-100">
            <div className="font-semibold">환경 상태</div>
            <dl className="mt-2 space-y-1 text-[11px]">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-emerald-200/80">환경 점수</dt>
                <dd className="font-semibold text-emerald-100">
                  {Math.round(resources.ecoScore)} / 100
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-emerald-200/80">물 자원</dt>
                <dd className="font-semibold text-emerald-100">
                  {Math.max(0, Math.round(resources.water)).toLocaleString()}㎘
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-emerald-200/80">재생 시설</dt>
                <dd className="font-semibold text-emerald-100">{energyFacilityCount}개</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-emerald-200">
            {sessionId ? `세션 ID: ${sessionId}` : "세션 준비 중"}
          </span>
          <span className="text-[11px] sm:text-xs">{supabaseStatus}</span>
        </div>
      </div>
    </GlowFrame>
  );
}

type ResourceBadgeProps = {
  variant: "credits" | "energy" | "population";
  label: string;
  value: string;
};

function ResourceBadge({ variant, label, value }: ResourceBadgeProps) {
  const Icon =
    variant === "credits"
      ? CreativeMoneyIcon
      : variant === "energy"
      ? CreativeEnergyIcon
      : CreativePopulationIcon;

  return (
    <div
      className="eco-chip flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-200"
      data-variant={variant === "energy" ? "emerald" : undefined}
    >
      <Icon size={36} animated value={undefined} />
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
        <div className="truncate text-sm font-semibold text-slate-100">{value}</div>
      </div>
    </div>
  );
}
