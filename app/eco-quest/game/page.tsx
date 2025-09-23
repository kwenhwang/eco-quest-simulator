"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";

import { CreativeResearchLab } from "@/components/CreativePixelIcons";
import { CreativeSolarPlant, CreativeWindPlant } from "@/components/CreativePixelIcons2";
import {
  CreativeCommercial,
  CreativePark,
  CreativeRecycling,
  CreativeResidential,
} from "@/components/CreativePixelIcons3";
import { CreativeResourcePanel } from "@/components/CreativeResourceIcons";
import { FacilityUpgradeInfo, UpgradeableSolarPlant } from "@/components/UpgradeableIcons";
import { useNotify } from "@/app/_components/notification-center";

type FacilityType =
  | "solar"
  | "wind"
  | "residential"
  | "commercial"
  | "park"
  | "recycling";

type FacilityStatus = "active" | "paused" | "building";

type FacilityIcon = ComponentType<{
  size?: number;
  className?: string;
  animated?: boolean;
}>;

type FacilityUpgradePreview = ComponentType<{
  size?: number;
  className?: string;
  animated?: boolean;
  level?: number;
  addons?: string[];
  efficiency?: number;
}>;

interface ResourceDelta {
  credits?: number;
  energy?: number;
  water?: number;
  population?: number;
}

interface FacilityDefinition {
  displayName: string;
  description: string;
  quickHint: string;
  icon: FacilityIcon;
  upgradePreview?: FacilityUpgradePreview;
  cost: number;
  maintenance: (level: number) => number;
  production: (level: number) => ResourceDelta;
  capacityBonus: (level: number) => number;
  ecoImpact: (level: number) => number;
  upgradeCost: (level: number) => number;
  addons?: Array<{
    id: string;
    name: string;
    description: string;
    cost: number;
  }>;
}

interface ResourceState {
  credits: number;
  energy: number;
  energyCapacity: number;
  water: number;
  population: number;
  ecoScore: number;
}

interface Facility {
  id: string;
  type: FacilityType;
  level: number;
  position: number;
  status: FacilityStatus;
  efficiency: number;
  addons: string[];
}

interface Policy {
  id: string;
  name: string;
  description: string;
  effect: {
    ecoScore?: number;
    credits?: number;
    energyEfficiency?: number;
  };
  active: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
}

interface NotificationEntry {
  id: string;
  message: string;
  severity: "info" | "success" | "warn" | "error";
  timestamp: number;
}

interface GameState {
  started: boolean;
  tick: number;
  resources: ResourceState;
  facilities: Facility[];
  policies: Policy[];
  goals: Goal[];
  notifications: NotificationEntry[];
}

const GRID_COLUMNS = 8;
const GRID_ROWS = 6;
const GRID_SIZE = GRID_COLUMNS * GRID_ROWS;
const BASE_ENERGY_CAPACITY = 420;
const MAX_LEVEL = 5;
const energyFacilityTypes: FacilityType[] = ["solar", "wind"];

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

const facilityCatalog: Record<FacilityType, FacilityDefinition> = {
  solar: {
    displayName: "태양광 발전소",
    description: "태양 에너지를 활용해 안정적인 전력을 공급하는 기본 전력 시설입니다.",
    quickHint: "에너지 +70⚡ / 친환경 점수 +3",
    icon: CreativeSolarPlant,
    upgradePreview: UpgradeableSolarPlant,
    cost: 1200,
    maintenance: (level) => 50 + level * 12,
    production: (level) => ({
      credits: 110 + level * 20,
      energy: 70 + level * 28,
    }),
    capacityBonus: (level) => 40 + (level - 1) * 12,
    ecoImpact: (level) => 2.2 + level * 0.8,
    upgradeCost: (level) => Math.round(900 * Math.pow(1.55, level)),
    addons: [
      {
        id: "battery",
        name: "배터리 저장소",
        description: "에너지 용량 +60",
        cost: 820,
      },
      {
        id: "inverter",
        name: "고효율 인버터",
        description: "에너지 생산 +12%",
        cost: 650,
      },
    ],
  },
  wind: {
    displayName: "풍력 발전소",
    description: "바람의 힘을 이용해 대량의 전력을 생산하지만 유지 관리가 까다롭습니다.",
    quickHint: "에너지 +90⚡ / 친환경 점수 +4",
    icon: CreativeWindPlant,
    cost: 1500,
    maintenance: (level) => 70 + level * 20,
    production: (level) => ({
      credits: 95 + level * 26,
      energy: 90 + level * 34,
    }),
    capacityBonus: (level) => 35 + (level - 1) * 14,
    ecoImpact: (level) => 2.8 + level * 1,
    upgradeCost: (level) => Math.round(1100 * Math.pow(1.48, level)),
  },
  residential: {
    displayName: "친환경 주거 단지",
    description: "인구 증가와 기초 세수를 담당하는 주거 구역입니다.",
    quickHint: "인구 +60 / 세수 +140",
    icon: CreativeResidential,
    cost: 900,
    maintenance: (level) => 35 + level * 15,
    production: (level) => ({
      credits: 140 + level * 40,
      population: 60 + level * 25,
    }),
    capacityBonus: () => 0,
    ecoImpact: (level) => -0.6 * level,
    upgradeCost: (level) => Math.round(780 * Math.pow(1.42, level)),
  },
  commercial: {
    displayName: "상업 지구",
    description: "도시의 세수를 크게 늘리지만 환경 부담이 존재합니다.",
    quickHint: "세수 +210 / 환경 -1",
    icon: CreativeCommercial,
    cost: 1100,
    maintenance: (level) => 55 + level * 18,
    production: (level) => ({
      credits: 210 + level * 55,
      population: 20 + level * 12,
    }),
    capacityBonus: () => 0,
    ecoImpact: (level) => -1.1 * level,
    upgradeCost: (level) => Math.round(960 * Math.pow(1.5, level)),
  },
  park: {
    displayName: "도시 공원",
    description: "시민 만족도와 환경 점수를 동시에 향상시키는 녹지 공간입니다.",
    quickHint: "환경 +5 / 인구 만족 +20",
    icon: CreativePark,
    cost: 720,
    maintenance: (level) => 25 + level * 8,
    production: (level) => ({
      population: 25 + level * 10,
      water: -5,
    }),
    capacityBonus: () => 0,
    ecoImpact: (level) => 3.5 + level * 1.4,
    upgradeCost: (level) => Math.round(620 * Math.pow(1.35, level)),
  },
  recycling: {
    displayName: "재활용 센터",
    description: "폐기물을 자원으로 전환하여 지속 가능한 순환 구조를 만듭니다.",
    quickHint: "환경 +6 / 세수 +100",
    icon: CreativeRecycling,
    cost: 1380,
    maintenance: (level) => 48 + level * 16,
    production: (level) => ({
      credits: 100 + level * 32,
      water: 15 + level * 6,
    }),
    capacityBonus: () => 0,
    ecoImpact: (level) => 4 + level * 1.6,
    upgradeCost: (level) => Math.round(1000 * Math.pow(1.47, level)),
    addons: [
      {
        id: "ai-sorter",
        name: "AI 분류기",
        description: "재활용 효율 +18%",
        cost: 920,
      },
    ],
  },
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

export default function EcoQuestGame() {
  const { notify } = useNotify();
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [selectedBuildType, setSelectedBuildType] = useState<FacilityType | null>("solar");
  const ecoWarningIssued = useRef(false);
  const energyWarningIssued = useRef(false);

  // NOTE: 현재는 Supabase 연동 전이라 local mock state를 사용합니다.
  // TODO(fetchSeasonState): fetchSeasonState()로 초기 스냅샷을 불러오고 syncGameState()로 주기적 동기화를 연결합니다.

  useEffect(() => {
    if (!selectedFacilityId && gameState.facilities.length > 0) {
      setSelectedFacilityId(gameState.facilities[0].id);
    }
  }, [gameState.facilities, selectedFacilityId]);

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

        nextResources.credits = Math.max(0, nextResources.credits);
        nextResources.energy = Math.max(0, nextResources.energy);
        nextResources.water = Math.max(0, nextResources.water);

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
  }, []);

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
    notify({
      severity: nextStarted ? "success" : "info",
      title: "시뮬레이션",
      message: nextStarted ? "시뮬레이션을 시작했습니다." : "시뮬레이션을 일시정지했습니다.",
    });
  }, [notify]);

  const buildFacility = useCallback(
    (type: FacilityType, position: number) => {
      const definition = facilityCatalog[type];
      let result: "built" | "occupied" | "insufficient" = "occupied";
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

      if (result === "insufficient") {
        notify({
          severity: "warn",
          title: "건설 실패",
          message: "크레딧이 부족하여 시설을 건설할 수 없습니다.",
        });
      }

      if (result === "built" && newFacility) {
        notify({
          severity: "success",
          title: "건설 완료",
          message: `${facilityCatalog[newFacility.type].displayName}가 도시에 추가되었습니다.`,
        });
        setSelectedFacilityId(newFacility.id);
        setSelectedBuildType(null);
      }
    },
    [notify],
  );

  const upgradeFacility = useCallback(
    (facilityId: string) => {
      let result: "upgraded" | "maxed" | "insufficient" | "missing" = "missing";
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

      if (result === "insufficient") {
        notify({
          severity: "warn",
          title: "업그레이드 실패",
          message: "업그레이드 비용이 부족합니다.",
        });
      }
      if (result === "maxed") {
        notify({
          severity: "info",
          message: "이미 최대 레벨입니다.",
        });
      }
      if (result === "upgraded") {
        notify({
          severity: "success",
          title: "업그레이드 완료",
          message: "시설 레벨이 상승했습니다.",
        });
      }
    },
    [notify],
  );

  const togglePolicy = useCallback(
    (policyId: string) => {
      let toggledPolicy: Policy | null = null;
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
        notify({
          severity: toggledPolicy.active ? "success" : "info",
          title: "정책 업데이트",
          message: `${toggledPolicy.name} 정책이 ${
            toggledPolicy.active ? "활성화" : "비활성화"
          }되었습니다.`,
        });
      }
    },
    [notify],
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

  const facilityList = useMemo(
    () => Object.entries(facilityCatalog) as [FacilityType, FacilityDefinition][],
    [],
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 pb-36 text-slate-100 lg:pb-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl bg-slate-900/70 px-6 py-5 shadow-xl ring-1 ring-slate-700/40 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Eco Quest 시뮬레이션</h1>
              <p className="text-sm text-slate-400">
                시즌 1 · {gameState.started ? "진행 중" : "대기 중"} · Tick {" "}
                {gameState.tick.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleStart}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  gameState.started
                    ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                    : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                }`}
              >
                {gameState.started ? "일시 정지" : "게임 시작하기"}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <CreativeResourcePanel
              money={Math.round(gameState.resources.credits)}
              energy={`${Math.round(gameState.resources.energy)}/${Math.round(
                gameState.resources.energyCapacity,
              )}`}
              population={Math.round(gameState.resources.population)}
            />
            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
              <span>
                환경 점수: {Math.round(gameState.resources.ecoScore)} / 100
              </span>
              <span>물 자원: {Math.max(0, Math.round(gameState.resources.water))}㎘</span>
              <span>
                재생 에너지 시설: {gameState.facilities.filter((facility) =>
                  energyFacilityTypes.includes(facility.type),
                ).length}
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            현재는 모의 상태를 로컬로 유지합니다. 이후 fetchSeasonState()와
            syncGameState()를 연결해 Supabase와 동기화할 예정입니다.
          </p>
        </header>

        <main className="flex flex-col gap-5 lg:grid lg:grid-cols-[260px_minmax(0,1fr)_320px]">
          <aside className="hidden flex-col gap-4 lg:flex">
            <section className="rounded-3xl bg-slate-900/70 p-5 shadow-inner ring-1 ring-slate-700/40">
              <h3 className="text-lg font-semibold text-slate-100">Quick Dock</h3>
              <p className="mt-1 text-xs text-slate-400">
                건설할 시설을 선택하고 그리드에 배치하세요.
              </p>
              <div className="mt-4 space-y-3">
                {facilityList.map(([type, definition]) => {
                  const Icon = definition.icon;
                  const isSelected = selectedBuildType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleSelectBuildType(type)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${
                        isSelected
                          ? "border-emerald-400 bg-emerald-500/10"
                          : "border-slate-700/60 bg-slate-800/50 hover:border-emerald-400/40"
                      }`}
                    >
                      <Icon size={52} animated className="shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-100">
                          {definition.displayName}
                        </div>
                        <p className="truncate text-xs text-slate-400">
                          {definition.quickHint}
                        </p>
                        <div className="mt-1 text-[11px] text-emerald-300">
                          비용 {definition.cost.toLocaleString()}💰
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

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
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
              {Array.from({ length: GRID_SIZE }, (_, index) => {
                const facility = gameState.facilities.find((item) => item.position === index);
                const isSelected =
                  facility && selectedFacilityId === facility.id;
                const Icon = facility ? facilityCatalog[facility.type].icon : null;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCellClick(index)}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl border text-xs transition ${
                      facility
                        ? isSelected
                          ? "border-emerald-400 bg-emerald-500/10"
                          : "border-slate-700/70 bg-slate-800/70"
                        : selectedBuildType
                        ? "border-dashed border-emerald-400/60 bg-slate-800/40 hover:border-emerald-300"
                        : "border-slate-700/50 bg-slate-800/40"
                    }`}
                  >
                    {facility && Icon ? (
                      <>
                        <Icon size={60} animated />
                        <span className="absolute left-2 top-2 rounded-full bg-slate-950/90 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          Lv.{facility.level}
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400">건설</span>
                    )}
                    <span className="absolute bottom-2 right-2 text-[10px] text-slate-500">
                      R{Math.floor(index / GRID_COLUMNS) + 1}-C{(index % GRID_COLUMNS) + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="hidden flex-col gap-4 lg:flex">
            {detailPanel}
            {policiesPanel}
            {goalsPanel}
            {notificationsPanel}
          </aside>
        </main>

        <section className="flex flex-col gap-4 lg:hidden">
          {detailPanel}
          {policiesPanel}
          {goalsPanel}
          {notificationsPanel}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="rounded-3xl bg-slate-900/95 shadow-2xl ring-1 ring-emerald-500/30">
            <div className="flex items-center justify-between gap-2 overflow-x-auto px-3 py-3">
              {facilityList.map(([type, definition]) => {
                const Icon = definition.icon;
                const isSelected = selectedBuildType === type;
                return (
                  <button
                    key={`${type}-mobile`}
                    type="button"
                    onClick={() => handleSelectBuildType(type)}
                    className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] transition ${
                      isSelected
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "text-slate-200 hover:text-emerald-200"
                    }`}
                  >
                    <Icon size={42} animated className="shrink-0" />
                    <span className="whitespace-nowrap">
                      {definition.displayName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
