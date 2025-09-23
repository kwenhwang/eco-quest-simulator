"use client";

import React from "react";

export type Policy = {
  taxPerNegEnvMonthly: number;     // money per -1 env-month (air/water/bio)
  subsidyPerPosEnvMonthly: number; // money per +1 env-month (air/water/bio)
  regulationStrictness: number;    // 0..1
};

export function PolicyPanel({ policy, onChange }: { policy: Policy; onChange: (p: Policy) => void }) {
  const set = (partial: Partial<Policy>) => onChange({ ...policy, ...partial });
  return (
    <div className="rounded-lg border border-black/10 bg-white p-3 text-sm">
      <div className="font-medium mb-2">정책 패널</div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-black/60">오염세(피구세) — 단위: /환경포인트·월</label>
          <div className="flex items-center gap-2 mt-1">
            <input type="range" min={0} max={100} step={5} value={policy.taxPerNegEnvMonthly} onChange={(e)=>set({ taxPerNegEnvMonthly: parseInt(e.target.value, 10) })} className="flex-1" />
            <input type="number" className="w-16 border rounded px-1 py-0.5 text-xs" min={0} max={100} value={policy.taxPerNegEnvMonthly} onChange={(e)=>set({ taxPerNegEnvMonthly: Math.max(0, Math.min(100, parseInt(e.target.value||'0',10))) })} />
          </div>
          <div className="text-[11px] text-black/60 mt-1">음의 환경 영향에 비례해 비용 발생</div>
        </div>
        <div>
          <label className="text-xs text-black/60">환경 보조금 — 단위: /환경포인트·월</label>
          <div className="flex items-center gap-2 mt-1">
            <input type="range" min={0} max={60} step={5} value={policy.subsidyPerPosEnvMonthly} onChange={(e)=>set({ subsidyPerPosEnvMonthly: parseInt(e.target.value, 10) })} className="flex-1" />
            <input type="number" className="w-16 border rounded px-1 py-0.5 text-xs" min={0} max={60} value={policy.subsidyPerPosEnvMonthly} onChange={(e)=>set({ subsidyPerPosEnvMonthly: Math.max(0, Math.min(60, parseInt(e.target.value||'0',10))) })} />
          </div>
          <div className="text-[11px] text-black/60 mt-1">양의 환경 개선에 비례해 수익 발생</div>
        </div>
        <div>
          <label className="text-xs text-black/60">규제 강도</label>
          <div className="flex items-center gap-2 mt-1">
            <input type="range" min={0} max={100} step={5} value={Math.round(policy.regulationStrictness*100)} onChange={(e)=>set({ regulationStrictness: Math.max(0, Math.min(1, parseInt(e.target.value,10)/100)) })} className="flex-1" />
            <input type="number" className="w-16 border rounded px-1 py-0.5 text-xs" min={0} max={100} value={Math.round(policy.regulationStrictness*100)} onChange={(e)=>set({ regulationStrictness: Math.max(0, Math.min(1, parseInt(e.target.value||'0',10)/100)) })} />
          </div>
          <div className="text-[11px] text-black/60 mt-1">음의 총 환경 영향(대기+수질+생물)에 비례한 추가 벌금</div>
        </div>
        <div className="text-[11px] text-black/60">Tip: 오염세↑/보조금↑은 외부비용을 내재화하여 사회적 최적에 가깝게 만듭니다.</div>
      </div>
    </div>
  );
}

