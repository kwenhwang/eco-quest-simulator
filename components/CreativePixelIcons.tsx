// 창의적인 픽셀 아트 아이콘 컬렉션
import React from 'react';

interface PixelIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

// 연구소 - 실험 장비가 반짝이는 애니메이션
export const CreativeResearchLab: React.FC<PixelIconProps> = ({ 
  size = 64, 
  className = "", 
  animated = true 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className={`w-full h-full ${animated ? 'animate-pulse' : ''}`}
        style={{
          background: `
            /* 건물 기본 구조 */
            radial-gradient(circle at 20% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 25% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 30% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 35% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 40% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 45% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 50% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 55% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 60% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 65% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 70% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 75% 80%, #4A90E2 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, #4A90E2 2px, transparent 2px),
            
            /* 창문 */
            radial-gradient(circle at 30% 65%, #2D3748 1.5px, transparent 1.5px),
            radial-gradient(circle at 35% 65%, #2D3748 1.5px, transparent 1.5px),
            radial-gradient(circle at 50% 65%, #2D3748 1.5px, transparent 1.5px),
            radial-gradient(circle at 55% 65%, #2D3748 1.5px, transparent 1.5px),
            radial-gradient(circle at 70% 65%, #2D3748 1.5px, transparent 1.5px),
            radial-gradient(circle at 75% 65%, #2D3748 1.5px, transparent 1.5px),
            
            /* 실험 장비 - 반짝이는 효과 */
            radial-gradient(circle at 40% 50%, #2E7D32 2px, transparent 2px),
            radial-gradient(circle at 42% 50%, #68D391 1px, transparent 1px),
            radial-gradient(circle at 60% 50%, #FF6B35 2px, transparent 2px),
            radial-gradient(circle at 62% 50%, #FBD38D 1px, transparent 1px),
            
            /* 지붕 */
            linear-gradient(45deg, #E53E3E 25%, transparent 25%),
            linear-gradient(-45deg, #C53030 25%, transparent 25%),
            
            /* 기본 배경 */
            linear-gradient(180deg, #EDF2F7 0%, #E2E8F0 100%)
          `,
          backgroundSize: `
            4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px,
            4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px,
            4px 4px, 4px 4px, 4px 4px, 4px 4px,
            8px 8px, 8px 8px,
            100% 100%
          `,
          imageRendering: 'pixelated' as const
        }}
      />
      
      {/* 반짝이는 파티클 효과 */}
      {animated && (
        <>
          <div 
            className="absolute animate-ping"
            style={{
              top: '45%',
              left: '38%',
              width: '4px',
              height: '4px',
              background: '#68D391',
              borderRadius: '50%',
              animationDuration: '2s'
            }}
          />
          <div 
            className="absolute animate-ping"
            style={{
              top: '45%',
              left: '58%',
              width: '4px',
              height: '4px',
              background: '#FBD38D',
              borderRadius: '50%',
              animationDelay: '1s',
              animationDuration: '2s'
            }}
          />
        </>
      )}
    </div>
  );
};
