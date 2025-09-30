"use client";

import { useMemo } from "react";

import { PixelSprite } from "@/components/pixel/PixelSprite";
import { getSpriteMetadata } from "@/components/pixel/sprite-registry";
import { GlowFrame } from "@/components/pixel/GlowFrame";
import { ParticleEmitter } from "@/components/pixel/ParticleEmitter";
import {
  FacilityDefinition,
  FacilityType,
  facilityCatalog,
} from "@/lib/game/facilities";

const FACILITY_SPRITES: Partial<Record<FacilityType, string>> = {
  solar: "facility-solar",
  wind: "facility-wind",
  residential: "facility-residential",
  park: "facility-park",
  recycling: "facility-recycling",
};

type FacilityOption = {
  type: FacilityType;
  definition: FacilityDefinition;
};

export type QuickDockFilter = "all" | "energy" | "civic" | "economic";

type BuildFeedback = {
  type: FacilityType;
  timestamp: number;
};

type QuickDockPanelProps = {
  selectedType: FacilityType | null;
  onSelect: (type: FacilityType) => void;
  filter: QuickDockFilter;
  onFilterChange: (filter: QuickDockFilter) => void;
  lastBuild?: BuildFeedback | null;
  className?: string;
};

type QuickDockBarProps = QuickDockPanelProps;

type FacilityButtonProps = {
  option: FacilityOption;
  selected: boolean;
  onClick: () => void;
  layout: "vertical" | "horizontal";
  emissionKey: string | null;
};

type QuickDockFiltersProps = {
  activeFilter: QuickDockFilter;
  onFilterChange: (filter: QuickDockFilter) => void;
  layout: "grid" | "scroll";
};

type QuickDockFilterOption = {
  value: QuickDockFilter;
  label: string;
  description: string;
};

const FILTER_OPTIONS: QuickDockFilterOption[] = [
  {
    value: "all",
    label: "전체",
    description: "모든 시설",
  },
  {
    value: "energy",
    label: "에너지",
    description: "태양광 · 풍력",
  },
  {
    value: "civic",
    label: "도시 인프라",
    description: "공원 · 재활용",
  },
  {
    value: "economic",
    label: "경제",
    description: "주거 · 상업",
  },
];

const FILTER_TYPE_MAP: Record<QuickDockFilter, FacilityType[]> = {
  all: Object.keys(facilityCatalog) as FacilityType[],
  energy: ["solar", "wind"],
  civic: ["park", "recycling"],
  economic: ["residential", "commercial"],
};

export const matchesQuickDockFilter = (
  filter: QuickDockFilter,
  type: FacilityType,
) => filter === "all" || FILTER_TYPE_MAP[filter].includes(type);

export function QuickDockPanel({
  selectedType,
  onSelect,
  filter,
  onFilterChange,
  lastBuild,
  className,
}: QuickDockPanelProps) {
  const options = useFacilityOptions(filter);

  return (
    <GlowFrame
      className={mergeClasses(
        "animate-eco-quickdock-enter eco-glass-panel eco-bevel-edge flex flex-col gap-4",
        className,
      )}
      borderColor="rgba(148, 233, 210, 0.4)"
      glowColor="rgba(245, 193, 91, 0.35)"
      padding="24px"
    >
      <header className="space-y-1">
        <div className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
          Quick Dock
        </div>
        <p className="text-xs text-slate-300">
          시설을 선택해 도시 그리드에 배치하세요.
        </p>
      </header>

      <QuickDockFilters
        activeFilter={filter}
        onFilterChange={onFilterChange}
        layout="grid"
      />

      <div className="space-y-3">
        {options.map((option) => (
          <FacilityButton
            key={option.type}
            option={option}
            selected={selectedType === option.type}
            onClick={() => onSelect(option.type)}
            layout="vertical"
            emissionKey={
              lastBuild && lastBuild.type === option.type
                ? `${lastBuild.type}-${lastBuild.timestamp}`
                : null
            }
          />
        ))}
      </div>
    </GlowFrame>
  );
}

export function QuickDockBar({
  selectedType,
  onSelect,
  filter,
  onFilterChange,
  lastBuild,
  className,
}: QuickDockBarProps) {
  const options = useFacilityOptions(filter);

  return (
    <GlowFrame
      className={mergeClasses(
        "animate-eco-quickdock-enter eco-glass-panel eco-bevel-edge supports-[backdrop-filter]:backdrop-blur-xl",
        className,
      )}
      borderColor="rgba(148, 233, 210, 0.4)"
      glowColor="rgba(245, 193, 91, 0.35)"
      padding="20px"
    >
      <QuickDockFilters
        activeFilter={filter}
        onFilterChange={onFilterChange}
        layout="scroll"
      />
      <div className="mt-3 flex items-center justify-between gap-2 overflow-x-auto">
        {options.map((option) => (
          <FacilityButton
            key={`${option.type}-bar`}
            option={option}
            selected={selectedType === option.type}
            onClick={() => onSelect(option.type)}
            layout="horizontal"
            emissionKey={
              lastBuild && lastBuild.type === option.type
                ? `${lastBuild.type}-${lastBuild.timestamp}`
                : null
            }
          />
        ))}
      </div>
    </GlowFrame>
  );
}

function FacilityButton({
  option,
  selected,
  onClick,
  layout,
  emissionKey,
}: FacilityButtonProps) {
  const spriteId = FACILITY_SPRITES[option.type];
  const spriteMeta = spriteId ? getSpriteMetadata(spriteId) : null;
  const Icon = option.definition.icon;
  const theme = option.type;
  const baseButtonClasses =
    "eco-card-interactive eco-card-surface relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-200";

  if (layout === "horizontal") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseButtonClasses} flex min-w-[90px] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-semibold ${
          selected
            ? "eco-card-selected text-emerald-100"
            : "text-slate-200 hover:text-emerald-100"
        }`}
        data-selected={selected ? "true" : undefined}
        data-theme={theme}
      >
        <ParticleEmitter
          emissionKey={emissionKey}
          className="pointer-events-none"
        />
        {spriteMeta ? (
          <PixelSprite
            spriteId={spriteId!}
            alt={option.definition.displayName}
            size={44}
            className="drop-shadow-[0_6px_12px_rgba(34,197,94,0.25)]"
          />
        ) : (
          <Icon size={44} animated className="shrink-0" />
        )}
        <span className="whitespace-nowrap">{option.definition.displayName}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseButtonClasses} flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left ${
        selected
          ? "eco-card-selected text-emerald-100"
          : "text-slate-200 hover:text-emerald-100"
      }`}
      data-selected={selected ? "true" : undefined}
      data-theme={theme}
    >
      <ParticleEmitter emissionKey={emissionKey} className="pointer-events-none" />
      {spriteMeta ? (
        <PixelSprite
          spriteId={spriteId!}
          alt={option.definition.displayName}
          size={56}
          className="shrink-0 drop-shadow-[0_6px_12px_rgba(34,197,94,0.25)]"
        />
      ) : (
        <Icon size={56} animated className="shrink-0" />
      )}
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-100">
          {option.definition.displayName}
        </div>
        <p className="truncate text-xs text-slate-400">
          {option.definition.quickHint}
        </p>
        <div className="mt-1 text-[11px] text-emerald-300">
          비용 {option.definition.cost.toLocaleString()}💰
        </div>
      </div>
    </button>
  );
}

function QuickDockFilters({ activeFilter, onFilterChange, layout }: QuickDockFiltersProps) {
  const containerClass =
    layout === "grid"
      ? "grid grid-cols-2 gap-2"
      : "flex items-center gap-2 overflow-x-auto pb-1";

  return (
    <div className={containerClass}>
      {FILTER_OPTIONS.map((option) => {
        const active = activeFilter === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className="eco-filter-pill"
            data-active={active ? "true" : undefined}
            aria-pressed={active}
            onClick={() => onFilterChange(option.value)}
          >
            <span className="text-xs font-semibold">{option.label}</span>
            <span className="text-[10px] text-emerald-200/80">
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function useFacilityOptions(filter: QuickDockFilter) {
  return useMemo(() => {
    return (Object.entries(facilityCatalog) as [FacilityType, FacilityDefinition][])
      .filter(([type]) => matchesQuickDockFilter(filter, type))
      .map(([type, definition]) => ({
        type,
        definition,
      }));
  }, [filter]);
}

function mergeClasses(base: string, extra?: string) {
  return extra ? `${base} ${extra}` : base;
}
