"use client";

import React, { useEffect, useMemo, useState } from "react";

type FacilityBase = {
  id: string;
  type: string;
  name: string;
  upgradeLevel: number;
  status: 'active'|'building'|'upgrading';
  efficiency?: number;
  operating?: boolean;
  addOns?: string[];
};

type Stats = {
  profitPerTick?: number;
  powerKwh?: number;
  env?: { air: number; water: number; bio: number };
  upgradeCost?: number;
  canUpgrade?: boolean;
  cycle?: { ready: boolean; remainHours?: number };
};

type AddonDesc = { id: string; label: string; icon: string; cost?: number; installed?: boolean; disabled?: boolean };

function Sparkline({ values, width = 160, height = 48, className = '' }: { values: number[]; width?: number; height?: number; className?: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const pts = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * width;
    const y = height - ((v - min) / span) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className={className} aria-hidden>
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={pts} />
    </svg>
  );
}

export default function FacilityDetailView({
  facility,
  meta,
  stats,
  onClose,
  onUpgrade,
  onCollect,
  installedAddons = [],
  availableAddons = [],
  onInstallAddon,
}: {
  facility: FacilityBase;
  meta?: { label?: string; icon?: string };
  stats?: Stats;
  onClose: () => void;
  onUpgrade: (id: string) => void;
  onCollect?: (id: string) => void;
  installedAddons?: AddonDesc[];
  availableAddons?: AddonDesc[];
  onInstallAddon?: (id: string) => void;
}) {
  const [series, setSeries] = useState<number[]>(() => Array.from({ length: 40 }, (_, i) => 50 + Math.round(Math.sin(i/3)*20)));
  useEffect(() => {
    const t = setInterval(() => setSeries(s => [...s.slice(1), s[s.length-1] + (Math.random()*6-3)]), 900);
    return () => clearInterval(t);
  }, []);

  const statusLabel = useMemo(() => (
    facility.status === 'building' ? '공사 중' : facility.status === 'upgrading' ? '업그레이드 중' : (facility.operating === false ? '정지' : '가동')
  ), [facility.status, facility.operating]);

  const profit = stats?.profitPerTick ?? undefined;
  const power = stats?.powerKwh ?? undefined;
  const env = stats?.env ?? undefined;

  return (
    <div className="fixed inset-0 z-[96]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-14 -translate-x-1/2 w-[min(96vw,980px)] rounded-xl kingdom-sheet overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>{meta?.icon ?? '🏗️'}</span>
            <div>
              <div className="text-sm font-medium">{facility.name} <span className="ml-1 text-black/50">Lv.{facility.upgradeLevel}</span></div>
              <div className="text-[11px] text-black/60">상태: {statusLabel}{typeof facility.efficiency === 'number' ? ` • 효율 ${Math.round(facility.efficiency)}%` : ''}</div>
            </div>
          </div>
          <button className="text-xs border px-2 py-1 rounded" onClick={onClose}>닫기</button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-3">
          {/* Overview */}
          <div className="rounded-md border border-black/10 bg-white p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <div className="rounded border border-black/10 p-2">
                <div className="text-[11px] text-black/60">예상 수지/틱</div>
                <div className={`font-semibold tabular-nums ${profit!=null ? (profit>=0?'text-emerald-600':'text-rose-600') : 'text-black/70'}`}>{profit!=null ? `${profit>=0?'+':''}${profit}` : '-'}</div>
              </div>
              <div className="rounded border border-black/10 p-2">
                <div className="text-[11px] text-black/60">전력 영향(kWh)</div>
                <div className={`font-semibold tabular-nums ${power!=null ? (power>=0?'text-sky-600':'text-amber-600') : 'text-black/70'}`}>{power!=null ? `${power>=0?'+':''}${power}` : '-'}</div>
              </div>
              <div className="rounded border border-black/10 p-2">
                <div className="text-[11px] text-black/60">환경 영향(월)</div>
                <div className="text-[12px]">
                  {env ? (
                    <div className="flex gap-2">
                      <span className={`${env.air>=0?'text-emerald-600':'text-rose-600'}`}>대기 {env.air>=0?'+':''}{env.air}</span>
                      <span className={`${env.water>=0?'text-emerald-600':'text-rose-600'}`}>수질 {env.water>=0?'+':''}{env.water}</span>
                      <span className={`${env.bio>=0?'text-emerald-600':'text-rose-600'}`}>생물 {env.bio>=0?'+':''}{env.bio}</span>
                    </div>
                  ) : '-' }
                </div>
              </div>
            </div>
            {/* Decorative trend */}
            <div className="mt-3">
              <div className="text-[11px] text-black/60 mb-1">트렌드</div>
              <Sparkline values={series} width={280} height={48} className="text-emerald-600" />
            </div>
          </div>

          {/* Actions & Add-ons */}
          <div className="rounded-md border border-black/10 bg-white p-3 space-y-2">
            <button
              className="w-full rounded bg-emerald-500 text-white py-2 text-sm hover:bg-emerald-400 disabled:opacity-50"
              onClick={()=>onUpgrade(facility.id)}
              disabled={stats?.canUpgrade===false}
            >업그레이드{stats?.upgradeCost!=null?` (${stats.upgradeCost})`:''}</button>
            {onCollect && stats?.cycle && (
              stats.cycle.ready ? (
                <button className="w-full rounded border border-amber-300 bg-amber-50 text-amber-800 py-2 text-sm" onClick={()=>onCollect(facility.id)}>수확</button>
              ) : (
                <div className="rounded border border-black/10 p-2 text-xs text-black/70">수확까지 {stats.cycle.remainHours ?? '-'}시간</div>
              )
            )}

            {/* Installed add-ons */}
            {installedAddons.length>0 && (
              <div>
                <div className="text-[12px] text-black/60 mb-1">설치된 애드온</div>
                <div className="flex flex-wrap gap-1">
                  {installedAddons.map(a => (
                    <span key={a.id} className="inline-flex items-center gap-1 rounded border border-black/10 bg-white px-2 py-0.5 text-xs">
                      <span>{a.icon}</span>
                      <span>{a.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Available add-ons */}
            {availableAddons.length>0 && (
              <div>
                <div className="text-[12px] text-black/60 mb-1">애드온 설치</div>
                <div className="grid grid-cols-1 gap-2">
                  {availableAddons.map(a => (
                    <button key={a.id}
                      className="flex items-center justify-between rounded-lg border border-black/10 p-2 text-left hover:bg-black/5 text-sm disabled:opacity-50"
                      onClick={() => onInstallAddon?.(a.id)}
                      disabled={a.disabled || a.installed}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{a.icon}</span>
                        <div>
                          <div className="font-medium">{a.label}</div>
                          {a.cost!=null && <div className="text-xs text-black/60">${a.cost}</div>}
                        </div>
                      </div>
                      <div className="text-xs text-black/60">설치</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-black/60">참고: 화면 바깥을 탭/클릭하면 닫힙니다.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
