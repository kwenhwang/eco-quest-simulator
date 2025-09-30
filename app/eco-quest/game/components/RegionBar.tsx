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
  goalsSummary?: {
    completed: number;
    total: number;
  };
  policySummary?: {
    active: number;
    total: number;
  };
  notificationsCount?: number;
  environmentSummary?: {
    net: number;
    air: number;
    water: number;
    bio: number;
  };
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
  goalsSummary,
  policySummary,
  notificationsCount,
  environmentSummary,
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

        {(goalsSummary || policySummary || typeof notificationsCount === "number" || environmentSummary) && (
          <div className="grid gap-2 text-[11px] text-slate-200 sm:grid-cols-3">
            {goalsSummary ? (
              <SummaryChip
                title="목표 달성"
                value={`${goalsSummary.completed}/${goalsSummary.total}`}
                tone="emerald"
              />
            ) : null}
            {policySummary ? (
              <SummaryChip
                title="활성 정책"
                value={`${policySummary.active}/${policySummary.total}`}
                tone="cyan"
              />
            ) : null}
            {typeof notificationsCount === "number" ? (
              <SummaryChip
                title="알림"
                value={`${notificationsCount}건`}
                tone={notificationsCount > 0 ? "amber" : "slate"}
              />
            ) : null}
            {environmentSummary ? (
              <SummaryChip
                title="환경 변화(월)"
                value={`${environmentSummary.net >= 0 ? "+" : ""}${Math.round(environmentSummary.net)}`}
                subtitle={`대기 ${Math.round(environmentSummary.air)}, 수질 ${Math.round(environmentSummary.water)}, 생물 ${Math.round(environmentSummary.bio)}`}
                tone={environmentSummary.net >= 0 ? "emerald" : "rose"}
                className="sm:col-span-3"
              />
            ) : null}
          </div>
        )}
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

type SummaryChipProps = {
  title: string;
  value: string;
  subtitle?: string;
  tone?: "emerald" | "cyan" | "amber" | "rose" | "slate";
  className?: string;
};

function SummaryChip({
  title,
  value,
  subtitle,
  tone = "slate",
  className,
}: SummaryChipProps) {
  const toneClass = {
    emerald: "border-emerald-400/40 text-emerald-100",
    cyan: "border-cyan-400/40 text-cyan-100",
    amber: "border-amber-400/40 text-amber-100",
    rose: "border-rose-400/40 text-rose-100",
    slate: "border-slate-600/40 text-slate-200",
  }[tone];

  return (
    <div
      className={`eco-chip rounded-2xl border px-4 py-3 ${toneClass} ${className ?? ""}`.trim()}
    >
      <div className="text-[10px] uppercase tracking-wide text-slate-400/80">
        {title}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-current">{value}</div>
      {subtitle ? (
        <div className="mt-1 text-[10px] text-slate-300/80">{subtitle}</div>
      ) : null}
    </div>
  );
}
