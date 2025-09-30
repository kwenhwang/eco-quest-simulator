"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CreativeResearchLab } from "@/components/CreativePixelIcons";
import { FacilityUpgradeInfo } from "@/components/UpgradeableIcons";
import { useNotify } from "@/app/_components/notification-center";
import { FacilityBoard } from "./components/Board";
import { RegionBar } from "./components/RegionBar";
import { ExternalityLedger } from "./components/externality-ledger";
import { PlayersFeed, type FeedItem } from "./components/players-feed";
import {
  PolicyPanel as PolicyControlPanel,
  type Policy as PolicyControlState,
} from "./components/policy-panel";
import {
  QuickDockBar,
  QuickDockPanel,
  QuickDockFilter,
  matchesQuickDockFilter,
} from "./components/QuickDock";
import {
  fetchSeasonState,
  joinEcoQuest,
  syncGameState,
} from "@/lib/ecoquest-api";
import {
  BASE_ENERGY_CAPACITY,
  FacilityStatus,
  FacilityType,
  MAX_LEVEL,
  energyFacilityTypes,
  facilityCatalog,
} from "@/lib/game/facilities";
import type {
  Facility,
  GameEvent,
  GameEventType,
  GameState,
  Goal,
  NotificationEntry,
  NotificationSeverity,
  Policy as StoredPolicy,
  ResourceState,
  SupabaseStatus,
} from "@/lib/game/types";

declare global {
  interface Window {
    ecoQuestEventBus?: {
      history: () => GameEvent[];
      subscribe: (
        type: GameEventType,
        handler: (event: GameEvent) => void,
      ) => () => void;
    };
  }
}

const GRID_COLUMNS = 8;
const GRID_ROWS = 6;

const SYNC_DEBOUNCE_MS = 1400;
const EVENT_LOG_LIMIT = 30;
const WIN_ECO_SCORE_THRESHOLD = 90;
const LOSS_ECO_SCORE_THRESHOLD = 10;
const LOSS_ENERGY_THRESHOLD = 5;
const MIN_TICKS_FOR_OUTCOME = 6;

type EnvVector = { air: number; water: number; bio: number };

const FACILITY_ENVIRONMENT_VECTORS: Record<FacilityType, EnvVector> = {
  solar: { air: 1.8, water: 0.4, bio: 0.3 },
  wind: { air: 1.5, water: 0.2, bio: 0.4 },
  residential: { air: -1.2, water: -0.8, bio: -0.5 },
  commercial: { air: -1.4, water: -1.1, bio: -0.6 },
  park: { air: 0.8, water: 1.2, bio: 1.6 },
  recycling: { air: 0.6, water: 1.4, bio: 0.7 },
};

const ENVIRONMENT_HISTORY_WINDOW = 30;
type MobilePanelKey = "policy" | "goals" | "events" | "ledger";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const extractSessionId = (value: unknown): string | null => {
  if (!isRecord(value)) {
    return null;
  }
  if (typeof value.id === "string") {
    return value.id;
  }
  if (typeof value.session_id === "string") {
    return value.session_id;
  }
  if (typeof value.sessionId === "string") {
    return value.sessionId;
  }
  return null;
};

const mergeNumber = (candidate: unknown, fallback: number) =>
  typeof candidate === "number" && Number.isFinite(candidate)
    ? candidate
    : fallback;

const mergeResourceState = (
  base: ResourceState,
  payload: unknown,
): ResourceState => {
  if (!isRecord(payload)) {
    return base;
  }
  return {
    credits: mergeNumber(payload.credits, base.credits),
    energy: mergeNumber(payload.energy, base.energy),
    energyCapacity: mergeNumber(
      payload.energyCapacity,
      base.energyCapacity,
    ),
    water: mergeNumber(payload.water, base.water),
    population: mergeNumber(payload.population, base.population),
    ecoScore: mergeNumber(payload.ecoScore, base.ecoScore),
  };
};

const mergeFacilities = (
  base: Facility[],
  payload: unknown,
): Facility[] => {
  if (!Array.isArray(payload) || payload.length === 0) {
    return base;
  }
  const next: Facility[] = [];
  payload.forEach((entry, index) => {
    if (!isRecord(entry)) {
      return;
    }
    const type = entry.type;
    if (typeof type !== "string") {
      return;
    }
    const facilityType = type as FacilityType;
    next.push({
      id: typeof entry.id === "string" ? entry.id : `remote-${index}`,
      type: facilityType,
      level: mergeNumber(entry.level, 1),
      position: mergeNumber(entry.position, index),
      status: (typeof entry.status === "string"
        ? entry.status
        : "active") as FacilityStatus,
      efficiency: mergeNumber(entry.efficiency, 95),
      addons: Array.isArray(entry.addons)
        ? entry.addons.filter((addon): addon is string => typeof addon === "string")
        : [],
    });
  });
  return next.length > 0 ? next : base;
};

const mergePolicies = (base: StoredPolicy[], payload: unknown): StoredPolicy[] => {
  if (!Array.isArray(payload) || payload.length === 0) {
    return base;
  }
  const result = payload
    .map((entry) => {
      if (!isRecord(entry) || typeof entry.id !== "string") {
        return null;
      }
      const effectRecord = isRecord(entry.effect) ? entry.effect : {};
      return {
        id: entry.id,
        name:
          typeof entry.name === "string" ? entry.name : "알 수 없는 정책",
        description:
          typeof entry.description === "string"
            ? entry.description
            : "",
        effect: {
          ecoScore:
            typeof effectRecord.ecoScore === "number"
              ? effectRecord.ecoScore
              : undefined,
          credits:
            typeof effectRecord.credits === "number"
              ? effectRecord.credits
              : undefined,
          energyEfficiency:
            typeof effectRecord.energyEfficiency === "number"
              ? effectRecord.energyEfficiency
              : undefined,
        },
        active: typeof entry.active === "boolean" ? entry.active : false,
      } as StoredPolicy;
    })
    .filter((entry): entry is StoredPolicy => entry !== null);
  return result.length > 0 ? result : base;
};

const mergeGoals = (base: Goal[], payload: unknown): Goal[] => {
  if (!Array.isArray(payload) || payload.length === 0) {
    return base;
  }
  const result = payload
    .map((entry, index) => {
      if (!isRecord(entry)) {
        return null;
      }
      return {
        id:
          typeof entry.id === "string" ? entry.id : `goal-${index + 1}`,
        title:
          typeof entry.title === "string" ? entry.title : "알 수 없는 목표",
        description:
          typeof entry.description === "string"
            ? entry.description
            : "",
        progress: mergeNumber(entry.progress, base[index]?.progress ?? 0),
        target: mergeNumber(entry.target, base[index]?.target ?? 1),
        reward: mergeNumber(entry.reward, base[index]?.reward ?? 0),
      } as Goal;
    })
    .filter((entry): entry is Goal => entry !== null);
  return result.length > 0 ? result : base;
};

const mergeNotifications = (
  base: NotificationEntry[],
  payload: unknown,
): NotificationEntry[] => {
  if (!Array.isArray(payload) || payload.length === 0) {
    return base;
  }
  const result = payload
    .map((entry, index) => {
      if (!isRecord(entry) || typeof entry.message !== "string") {
        return null;
      }
      const severity = entry.severity;
      return {
        id: typeof entry.id === "string" ? entry.id : `note-${index}`,
        message: entry.message,
        severity:
          severity === "success" ||
          severity === "warn" ||
          severity === "error" ||
          severity === "info"
            ? severity
            : "info",
        timestamp: mergeNumber(entry.timestamp, Date.now()),
      } as NotificationEntry;
    })
    .filter((entry): entry is NotificationEntry => entry !== null);
  return result.length > 0 ? result.slice(-8) : base;
};

const mergeGameStateFromRemote = (
  base: GameState,
  payload: unknown,
  supplementaryResources: unknown,
): GameState => {
  if (!isRecord(payload)) {
    if (supplementaryResources) {
      return {
        ...base,
        resources: mergeResourceState(base.resources, supplementaryResources),
      };
    }
    return base;
  }

  const resourcesCandidate = isRecord(payload.resources)
    ? payload.resources
    : supplementaryResources;

  const nextResources = resourcesCandidate
    ? mergeResourceState(base.resources, resourcesCandidate)
    : base.resources;

  return {
    ...base,
    started: typeof payload.started === "boolean" ? payload.started : base.started,
    tick: typeof payload.tick === "number" ? payload.tick : base.tick,
    resources: nextResources,
    facilities: mergeFacilities(base.facilities, payload.facilities),
    policies: mergePolicies(base.policies, payload.policies),
    goals: mergeGoals(base.goals, payload.goals),
    notifications: mergeNotifications(
      base.notifications,
      payload.notifications,
    ),
  };
};

const unwrapSupabaseData = <T,>(value: unknown): T | null => {
  if (!value) {
    return null;
  }
  if (isRecord(value) && "data" in value) {
    return unwrapSupabaseData<T>(value.data);
  }
  return value as T;
};

const resolveSessionSnapshot = (input: unknown) => {
  if (!isRecord(input)) {
    return {
      rawSession: null as UnknownRecord | null,
      gameState: input,
      resources: null as unknown,
    };
  }

  const sessionRecord = input as UnknownRecord;
  const gameState = isRecord(sessionRecord.game_state)
    ? sessionRecord.game_state
    : sessionRecord;
  const resources = isRecord(sessionRecord.resources)
    ? sessionRecord.resources
    : null;

  return {
    rawSession: sessionRecord,
    gameState,
    resources,
  };
};

const createSyncSnapshot = (state: GameState) => ({
  started: state.started,
  tick: state.tick,
  resources: state.resources,
  facilities: state.facilities,
  policies: state.policies,
  goals: state.goals,
  notifications: state.notifications.slice(-8),
  updatedAt: new Date().toISOString(),
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const makeId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const appendNotification = (
  list: NotificationEntry[],
  entry: NotificationEntry,
  limit = 6,
) => {
  const next = [...list.slice(-(limit - 1)), entry];
  return next;
};

const createInitialGameState = (): GameState => {
  const facilities: Facility[] = [
    {
      id: makeId("fac"),
      type: "solar",
      level: 1,
      position: 9,
      status: "active",
      efficiency: 96,
      addons: [],
    },
    {
      id: makeId("fac"),
      type: "residential",
      level: 1,
      position: 18,
      status: "active",
      efficiency: 90,
      addons: [],
    },
    {
      id: makeId("fac"),
      type: "park",
      level: 1,
      position: 29,
      status: "active",
      efficiency: 98,
      addons: [],
    },
  ];

  const capacityBonus = facilities.reduce(
    (total, item) => total + facilityCatalog[item.type].capacityBonus(item.level),
    0,
  );

  const resources: ResourceState = {
    credits: 8200,
    energy: 240,
    energyCapacity: BASE_ENERGY_CAPACITY + capacityBonus,
    water: 180,
    population: 1480,
    ecoScore: 68,
  };

  const greenEnergyCount = facilities.filter((f) =>
    energyFacilityTypes.includes(f.type),
  ).length;
  const civicSupportCount = facilities.filter((f) =>
    f.type === "park" || f.type === "recycling",
  ).length;

  return {
    started: false,
    tick: 0,
    facilities,
    resources,
    policies: [
      {
        id: "carbon-tax",
        name: "탄소세 인센티브",
        description: "친환경 시설의 운영 효율을 10% 향상시킵니다.",
        effect: { ecoScore: 2 },
        active: true,
      },
      {
        id: "night-market",
        name: "야간 시장 허가",
        description: "상업 지구의 수익을 늘리지만 환경 점수가 약간 감소합니다.",
        effect: { credits: 120 },
        active: false,
      },
      {
        id: "water-conservation",
        name: "물 절약 캠페인",
        description: "물 소비를 줄여 환경 점수를 높입니다.",
        effect: { ecoScore: 3 },
        active: false,
      },
    ],
    goals: [
      {
        id: "green-energy",
        title: "재생 에너지 도시",
        description: "재생 에너지 시설을 4개 확보하세요.",
        progress: greenEnergyCount,
        target: 4,
        reward: 500,
      },
      {
        id: "eco-score",
        title: "환경 점수 80 달성",
        description: "도시 환경 점수를 80 이상으로 유지하세요.",
        progress: Math.round(resources.ecoScore),
        target: 80,
        reward: 750,
      },
      {
        id: "happy-citizens",
        title: "시민 만족도",
        description: "공원이나 재활용 시설을 3개 이상 운영하세요.",
        progress: civicSupportCount,
        target: 3,
        reward: 600,
      },
    ],
    notifications: [
      {
        id: makeId("note"),
        message: "Eco-Quest 시뮬레이터에 오신 것을 환영합니다!",
        severity: "info",
        timestamp: Date.now(),
      },
    ],
  };
};

function TutorialOverlay({
  onClose,
  onBegin,
}: {
  onClose: () => void;
  onBegin: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-emerald-400/40 bg-slate-900/80 p-8 text-slate-100 shadow-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-200">Eco-Quest 플레이 가이드</h2>
        <p className="mt-2 text-sm text-slate-300">
          친환경 도시를 운영해 환경 점수와 경제 성장을 동시에 잡아보세요. 기본 흐름은 아래와 같습니다.
        </p>
        <ol className="mt-6 space-y-3 text-sm text-slate-200">
          <li>
            <span className="font-semibold text-emerald-300">1. 시설 배치:</span> 보드의 빈 타일을 선택하고 퀵 도크에서 태양광, 주거, 공원 등 시설을 건설하세요.
          </li>
          <li>
            <span className="font-semibold text-emerald-300">2. 정책 조정:</span> 오른쪽 패널에서 탄소세·보조금·규제 강도를 조절해 환경 피해를 억제하고 사회적 비용을 관리하세요.
          </li>
          <li>
            <span className="font-semibold text-emerald-300">3. 지표 모니터링:</span> 상단 HUD와 외부효과 패널을 주기적으로 확인해 에너지, 자원, 환경 점수를 균형 있게 유지하세요.
          </li>
          <li>
            <span className="font-semibold text-emerald-300">4. 승리 조건:</span> 환경 점수 90 이상과 모든 도시 목표를 달성하면 세션이 성공적으로 완료됩니다.
          </li>
        </ol>
        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-slate-400"
          >
            나중에 다시 보기
          </button>
          <button
            type="button"
            onClick={onBegin}
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-emerald-300"
          >
            바로 시뮬레이션 시작
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-emerald-400/30 bg-slate-900/95 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-20px_40px_rgba(15,23,42,0.55)]">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-emerald-200">{title}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-600/60 px-3 py-1 text-xs text-slate-200 hover:border-slate-400"
          >
            닫기
          </button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto pb-2 text-sm text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function EcoQuestGame() {
  const { notify } = useNotify();
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [selectedBuildType, setSelectedBuildType] = useState<FacilityType | null>("solar");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>("idle");
  const [supabaseMessage, setSupabaseMessage] = useState("로컬 상태를 유지하는 중");
  const [sessionOutcome, setSessionOutcome] = useState<"idle" | "running" | "won" | "lost">("idle");
  const [quickDockFilter, setQuickDockFilter] = useState<QuickDockFilter>("all");
  const [lastBuildFeedback, setLastBuildFeedback] = useState<{
    type: FacilityType;
    timestamp: number;
  } | null>(null);
  const [hudPulseSeverity, setHudPulseSeverity] = useState<NotificationSeverity | null>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [policyControls, setPolicyControls] = useState<PolicyControlState>({
    taxPerNegEnvMonthly: 30,
    subsidyPerPosEnvMonthly: 15,
    regulationStrictness: 0.35,
  });
  const environmentHistoryRef = useRef<EnvVector[]>([]);
  const [environmentMonthlyDelta, setEnvironmentMonthlyDelta] = useState<EnvVector>({
    air: 0,
    water: 0,
    bio: 0,
  });
  const [dailyPrivateIncome, setDailyPrivateIncome] = useState(0);
  const [showTutorial, setShowTutorial] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem("eco-quest-tutorial") !== "dismissed";
  });
  const [activeMobileSheet, setActiveMobileSheet] = useState<MobilePanelKey | null>(
    null,
  );
  const lastHydratedStateRef = useRef<GameState | null>(null);
  const hasBootstrappedSupabase = useRef(false);
  const syncTimeoutRef = useRef<number | null>(null);
  const lastSyncedSnapshotRef = useRef<string>("");
  const ecoWarningIssued = useRef(false);
  const energyWarningIssued = useRef(false);
  const eventLogRef = useRef<GameEvent[]>([]);
  const eventListenersRef = useRef<Map<GameEventType, Set<(event: GameEvent) => void>>>(
    new Map(),
  );
  const hudPulseTimeoutRef = useRef<number | null>(null);
  const lastNotificationCountRef = useRef<number>(gameState.notifications.length);

  const supabaseStatusLabel = useMemo(() => {
    switch (supabaseStatus) {
      case "loading":
        return "Supabase 세션을 불러오는 중입니다. 연결이 실패하면 로컬 상태로 계속됩니다.";
      case "ready":
        return `Supabase와 동기화 가능 · ${supabaseMessage}`;
      case "error":
        return `Supabase 오프라인 · ${supabaseMessage}`;
      default:
        return supabaseMessage;
    }
  }, [supabaseMessage, supabaseStatus]);

  useEffect(() => {
    lastHydratedStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (showTutorial) {
      window.localStorage.removeItem("eco-quest-tutorial");
    } else {
      window.localStorage.setItem("eco-quest-tutorial", "dismissed");
    }
  }, [showTutorial]);

  useEffect(() => {
    return () => {
      if (hudPulseTimeoutRef.current) {
        window.clearTimeout(hudPulseTimeoutRef.current);
        hudPulseTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const count = gameState.notifications.length;
    const previous = lastNotificationCountRef.current;

    if (count > previous) {
      const lastNotification = gameState.notifications[count - 1];
      if (lastNotification) {
        setHudPulseSeverity(lastNotification.severity);
        if (hudPulseTimeoutRef.current) {
          window.clearTimeout(hudPulseTimeoutRef.current);
        }
        hudPulseTimeoutRef.current = window.setTimeout(() => {
          setHudPulseSeverity(null);
          hudPulseTimeoutRef.current = null;
        }, 560);
      }
    }

    lastNotificationCountRef.current = count;
  }, [gameState.notifications]);

  const emitEvent = useCallback(
    (type: GameEventType, message: string, payload?: Record<string, unknown>) => {
      const event: GameEvent = {
        id: makeId("evt"),
        type,
        message,
        payload,
        timestamp: Date.now(),
      };
      eventLogRef.current = [
        ...eventLogRef.current.slice(-(EVENT_LOG_LIMIT - 1)),
        event,
      ];
      if (type !== "tick") {
        setFeedItems((prev) => {
          const entry: FeedItem = {
            id: event.id,
            ts: event.timestamp,
            source: "me",
            text: message,
          };
          return [entry, ...prev].slice(0, 20);
        });
      }
      const listeners = eventListenersRef.current.get(type);
      if (listeners) {
        listeners.forEach((listener) => {
          try {
            listener(event);
          } catch (error) {
            console.error("Eco-Quest event listener error", error);
          }
        });
      }
    },
    [setFeedItems],
  );

  const subscribeToEvent = useCallback(
    (type: GameEventType, handler: (event: GameEvent) => void) => {
      const listeners = eventListenersRef.current.get(type) ?? new Set();
      listeners.add(handler);
      eventListenersRef.current.set(type, listeners);
      return () => {
        const current = eventListenersRef.current.get(type);
        current?.delete(handler);
        if (current && current.size === 0) {
          eventListenersRef.current.delete(type);
        }
      };
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const bus = {
      history: () => eventLogRef.current.slice(),
      subscribe: subscribeToEvent,
    };
    window.ecoQuestEventBus = bus;
    return () => {
      if (window.ecoQuestEventBus === bus) {
        delete window.ecoQuestEventBus;
      }
    };
  }, [subscribeToEvent]);

  useEffect(() => {
    if (gameState.started && sessionOutcome === "idle") {
      setSessionOutcome("running");
    }
    if (!gameState.started && sessionOutcome === "running") {
      setSessionOutcome("idle");
    }
  }, [gameState.started, sessionOutcome]);

  useEffect(() => {
    if (hasBootstrappedSupabase.current) {
      return;
    }
    hasBootstrappedSupabase.current = true;

    let cancelled = false;

    const bootstrap = async () => {
      setSupabaseStatus("loading");
      setSupabaseMessage("Supabase 세션을 불러오는 중입니다...");

      try {
        const { data, error } = await fetchSeasonState();

        if (cancelled) {
          return;
        }

        if (error) {
          console.error("fetchSeasonState error", error);
          setSupabaseStatus("error");
          setSupabaseMessage(
            "Supabase 세션을 불러오지 못했습니다. 로컬 상태로 계속 진행합니다.",
          );
          return;
        }

        const normalized = unwrapSupabaseData<{
          session?: unknown;
          season?: unknown;
        }>(data);

        const sessionCandidate =
          normalized?.session ?? normalized ?? null;

        let resolvedSessionId: string | null = null;

        if (sessionCandidate) {
          const { rawSession, gameState: remoteGameState, resources } =
            resolveSessionSnapshot(sessionCandidate);

          setGameState((prev) => {
            const merged = mergeGameStateFromRemote(
              prev,
              remoteGameState,
              resources,
            );
            lastHydratedStateRef.current = merged;
            return merged;
          });

          resolvedSessionId = extractSessionId(
            rawSession ?? sessionCandidate,
          );
        }

        if (resolvedSessionId) {
          setSessionId(resolvedSessionId);
          setSupabaseStatus("ready");
          setSupabaseMessage(
            `Supabase 세션(${resolvedSessionId})과 동기화 준비 완료`,
          );
          return;
        }

        const snapshotSource =
          lastHydratedStateRef.current ?? createInitialGameState();
        const snapshot = createSyncSnapshot(snapshotSource);

        const joinResult = await joinEcoQuest({
          gameState: snapshot as unknown as Record<string, unknown>,
          resources: snapshot.resources as unknown as Record<string, unknown>,
        });

        if (cancelled) {
          return;
        }

        if (joinResult.error) {
          console.error("joinEcoQuest error", joinResult.error);
          setSupabaseStatus("error");
          setSupabaseMessage(
            "Supabase 세션 생성에 실패했습니다. 로컬 상태로 계속 진행합니다.",
          );
          return;
        }

        const joinedPayload = unwrapSupabaseData<{ session?: unknown }>(
          joinResult.data,
        );
        const joinedSession = joinedPayload?.session ?? joinedPayload ?? null;
        const joinedSessionId = extractSessionId(joinedSession);

        if (joinedSessionId) {
          setSessionId(joinedSessionId);
          setSupabaseStatus("ready");
          setSupabaseMessage(
            `Supabase 세션(${joinedSessionId}) 생성 완료`,
          );
        } else {
          setSupabaseStatus("error");
          setSupabaseMessage(
            "새 Supabase 세션 ID를 확인할 수 없어 로컬 상태를 유지합니다.",
          );
        }
      } catch (err) {
        if (cancelled) {
          return;
        }
        console.error("Supabase bootstrap error", err);
        setSupabaseStatus("error");
        setSupabaseMessage(
          "Supabase 호출 중 오류가 발생했습니다. 로컬 상태로 진행합니다.",
        );
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const snapshot = createSyncSnapshot(gameState);
    const serializedSnapshot = JSON.stringify(snapshot);

    if (serializedSnapshot === lastSyncedSnapshotRef.current) {
      return;
    }

    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current);
    }

    const handle = window.setTimeout(async () => {
      try {
        const { error } = await syncGameState({
          sessionId,
          gameState: snapshot as unknown as Record<string, unknown>,
          resources: snapshot.resources as unknown as Record<string, unknown>,
          score: Math.round(snapshot.resources.ecoScore),
        });

        if (error) {
          console.error("syncGameState error", error);
          setSupabaseStatus("error");
          setSupabaseMessage(
            "Supabase 동기화에 실패했습니다. 재시도 중...",
          );
          return;
        }

        lastSyncedSnapshotRef.current = serializedSnapshot;
        setSupabaseStatus("ready");
        setSupabaseMessage(
          `Supabase와 동기화됨 (${new Date().toLocaleTimeString()})`,
        );
      } catch (err) {
        console.error("syncGameState invocation error", err);
        setSupabaseStatus("error");
        setSupabaseMessage(
          "Supabase 동기화 중 오류가 발생했습니다.",
        );
      } finally {
        syncTimeoutRef.current = null;
      }
    }, SYNC_DEBOUNCE_MS);

    syncTimeoutRef.current = handle;

    return () => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
    };
  }, [sessionId, gameState]);

  useEffect(() => {
    if (!selectedFacilityId && gameState.facilities.length > 0) {
      setSelectedFacilityId(gameState.facilities[0].id);
    }
  }, [gameState.facilities, selectedFacilityId]);

  useEffect(() => {
    if (!selectedBuildType) {
      return;
    }
    if (matchesQuickDockFilter(quickDockFilter, selectedBuildType)) {
      return;
    }
    setSelectedBuildType(null);
  }, [quickDockFilter, selectedBuildType]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setGameState((prev) => {
        if (!prev.started) {
          return prev;
        }

        const nextResources: ResourceState = { ...prev.resources };
        const nextFacilities = prev.facilities.map((facility) => ({
          ...facility,
        }));
        const environmentTick: EnvVector = { air: 0, water: 0, bio: 0 };
        let nextNotifications = prev.notifications.slice();

        const totalCapacityBonus = nextFacilities.reduce((total, facility) => {
          const definition = facilityCatalog[facility.type];
          return total + definition.capacityBonus(facility.level);
        }, 0);
        nextResources.energyCapacity = BASE_ENERGY_CAPACITY + totalCapacityBonus;
        nextResources.energy = Math.min(
          nextResources.energy,
          nextResources.energyCapacity,
        );

        nextFacilities.forEach((facility) => {
          const definition = facilityCatalog[facility.type];
          const production = definition.production(facility.level);
          const maintenanceCost = definition.maintenance(facility.level);

          if (production.credits) {
            nextResources.credits += production.credits;
          }
          if (production.energy) {
            nextResources.energy = Math.min(
              nextResources.energyCapacity,
              nextResources.energy + production.energy,
            );
          }
          if (production.water) {
            nextResources.water += production.water;
          }
          if (production.population) {
            nextResources.population += production.population;
          }
          if (maintenanceCost) {
            nextResources.credits -= maintenanceCost;
          }

          nextResources.ecoScore = clamp(
            nextResources.ecoScore + definition.ecoImpact(facility.level),
            0,
            100,
          );

          const efficiencyDelta = facility.status === "active" ? 1.5 : -2;
          facility.efficiency = Math.round(
            clamp(facility.efficiency + efficiencyDelta, 60, 120),
          );

          if (facility.status === "active") {
            const envVector =
              FACILITY_ENVIRONMENT_VECTORS[facility.type] ?? ({
                air: 0,
                water: 0,
                bio: 0,
              } satisfies EnvVector);
            environmentTick.air += envVector.air * facility.level;
            environmentTick.water += envVector.water * facility.level;
            environmentTick.bio += envVector.bio * facility.level;
          }
        });

        prev.policies.forEach((policy) => {
          if (!policy.active) return;
          if (policy.effect.credits) {
            nextResources.credits += policy.effect.credits / 10;
          }
          if (policy.effect.ecoScore) {
            nextResources.ecoScore = clamp(
              nextResources.ecoScore + policy.effect.ecoScore * 0.5,
              0,
              100,
            );
          }
          if (policy.effect.energyEfficiency) {
            nextResources.energy = Math.min(
              nextResources.energyCapacity,
              nextResources.energy + policy.effect.energyEfficiency,
            );
          }
        });

        const combinedImpact =
          environmentTick.air + environmentTick.water + environmentTick.bio;
        const negativeImpact = Math.max(0, -combinedImpact);
        const positiveImpact = Math.max(0, combinedImpact);
        const envTaxDaily =
          (policyControls.taxPerNegEnvMonthly / 30) * negativeImpact;
        const envSubsidyDaily =
          (policyControls.subsidyPerPosEnvMonthly / 30) * positiveImpact;
        const regulationPenalty =
          policyControls.regulationStrictness * negativeImpact * 0.8;

        nextResources.credits = Math.max(
          0,
          nextResources.credits - envTaxDaily + envSubsidyDaily - regulationPenalty,
        );
        if (policyControls.regulationStrictness > 0) {
          nextResources.ecoScore = clamp(
            nextResources.ecoScore + policyControls.regulationStrictness * positiveImpact * 0.25,
            0,
            100,
          );
        }

        nextResources.credits = Math.max(0, nextResources.credits);
        nextResources.energy = Math.max(0, nextResources.energy);
        nextResources.water = Math.max(0, nextResources.water);

        environmentHistoryRef.current = [
          environmentTick,
          ...environmentHistoryRef.current,
        ].slice(0, ENVIRONMENT_HISTORY_WINDOW);

        const monthlyTotals = environmentHistoryRef.current.reduce<EnvVector>(
          (acc, entry) => ({
            air: acc.air + entry.air,
            water: acc.water + entry.water,
            bio: acc.bio + entry.bio,
          }),
          { air: 0, water: 0, bio: 0 },
        );

        setEnvironmentMonthlyDelta({
          air: Math.round(monthlyTotals.air),
          water: Math.round(monthlyTotals.water),
          bio: Math.round(monthlyTotals.bio),
        });

        const incomeDelta = nextResources.credits - prev.resources.credits;
        setDailyPrivateIncome(Math.round(incomeDelta));

        const updatedGoals = prev.goals.map((goal) => {
          switch (goal.id) {
            case "green-energy": {
              const count = nextFacilities.filter((facility) =>
                energyFacilityTypes.includes(facility.type),
              ).length;
              return { ...goal, progress: count };
            }
            case "eco-score": {
              return {
                ...goal,
                progress: Math.round(nextResources.ecoScore),
              };
            }
            case "happy-citizens": {
              const count = nextFacilities.filter((facility) =>
                facility.type === "park" || facility.type === "recycling",
              ).length;
              return { ...goal, progress: count };
            }
            default:
              return goal;
          }
        });

        if (
          nextResources.energy >= nextResources.energyCapacity * 0.95 &&
          prev.resources.energy < nextResources.energyCapacity * 0.95
        ) {
          nextNotifications = appendNotification(nextNotifications, {
            id: makeId("note"),
            message: "에너지 저장고가 거의 가득 찼습니다. 저장소를 확장하세요.",
            severity: "warn",
            timestamp: Date.now(),
          });
        }

        if (
          nextResources.ecoScore >= 80 &&
          prev.resources.ecoScore < 80
        ) {
          nextNotifications = appendNotification(nextNotifications, {
            id: makeId("note"),
            message: "환경 점수가 80 이상으로 상승했습니다!",
            severity: "success",
            timestamp: Date.now(),
          });
        }

        return {
          ...prev,
          tick: prev.tick + 1,
          resources: nextResources,
          facilities: nextFacilities,
          notifications: nextNotifications,
          goals: updatedGoals,
        };
      });
    }, 2000);

    return () => window.clearInterval(interval);
  }, [policyControls]);

  useEffect(() => {
    if (!gameState.started) return;
    if (gameState.resources.ecoScore < 40 && !ecoWarningIssued.current) {
      notify({
        severity: "warn",
        title: "환경 경고",
        message: "환경 점수가 40 이하로 하락했습니다.",
        detail: "공원이나 재활용 센터를 추가로 건설해 회복하세요.",
      });
      ecoWarningIssued.current = true;
    } else if (gameState.resources.ecoScore >= 45) {
      ecoWarningIssued.current = false;
    }
  }, [gameState.resources.ecoScore, gameState.started, notify]);

  useEffect(() => {
    if (!gameState.started) return;
    const energyRatio =
      gameState.resources.energyCapacity === 0
        ? 0
        : gameState.resources.energy / gameState.resources.energyCapacity;
    if (energyRatio >= 0.9 && !energyWarningIssued.current) {
      notify({
        severity: "info",
        title: "에너지 저장고 경고",
        message: "에너지 저장소가 90% 용량에 도달했습니다.",
        detail: "배터리 저장소 업그레이드를 고려해 보세요.",
      });
      energyWarningIssued.current = true;
    } else if (energyRatio < 0.8) {
      energyWarningIssued.current = false;
    }
  }, [
    gameState.resources.energy,
    gameState.resources.energyCapacity,
    gameState.started,
    notify,
  ]);

  useEffect(() => {
    if (gameState.tick === 0) {
      return;
    }
    emitEvent("tick", "도시가 한 틱 진행되었습니다.", {
      tick: gameState.tick,
      energy: gameState.resources.energy,
      ecoScore: gameState.resources.ecoScore,
      credits: gameState.resources.credits,
    });
  }, [
    emitEvent,
    gameState.resources.credits,
    gameState.resources.ecoScore,
    gameState.resources.energy,
    gameState.tick,
  ]);

  useEffect(() => {
    if (sessionOutcome !== "running") {
      return;
    }
    if (gameState.tick < MIN_TICKS_FOR_OUTCOME) {
      return;
    }

    const { energy, ecoScore } = gameState.resources;
    const allGoalsMet = gameState.goals.every((goal) => goal.progress >= goal.target);

    if (energy <= LOSS_ENERGY_THRESHOLD || ecoScore <= LOSS_ECO_SCORE_THRESHOLD) {
      const lossReason = energy <= LOSS_ENERGY_THRESHOLD ? "에너지 고갈" : "환경 악화";
      setSessionOutcome("lost");
      setGameState((prev) => (prev.started ? { ...prev, started: false } : prev));
      emitEvent("lose", `${lossReason}로 세션이 종료되었습니다.`, {
        tick: gameState.tick,
        energy,
        ecoScore,
      });
      notify({
        severity: "error",
        title: "세션 실패",
        message: `${lossReason}로 도시가 위기에 빠졌습니다.`,
        detail: "시설 업그레이드와 정책 조정을 통해 자원을 회복해 보세요.",
      });
      return;
    }

    if (ecoScore >= WIN_ECO_SCORE_THRESHOLD && allGoalsMet) {
      setSessionOutcome("won");
      setGameState((prev) => (prev.started ? { ...prev, started: false } : prev));
      emitEvent("win", "지속가능성 목표를 달성했습니다.", {
        tick: gameState.tick,
        ecoScore,
      });
      notify({
        severity: "success",
        title: "세션 완료",
        message: "환경 점수 목표와 도시 목표를 모두 달성했습니다!",
        detail: "추가 난이도를 위해 새로운 정책 조합을 실험해 보세요.",
      });
    }
  }, [
    emitEvent,
    gameState.goals,
    gameState.resources,
    gameState.tick,
    notify,
    sessionOutcome,
    setGameState,
  ]);

  const selectedFacility = useMemo(
    () =>
      gameState.facilities.find((facility) => facility.id === selectedFacilityId) ??
      null,
    [gameState.facilities, selectedFacilityId],
  );

  const handleToggleStart = useCallback(() => {
    let nextStarted = false;
    setGameState((prev) => {
      nextStarted = !prev.started;
      return { ...prev, started: nextStarted };
    });
    setSessionOutcome((prev) => {
      if (nextStarted) {
        return "running";
      }
      if (prev === "won" || prev === "lost") {
        return prev;
      }
      return "idle";
    });
    notify({
      severity: nextStarted ? "success" : "info",
      title: "시뮬레이션",
      message: nextStarted ? "시뮬레이션을 시작했습니다." : "시뮬레이션을 일시정지했습니다.",
    });
  }, [notify]);

  const buildFacility = useCallback(
    (type: FacilityType, position: number) => {
      const definition = facilityCatalog[type];
      let result: "built" | "occupied" | "insufficient" | null = null;
      let newFacility: Facility | null = null;

      setGameState((prev) => {
        if (prev.facilities.some((facility) => facility.position === position)) {
          result = "occupied";
          return prev;
        }
        if (prev.resources.credits < definition.cost) {
          result = "insufficient";
          return prev;
        }

        newFacility = {
          id: makeId("fac"),
          type,
          level: 1,
          position,
          status: "active",
          efficiency: 92,
          addons: [],
        };

        const updatedFacilities = [...prev.facilities, newFacility];
        const updatedResources: ResourceState = {
          ...prev.resources,
          credits: prev.resources.credits - definition.cost,
          energyCapacity:
            prev.resources.energyCapacity + definition.capacityBonus(1),
          ecoScore: clamp(
            prev.resources.ecoScore + definition.ecoImpact(1),
            0,
            100,
          ),
        };

        const updatedGoals = prev.goals.map((goal) => {
          if (goal.id === "green-energy" && energyFacilityTypes.includes(type)) {
            return { ...goal, progress: goal.progress + 1 };
          }
          if (
            goal.id === "happy-citizens" &&
            (type === "park" || type === "recycling")
          ) {
            return { ...goal, progress: goal.progress + 1 };
          }
          return goal;
        });

        const updatedNotifications = appendNotification(prev.notifications, {
          id: makeId("note"),
          message: `${definition.displayName} 건설을 완료했습니다.`,
          severity: "success",
          timestamp: Date.now(),
        });

        result = "built";

        return {
          ...prev,
          facilities: updatedFacilities,
          resources: updatedResources,
          notifications: updatedNotifications,
          goals: updatedGoals,
        };
      });

      const outcome = result as "built" | "occupied" | "insufficient" | null;

      switch (outcome) {
        case "insufficient": {
          notify({
            severity: "warn",
            title: "건설 실패",
            message: "크레딧이 부족하여 시설을 건설할 수 없습니다.",
          });
          break;
        }
        case "built": {
          if (!newFacility) {
            break;
          }
          const builtFacility = newFacility as Facility;
          const definition = facilityCatalog[builtFacility.type];
          notify({
            severity: "success",
            title: "건설 완료",
            message: `${definition.displayName}가 도시에 추가되었습니다.`,
          });
          emitEvent("build", `${definition.displayName} 건설`, {
            facilityId: builtFacility.id,
            type: builtFacility.type,
            position: builtFacility.position,
            level: builtFacility.level,
          });
          setLastBuildFeedback({ type: builtFacility.type, timestamp: Date.now() });
          setSelectedFacilityId(builtFacility.id);
          setSelectedBuildType(null);
          break;
        }
        default:
          break;
      }
    },
    [emitEvent, notify],
  );

  const upgradeFacility = useCallback(
    (facilityId: string) => {
      let result: "upgraded" | "maxed" | "insufficient" | "missing" | null = null;
      let upgradedFacilitySnapshot: Facility | null = null;
      setGameState((prev) => {
        const index = prev.facilities.findIndex((facility) => facility.id === facilityId);
        if (index === -1) {
          result = "missing";
          return prev;
        }
        const facility = prev.facilities[index];
        const definition = facilityCatalog[facility.type];
        const nextLevel = facility.level + 1;
        if (nextLevel > MAX_LEVEL) {
          result = "maxed";
          return prev;
        }
        const upgradeCost = definition.upgradeCost(facility.level);
        if (prev.resources.credits < upgradeCost) {
          result = "insufficient";
          return prev;
        }

        const upgradedFacility: Facility = {
          ...facility,
          level: nextLevel,
          efficiency: Math.round(clamp(facility.efficiency + 6, 60, 125)),
        };

        upgradedFacilitySnapshot = upgradedFacility;

        const updatedFacilities = [...prev.facilities];
        updatedFacilities[index] = upgradedFacility;

        const updatedResources: ResourceState = {
          ...prev.resources,
          credits: prev.resources.credits - upgradeCost,
          energyCapacity:
            prev.resources.energyCapacity +
            (definition.capacityBonus(nextLevel) -
              definition.capacityBonus(facility.level)),
          ecoScore: clamp(
            prev.resources.ecoScore + definition.ecoImpact(nextLevel) * 1.4,
            0,
            100,
          ),
        };

        const updatedNotifications = appendNotification(prev.notifications, {
          id: makeId("note"),
          message: `${definition.displayName}가 레벨 ${nextLevel}로 업그레이드되었습니다.`,
          severity: "info",
          timestamp: Date.now(),
        });

        result = "upgraded";

        return {
          ...prev,
          facilities: updatedFacilities,
          resources: updatedResources,
          notifications: updatedNotifications,
        };
      });

      const upgradeOutcome = result as
        | "upgraded"
        | "maxed"
        | "insufficient"
        | "missing"
        | null;

      switch (upgradeOutcome) {
        case "insufficient": {
          notify({
            severity: "warn",
            title: "업그레이드 실패",
            message: "업그레이드 비용이 부족합니다.",
          });
          break;
        }
        case "maxed": {
          notify({
            severity: "info",
            message: "이미 최대 레벨입니다.",
          });
          break;
        }
        case "upgraded": {
          const upgraded = upgradedFacilitySnapshot as Facility | null;
          notify({
            severity: "success",
            title: "업그레이드 완료",
            message: "시설 레벨이 상승했습니다.",
          });
          emitEvent("upgrade", `${facilityId} 업그레이드`, {
            facilityId,
            level: upgraded?.level ?? 0,
          });
          break;
        }
        default:
          break;
      }
    },
    [emitEvent, notify],
  );

  const togglePolicy = useCallback(
    (policyId: string) => {
      let toggledPolicy: StoredPolicy | null = null;
      setGameState((prev) => {
        const updatedPolicies = prev.policies.map((policy) => {
          if (policy.id !== policyId) return policy;
          const updated = { ...policy, active: !policy.active };
          toggledPolicy = updated;
          return updated;
        });
        if (!toggledPolicy) return prev;

        const resources = { ...prev.resources };
        if (toggledPolicy.active && toggledPolicy.effect.ecoScore) {
          resources.ecoScore = clamp(
            resources.ecoScore + toggledPolicy.effect.ecoScore,
            0,
            100,
          );
        }
        if (!toggledPolicy.active && toggledPolicy.effect.ecoScore) {
          resources.ecoScore = clamp(
            resources.ecoScore - toggledPolicy.effect.ecoScore * 0.5,
            0,
            100,
          );
        }
        if (toggledPolicy.active && toggledPolicy.effect.credits) {
          resources.credits += toggledPolicy.effect.credits;
        }

        return { ...prev, policies: updatedPolicies, resources };
      });

      if (toggledPolicy) {
        const policy = toggledPolicy as StoredPolicy;
        notify({
          severity: policy.active ? "success" : "info",
          title: "정책 업데이트",
          message: `${policy.name} 정책이 ${
            policy.active ? "활성화" : "비활성화"
          }되었습니다.`,
        });
        emitEvent("policy", `${policy.name} 정책 ${
          policy.active ? "활성화" : "비활성화"
        }`, {
          policyId,
          active: policy.active,
        });
      }
    },
    [emitEvent, notify],
  );

  const handleCellClick = useCallback(
    (position: number) => {
      const facility = gameState.facilities.find((item) => item.position === position);
      if (facility) {
        setSelectedFacilityId(facility.id);
        setSelectedBuildType(null);
        return;
      }
      if (selectedBuildType) {
        buildFacility(selectedBuildType, position);
      }
    },
    [buildFacility, gameState.facilities, selectedBuildType],
  );

  const handleSelectBuildType = useCallback((type: FacilityType) => {
    setSelectedBuildType((current) => (current === type ? null : type));
    setSelectedFacilityId(null);
  }, []);

  const handleQuickDockFilterChange = useCallback((nextFilter: QuickDockFilter) => {
    setQuickDockFilter(nextFilter);
  }, []);

  const handlePolicyControlsChange = useCallback(
    (nextControls: PolicyControlState) => {
      setPolicyControls(nextControls);
    },
    [],
  );

  const handleDismissTutorial = useCallback(() => {
    setShowTutorial(false);
  }, []);

  const handleBeginSimulation = useCallback(() => {
    setShowTutorial(false);
    setGameState((prev) => (prev.started ? prev : { ...prev, started: true }));
  }, []);

  const closeMobileSheet = useCallback(() => {
    setActiveMobileSheet(null);
  }, []);

  const toggleMobileSheet = useCallback((panel: MobilePanelKey) => {
    setActiveMobileSheet((prev) => (prev === panel ? null : panel));
  }, []);

  const energyFacilityCount = useMemo(
    () =>
      gameState.facilities.filter((facility) =>
        energyFacilityTypes.includes(facility.type),
      ).length,
    [gameState.facilities],
  );

  const detailPanel = (
    <section className="rounded-3xl bg-slate-900/70 p-5 shadow-inner ring-1 ring-slate-700/40">
      {selectedFacility ? (
        (() => {
          const definition = facilityCatalog[selectedFacility.type];
          const currentOutput = definition.production(selectedFacility.level);
          const nextLevel = Math.min(MAX_LEVEL, selectedFacility.level + 1);
          const nextOutput =
            selectedFacility.level < MAX_LEVEL
              ? definition.production(nextLevel)
              : null;
          const upgradeCost = definition.upgradeCost(selectedFacility.level);
          const canUpgrade =
            selectedFacility.level < MAX_LEVEL &&
            gameState.resources.credits >= upgradeCost;
          const UpgradePreview = definition.upgradePreview;
          const Icon = definition.icon;

          const benefits: string[] = [];
          if (nextOutput?.energy) {
            benefits.push(`에너지 생산 ${nextOutput.energy.toLocaleString()}⚡`);
          }
          if (nextOutput?.credits) {
            benefits.push(`세수 ${nextOutput.credits.toLocaleString()}💰`);
          }
          if (nextOutput?.population) {
            benefits.push(`인구 변화 ${nextOutput.population.toLocaleString()}명`);
          }
          benefits.push(
            `환경 영향 +${definition
              .ecoImpact(nextLevel)
              .toFixed(1)}점`,
          );

          return (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {UpgradePreview ? (
                  <UpgradePreview
                    animated
                    level={selectedFacility.level}
                    efficiency={selectedFacility.efficiency}
                    addons={selectedFacility.addons}
                    size={84}
                  />
                ) : (
                  <Icon size={76} animated className="shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-100">
                      {definition.displayName}
                    </h2>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                      Lv.{selectedFacility.level}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    {definition.description}
                  </p>
                  <div className="mt-2 text-xs font-medium text-emerald-300">
                    {definition.quickHint}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-800/60 p-3">
                  <div className="text-xs text-slate-400">세수</div>
                  <div className="mt-1 text-lg font-semibold">
                    {(currentOutput.credits ?? 0).toLocaleString()}💰
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-800/60 p-3">
                  <div className="text-xs text-slate-400">에너지</div>
                  <div className="mt-1 text-lg font-semibold">
                    {(currentOutput.energy ?? 0).toLocaleString()}⚡
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-800/60 p-3">
                  <div className="text-xs text-slate-400">인구 영향</div>
                  <div className="mt-1 text-lg font-semibold">
                    {(currentOutput.population ?? 0).toLocaleString()}명
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-800/60 p-3">
                  <div className="text-xs text-slate-400">효율</div>
                  <div className="mt-1 text-lg font-semibold">
                    {selectedFacility.efficiency}%
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!canUpgrade}
                onClick={() => upgradeFacility(selectedFacility.id)}
                className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  canUpgrade
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    : "bg-slate-700/60 text-slate-400"
                }`}
              >
                {selectedFacility.level < MAX_LEVEL
                  ? `업그레이드 (${upgradeCost.toLocaleString()} 크레딧)`
                  : "최대 레벨"}
              </button>

              <FacilityUpgradeInfo
                facilityName={definition.displayName}
                currentLevel={selectedFacility.level}
                maxLevel={MAX_LEVEL}
                upgradeCost={
                  selectedFacility.level < MAX_LEVEL ? upgradeCost : 0
                }
                nextLevelBenefits={selectedFacility.level < MAX_LEVEL ? benefits : [
                  "최대 레벨에 도달했습니다.",
                ]}
                availableAddons={(definition.addons ?? []).map((addon) => ({
                  name: addon.name,
                  benefit: addon.description,
                  cost: addon.cost,
                  installed: selectedFacility.addons.includes(addon.id),
                }))}
              />
            </div>
          );
        })()
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-slate-400">
          <CreativeResearchLab size={88} animated />
          <p>상세 정보를 보려면 시설을 선택하세요.</p>
        </div>
      )}
    </section>
  );

  const policiesPanel = (
    <section className="rounded-3xl bg-slate-900/70 p-5 shadow-inner ring-1 ring-slate-700/40">
      <h3 className="text-lg font-semibold text-slate-100">정책 패널</h3>
      <p className="mt-1 text-xs text-slate-400">
        정책을 활성화하면 도시 운영 방식이 달라집니다.
      </p>
      <div className="mt-4 space-y-3">
        {gameState.policies.map((policy) => (
          <div
            key={policy.id}
            className={`rounded-2xl border px-4 py-3 transition ${
              policy.active
                ? "border-emerald-400/40 bg-emerald-500/10"
                : "border-slate-700/50 bg-slate-800/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-100">
                  {policy.name}
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  {policy.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => togglePolicy(policy.id)}
                className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                  policy.active
                    ? "bg-emerald-400 text-slate-900 hover:bg-emerald-300"
                    : "bg-slate-700 text-slate-100 hover:bg-slate-600"
                }`}
              >
                {policy.active ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const goalsPanel = (
    <section className="rounded-3xl bg-slate-900/70 p-5 shadow-inner ring-1 ring-slate-700/40">
      <h3 className="text-lg font-semibold text-slate-100">시즌 목표</h3>
      <p className="mt-1 text-xs text-slate-400">
        목표를 달성하면 추가 보상을 획득할 수 있습니다.
      </p>
      <div className="mt-4 space-y-4">
        {gameState.goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.progress / goal.target) * 100));
          return (
            <div key={goal.id} className="rounded-2xl bg-slate-800/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {goal.title}
                  </div>
                  <p className="text-xs text-slate-400">{goal.description}</p>
                </div>
                <div className="text-xs font-semibold text-emerald-300">
                  보상 {goal.reward.toLocaleString()}💰
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-300">
                <span>
                  진행 {goal.progress} / {goal.target}
                </span>
                <span>{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  const notificationsPanel = (
    <section className="rounded-3xl bg-slate-900/70 p-5 shadow-inner ring-1 ring-slate-700/40">
      <h3 className="text-lg font-semibold text-slate-100">최근 이벤트</h3>
      <div className="mt-3 space-y-3 text-sm">
        {gameState.notifications
          .slice()
          .reverse()
          .map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl bg-slate-800/60 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    entry.severity === "success"
                      ? "text-emerald-300"
                      : entry.severity === "warn"
                      ? "text-amber-300"
                      : entry.severity === "error"
                      ? "text-rose-300"
                      : "text-slate-200"
                  }`}
                >
                  {entry.severity.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="mt-1 text-slate-200">{entry.message}</div>
            </div>
          ))}
      </div>
    </section>
  );

  const mobileSheetTitleMap: Record<MobilePanelKey, string> = {
    policy: "환경 정책",
    goals: "도시 목표",
    events: "최근 활동",
    ledger: "환경 영향",
  };

  let mobileSheetContent: React.ReactNode = null;
  if (activeMobileSheet === "policy") {
    mobileSheetContent = (
      <div className="space-y-4 text-sm">
        <PolicyControlPanel
          policy={policyControls}
          onChange={handlePolicyControlsChange}
        />
        <ExternalityLedger
          envImpactMonthly={environmentMonthlyDelta}
          privateIncomeDaily={dailyPrivateIncome}
        />
        {policiesPanel}
      </div>
    );
  } else if (activeMobileSheet === "goals") {
    mobileSheetContent = goalsPanel;
  } else if (activeMobileSheet === "events") {
    mobileSheetContent = (
      <div className="space-y-4">
        {notificationsPanel}
        <PlayersFeed items={feedItems} />
      </div>
    );
  } else if (activeMobileSheet === "ledger") {
    mobileSheetContent = (
      <div className="space-y-4">
        <ExternalityLedger
          envImpactMonthly={environmentMonthlyDelta}
          privateIncomeDaily={dailyPrivateIncome}
        />
        <PlayersFeed items={feedItems} />
      </div>
    );
  }

  return (
    <>
      {showTutorial ? (
        <TutorialOverlay
          onClose={handleDismissTutorial}
          onBegin={handleBeginSimulation}
        />
      ) : null}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 pb-36 text-slate-100 lg:pb-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <RegionBar
          tick={gameState.tick}
          started={gameState.started}
          sessionId={sessionId}
          supabaseStatus={supabaseStatusLabel}
          resources={gameState.resources}
          energyFacilityCount={energyFacilityCount}
          onToggleStart={handleToggleStart}
          pulseSeverity={hudPulseSeverity}
        />

        <main className="flex flex-col gap-5 pb-24 lg:grid lg:pb-0 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
          <aside className="hidden flex-col gap-4 lg:flex">
            <QuickDockPanel
              selectedType={selectedBuildType}
              onSelect={handleSelectBuildType}
              filter={quickDockFilter}
              onFilterChange={handleQuickDockFilterChange}
              lastBuild={lastBuildFeedback}
            />

            <section className="rounded-3xl bg-emerald-500/10 p-5 shadow-inner ring-1 ring-emerald-500/30">
              <div className="flex items-center gap-4">
                <CreativeResearchLab size={64} animated />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-100">
                    연구소 추천
                  </h4>
                  <p className="text-xs text-emerald-200">
                    연구소를 건설하면 고급 정책과 업그레이드가 해금됩니다.
                  </p>
                </div>
              </div>
            </section>
          </aside>

          <section className="rounded-3xl bg-slate-900/60 p-5 shadow-xl ring-1 ring-slate-700/50">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">도시 그리드</h2>
              <span className="text-xs text-slate-400">
                8 x 6 타일 · 비어있는 위치를 클릭해 시설을 배치하세요
              </span>
            </div>
            <div className="overflow-x-auto pb-2">
              <FacilityBoard
                columns={GRID_COLUMNS}
                rows={GRID_ROWS}
                facilities={gameState.facilities}
                selectedFacilityId={selectedFacilityId}
                selectedBuildType={selectedBuildType}
                onCellClick={handleCellClick}
              />
            </div>
          </section>

          <aside className="hidden flex-col gap-4 lg:flex">
            {detailPanel}
            <section className="rounded-3xl bg-slate-900/70 p-5 shadow-inner ring-1 ring-slate-700/40">
              <h3 className="text-lg font-semibold text-slate-100">환경 정책 조정</h3>
              <p className="mt-1 text-xs text-slate-400">
                탄소세·보조금·규제 강도를 조정해 환경 피해를 완화하세요.
              </p>
              <div className="mt-4 space-y-3">
            <PolicyControlPanel
              policy={policyControls}
              onChange={handlePolicyControlsChange}
            />
              </div>
            </section>
            <ExternalityLedger
              envImpactMonthly={environmentMonthlyDelta}
              privateIncomeDaily={dailyPrivateIncome}
            />
            {policiesPanel}
            {goalsPanel}
            {notificationsPanel}
            <PlayersFeed items={feedItems} />
          </aside>
        </main>

        <div className="fixed inset-x-0 bottom-[120px] z-40 flex items-center justify-around gap-2 px-4 lg:hidden">
          {(
            [
              ["policy", "⚖️", "정책"],
              ["ledger", "🌍", "환경"],
              ["goals", "🎯", "목표"],
              ["events", "📜", "이벤트"],
            ] as Array<[MobilePanelKey, string, string]>
          ).map(([key, icon, label]) => {
            const active = activeMobileSheet === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleMobileSheet(key)}
                aria-pressed={active}
                className={`flex h-14 w-14 flex-col items-center justify-center rounded-full border text-[11px] font-semibold transition ${
                  active
                    ? "border-emerald-400 bg-emerald-400 text-slate-900 shadow-lg"
                    : "border-emerald-400/40 bg-slate-900/90 text-emerald-100 hover:border-emerald-300"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {icon}
                </span>
                <span className="mt-0.5 leading-tight">{label}</span>
              </button>
            );
          })}
        </div>

        <section className="flex flex-col gap-4 lg:hidden">
          {detailPanel}
          <section className="rounded-3xl bg-slate-900/70 p-5 shadow-inner ring-1 ring-slate-700/40">
            <h3 className="text-lg font-semibold text-slate-100">환경 정책 조정</h3>
            <div className="mt-4 space-y-3">
              <PolicyControlPanel
                policy={policyControls}
                onChange={handlePolicyControlsChange}
              />
            </div>
          </section>
          <ExternalityLedger
            envImpactMonthly={environmentMonthlyDelta}
            privateIncomeDaily={dailyPrivateIncome}
          />
          {policiesPanel}
          {goalsPanel}
          {notificationsPanel}
          <PlayersFeed items={feedItems} />
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto w-full max-w-3xl px-4">
          <QuickDockBar
            selectedType={selectedBuildType}
            onSelect={handleSelectBuildType}
            filter={quickDockFilter}
            onFilterChange={handleQuickDockFilterChange}
            lastBuild={lastBuildFeedback}
          />
        </div>
      </div>
    </div>
      {activeMobileSheet && mobileSheetContent ? (
        <MobileSheet
          title={mobileSheetTitleMap[activeMobileSheet]}
          onClose={closeMobileSheet}
        >
          {mobileSheetContent}
        </MobileSheet>
      ) : null}
    </>
  );
}
