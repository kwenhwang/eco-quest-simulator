"use client";

import React, { useMemo } from "react";

type Vec2 = { x: number; y: number };
type Facility = {
  id: string;
  type: string;
  name: string;
  position: Vec2;
  upgradeLevel: number;
  status: 'active'|'building'|'upgrading';
  addOns: string[];
};
type EnvMetrics = { airQuality: number; waterQuality: number; biodiversity: number };

function categorize(type: string): 'power'|'mfg'|'agri'|'civic'|'retail'|'util' {
  if (type==='coal_power' || type==='gas_power' || type==='wind_turbine' || type==='solar_panel') return 'power';
  if (type==='chemical_plant' || type==='steel_plant' || type==='food_processing' || type==='factory') return 'mfg';
  if (type==='organic_farm' || type==='regular_farm' || type==='vertical_farm') return 'agri';
  if (type==='research_lab') return 'civic';
  if (type==='hypermarket') return 'retail';
  if (type==='water_purifier' || type==='sewage_treatment' || type==='recycling_center') return 'util';
  return 'mfg';
}

export function CityView({ facilities, metrics, season }: { facilities: Facility[]; metrics: EnvMetrics; season: 'normal'|'summer'|'winter' }) {
  const buildings = useMemo(() => {
    const list = facilities.filter(f => f.status === 'active').map((f) => ({
      id: f.id,
      cat: categorize(f.type),
      level: f.upgradeLevel,
      addons: f.addOns,
      type: f.type,
    }));
    // Sort for nicer skyline: civic/retail center, mfg/power sides
    const order = { civic: 2, retail: 2, agri: 0, util: 1, mfg: 1, power: 0 } as const;
    list.sort((a, b) => (order[b.cat as keyof typeof order] - order[a.cat as keyof typeof order]) || (b.level - a.level));
    return list;
  }, [facilities]);

  const envTint = useMemo(() => {
    const air = Math.max(0, Math.min(100, metrics.airQuality));
    const g = air >= 70 ? 'rgba(16,185,129,0.10)' : air >= 50 ? 'rgba(245,158,11,0.08)' : 'rgba(244,63,94,0.10)';
    return g;
  }, [metrics.airQuality]);

  const hasWind = buildings.some(b => b.addons.includes('wind_turbine_addon'));
  const agriCount = buildings.filter(b => b.cat==='agri').length;
  const waterUtil = buildings.filter(b => b.cat==='util').length > 0;

  const seasonGlyph = season === 'winter' ? '❄️' : season === 'summer' ? '☀️' : '🌤️';

  return (
    <div className="city-view">
      <div className="city-sky" style={{ background: `linear-gradient(180deg, #b3e5fc 0%, #e0f7fa 60%, #fff 100%)` }} />
      {/* Env tint overlay */}
      <div className="city-tint" style={{ background: envTint }} />
      {/* Sun/Moon simple */}
      <div className="city-sun" aria-hidden>{seasonGlyph}</div>
      {/* Skyline */}
      <div className="city-skyline">
        {buildings.map((b) => {
          const h = 40 + Math.min(5 + b.level * 10, 120);
          const cls = b.cat === 'civic' ? 'building-civic' : b.cat === 'retail' ? 'building-retail' : b.cat === 'mfg' ? 'building-mfg' : b.cat === 'power' ? 'building-power' : b.cat === 'util' ? 'building-util' : 'building-agri';
          return (
            <div key={b.id} className={`building ${cls}`} style={{ height: h }} title={`${b.type} Lv.${b.level}`}> 
              {/* rooftop accents */}
              {(b.cat==='power' || b.cat==='mfg') && b.level>=3 && (<div className="roof-accent" />)}
              {b.addons.includes('solar_roof') && (<div className="roof-solar" title="Solar" />)}
            </div>
          );
        })}
      </div>
      {/* Foreground: farms & water */}
      <div className="city-foreground">
        {agriCount>0 && (
          <div className="farms" aria-label="농업 지대">
            {Array.from({length: Math.min(6, Math.max(2, agriCount))}).map((_,i)=>(<div key={i} className="farm-plot" />))}
          </div>
        )}
        {hasWind && (
          <div className="turbines" aria-hidden>
            <span>🌬️</span><span>🌬️</span>
          </div>
        )}
        {waterUtil && (
          <div className="water" aria-hidden>💧</div>
        )}
      </div>
    </div>
  );
}

export default CityView;
