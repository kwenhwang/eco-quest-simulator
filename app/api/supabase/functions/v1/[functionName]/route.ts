import { NextRequest, NextResponse } from "next/server";

import { forwardSupabaseFunction } from "@/lib/server/supabase-function-proxy.mjs";

type FacilityType = "solar" | "wind" | "residential" | "commercial" | "park" | "recycling";

type FacilityStatus = "active" | "paused" | "building";

type ResourceState = {
  credits: number;
  energy: number;
  energyCapacity: number;
  water: number;
  population: number;
  ecoScore: number;
};

type Facility = {
  id: string;
  type: FacilityType;
  level: number;
  position: number;
  status: FacilityStatus;
  efficiency: number;
  addons: string[];
};

type Policy = {
  id: string;
  name: string;
  description: string;
  effect: {
    ecoScore?: number;
    credits?: number;
    energyEfficiency?: number;
  };
  active: boolean;
};

type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
};

type NotificationEntry = {
  id: string;
  message: string;
  severity: "info" | "success" | "warn" | "error";
  timestamp: number;
};

type GameStatePayload = {
  started: boolean;
  tick: number;
  resources: ResourceState;
  facilities: Facility[];
  policies: Policy[];
  goals: Goal[];
  notifications: NotificationEntry[];
};

type SessionRecord = {
  id: string;
  updated_at: string;
  game_state: GameStatePayload;
  resources: ResourceState;
  season_id: string;
};

type SeasonPayload = {
  id: string;
  name: string;
  status: "draft" | "active" | "archived";
  description: string;
  updated_at: string;
};

let memorySession: SessionRecord | null = null;
let memorySeason: SeasonPayload | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function coerceFacility(value: unknown, fallbackId: string, fallbackPosition: number): Facility {
  if (!isRecord(value)) {
    return {
      id: fallbackId,
      type: "solar",
      level: 1,
      position: fallbackPosition,
      status: "active",
      efficiency: 95,
      addons: [],
    };
  }

  const type = (typeof value.type === "string" ? value.type : "solar") as FacilityType;
  return {
    id: typeof value.id === "string" ? value.id : fallbackId,
    type,
    level: toNumber(value.level, 1),
    position: toNumber(value.position, fallbackPosition),
    status: (typeof value.status === "string" ? value.status : "active") as FacilityStatus,
    efficiency: toNumber(value.efficiency, 95),
    addons: Array.isArray(value.addons) ? value.addons.filter((item) => typeof item === "string") : [],
  };
}

function coerceFacilities(value: unknown, base: Facility[]): Facility[] {
  if (!Array.isArray(value) || value.length === 0) {
    return base;
  }
  return value.map((entry, index) => coerceFacility(entry, `sync-${index}`, index));
}

function coerceResourceState(value: unknown, base: ResourceState): ResourceState {
  if (!isRecord(value)) {
    return base;
  }
  return {
    credits: toNumber(value.credits, base.credits),
    energy: toNumber(value.energy, base.energy),
    energyCapacity: toNumber(value.energyCapacity, base.energyCapacity),
    water: toNumber(value.water, base.water),
    population: toNumber(value.population, base.population),
    ecoScore: toNumber(value.ecoScore, base.ecoScore),
  };
}

function createDefaultGameState(): GameStatePayload {
  const facilities: Facility[] = [
    {
      id: "fac-solar",
      type: "solar",
      level: 1,
      position: 9,
      status: "active",
      efficiency: 96,
      addons: [],
    },
    {
      id: "fac-residential",
      type: "residential",
      level: 1,
      position: 18,
      status: "active",
      efficiency: 90,
      addons: [],
    },
    {
      id: "fac-park",
      type: "park",
      level: 1,
      position: 29,
      status: "active",
      efficiency: 98,
      addons: [],
    },
  ];

  const resources: ResourceState = {
    credits: 8200,
    energy: 240,
    energyCapacity: 460,
    water: 180,
    population: 1480,
    ecoScore: 68,
  };

  return {
    started: false,
    tick: 0,
    resources,
    facilities,
    policies: [
      {
        id: "carbon-tax",
        name: "탄소세 인센티브",
        description: "친환경 시설의 운영 효율을 10% 향상시킵니다.",
        effect: { ecoScore: 2 },
        active: true,
      },
      {
        id: "green-bonds",
        name: "그린 본드",
        description: "녹색 채권을 발행해 초기 건설 비용을 보조합니다.",
        effect: { credits: 120 },
        active: false,
      },
    ],
    goals: [
      {
        id: "green-energy",
        title: "친환경 에너지 확대",
        description: "태양광 혹은 풍력 발전소를 5개 보유하세요.",
        progress: 1,
        target: 5,
        reward: 600,
      },
      {
        id: "eco-score",
        title: "환경 점수 80 달성",
        description: "지속가능한 정책으로 환경 점수를 80까지 끌어올리세요.",
        progress: 68,
        target: 80,
        reward: 900,
      },
      {
        id: "happy-citizens",
        title: "행복한 시민들",
        description: "공원이나 재활용 센터를 3개 이상 건설하세요.",
        progress: 1,
        target: 3,
        reward: 450,
      },
    ],
    notifications: [
      {
        id: "note-welcome",
        message: "Eco-Quest 시뮬레이터에 오신 것을 환영합니다!",
        severity: "info",
        timestamp: Date.now(),
      },
    ],
  };
}

function createDefaultSession(): SessionRecord {
  const now = new Date().toISOString();
  const baseState = createDefaultGameState();
  return {
    id: "dev-session",
    updated_at: now,
    game_state: baseState,
    resources: baseState.resources,
    season_id: "dev-season",
  };
}

function ensureSession(): SessionRecord {
  if (!memorySession) {
    memorySession = createDefaultSession();
  }
  return memorySession;
}

function ensureSeason(): SeasonPayload {
  if (!memorySeason) {
    memorySeason = {
      id: "dev-season",
      name: "Development Preview Season",
      status: "draft",
      description: "로컬 개발용 Supabase 함수 모의 응답",
      updated_at: new Date().toISOString(),
    };
  }
  return memorySeason;
}

async function readJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { functionName: string } },
) {
  const { functionName } = params;
  const payload = await readJson(request);

  const forwarded = await forwardSupabaseFunction(functionName, payload ?? undefined);
  if (forwarded.forwarded) {
    const headers = new Headers(forwarded.headers ?? {});
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
    return new NextResponse(forwarded.bodyText ?? "", {
      status: forwarded.status ?? 200,
      headers,
    });
  }

  switch (functionName) {
    case "get-season-state": {
      const session = ensureSession();
      const season = ensureSeason();
      return NextResponse.json({
        session,
        season,
      });
    }

    case "join": {
      const body = payload;
      const current = ensureSession();
      const nextSession: SessionRecord = {
        ...current,
        updated_at: new Date().toISOString(),
      };

      if (isRecord(body) && isRecord(body.session)) {
        if (isRecord(body.session.game_state)) {
          nextSession.game_state = {
            ...nextSession.game_state,
            ...body.session.game_state,
          } as GameStatePayload;
        }
        if (isRecord(body.session.resources)) {
          nextSession.resources = coerceResourceState(
            body.session.resources,
            nextSession.resources,
          );
          nextSession.game_state = {
            ...nextSession.game_state,
            resources: nextSession.resources,
          };
        }
      }

      memorySession = nextSession;
      return NextResponse.json({ session: memorySession });
    }

    case "player_action": {
      const body = payload;
      const session = ensureSession();
      const nextSession: SessionRecord = {
        ...session,
        id: isRecord(body) && typeof body.session_id === "string"
          ? body.session_id
          : session.id,
        updated_at: new Date().toISOString(),
      };

      if (isRecord(body)) {
        if (body.type === "sync_state") {
          if (isRecord(body.game_state)) {
            const mergedFacilities = coerceFacilities(
              body.game_state.facilities,
              nextSession.game_state.facilities,
            );
            nextSession.game_state = {
              ...nextSession.game_state,
              ...body.game_state,
              facilities: mergedFacilities,
            } as GameStatePayload;
          }
          if (isRecord(body.resources)) {
            nextSession.resources = coerceResourceState(
              body.resources,
              nextSession.resources,
            );
            nextSession.game_state = {
              ...nextSession.game_state,
              resources: nextSession.resources,
            };
          }
          memorySession = nextSession;
          return NextResponse.json({ status: "ok", session: memorySession });
        }

        if (body.type === "record_leaderboard") {
          return NextResponse.json({ status: "ok", leaderboard: [] });
        }
      }

      return NextResponse.json({ status: "ok" });
    }

    default:
      return NextResponse.json(
        { error: `Unknown function: ${functionName}` },
        { status: 404 },
      );
  }
}
