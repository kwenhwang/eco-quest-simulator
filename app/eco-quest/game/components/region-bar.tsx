"use client";

import React from "react";

type Env = { air: number; water: number; bio: number };
type NeighborStrategy = 'balanced' | 'selfish' | 'green';

function Bar({ label, value, className }: { label: string; value: number; className: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-14 text-black/60">{label}</div>
      <div className="flex-1 h-2 rounded bg-black/10 overflow-hidden">
        <div className={`h-full ${className}`} style={{ width: `${v}%`, transition: 'width 300ms ease' }} />
      </div>
      <div className="w-10 text-right tabular-nums text-black/70">{v}%</div>
    </div>
  );
}

export function RegionBar({
  region,
  mine,
  neighborStrategy,
  onNeighborStrategyChange,
}: {
  region: Env;
  mine: Env;
  neighborStrategy: NeighborStrategy;
  onNeighborStrategyChange: (s: NeighborStrategy) => void;
}) {
  // Contribution hint: region - mine
  const others = {
    air: Math.round((region.air - mine.air) * 10) / 10,
    water: Math.round((region.water - mine.water) * 10) / 10,
    bio: Math.round((region.bio - mine.bio) * 10) / 10,
  };
  const opt = [
    { id: 'green', label: '친환경' },
    { id: 'balanced', label: '균형' },
    { id: 'selfish', label: '이기적' },
  ] as const;
  return (
    <div className="px-3 sm:px-4 pb-2">
      <div className="rounded-lg border border-black/10 bg-white/70 p-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium">지역 환경(공동)</div>
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-black/50">이웃 전략</span>
            <select
              className="border rounded px-1 py-0.5"
              value={neighborStrategy}
              onChange={(e) => onNeighborStrategyChange(e.target.value as NeighborStrategy)}
            >
              {opt.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <Bar label="대기" value={region.air} className="bg-sky-500" />
          <Bar label="수질" value={region.water} className="bg-emerald-500" />
          <Bar label="생물" value={region.bio} className="bg-lime-500" />
        </div>
        <div className="mt-1 text-[11px] text-black/60">
          이웃 영향: 대기 {others.air>=0?`+${others.air}`:others.air}, 수질 {others.water>=0?`+${others.water}`:others.water}, 생물 {others.bio>=0?`+${others.bio}`:others.bio}
        </div>
      </div>
    </div>
  );
}
