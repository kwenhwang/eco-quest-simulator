"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";

export type Severity = "info" | "success" | "warn" | "error" | "blocker";
export type Placement = "top" | "bottom";

export type Action = { id: string; label: string; primary?: boolean; onClick?: () => void };
export type UINotification = {
  id?: string;
  dedupKey?: string;
  severity?: Severity;
  priority?: number;
  title?: string;
  message: string;
  detail?: React.ReactNode;
  actions?: Action[];
  autoDismissMs?: number;
  sticky?: boolean;
  preempt?: boolean;
};

type Queued = Required<UINotification> & { id: string; dedupKey: string; count: number; ts: number };

type API = {
  notify: (n: UINotification) => string;
  dismissCurrent: () => void;
  clearQueue: () => void;
  setPlacement: (p: Placement) => void;
  setDefaultExpanded: (v: boolean) => void;
  setMinSeverity: (s: Severity) => void;
  setThrottleMs: (ms: number) => void;
};

const Ctx = createContext<API | null>(null);

function severityMs(s: Severity) {
  switch (s) {
    case "info":
    case "success":
      return 1600;
    case "warn":
      return 2200;
    case "error":
      return 2800;
    case "blocker":
      return 0;
    default:
      return 1800;
  }
}

function insert(queue: Queued[], q: Queued) {
  queue.push(q);
  queue.sort((a, b) => (b.priority - a.priority) || (b.ts - a.ts));
}

export function NotificationProvider({ children, placement: initialPlacement = "top", initialExpanded = false, minSeverity = "info", throttleMs = 0 }:{ children: React.ReactNode; placement?: Placement; initialExpanded?: boolean; minSeverity?: Severity; throttleMs?: number }) {
  const [current, setCurrent] = useState<Queued | null>(null);
  const currentRef = useRef<Queued | null>(null);
  const [placement, setPlacement] = useState<Placement>(initialPlacement);
  const [expandedDefault, setExpandedDefault] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem("notif.expanded");
      if (v == null) return initialExpanded;
      return v === "1";
    } catch { return initialExpanded; }
  });

  const queueRef = useRef<Queued[]>([]);
  const dedupRef = useRef<Map<string, Queued>>(new Map());
  const recentRef = useRef<Map<string, number>>(new Map());
  const minSeverityRef = useRef<Severity>(minSeverity);
  const throttleMsRef = useRef<number>(throttleMs);

  function severityRank(s: Severity) {
    switch (s) {
      case "info": return 0;
      case "success": return 1;
      case "warn": return 2;
      case "error": return 3;
      case "blocker": return 4;
      default: return 0;
    }
  }

  useEffect(() => { currentRef.current = current; }, [current]);

  const dismiss = useCallback(() => {
    setCurrent(null);
    setTimeout(() => {
      const next = queueRef.current.shift();
      if (!next) return;
      dedupRef.current.delete(next.dedupKey);
      setCurrent(next);
    }, 40);
  }, []);

  const notify = useCallback((n: UINotification) => {
    const id = n.id ?? Math.random().toString(36).slice(2);
    const normalizedMessage = (n.message || "").trim();
    const defaultKey = (n.title ? `${n.title}|${normalizedMessage}` : normalizedMessage) || id;
    const dedupKey = n.dedupKey ?? defaultKey;
    const sev = (n.severity ?? "info");

    // Global filter by minimum severity
    if (severityRank(sev) < severityRank(minSeverityRef.current)) {
      return id;
    }

    // Rate limit per dedupKey
    const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
    const lastTs = recentRef.current.get(dedupKey) ?? 0;
    const withinThrottle = throttleMsRef.current > 0 && (now - lastTs) < throttleMsRef.current;

    const active = currentRef.current;

    if ((active && active.dedupKey === dedupKey) || dedupRef.current.has(dedupKey)) {
      if (active?.dedupKey === dedupKey) setCurrent({ ...active, count: active.count + 1 });
      else {
        const q = dedupRef.current.get(dedupKey)!;
        q.count += 1;
      }
      return id;
    }

    const q: Queued = {
      id,
      dedupKey,
      severity: sev,
      priority: n.priority ?? 0,
      title: n.title ?? "",
      message: normalizedMessage,
      detail: n.detail ?? null,
      actions: n.actions ?? [],
      autoDismissMs: n.autoDismissMs ?? 0,
      sticky: n.sticky ?? false,
      preempt: n.preempt ?? false,
      count: 1,
      ts: (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now(),
    };

    if (withinThrottle) {
      // Drop silently when throttled (we already handle count increment above)
      return id;
    }

    const canPreempt = q.preempt || q.severity === "blocker";
    if (active && canPreempt && (q.priority > active.priority || q.severity === "blocker")) {
      insert(queueRef.current, active);
      setCurrent(q);
      recentRef.current.set(dedupKey, now);
      return id;
    }

    insert(queueRef.current, q);
    dedupRef.current.set(dedupKey, q);
    if (!active) {
      const next = queueRef.current.shift()!;
      dedupRef.current.delete(next.dedupKey);
      setCurrent(next);
    }
    recentRef.current.set(dedupKey, now);
    return id;
  }, []);

  useEffect(() => {
    if (!current) return;
    if (current.sticky || current.severity === "blocker" || current.actions.length > 0) return;
    const ms = current.autoDismissMs || severityMs(current.severity);
    if (ms <= 0) return;
    const t = setTimeout(dismiss, ms);
    return () => clearTimeout(t);
  }, [current, dismiss]);

  const api = useMemo<API>(() => ({
    notify,
    dismissCurrent: dismiss,
    clearQueue: () => { queueRef.current.length = 0; dedupRef.current.clear(); },
    setPlacement: (p) => setPlacement(p),
    setDefaultExpanded: (v) => { setExpandedDefault(v); try { localStorage.setItem("notif.expanded", v ? "1" : "0"); } catch {} },
    setMinSeverity: (s) => { minSeverityRef.current = s; },
    setThrottleMs: (ms) => { throttleMsRef.current = Math.max(0, ms|0); },
  }), [dismiss, notify]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <NotificationContainer placement={placement} data={current} defaultExpanded={expandedDefault} onClose={dismiss} />
    </Ctx.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNotify must be used within NotificationProvider");
  return ctx;
}

function LabelBySeverity({ s }:{ s: Severity }) {
  const label = s === "blocker" ? "주의" : s === "error" ? "오류" : s === "warn" ? "경고" : s === "success" ? "완료" : "알림";
  const color = s === "blocker" ? "bg-rose-600" : s === "error" ? "bg-red-600" : s === "warn" ? "bg-amber-500" : s === "success" ? "bg-emerald-600" : "bg-slate-600";
  return <span className={`inline-block rounded px-2 py-0.5 text-[10px] leading-4 text-white ${color}`}>{label}</span>;
}

function NotificationContainer({ placement, data, defaultExpanded, onClose }:{ placement: Placement; data: Queued | null; defaultExpanded: boolean; onClose: ()=>void }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  useEffect(() => setExpanded(defaultExpanded), [defaultExpanded]);
  if (!data) return null;
  const posCls = placement === "top" ? "top-3" : "bottom-3";
  return (
    <div className={`fixed inset-x-0 ${posCls} z-[100] flex justify-center pointer-events-none`} aria-live="polite" role="status">
      <div className="pointer-events-auto w-[min(92vw,560px)] rounded-2xl border border-black/10 bg-[var(--card,rgba(31,41,55,0.96))] text-[var(--card-foreground,#fff)] shadow-xl relative">
        {/* Always-on close (X) button */}
        <button
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full text-white/80 hover:text-white focus:outline-none"
        >
          ✕
        </button>
        <div className="px-4 py-3 flex items-start gap-3">
          <LabelBySeverity s={data.severity} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {data.title ? <strong className="text-sm">{data.title}</strong> : null}
              <span className="text-sm opacity-90">{data.message}</span>
              {data.count > 1 ? (
                <span className="ml-2 rounded-full bg-black/20 text-[11px] px-2 py-0.5">x{data.count}</span>
              ) : null}
            </div>
            {expanded && data.detail ? (
              <div className="mt-2 text-[13px] opacity-90">{data.detail}</div>
            ) : null}
            <div className="mt-3 flex items-center justify-end gap-2">
              {data.detail ? (
                <button onClick={() => setExpanded(e => !e)} className="text-xs text-white/80 hover:text-white/100">
                  {expanded ? "간단히 보기" : "자세히 보기"}
                </button>
              ) : null}
              {data.actions.map(a => (
                <button key={a.id} onClick={() => { try { a.onClick?.(); } finally { onClose(); } }}
                  className={`rounded-md px-3 py-1.5 text-xs ${a.primary ? "bg-emerald-500 text-white hover:bg-emerald-400" : "border border-white/20 text-white/90 hover:bg-white/10"}`}>
                  {a.label}
                </button>
              ))}
              {data.actions.length === 0 ? (
                <button onClick={onClose} className="rounded-md border border-white/20 text-white/90 hover:bg-white/10 px-3 py-1.5 text-xs">닫기</button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
