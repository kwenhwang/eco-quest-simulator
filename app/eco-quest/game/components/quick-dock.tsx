"use client";

import React from "react";

type Props = {
  items: Array<{ type: string; icon?: React.ReactNode; label: string; price: number; disabled?: boolean }>;
  onPick: (type: string) => void;
};

export function QuickDock({ items, onPick, categories = [], selectedCategory, onSelectCategory, favorites = [], onToggleFavorite }: Props & {
  categories?: Array<{ id: string; label: string; icon?: string }>;
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
  favorites?: string[];
  onToggleFavorite?: (type: string) => void;
}) {
  return (
    <div className="kingdom-dock">
      {categories && categories.length > 0 && (
        <div className="mb-2 flex gap-6 items-center text-xs">
          {categories.map(c => (
            <button key={c.id}
              className={`rounded-full px-3 py-1 border ${selectedCategory===c.id? 'border-emerald-300 bg-emerald-50 text-emerald-700':'border-black/10 bg-white/80 text-black/70'}`}
              onClick={() => onSelectCategory?.(c.id)}
            >{c.icon? <span className="mr-1">{c.icon}</span>:null}{c.label}</button>
          ))}
        </div>
      )}
      {favorites && favorites.length > 0 && (
        <div className="mb-2 dock-scroll" aria-label="즐겨찾기">
          {favorites.map(ft => (
            <button key={ft} className="dock-item" onClick={()=>onPick(ft)}>
              <span className="ico">⭐</span>
              <span className="label">{ft}</span>
            </button>
          ))}
        </div>
      )}
      <div className="dock-scroll" role="toolbar" aria-label="빠른 건설">
        {items.map((it) => (
          <button
            key={it.type}
            className="dock-item"
            disabled={it.disabled}
            onClick={() => onPick(it.type)}
            aria-label={`${it.label} 건설`}
            title={`${it.label} • $${it.price}`}
          >
            <span className="ico">
              {typeof it.icon === "string" || typeof it.icon === "number"
                ? it.icon
                : it.icon ?? "🏗️"}
            </span>
            <span className="label">{it.label}</span>
            <span className="price">${it.price}</span>
            {onToggleFavorite && (
              <span role="button" aria-label="즐겨찾기" className="ml-1 text-xs" onClick={(e)=>{ e.stopPropagation(); onToggleFavorite(it.type); }}>
                ⭐
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
