// 픽셀 아트 스타일 아이콘 (CSS 기반)
import React from 'react';

interface PixelIconProps {
  size?: number;
  className?: string;
}

// 32x32 픽셀 아트 - 연구소
export const PixelResearchLab: React.FC<PixelIconProps> = ({ size = 32, className = "" }) => {
  const scale = size / 32;
  
  return (
    <div 
      className={`pixel-icon ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        imageRendering: 'pixelated'
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          boxShadow: `
            /* 건물 기본 구조 */
            4px 20px 0 0 #4A90E2,
            5px 20px 0 0 #4A90E2,
            6px 20px 0 0 #4A90E2,
            7px 20px 0 0 #4A90E2,
            8px 20px 0 0 #4A90E2,
            9px 20px 0 0 #4A90E2,
            10px 20px 0 0 #4A90E2,
            11px 20px 0 0 #4A90E2,
            12px 20px 0 0 #4A90E2,
            13px 20px 0 0 #4A90E2,
            14px 20px 0 0 #4A90E2,
            15px 20px 0 0 #4A90E2,
            16px 20px 0 0 #4A90E2,
            17px 20px 0 0 #4A90E2,
            18px 20px 0 0 #4A90E2,
            19px 20px 0 0 #4A90E2,
            20px 20px 0 0 #4A90E2,
            21px 20px 0 0 #4A90E2,
            22px 20px 0 0 #4A90E2,
            23px 20px 0 0 #4A90E2,
            24px 20px 0 0 #4A90E2,
            25px 20px 0 0 #4A90E2,
            26px 20px 0 0 #4A90E2,
            27px 20px 0 0 #4A90E2,
            
            /* 창문 */
            8px 16px 0 0 #2D3748,
            9px 16px 0 0 #2D3748,
            12px 16px 0 0 #2D3748,
            13px 16px 0 0 #2D3748,
            16px 16px 0 0 #2D3748,
            17px 16px 0 0 #2D3748,
            20px 16px 0 0 #2D3748,
            21px 16px 0 0 #2D3748,
            
            /* 실험 장비 */
            10px 12px 0 0 #2E7D32,
            11px 12px 0 0 #2E7D32,
            10px 11px 0 0 #2E7D32,
            11px 11px 0 0 #2E7D32,
            
            18px 12px 0 0 #FF6B35,
            19px 12px 0 0 #FF6B35,
            18px 11px 0 0 #FF6B35,
            19px 11px 0 0 #FF6B35,
            
            /* 지붕 */
            14px 8px 0 0 #E53E3E,
            15px 8px 0 0 #E53E3E,
            16px 8px 0 0 #E53E3E,
            17px 8px 0 0 #E53E3E,
            13px 9px 0 0 #E53E3E,
            18px 9px 0 0 #E53E3E,
            12px 10px 0 0 #E53E3E,
            19px 10px 0 0 #E53E3E
          `
        }}
      />
    </div>
  );
};

// 32x32 픽셀 아트 - 태양광 발전소
export const PixelSolarPlant: React.FC<PixelIconProps> = ({ size = 32, className = "" }) => {
  const scale = size / 32;
  
  return (
    <div 
      className={`pixel-icon ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        imageRendering: 'pixelated'
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          boxShadow: `
            /* 태양광 패널 */
            6px 18px 0 0 #4299E1,
            7px 18px 0 0 #4299E1,
            8px 18px 0 0 #4299E1,
            9px 18px 0 0 #4299E1,
            10px 18px 0 0 #4299E1,
            11px 18px 0 0 #4299E1,
            12px 18px 0 0 #4299E1,
            13px 18px 0 0 #4299E1,
            14px 18px 0 0 #4299E1,
            15px 18px 0 0 #4299E1,
            16px 18px 0 0 #4299E1,
            17px 18px 0 0 #4299E1,
            18px 18px 0 0 #4299E1,
            19px 18px 0 0 #4299E1,
            20px 18px 0 0 #4299E1,
            21px 18px 0 0 #4299E1,
            22px 18px 0 0 #4299E1,
            23px 18px 0 0 #4299E1,
            24px 18px 0 0 #4299E1,
            25px 18px 0 0 #4299E1,
            
            /* 패널 격자 */
            10px 16px 0 0 #63B3ED,
            14px 16px 0 0 #63B3ED,
            18px 16px 0 0 #63B3ED,
            22px 16px 0 0 #63B3ED,
            
            /* 지지대 */
            15px 20px 0 0 #2D3748,
            16px 20px 0 0 #2D3748,
            15px 21px 0 0 #2D3748,
            16px 21px 0 0 #2D3748,
            15px 22px 0 0 #2D3748,
            16px 22px 0 0 #2D3748,
            15px 23px 0 0 #2D3748,
            16px 23px 0 0 #2D3748,
            15px 24px 0 0 #2D3748,
            16px 24px 0 0 #2D3748,
            
            /* 기초 */
            12px 26px 0 0 #4A5568,
            13px 26px 0 0 #4A5568,
            14px 26px 0 0 #4A5568,
            15px 26px 0 0 #4A5568,
            16px 26px 0 0 #4A5568,
            17px 26px 0 0 #4A5568,
            18px 26px 0 0 #4A5568,
            19px 26px 0 0 #4A5568,
            
            /* 태양 */
            16px 8px 0 0 #FBD38D,
            15px 9px 0 0 #FBD38D,
            16px 9px 0 0 #FBD38D,
            17px 9px 0 0 #FBD38D,
            14px 10px 0 0 #FBD38D,
            15px 10px 0 0 #FBD38D,
            16px 10px 0 0 #FBD38D,
            17px 10px 0 0 #FBD38D,
            18px 10px 0 0 #FBD38D,
            
            /* 태양 광선 */
            16px 6px 0 0 #F6E05E,
            14px 8px 0 0 #F6E05E,
            18px 8px 0 0 #F6E05E,
            12px 10px 0 0 #F6E05E,
            20px 10px 0 0 #F6E05E
          `
        }}
      />
    </div>
  );
};

// 픽셀 아트 아이콘 컬렉션
export const PixelIconCollection = {
  ResearchLab: PixelResearchLab,
  SolarPlant: PixelSolarPlant,
  // 추가 아이콘들...
};
