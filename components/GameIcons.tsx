// AI 생성 SVG 아이콘 컴포넌트
import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// 연구소 아이콘
export const ResearchLabIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <rect x="4" y="20" width="24" height="8" fill="#4A90E2" rx="2"/>
    <rect x="8" y="12" width="16" height="8" fill="#7BB3F0" rx="1"/>
    <circle cx="12" cy="16" r="2" fill="#2E7D32"/>
    <circle cx="20" cy="16" r="2" fill="#FF6B35"/>
    <rect x="14" y="8" width="4" height="4" fill="#FFC107" rx="1"/>
    <path d="M16 8 L12 4 L20 4 Z" fill="#E53E3E"/>
  </svg>
);

// 태양광 발전소 아이콘
export const SolarPlantIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <rect x="6" y="18" width="20" height="10" fill="#2D3748" rx="1"/>
    <rect x="8" y="12" width="16" height="6" fill="#4299E1" rx="1"/>
    <rect x="10" y="14" width="12" height="2" fill="#63B3ED"/>
    <circle cx="16" cy="8" r="3" fill="#FBD38D"/>
    <path d="M16 5 L14 2 L18 2 Z" fill="#F6E05E"/>
    <path d="M19 8 L22 6 L22 10 Z" fill="#F6E05E"/>
    <path d="M13 8 L10 6 L10 10 Z" fill="#F6E05E"/>
  </svg>
);

// 풍력 발전소 아이콘
export const WindPlantIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <rect x="15" y="12" width="2" height="16" fill="#4A5568"/>
    <rect x="12" y="26" width="8" height="4" fill="#2D3748" rx="1"/>
    <circle cx="16" cy="12" r="1.5" fill="#E53E3E"/>
    <path d="M16 12 L20 8 L18 6 Z" fill="#F7FAFC" transform="rotate(0 16 12)"/>
    <path d="M16 12 L20 8 L18 6 Z" fill="#F7FAFC" transform="rotate(120 16 12)"/>
    <path d="M16 12 L20 8 L18 6 Z" fill="#F7FAFC" transform="rotate(240 16 12)"/>
  </svg>
);

// 주거 단지 아이콘
export const ResidentialIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <rect x="4" y="16" width="10" height="12" fill="#E53E3E" rx="1"/>
    <rect x="18" y="18" width="10" height="10" fill="#D69E2E" rx="1"/>
    <path d="M9 16 L4 10 L14 10 Z" fill="#C53030"/>
    <path d="M23 18 L18 12 L28 12 Z" fill="#B7791F"/>
    <rect x="6" y="20" width="2" height="3" fill="#2D3748"/>
    <rect x="10" y="20" width="2" height="3" fill="#2D3748"/>
    <rect x="20" y="22" width="2" height="3" fill="#2D3748"/>
    <rect x="24" y="22" width="2" height="3" fill="#2D3748"/>
  </svg>
);

// 상업 지구 아이콘
export const CommercialIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <rect x="6" y="8" width="8" height="20" fill="#4299E1" rx="1"/>
    <rect x="18" y="12" width="8" height="16" fill="#63B3ED" rx="1"/>
    <rect x="8" y="12" width="1" height="1" fill="#F7FAFC"/>
    <rect x="10" y="12" width="1" height="1" fill="#F7FAFC"/>
    <rect x="8" y="16" width="1" height="1" fill="#F7FAFC"/>
    <rect x="10" y="16" width="1" height="1" fill="#F7FAFC"/>
    <rect x="20" y="16" width="1" height="1" fill="#F7FAFC"/>
    <rect x="22" y="16" width="1" height="1" fill="#F7FAFC"/>
    <rect x="20" y="20" width="1" height="1" fill="#F7FAFC"/>
    <rect x="22" y="20" width="1" height="1" fill="#F7FAFC"/>
  </svg>
);

// 공원 아이콘
export const ParkIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <ellipse cx="16" cy="24" rx="12" ry="4" fill="#68D391"/>
    <rect x="15" y="16" width="2" height="8" fill="#8B4513"/>
    <circle cx="16" cy="16" r="6" fill="#38A169"/>
    <circle cx="12" cy="12" r="3" fill="#48BB78"/>
    <circle cx="20" cy="12" r="3" fill="#48BB78"/>
    <circle cx="16" cy="8" r="2" fill="#68D391"/>
    <rect x="8" y="26" width="16" height="2" fill="#A0AEC0" rx="1"/>
  </svg>
);

// 재활용 센터 아이콘
export const RecyclingIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <rect x="6" y="18" width="20" height="10" fill="#4A5568" rx="2"/>
    <rect x="8" y="20" width="16" height="6" fill="#68D391" rx="1"/>
    <path d="M16 16 L12 12 L14 10 L16 12 L18 10 L20 12 Z" fill="#38A169"/>
    <path d="M16 12 L20 16 L18 18 L16 16 L14 18 L12 16 Z" fill="#38A169"/>
    <circle cx="16" cy="14" r="1" fill="#F7FAFC"/>
    <rect x="10" y="22" width="2" height="2" fill="#2D3748"/>
    <rect x="14" y="22" width="2" height="2" fill="#2D3748"/>
    <rect x="18" y="22" width="2" height="2" fill="#2D3748"/>
  </svg>
);

// 자원 아이콘들
export const MoneyIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="10" fill="#F6E05E"/>
    <path d="M12 6 L12 8 M12 16 L12 18 M8 12 L16 12 M10 10 L14 10 M10 14 L14 14" 
          stroke="#2D3748" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const EnergyIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 L13 2 Z" 
          fill="#FBD38D" stroke="#D69E2E" strokeWidth="1"/>
  </svg>
);

export const PopulationIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <circle cx="9" cy="7" r="4" fill="#4299E1"/>
    <circle cx="15" cy="7" r="4" fill="#63B3ED"/>
    <path d="M3 21 C3 17 6 14 9 14 C12 14 15 17 15 21" fill="#4299E1"/>
    <path d="M9 21 C9 17 12 14 15 14 C18 14 21 17 21 21" fill="#63B3ED"/>
  </svg>
);
