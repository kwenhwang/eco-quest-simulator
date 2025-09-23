"use client";

import React from "react";

export type FeedItem = { id: string; ts: number; source: 'me'|'neighbor'; text: string };

export function PlayersFeed({ items, title = '이웃 활동' }: { items: FeedItem[]; title?: string }) {
  if (!items || items.length === 0) return (
    <div className="rounded-lg border border-black/10 p-2 text-xs text-black/60 bg-white/70">최근 활동이 없습니다.</div>
  );
  return (
    <div className="rounded-lg border border-black/10 bg-white/70">
      <div className="px-2 py-1 border-b border-black/10 text-xs font-medium">{title}</div>
      <ul className="max-h-44 overflow-auto divide-y divide-black/5 text-xs">
        {items.map(it => (
          <li key={it.id} className="px-2 py-1.5">
            <span className={`mr-1 ${it.source==='me'?'text-emerald-700':'text-indigo-700'}`}>{it.source==='me'?'나':'이웃'}</span>
            <span className="text-black/80">{it.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

