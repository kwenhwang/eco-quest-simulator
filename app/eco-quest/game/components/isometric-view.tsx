"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Vec2 = { x: number; y: number };
type Facility = {
  id: string;
  type: string;
  name: string;
  position: Vec2;
  upgradeLevel: number;
  status: 'active'|'building'|'upgrading';
};

// Simple icon map fallback for top faces (emoji)
const ICON: Record<string, string> = {
  coal_power: '⚡',
  gas_power: '🔥',
  chemical_plant: '🏭',
  steel_plant: '⚒️',
  food_processing: '🍞',
  research_lab: '🔬',
  hypermarket: '🏬',
  organic_farm: '🌾',
  regular_farm: '🌱',
  vertical_farm: '🏙️',
};

export function IsometricView({
  gridSize,
  facilities,
  onClose,
  onOpenDetail,
}: {
  gridSize: number;
  facilities: Facility[];
  onClose: () => void;
  onOpenDetail?: (id: string) => void;
}) {
  // Interaction state
  const [rot, setRot] = useState(45); // rotateZ degrees (default per requirement)
  const tilt = 60; // rotateX degrees (static for now)
  const [scale, setScale] = useState(1);
  const gesture = useRef<{ pointers: Map<number, {x:number;y:number}>; startRot?: number; startScale?: number; startDist?: number; lastX?: number } | null>(null);

  useEffect(() => { gesture.current = { pointers: new Map() }; }, []);

  function onPointerDown(e: React.PointerEvent) {
    const g = gesture.current!; g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (g.pointers.size === 1) { g.lastX = e.clientX; g.startRot = rot; }
    if (g.pointers.size === 2) {
      const pts = [...g.pointers.values()];
      g.startDist = Math.hypot(pts[1].x-pts[0].x, pts[1].y-pts[0].y);
      g.startScale = scale;
    }
  }
  function onPointerMove(e: React.PointerEvent) {
    const g = gesture.current!; if (!g.pointers.has(e.pointerId)) return; g.pointers.set(e.pointerId, {x:e.clientX,y:e.clientY});
    if (g.pointers.size === 1 && g.lastX != null && g.startRot != null) {
      const dx = e.clientX - g.lastX; setRot(g.startRot + dx * 0.2);
    }
    if (g.pointers.size === 2 && g.startDist && g.startScale) {
      const pts = [...g.pointers.values()];
      const dist = Math.hypot(pts[1].x-pts[0].x, pts[1].y-pts[0].y);
      const ratio = dist / g.startDist;
      setScale(Math.max(0.6, Math.min(2.0, g.startScale * ratio)));
    }
  }
  function onPointerUp(e: React.PointerEvent) {
    const g = gesture.current!; g.pointers.delete(e.pointerId);
    if (g.pointers.size === 0) { g.lastX=undefined; g.startRot=undefined; g.startScale=undefined; g.startDist=undefined; }
  }

  // Tile metrics for layout
  const tile = 40; // base size
  const halfW = tile; // iso horizontal spacing
  const halfH = tile * 0.5; // iso vertical spacing

  const items = useMemo(() => {
    return facilities.map(f => {
      const { x, y } = f.position;
      const ix = (x - y) * halfW;
      const iy = (x + y) * halfH;
      const h = 12 + (f.upgradeLevel - 1) * 10; // height by level
      return { ...f, ix, iy, h };
    });
  }, [facilities, halfW, halfH]);

  const width = (gridSize - 1) * halfW * 2 + tile * 2;
  const height = (gridSize - 1) * halfH * 2 + 200;

  return (
    <div className="iso-wrap" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div className="iso-toolbar">
        <button className="btn" onClick={()=>setRot(r=>r-15)}>↺</button>
        <button className="btn" onClick={()=>setRot(r=>r+15)}>↻</button>
        <button className="btn" onClick={()=>setScale(s=>Math.max(0.6, s*0.9))}>-</button>
        <button className="btn" onClick={()=>setScale(s=>Math.min(2.0, s*1.1))}>+</button>
        <button className="btn" onClick={onClose}>닫기</button>
      </div>
      <div className="iso-stage" style={{ perspective: 900 }}>
        <div className="iso-scene" style={{ width, height, transform: `scale(${scale}) rotateX(${tilt}deg) rotateZ(${rot}deg)`, transition: 'transform 300ms ease' }}>
          {/* Base grid diamonds */}
          {Array.from({ length: gridSize * gridSize }, (_, i) => {
            const x = i % gridSize; const y = Math.floor(i / gridSize);
            const ix = (x - y) * halfW; const iy = (x + y) * halfH;
            return (
              <div key={`g-${i}`} className="iso-tile" style={{ transform: `translate3d(${ix}px, ${iy}px, 0)` }} />
            );
          })}
          {/* Buildings */}
          {items.map(it => (
            <div key={it.id} className="iso-stack" style={{ transform: `translate3d(${it.ix}px, ${it.iy}px, 0)` }} onDoubleClick={()=>onOpenDetail?.(it.id)}>
              <div className="iso-pillar" style={{ height: it.h }} />
              <div className="iso-top" title={`${it.name} Lv.${it.upgradeLevel}`}>{ICON[it.type] ?? '🏗️'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IsometricView;
