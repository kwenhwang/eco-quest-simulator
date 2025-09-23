"use client";

import React from "react";

export type EnvDelta = { air: number; water: number; bio: number };

// Simple coefficients to translate monthly env deltas into daily social costs.
// Units: money per 1.0 env-point (monthly), converted to per-day internally.
const SOCIAL_COST = {
  air: 60,    // air pollution health/externality proxy
  water: 80,  // water contamination cleanup/import proxy
  bio: 50,    // biodiversity loss/protection proxy
} as const;

function toDailySocialCost(envMonthly: EnvDelta) {
  // Only negative impacts count as costs; positive impacts are benefits but not monetized here (P0).
  const neg = {
    air: Math.min(0, envMonthly.air),
    water: Math.min(0, envMonthly.water),
    bio: Math.min(0, envMonthly.bio),
  };
  const costMonthly = (neg.air * -SOCIAL_COST.air) + (neg.water * -SOCIAL_COST.water) + (neg.bio * -SOCIAL_COST.bio);
  const costDaily = costMonthly / 30;
  return Math.round(costDaily);
}

export function ExternalityLedger({
  title = "외부효과(사회적 비용)",
  envImpactMonthly,
  privateIncomeDaily,
}: {
  title?: string;
  envImpactMonthly: EnvDelta;
  privateIncomeDaily?: number; // optional: when provided, show social net = private - social cost
}) {
  const costDaily = toDailySocialCost(envImpactMonthly);
  const socialNet = typeof privateIncomeDaily === "number" ? Math.round(privateIncomeDaily - costDaily) : null;
  const badge = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
  return (
    <div
      className="rounded-lg border border-black/10 p-2 text-xs bg-white/70"
      data-testid="externality-ledger"
    >
      <div className="font-medium mb-1">{title}</div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-[11px] text-black/60">대기(월)</div>
          <div className={`tabular-nums ${envImpactMonthly.air>=0?'text-emerald-600':'text-rose-600'}`}>{badge(Math.round(envImpactMonthly.air))}</div>
        </div>
        <div>
          <div className="text-[11px] text-black/60">수질(월)</div>
          <div className={`tabular-nums ${envImpactMonthly.water>=0?'text-emerald-600':'text-rose-600'}`}>{badge(Math.round(envImpactMonthly.water))}</div>
        </div>
        <div>
          <div className="text-[11px] text-black/60">생물(월)</div>
          <div className={`tabular-nums ${envImpactMonthly.bio>=0?'text-emerald-600':'text-rose-600'}`}>{badge(Math.round(envImpactMonthly.bio))}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-black/70">사회적 비용(일)</div>
        <div className="tabular-nums font-medium text-rose-600" data-testid="social-cost-daily">
          -{Math.abs(costDaily)}
        </div>
      </div>
      {socialNet != null && (
        <div className="mt-1 flex items-center justify-between">
          <div className="text-black/70">사회적 순이익(일)</div>
          <div
            className={`tabular-nums font-semibold ${socialNet>=0?'text-emerald-600':'text-rose-600'}`}
            data-testid="social-net-daily"
          >
            {socialNet>=0?'+':''}{socialNet}
          </div>
        </div>
      )}
      <div className="mt-1 text-[11px] text-black/50">참고: 사회적 비용은 환경 악화분만 반영(개선분은 P0에서 미반영).</div>
    </div>
  );
}
