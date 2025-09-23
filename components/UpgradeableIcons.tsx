// 업그레이드 가능한 시설 아이콘 시스템
import React from 'react';

interface UpgradeableIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
  level?: number;        // 1-5 레벨
  addons?: string[];     // 애드온 시설 목록
  efficiency?: number;   // 0-100% 효율성
}

// 업그레이드 가능한 연구소
export const UpgradeableResearchLab: React.FC<UpgradeableIconProps> = ({ 
  size = 64, 
  className = "", 
  animated = true,
  level = 1,
  addons = [],
  efficiency = 100
}) => {
  // 레벨별 색상 변화
  const levelColors = {
    1: { primary: '#4A90E2', secondary: '#2E7D32', accent: '#FFC107' },
    2: { primary: '#5BA3F5', secondary: '#43A047', accent: '#FFD54F' },
    3: { primary: '#6CB6FF', secondary: '#66BB6A', accent: '#FFE082' },
    4: { primary: '#81C784', secondary: '#81C784', accent: '#FFECB3' },
    5: { primary: '#A5D6A7', secondary: '#C8E6C9', accent: '#FFF9C4' }
  };

  const colors = levelColors[level as keyof typeof levelColors] || levelColors[1];
  const sizeMultiplier = 1 + (level - 1) * 0.1; // 레벨당 10% 크기 증가

  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size * sizeMultiplier, height: size * sizeMultiplier }}
    >
      {/* 메인 건물 */}
      <div
        className={`w-full h-full ${animated ? 'animate-pulse' : ''}`}
        style={{
          background: `
            /* 건물 기본 구조 - 레벨별 색상 */
            radial-gradient(circle at 20% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 25% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 30% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 35% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 40% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 45% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 50% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 55% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 60% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 65% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 70% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 75% 80%, ${colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, ${colors.primary} 2px, transparent 2px),
            
            /* 실험 장비 - 레벨별 개수 증가 */
            ${Array.from({ length: level }, (_, i) => 
              `radial-gradient(circle at ${35 + i * 10}% 50%, ${colors.secondary} 2px, transparent 2px),
               radial-gradient(circle at ${37 + i * 10}% 50%, ${colors.accent} 1px, transparent 1px)`
            ).join(', ')},
            
            /* 기본 배경 */
            linear-gradient(180deg, #EDF2F7 0%, #E2E8F0 100%)
          `,
          backgroundSize: `4px 4px`,
          imageRendering: 'pixelated' as const,
          animationDuration: `${3 - level * 0.3}s` // 레벨이 높을수록 빠른 애니메이션
        }}
      />

      {/* 레벨 표시 */}
      <div
        className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center justify-center"
        style={{
          width: `${size * 0.25}px`,
          height: `${size * 0.25}px`,
          fontSize: `${size * 0.15}px`
        }}
      >
        {level}
      </div>

      {/* 효율성 표시 바 */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gray-700 rounded-b"
        style={{ height: `${size * 0.08}px` }}
      >
        <div
          className={`h-full rounded-b transition-all duration-1000 ${
            efficiency >= 80 ? 'bg-green-500' : 
            efficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${efficiency}%` }}
        />
      </div>

      {/* 애드온 시설들 */}
      {addons.map((addon, index) => (
        <div
          key={addon}
          className={`absolute ${animated ? 'animate-bounce' : ''}`}
          style={{
            top: `${-20 - index * 15}%`,
            right: `${-15 - index * 10}%`,
            width: `${size * 0.3}px`,
            height: `${size * 0.3}px`,
            animationDelay: `${index * 0.5}s`
          }}
        >
          {addon === 'antenna' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `
                  linear-gradient(90deg, transparent 45%, #718096 45%, #718096 55%, transparent 55%),
                  radial-gradient(circle at 50% 20%, #E53E3E 30%, transparent 30%)
                `,
                backgroundSize: '100% 100%'
              }}
            />
          )}
          {addon === 'solar' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `
                  linear-gradient(45deg, #4299E1 25%, #63B3ED 25%, #63B3ED 50%, #4299E1 50%, #4299E1 75%, #63B3ED 75%)
                `,
                backgroundSize: '4px 4px'
              }}
            />
          )}
          {addon === 'storage' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#4A5568',
                borderRadius: '20%'
              }}
            />
          )}
        </div>
      ))}

      {/* 연결선 (애드온이 있을 때) */}
      {addons.length > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '150%', height: '150%', top: '-25%', left: '-25%' }}
        >
          {addons.map((_, index) => (
            <line
              key={index}
              x1="60%"
              y1="40%"
              x2={`${85 + index * 10}%`}
              y2={`${15 + index * 15}%`}
              stroke="#718096"
              strokeWidth="2"
              strokeDasharray="4,2"
              className={animated ? 'animate-pulse' : ''}
            />
          ))}
        </svg>
      )}

      {/* 레벨업 파티클 효과 */}
      {animated && level > 1 && (
        <>
          {Array.from({ length: level }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                top: `${20 + i * 15}%`,
                left: `${20 + i * 15}%`,
                width: '4px',
                height: '4px',
                background: colors.accent,
                borderRadius: '50%',
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

// 업그레이드 가능한 태양광 발전소
export const UpgradeableSolarPlant: React.FC<UpgradeableIconProps> = ({ 
  size = 64, 
  className = "", 
  animated = true,
  level = 1,
  addons = [],
  efficiency = 100
}) => {
  const panelCount = Math.min(level * 2, 8); // 레벨당 패널 2개씩 증가
  const sizeMultiplier = 1 + (level - 1) * 0.15;

  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size * sizeMultiplier, height: size * sizeMultiplier }}
    >
      {/* 태양 - 레벨별 크기 증가 */}
      <div
        className={`absolute ${animated ? 'animate-spin' : ''}`}
        style={{
          top: '10%',
          left: '40%',
          width: `${15 + level * 2}%`,
          height: `${15 + level * 2}%`,
          background: `
            radial-gradient(circle at 50% 50%, 
              #FBD38D 40%, 
              #F6E05E 60%, 
              transparent 70%
            )
          `,
          borderRadius: '50%',
          animationDuration: `${8 - level}s`
        }}
      >
        {/* 태양 광선 - 레벨별 개수 증가 */}
        <div className="absolute inset-0">
          {Array.from({ length: 4 + level * 2 }, (_, i) => (
            <div
              key={i}
              className={`absolute ${animated ? 'animate-pulse' : ''}`}
              style={{
                top: '50%',
                left: '50%',
                width: '2px',
                height: `${8 + level * 2}px`,
                background: '#F6E05E',
                transformOrigin: '1px 0px',
                transform: `rotate(${(360 / (4 + level * 2)) * i}deg) translateY(-${12 + level * 2}px)`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* 태양광 패널 배열 - 레벨별 개수 증가 */}
      <div className="absolute" style={{ top: '50%', left: '10%', width: '80%', height: '30%' }}>
        {Array.from({ length: panelCount }, (_, i) => (
          <div
            key={i}
            className={`absolute ${animated ? 'animate-pulse' : ''}`}
            style={{
              left: `${(i % 4) * 20}%`,
              top: `${Math.floor(i / 4) * 60}%`,
              width: '18%',
              height: '50%',
              background: `
                linear-gradient(90deg, 
                  #4299E1 0%, #63B3ED 50%, #4299E1 100%
                )
              `,
              border: '1px solid #2B6CB0',
              animationDelay: `${i * 0.2}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* 레벨 표시 */}
      <div
        className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center justify-center"
        style={{
          width: `${size * 0.25}px`,
          height: `${size * 0.25}px`,
          fontSize: `${size * 0.15}px`
        }}
      >
        {level}
      </div>

      {/* 에너지 생산량 표시 */}
      <div
        className={`absolute ${animated ? 'animate-bounce' : ''}`}
        style={{
          top: '30%',
          right: '10%',
          fontSize: `${size * 0.12}px`,
          color: '#68D391',
          fontWeight: 'bold'
        }}
      >
        +{level * 50}⚡
      </div>

      {/* 애드온 배터리 저장소 */}
      {addons.includes('battery') && (
        <div
          className={`absolute ${animated ? 'animate-pulse' : ''}`}
          style={{
            bottom: '10%',
            right: '-20%',
            width: `${size * 0.4}px`,
            height: `${size * 0.3}px`,
            background: 'linear-gradient(180deg, #4A5568 0%, #2D3748 100%)',
            borderRadius: '4px'
          }}
        >
          {/* 배터리 충전 표시 */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-green-400 rounded-b"
            style={{ height: `${efficiency}%` }}
          />
        </div>
      )}

      {/* 애드온 인버터 */}
      {addons.includes('inverter') && (
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '-15%',
            width: `${size * 0.25}px`,
            height: `${size * 0.25}px`,
            background: '#718096',
            borderRadius: '2px'
          }}
        >
          <div
            className={`w-full h-full ${animated ? 'animate-ping' : ''}`}
            style={{
              background: 'radial-gradient(circle at 50% 50%, #68D391 30%, transparent 30%)',
              animationDuration: '1s'
            }}
          />
        </div>
      )}
    </div>
  );
};

// 시설 업그레이드 정보 컴포넌트
export const FacilityUpgradeInfo: React.FC<{
  facilityName: string;
  currentLevel: number;
  maxLevel: number;
  upgradeCost: number;
  nextLevelBenefits: string[];
  availableAddons: Array<{
    name: string;
    cost: number;
    benefit: string;
    installed: boolean;
  }>;
}> = ({ 
  facilityName, 
  currentLevel, 
  maxLevel, 
  upgradeCost, 
  nextLevelBenefits, 
  availableAddons 
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
      <h3 className="text-lg font-bold mb-3">{facilityName} 업그레이드</h3>
      
      {/* 현재 레벨 */}
      <div className="flex items-center gap-2 mb-3">
        <span>레벨:</span>
        <div className="flex gap-1">
          {Array.from({ length: maxLevel }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentLevel ? 'bg-yellow-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-300">
          ({currentLevel}/{maxLevel})
        </span>
      </div>

      {/* 다음 레벨 혜택 */}
      {currentLevel < maxLevel && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">레벨 {currentLevel + 1} 혜택:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            {nextLevelBenefits.map((benefit, i) => (
              <li key={i}>• {benefit}</li>
            ))}
          </ul>
          <div className="mt-2 text-yellow-400 font-semibold">
            업그레이드 비용: {upgradeCost.toLocaleString()}💰
          </div>
        </div>
      )}

      {/* 애드온 시설 */}
      <div>
        <h4 className="font-semibold mb-2">애드온 시설:</h4>
        <div className="space-y-2">
          {availableAddons.map((addon, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-2 rounded ${
                addon.installed ? 'bg-green-500/20' : 'bg-gray-500/20'
              }`}
            >
              <div>
                <div className="font-medium">{addon.name}</div>
                <div className="text-xs text-gray-300">{addon.benefit}</div>
              </div>
              <div className="text-right">
                {addon.installed ? (
                  <span className="text-green-400 text-sm">설치됨</span>
                ) : (
                  <span className="text-yellow-400 text-sm">
                    {addon.cost.toLocaleString()}💰
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
