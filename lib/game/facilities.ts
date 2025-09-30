import type { ComponentType } from "react";

import { CreativeSolarPlant, CreativeWindPlant } from "@/components/CreativePixelIcons2";
import {
  CreativeCommercial,
  CreativePark,
  CreativeRecycling,
  CreativeResidential,
} from "@/components/CreativePixelIcons3";
import { UpgradeableSolarPlant } from "@/components/UpgradeableIcons";

export type FacilityType =
  | "solar"
  | "wind"
  | "residential"
  | "commercial"
  | "park"
  | "recycling";

export type FacilityStatus = "active" | "paused" | "building";

export type FacilityIcon = ComponentType<{
  size?: number;
  className?: string;
  animated?: boolean;
}>;

export type FacilityUpgradePreview = ComponentType<{
  size?: number;
  className?: string;
  animated?: boolean;
  level?: number;
  addons?: string[];
  efficiency?: number;
}>;

export interface ResourceDelta {
  credits?: number;
  energy?: number;
  water?: number;
  population?: number;
}

export interface FacilityDefinition {
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

export const MAX_LEVEL = 5;
export const BASE_ENERGY_CAPACITY = 420;

export const energyFacilityTypes: FacilityType[] = ["solar", "wind"];

export const facilityCatalog: Record<FacilityType, FacilityDefinition> = {
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

export const isEnergyFacility = (type: FacilityType) =>
  energyFacilityTypes.includes(type);
