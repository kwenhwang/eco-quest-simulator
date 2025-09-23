// 창의적인 자원 아이콘들 - 애니메이션과 특수 효과
import React from 'react';

interface ResourceIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
  value?: string | number;
}

// 돈 아이콘 - 동전이 회전하고 반짝이는 효과
export const CreativeMoneyIcon: React.FC<ResourceIconProps> = ({ 
  size = 32, 
  className = "", 
  animated = true,
  value 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center gap-2 ${className}`}
    >
      <div
        className={`relative ${animated ? 'animate-spin' : ''}`}
        style={{ 
          width: size, 
          height: size,
          animationDuration: '3s'
        }}
      >
        {/* 동전 기본 */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 30% 30%, #FBD38D 0%, #F6E05E 40%, #D69E2E 100%)
            `,
            borderRadius: '50%',
            border: '2px solid #B7791F',
            position: 'relative'
          }}
        >
          {/* 달러 사인 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              height: '60%',
              background: '#2D3748',
              clipPath: `
                polygon(
                  40% 10%, 60% 10%, 60% 25%, 80% 25%, 80% 40%, 60% 40%, 
                  60% 60%, 80% 60%, 80% 75%, 60% 75%, 60% 90%, 40% 90%, 
                  40% 75%, 20% 75%, 20% 60%, 40% 60%, 40% 40%, 20% 40%, 
                  20% 25%, 40% 25%
                )
              `
            }}
          />
          
          {/* 반짝이는 효과 */}
          {animated && (
            <>
              <div
                className="absolute animate-ping"
                style={{
                  top: '20%',
                  right: '20%',
                  width: '6px',
                  height: '6px',
                  background: '#F7FAFC',
                  borderRadius: '50%',
                  animationDuration: '2s'
                }}
              />
              <div
                className="absolute animate-ping"
                style={{
                  bottom: '25%',
                  left: '25%',
                  width: '4px',
                  height: '4px',
                  background: '#F7FAFC',
                  borderRadius: '50%',
                  animationDelay: '1s',
                  animationDuration: '2s'
                }}
              />
            </>
          )}
        </div>
      </div>
      
      {value && (
        <span className="font-bold text-yellow-600">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      )}
    </div>
  );
};

// 에너지 아이콘 - 번개가 번쩍이고 전기가 흐르는 효과
export const CreativeEnergyIcon: React.FC<ResourceIconProps> = ({ 
  size = 32, 
  className = "", 
  animated = true,
  value 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center gap-2 ${className}`}
    >
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* 번개 모양 */}
        <div
          className={`absolute inset-0 ${animated ? 'animate-pulse' : ''}`}
          style={{
            background: `
              linear-gradient(45deg, 
                #FBD38D 0%, #F6E05E  30%, #ECC94B  60%, #D69E2E 100%
              )
            `,
            clipPath: `
              polygon(
                40% 0%, 60% 0%, 45% 35%, 70% 35%, 30% 100%, 
                50% 100%, 35% 65%, 10% 65%
              )
            `,
            animationDuration: '1.5s'
          }}
        />
        
        {/* 전기 스파크 효과 */}
        {animated && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  top: `${20 + i * 10}%`,
                  left: `${15 + i * 12}%`,
                  width: '2px',
                  height: '2px',
                  background: '#F7FAFC',
                  borderRadius: '50%',
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </>
        )}
        
        {/* 외곽 글로우 효과 */}
        {animated && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: `
                radial-gradient(circle, 
                  rgba(251, 211, 141, 0.3) 0%, 
                  rgba(251, 211, 141, 0.1) 50%, 
                  transparent 70%
                )
              `,
              animationDuration: '2s'
            }}
          />
        )}
      </div>
      
      {value && (
        <span className="font-bold text-yellow-500">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      )}
    </div>
  );
};

// 인구 아이콘 - 사람들이 움직이고 증가하는 효과
export const CreativePopulationIcon: React.FC<ResourceIconProps> = ({ 
  size = 32, 
  className = "", 
  animated = true,
  value 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center gap-2 ${className}`}
    >
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* 사람들 그룹 */}
        <div className="absolute inset-0 grid grid-cols-3 gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`relative ${animated ? 'animate-bounce' : ''}`}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              {/* 머리 */}
              <div
                style={{
                  width: '40%',
                  height: '40%',
                  background: ['#4299E1', '#63B3ED', '#90CDF4'][i % 3],
                  borderRadius: '50%',
                  margin: '0 auto'
                }}
              />
              
              {/* 몸 */}
              <div
                style={{
                  width: '60%',
                  height: '60%',
                  background: ['#4299E1', '#63B3ED', '#90CDF4'][i % 3],
                  borderRadius: '20% 20% 50% 50%',
                  margin: '0 auto'
                }}
              />
            </div>
          ))}
        </div>
        
        {/* 인구 증가 효과 */}
        {animated && (
          <>
            <div
              className="absolute animate-ping"
              style={{
                top: '10%',
                right: '10%',
                width: '6px',
                height: '6px',
                background: '#68D391',
                borderRadius: '50%',
                animationDuration: '3s'
              }}
            />
            <div
              className="absolute animate-ping"
              style={{
                bottom: '10%',
                left: '10%',
                width: '4px',
                height: '4px',
                background: '#68D391',
                borderRadius: '50%',
                animationDelay: '1.5s',
                animationDuration: '3s'
              }}
            />
          </>
        )}
        
        {/* 플러스 아이콘 (인구 증가 표시) */}
        {animated && (
          <div
            className="absolute animate-pulse"
            style={{
              top: '5%',
              right: '5%',
              width: '8px',
              height: '8px',
              background: `
                linear-gradient(90deg, transparent 40%, #68D391 40%, #68D391 60%, transparent 60%),
                linear-gradient(0deg, transparent 40%, #68D391 40%, #68D391 60%, transparent 60%)
              `,
              animationDuration: '2s'
            }}
          />
        )}
      </div>
      
      {value && (
        <span className="font-bold text-blue-600">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      )}
    </div>
  );
};

// 통합 자원 패널 컴포넌트
export const CreativeResourcePanel: React.FC<{
  money?: number;
  energy?: string;
  population?: number;
  animated?: boolean;
  className?: string;
}> = ({ 
  money = 0, 
  energy = "0/0", 
  population = 0, 
  animated = true, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-lg shadow-lg ${className}`}>
      <CreativeMoneyIcon 
        size={28} 
        animated={animated} 
        value={money}
      />
      <CreativeEnergyIcon 
        size={28} 
        animated={animated} 
        value={energy}
      />
      <CreativePopulationIcon 
        size={28} 
        animated={animated} 
        value={population}
      />
    </div>
  );
};
