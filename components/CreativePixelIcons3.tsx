// 창의적인 픽셀 아트 아이콘 - 주거, 상업, 공원, 재활용
import React from 'react';

interface PixelIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

// 주거 단지 - 연기가 나오고 창문에 불이 켜지는 효과
export const CreativeResidential: React.FC<PixelIconProps> = ({ 
  size = 64, 
  className = "", 
  animated = true 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 첫 번째 집 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          width: '35%',
          height: '40%',
          background: 'linear-gradient(180deg, #E53E3E 0%, #C53030 100%)'
        }}
      >
        {/* 지붕 */}
        <div
          style={{
            position: 'absolute',
            top: '-40%',
            left: '-10%',
            width: '120%',
            height: '50%',
            background: 'linear-gradient(45deg, #C53030 25%, #9C2A2A 75%)',
            clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
          }}
        />
        
        {/* 창문 - 깜빡이는 효과 */}
        <div
          className={`absolute ${animated ? 'animate-pulse' : ''}`}
          style={{
            top: '30%',
            left: '20%',
            width: '25%',
            height: '25%',
            background: animated ? '#FBD38D' : '#2D3748',
            animationDuration: '3s'
          }}
        />
        <div
          className={`absolute ${animated ? 'animate-pulse' : ''}`}
          style={{
            top: '30%',
            right: '20%',
            width: '25%',
            height: '25%',
            background: animated ? '#FBD38D' : '#2D3748',
            animationDelay: '1s',
            animationDuration: '3s'
          }}
        />
        
        {/* 문 */}
        <div
          style={{
            position: 'absolute',
            bottom: '0%',
            left: '35%',
            width: '30%',
            height: '50%',
            background: '#8B4513'
          }}
        />
      </div>

      {/* 두 번째 집 */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          right: '10%',
          width: '40%',
          height: '45%',
          background: 'linear-gradient(180deg, #D69E2E 0%, #B7791F 100%)'
        }}
      >
        {/* 지붕 */}
        <div
          style={{
            position: 'absolute',
            top: '-35%',
            left: '-5%',
            width: '110%',
            height: '45%',
            background: 'linear-gradient(45deg, #B7791F 25%, #975A16 75%)',
            clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
          }}
        />
        
        {/* 창문들 */}
        <div
          className={`absolute ${animated ? 'animate-pulse' : ''}`}
          style={{
            top: '25%',
            left: '15%',
            width: '20%',
            height: '20%',
            background: animated ? '#FBD38D' : '#2D3748',
            animationDelay: '2s',
            animationDuration: '3s'
          }}
        />
        <div
          className={`absolute ${animated ? 'animate-pulse' : ''}`}
          style={{
            top: '25%',
            right: '15%',
            width: '20%',
            height: '20%',
            background: animated ? '#FBD38D' : '#2D3748',
            animationDelay: '0.5s',
            animationDuration: '3s'
          }}
        />
      </div>

      {/* 굴뚝 연기 */}
      {animated && (
        <>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                top: `${25 - i * 5}%`,
                left: `${35 + i * 2}%`,
                width: `${3 + i}px`,
                height: `${3 + i}px`,
                background: `rgba(160, 174, 192, ${0.8 - i * 0.2})`,
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

// 상업 지구 - 네온사인 효과와 사람들 움직임
export const CreativeCommercial: React.FC<PixelIconProps> = ({ 
  size = 64, 
  className = "", 
  animated = true 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 첫 번째 빌딩 */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '25%',
          height: '70%',
          background: 'linear-gradient(180deg, #4299E1 0%, #3182CE 100%)'
        }}
      >
        {/* 창문들 - 네온 효과 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`absolute ${animated ? 'animate-pulse' : ''}`}
            style={{
              top: `${15 + (i % 4) * 20}%`,
              left: `${20 + Math.floor(i / 4) * 30}%`,
              width: '20%',
              height: '15%',
              background: animated ? (i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#FF1493' : '#32CD32') : '#2D3748',
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      {/* 두 번째 빌딩 */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '15%',
          width: '30%',
          height: '60%',
          background: 'linear-gradient(180deg, #63B3ED 0%, #4299E1 100%)'
        }}
      >
        {/* 창문들 */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={`absolute ${animated ? 'animate-ping' : ''}`}
            style={{
              top: `${10 + (i % 5) * 18}%`,
              left: `${15 + Math.floor(i / 5) * 25}%`,
              width: '18%',
              height: '12%',
              background: animated ? '#FBD38D' : '#2D3748',
              animationDelay: `${i * 0.15}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* 움직이는 사람들 (점으로 표현) */}
      {animated && (
        <>
          <div
            className="absolute animate-bounce"
            style={{
              bottom: '5%',
              left: '20%',
              width: '3px',
              height: '6px',
              background: '#E53E3E',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animationDuration: '1.5s'
            }}
          />
          <div
            className="absolute animate-bounce"
            style={{
              bottom: '5%',
              right: '30%',
              width: '3px',
              height: '6px',
              background: '#38A169',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animationDelay: '0.7s',
              animationDuration: '1.5s'
            }}
          />
        </>
      )}
    </div>
  );
};

// 공원 - 나무가 흔들리고 새가 날아다니는 효과
export const CreativePark: React.FC<PixelIconProps> = ({ 
  size = 64, 
  className = "", 
  animated = true 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 잔디밭 */}
      <div
        style={{
          position: 'absolute',
          bottom: '0%',
          left: '0%',
          width: '100%',
          height: '30%',
          background: 'linear-gradient(180deg, #68D391 0%, #38A169 100%)'
        }}
      />

      {/* 큰 나무 */}
      <div
        className={`relative ${animated ? 'animate-pulse' : ''}`}
        style={{
          position: 'absolute',
          top: '25%',
          left: '40%',
          width: '20%',
          height: '50%',
          animationDuration: '4s'
        }}
      >
        {/* 나무 줄기 */}
        <div
          style={{
            position: 'absolute',
            bottom: '0%',
            left: '40%',
            width: '20%',
            height: '40%',
            background: 'linear-gradient(180deg, #8B4513 0%, #654321 100%)'
          }}
        />
        
        {/* 나무 잎 - 흔들리는 효과 */}
        <div
          className={`absolute ${animated ? 'animate-bounce' : ''}`}
          style={{
            top: '0%',
            left: '10%',
            width: '80%',
            height: '70%',
            background: 'radial-gradient(circle, #38A169 30%, #48BB78 60%, #68D391 90%)',
            borderRadius: '50%',
            animationDuration: '3s'
          }}
        />
      </div>

      {/* 작은 나무들 */}
      <div
        className={`absolute ${animated ? 'animate-pulse' : ''}`}
        style={{
          top: '40%',
          left: '15%',
          width: '15%',
          height: '35%',
          animationDelay: '1s',
          animationDuration: '4s'
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '0%',
            left: '40%',
            width: '20%',
            height: '30%',
            background: '#8B4513'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '60%',
            height: '60%',
            background: '#48BB78',
            borderRadius: '50%'
          }}
        />
      </div>

      <div
        className={`absolute ${animated ? 'animate-pulse' : ''}`}
        style={{
          top: '45%',
          right: '15%',
          width: '12%',
          height: '30%',
          animationDelay: '2s',
          animationDuration: '4s'
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '0%',
            left: '40%',
            width: '20%',
            height: '25%',
            background: '#8B4513'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '50%',
            height: '50%',
            background: '#48BB78',
            borderRadius: '50%'
          }}
        />
      </div>

      {/* 벤치 */}
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '20%',
          height: '8%',
          background: '#8B4513'
        }}
      />

      {/* 날아다니는 새들 */}
      {animated && (
        <>
          <div
            className="absolute animate-ping"
            style={{
              top: '15%',
              left: '20%',
              width: '2px',
              height: '2px',
              background: '#2D3748',
              borderRadius: '50%',
              animationDuration: '2s'
            }}
          />
          <div
            className="absolute animate-ping"
            style={{
              top: '20%',
              right: '25%',
              width: '2px',
              height: '2px',
              background: '#2D3748',
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

// 재활용 센터 - 재활용 마크가 회전하고 컨베이어 벨트 효과
export const CreativeRecycling: React.FC<PixelIconProps> = ({ 
  size = 64, 
  className = "", 
  animated = true 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 건물 */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '20%',
          width: '60%',
          height: '45%',
          background: 'linear-gradient(180deg, #4A5568 0%, #2D3748 100%)'
        }}
      />

      {/* 지붕 */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '15%',
          width: '70%',
          height: '10%',
          background: 'linear-gradient(90deg, #68D391 0%, #38A169 100%)'
        }}
      />

      {/* 회전하는 재활용 마크 */}
      <div
        className={`absolute ${animated ? 'animate-spin' : ''}`}
        style={{
          top: '20%',
          left: '42%',
          width: '16%',
          height: '16%',
          animationDuration: '3s'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              conic-gradient(from 0deg, 
                #38A169 0deg 120deg, 
                transparent 120deg 240deg,
                #38A169 240deg 360deg
              )
            `,
            borderRadius: '50%',
            position: 'relative'
          }}
        >
          {/* 재활용 화살표들 */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '45%',
              width: '10%',
              height: '30%',
              background: '#2D3748',
              clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)'
            }}
          />
        </div>
      </div>

      {/* 컨베이어 벨트 효과 */}
      <div
        style={{
          position: 'absolute',
          bottom: '35%',
          left: '25%',
          width: '50%',
          height: '8%',
          background: 'linear-gradient(90deg, #2D3748 0%, #4A5568 50%, #2D3748 100%)',
          overflow: 'hidden'
        }}
      >
        {animated && (
          <div
            className="animate-pulse"
            style={{
              width: '100%',
              height: '100%',
              background: 'repeating-linear-gradient(90deg, transparent 0%, transparent 40%, #68D391 50%, transparent 60%, transparent 100%)',
              animationDuration: '1s'
            }}
          />
        )}
      </div>

      {/* 처리되는 쓰레기들 */}
      {animated && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                bottom: `${40 + i * 3}%`,
                left: `${30 + i * 15}%`,
                width: '4px',
                height: '4px',
                background: ['#E53E3E', '#4299E1', '#F6E05E'][i],
                borderRadius: '50%',
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </>
      )}

      {/* 연기/증기 효과 */}
      {animated && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                top: `${35 - i * 5}%`,
                right: `${25 + i * 3}%`,
                width: `${3 + i}px`,
                height: `${3 + i}px`,
                background: `rgba(104, 211, 145, ${0.6 - i * 0.2})`,
                borderRadius: '50%',
                animationDelay: `${i * 0.4}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
