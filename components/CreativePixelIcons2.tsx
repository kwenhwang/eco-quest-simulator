// 창의적인 픽셀 아트 아이콘 - 태양광 발전소와 풍력 발전소
import React from 'react';

interface PixelIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

// 태양광 발전소 - 태양이 움직이고 패널이 반짝이는 효과
export const CreativeSolarPlant: React.FC<PixelIconProps> = ({ 
  size = 64, 
  className = "", 
  animated = true 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 태양 - 회전 애니메이션 */}
      <div
        className={`absolute ${animated ? 'animate-spin' : ''}`}
        style={{
          top: '15%',
          left: '45%',
          width: '20%',
          height: '20%',
          background: `
            radial-gradient(circle at 50% 50%, #FBD38D 40%, #F6E05E 60%, transparent 70%)
          `,
          borderRadius: '50%',
          animationDuration: '8s'
        }}
      >
        {/* 태양 광선 */}
        <div className="absolute inset-0">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <div
              key={i}
              className={`absolute ${animated ? 'animate-pulse' : ''}`}
              style={{
                top: '50%',
                left: '50%',
                width: '2px',
                height: '8px',
                background: '#F6E05E',
                transformOrigin: '1px 0px',
                transform: `rotate(${angle}deg) translateY(-12px)`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* 태양광 패널 */}
      <div
        className={`absolute ${animated ? 'animate-pulse' : ''}`}
        style={{
          top: '55%',
          left: '20%',
          width: '60%',
          height: '25%',
          background: `
            linear-gradient(90deg, 
              #4299E1 0%, #63B3ED 20%, #4299E1 40%, 
              #63B3ED 60%, #4299E1 80%, #63B3ED 100%
            )
          `,
          border: '2px solid #2B6CB0',
          animationDuration: '3s'
        }}
      >
        {/* 패널 격자 */}
        <div className="absolute inset-0 grid grid-cols-4 gap-1 p-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`bg-blue-300 ${animated ? 'animate-ping' : ''}`}
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* 지지대 */}
      <div
        style={{
          position: 'absolute',
          top: '75%',
          left: '47%',
          width: '6%',
          height: '20%',
          background: 'linear-gradient(180deg, #4A5568 0%, #2D3748 100%)'
        }}
      />

      {/* 기초 */}
      <div
        style={{
          position: 'absolute',
          top: '90%',
          left: '35%',
          width: '30%',
          height: '8%',
          background: 'linear-gradient(90deg, #718096 0%, #4A5568 50%, #2D3748 100%)',
          borderRadius: '2px'
        }}
      />

      {/* 에너지 파티클 효과 */}
      {animated && (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                top: `${60 + i * 2}%`,
                left: `${45 + i * 2}%`,
                width: '3px',
                height: '3px',
                background: '#F6E05E',
                borderRadius: '50%',
                animationDelay: `${i * 0.4}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

// 풍력 발전소 - 날개가 회전하고 바람 효과
export const CreativeWindPlant: React.FC<PixelIconProps> = ({ 
  size = 64, 
  className = "", 
  animated = true 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 타워 */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '48%',
          width: '4%',
          height: '50%',
          background: 'linear-gradient(180deg, #E2E8F0 0%, #A0AEC0 50%, #4A5568 100%)'
        }}
      />

      {/* 회전하는 풍차 날개 */}
      <div
        className={`absolute ${animated ? 'animate-spin' : ''}`}
        style={{
          top: '35%',
          left: '45%',
          width: '10%',
          height: '10%',
          animationDuration: '2s'
        }}
      >
        {/* 중심부 */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '40%',
            width: '20%',
            height: '20%',
            background: '#E53E3E',
            borderRadius: '50%'
          }}
        />
        
        {/* 3개의 날개 */}
        {[0, 120, 240].map((angle, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2px',
              height: '20px',
              background: 'linear-gradient(180deg, #F7FAFC 0%, #E2E8F0 100%)',
              transformOrigin: '1px 0px',
              transform: `rotate(${angle}deg) translateY(-10px)`,
              borderRadius: '1px'
            }}
          />
        ))}
      </div>

      {/* 기초 */}
      <div
        style={{
          position: 'absolute',
          top: '85%',
          left: '35%',
          width: '30%',
          height: '12%',
          background: 'linear-gradient(90deg, #4A5568 0%, #2D3748 50%, #1A202C 100%)',
          borderRadius: '2px'
        }}
      />

      {/* 바람 효과 라인들 */}
      {animated && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                top: `${20 + i * 8}%`,
                left: `${10 + i * 2}%`,
                width: `${15 + i * 3}px`,
                height: '1px',
                background: `rgba(160, 174, 192, ${0.8 - i * 0.1})`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </>
      )}

      {/* 에너지 생산 표시 */}
      {animated && (
        <div
          className="absolute animate-ping"
          style={{
            top: '30%',
            right: '20%',
            width: '6px',
            height: '6px',
            background: '#68D391',
            borderRadius: '50%',
            animationDuration: '3s'
          }}
        />
      )}
    </div>
  );
};
