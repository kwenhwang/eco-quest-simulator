"use client";

import { useState } from 'react';

// 교통 시설 픽셀아트
const ElectricBusPixel = ({ size = 64, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    <div className="absolute bottom-2 left-1 w-12 h-6 bg-green-600 rounded-lg" />
    <div className={`absolute bottom-0 left-2 w-3 h-3 bg-gray-800 rounded-full ${animated ? 'animate-spin' : ''}`} />
    <div className={`absolute bottom-0 right-3 w-3 h-3 bg-gray-800 rounded-full ${animated ? 'animate-spin' : ''}`} />
    <div className="absolute bottom-4 left-3 w-2 h-2 bg-blue-300 rounded" />
    <div className="absolute bottom-4 left-6 w-2 h-2 bg-blue-300 rounded" />
    <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-300 rounded" />
    {animated && (
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-pulse">⚡</div>
    )}
  </div>
);

const ChargingStationPixel = ({ size = 64, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-white rounded-t-lg" />
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-black" />
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded" />
    {animated && (
      <>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-bounce">⚡</div>
        <div className="absolute top-6 left-2 text-blue-400 animate-ping" style={{ animationDelay: '0.5s' }}>⚡</div>
        <div className="absolute top-6 right-2 text-green-400 animate-ping" style={{ animationDelay: '1s' }}>⚡</div>
      </>
    )}
    <div className="absolute bottom-0 left-1/4 w-8 h-2 bg-gray-600 rounded" />
  </div>
);

// 기본 시설들 (기존 코드 유지)
const SolarPanelPixel = ({ size = 64, animated = true }) => (
  <div className={`relative inline-block`} style={{ width: size, height: size }}>
    <div className={`w-full h-full ${animated ? 'animate-pulse' : ''}`} style={{
      background: `
        linear-gradient(45deg, 
          #1e40af 0%, #1e40af 20%,
          #3b82f6 20%, #3b82f6 40%,
          #60a5fa 40%, #60a5fa 60%,
          #93c5fd 60%, #93c5fd 80%,
          #dbeafe 80%, #dbeafe 100%
        ),
        repeating-linear-gradient(90deg,
          transparent 0px, transparent 6px,
          rgba(0,0,0,0.1) 6px, rgba(0,0,0,0.1) 8px
        )
      `,
      imageRendering: 'pixelated',
      borderRadius: '4px',
      border: '2px solid #1e40af'
    }}>
      {animated && (
        <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping" 
             style={{ animationDuration: '3s' }} />
      )}
    </div>
  </div>
);

const WindTurbinePixel = ({ size = 64, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 bg-gray-600" 
         style={{ height: size * 0.7 }} />
    <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 ${animated ? 'animate-spin' : ''}`}
         style={{ animationDuration: '2s' }}>
      <div className="relative w-8 h-8">
        <div className="absolute top-0 left-1/2 w-1 bg-white transform -translate-x-1/2" style={{ height: '16px' }} />
        <div className="absolute top-1/2 left-0 h-1 bg-white transform -translate-y-1/2" style={{ width: '16px' }} />
        <div className="absolute top-1/2 right-0 h-1 bg-white transform -translate-y-1/2" style={{ width: '16px' }} />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  </div>
);

const TreePixel = ({ size = 64, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-amber-800" />
    <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 ${animated ? 'animate-bounce' : ''}`}
         style={{ animationDuration: '4s' }}>
      <div className="w-8 h-6 bg-green-600 rounded-full mb-1" />
      <div className="w-10 h-8 bg-green-500 rounded-full mb-1" />
      <div className="w-12 h-10 bg-green-400 rounded-full" />
    </div>
    {animated && (
      <div className="absolute top-4 left-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping" 
           style={{ animationDelay: '1s', animationDuration: '3s' }} />
    )}
  </div>
);

const FactoryPixel = ({ size = 64, animated = true, type = 'clean' }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    <div className={`absolute bottom-0 w-full h-3/4 ${type === 'clean' ? 'bg-blue-600' : 'bg-gray-700'} rounded-t-lg`} />
    <div className="absolute top-2 left-2 w-2 h-6 bg-gray-800 rounded-t-full" />
    <div className="absolute top-4 left-6 w-2 h-4 bg-gray-800 rounded-t-full" />
    <div className="absolute top-1 right-2 w-2 h-7 bg-gray-800 rounded-t-full" />
    {animated && (
      <>
        <div className={`absolute -top-2 left-2 w-3 h-3 ${type === 'clean' ? 'bg-white' : 'bg-gray-500'} rounded-full animate-ping`}
             style={{ animationDelay: '0s', animationDuration: '2s' }} />
        <div className={`absolute -top-1 left-6 w-2 h-2 ${type === 'clean' ? 'bg-white' : 'bg-gray-500'} rounded-full animate-ping`}
             style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
        <div className={`absolute -top-3 right-2 w-3 h-3 ${type === 'clean' ? 'bg-white' : 'bg-gray-500'} rounded-full animate-ping`}
             style={{ animationDelay: '1s', animationDuration: '2s' }} />
      </>
    )}
    <div className="absolute bottom-4 left-4 w-2 h-2 bg-yellow-300 rounded" />
    <div className="absolute bottom-4 right-4 w-2 h-2 bg-yellow-300 rounded" />
  </div>
);

const HousePixel = ({ size = 64, animated = true, level = 1 }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    <div className={`absolute bottom-0 w-full h-2/3 ${level >= 2 ? 'bg-stone-600' : 'bg-amber-700'} rounded-b-lg`} />
    <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-6 ${level >= 3 ? 'border-red-700' : 'border-red-600'} border-l-transparent border-r-transparent`} />
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-amber-900 rounded-t-lg" />
    <div className={`absolute bottom-8 left-2 w-3 h-3 ${animated ? 'animate-pulse' : ''} bg-yellow-300 rounded`} />
    <div className={`absolute bottom-8 right-2 w-3 h-3 ${animated ? 'animate-pulse' : ''} bg-yellow-300 rounded`} />
    {level >= 2 && (
      <div className="absolute top-6 right-1 w-2 h-4 bg-gray-700 rounded-t-full" />
    )}
    {level >= 3 && (
      <div className="absolute bottom-6 left-0 w-2 h-2 bg-green-500 rounded-full" />
    )}
  </div>
);

export default function CreativePixels() {
  const [selectedCategory, setSelectedCategory] = useState('buildings');
  const [animationEnabled, setAnimationEnabled] = useState(true);

  const categories = {
    buildings: '🏢 건물',
    energy: '⚡ 에너지',
    nature: '🌿 자연',
    transport: '🚗 교통',
    addons: '🔧 애드온'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🎨 Eco-Quest 픽셀아트 에셋 라이브러리
        </h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {Object.entries(categories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={animationEnabled}
                onChange={(e) => setAnimationEnabled(e.target.checked)}
                className="rounded"
              />
              애니메이션 활성화
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          
          {selectedCategory === 'buildings' && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <HousePixel size={64} animated={animationEnabled} level={1} />
                <h3 className="text-white mt-2 text-sm">기본 주택</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <HousePixel size={64} animated={animationEnabled} level={2} />
                <h3 className="text-white mt-2 text-sm">업그레이드 주택</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <HousePixel size={64} animated={animationEnabled} level={3} />
                <h3 className="text-white mt-2 text-sm">고급 주택</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <FactoryPixel size={64} animated={animationEnabled} type="clean" />
                <h3 className="text-white mt-2 text-sm">친환경 공장</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <FactoryPixel size={64} animated={animationEnabled} type="dirty" />
                <h3 className="text-white mt-2 text-sm">일반 공장</h3>
              </div>
            </>
          )}

          {selectedCategory === 'energy' && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <SolarPanelPixel size={64} animated={animationEnabled} />
                <h3 className="text-white mt-2 text-sm">태양광 패널</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <WindTurbinePixel size={64} animated={animationEnabled} />
                <h3 className="text-white mt-2 text-sm">풍력 터빈</h3>
              </div>
            </>
          )}

          {selectedCategory === 'nature' && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <TreePixel size={64} animated={animationEnabled} />
                <h3 className="text-white mt-2 text-sm">나무</h3>
              </div>
            </>
          )}

          {selectedCategory === 'transport' && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <ElectricBusPixel size={64} animated={animationEnabled} />
                <h3 className="text-white mt-2 text-sm">전기 버스</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <ChargingStationPixel size={64} animated={animationEnabled} />
                <h3 className="text-white mt-2 text-sm">충전소</h3>
              </div>
            </>
          )}

          {selectedCategory === 'addons' && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="relative inline-block">
                  <HousePixel size={64} animated={animationEnabled} level={2} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded animate-pulse">
                    <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-300 rounded-full" />
                  </div>
                </div>
                <h3 className="text-white mt-2 text-sm">태양광 애드온</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="relative inline-block">
                  <HousePixel size={64} animated={animationEnabled} level={3} />
                  <div className="absolute -top-1 left-0 right-0 h-3 bg-green-500 rounded-t-lg animate-pulse">
                    <div className="absolute top-0 left-1 w-1 h-1 bg-green-300 rounded-full" />
                    <div className="absolute top-0 right-1 w-1 h-1 bg-green-300 rounded-full" />
                  </div>
                </div>
                <h3 className="text-white mt-2 text-sm">옥상 정원</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="relative inline-block">
                  <FactoryPixel size={64} animated={animationEnabled} type="dirty" />
                  <div className="absolute -top-4 right-2 w-4 h-8 bg-gray-700 rounded-t-full">
                    {animationEnabled && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-500 rounded-full animate-ping" />
                    )}
                  </div>
                </div>
                <h3 className="text-white mt-2 text-sm">굴뚝 애드온</h3>
              </div>
            </>
          )}

        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">🎮 게임 적용 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
            <div>
              <h3 className="text-white font-semibold mb-2">동적 애니메이션</h3>
              <ul className="space-y-1 text-sm">
                <li>• 태양광: 반사광 효과</li>
                <li>• 풍력: 회전 애니메이션</li>
                <li>• 공장: 연기 효과</li>
                <li>• 주택: 창문 불빛</li>
                <li>• 교통: 바퀴 회전</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">레벨 시스템</h3>
              <ul className="space-y-1 text-sm">
                <li>• 3단계 업그레이드</li>
                <li>• 시각적 차별화</li>
                <li>• 추가 기능 표시</li>
                <li>• 성능 향상 시각화</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">애드온 시스템</h3>
              <ul className="space-y-1 text-sm">
                <li>• 모듈형 확장</li>
                <li>• 독립적 애니메이션</li>
                <li>• 기능별 시각화</li>
                <li>• 조합 가능한 구조</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
