"use client";

import { useMemo } from "react";

import {
  FacilityStatus,
  FacilityType,
  facilityCatalog,
} from "@/lib/game/facilities";

type BoardFacility = {
  id: string;
  type: FacilityType;
  level: number;
  position: number;
  status: FacilityStatus;
  addons: string[];
};

type FacilityBoardProps = {
  columns: number;
  rows: number;
  facilities: BoardFacility[];
  selectedFacilityId: string | null;
  selectedBuildType: FacilityType | null;
  onCellClick: (position: number) => void;
  className?: string;
};

const mergeClasses = (
  base: string,
  extra?: string,
) => (extra ? `${base} ${extra}` : base);

export function FacilityBoard({
  columns,
  rows,
  facilities,
  selectedFacilityId,
  selectedBuildType,
  onCellClick,
  className,
}: FacilityBoardProps) {
  const totalCells = columns * rows;

  const facilityByPosition = useMemo(() => {
    const map = new Map<number, BoardFacility>();
    facilities.forEach((facility) => {
      map.set(facility.position, facility);
    });
    return map;
  }, [facilities]);

  return (
    <div
      className={mergeClasses(
        "grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-8",
        className,
      )}
    >
      {Array.from({ length: totalCells }, (_, position) => {
        const facility = facilityByPosition.get(position);
        const isSelected =
          facility && selectedFacilityId === facility.id;
        const Icon = facility ? facilityCatalog[facility.type].icon : null;

        return (
          <button
            key={position}
            type="button"
            onClick={() => onCellClick(position)}
            className={`relative flex aspect-square min-h-[72px] min-w-[72px] flex-col items-center justify-center rounded-2xl border text-xs transition sm:min-h-[80px] sm:min-w-[80px] lg:min-h-[88px] lg:min-w-[88px] ${
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
              R{Math.floor(position / columns) + 1}-C{(position % columns) + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}
