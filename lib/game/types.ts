import type { FacilityStatus, FacilityType } from "./facilities";

export interface ResourceState {
  credits: number;
  energy: number;
  energyCapacity: number;
  water: number;
  population: number;
  ecoScore: number;
}

export interface Facility {
  id: string;
  type: FacilityType;
  level: number;
  position: number;
  status: FacilityStatus;
  efficiency: number;
  addons: string[];
}

export interface PolicyEffect {
  ecoScore?: number;
  credits?: number;
  energyEfficiency?: number;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  effect: PolicyEffect;
  active: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
}

export type NotificationSeverity = "info" | "success" | "warn" | "error";

export interface NotificationEntry {
  id: string;
  message: string;
  severity: NotificationSeverity;
  timestamp: number;
}

export type GameEventType = "tick" | "build" | "upgrade" | "policy" | "win" | "lose";

export interface GameEvent {
  id: string;
  type: GameEventType;
  message: string;
  payload?: Record<string, unknown>;
  timestamp: number;
}

export type SupabaseStatus = "idle" | "loading" | "ready" | "error";

export interface GameState {
  started: boolean;
  tick: number;
  resources: ResourceState;
  facilities: Facility[];
  policies: Policy[];
  goals: Goal[];
  notifications: NotificationEntry[];
}

export interface SimulationFacility extends Pick<Facility, "type" | "level" | "status" | "addons"> {
  id?: string;
  position?: number;
  efficiency?: number;
}

export interface SimulationSnapshot {
  tick: number;
  resources: ResourceState;
}

export interface SimulationWarning {
  tick: number;
  severity: NotificationSeverity;
  message: string;
}
