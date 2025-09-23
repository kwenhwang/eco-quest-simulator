// 교통 시설 픽셀아트
export const ElectricBusPixel = ({ size = 64, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    {/* 버스 본체 */}
    <div className="absolute bottom-2 left-1 w-12 h-6 bg-green-600 rounded-lg" />
    
    {/* 바퀴 */}
    <div className={`absolute bottom-0 left-2 w-3 h-3 bg-gray-800 rounded-full ${animated ? 'animate-spin' : ''}`} />
    <div className={`absolute bottom-0 right-3 w-3 h-3 bg-gray-800 rounded-full ${animated ? 'animate-spin' : ''}`} />
    
    {/* 창문 */}
    <div className="absolute bottom-4 left-3 w-2 h-2 bg-blue-300 rounded" />
    <div className="absolute bottom-4 left-6 w-2 h-2 bg-blue-300 rounded" />
    <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-300 rounded" />
    
    {/* 전기 표시 */}
    {animated && (
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-pulse">⚡</div>
    )}
  </div>
);

export const ChargingStationPixel = ({ size = 64, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    {/* 충전소 기둥 */}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-white rounded-t-lg" />
    
    {/* 충전 케이블 */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-black" />
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded" />
    
    {/* 전기 효과 */}
    {animated && (
      <>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-bounce">⚡</div>
        <div className="absolute top-6 left-2 text-blue-400 animate-ping" style={{ animationDelay: '0.5s' }}>⚡</div>
        <div className="absolute top-6 right-2 text-green-400 animate-ping" style={{ animationDelay: '1s' }}>⚡</div>
      </>
    )}
    
    {/* 베이스 */}
    <div className="absolute bottom-0 left-1/4 w-8 h-2 bg-gray-600 rounded" />
  </div>
);

// 자원 픽셀아트
export const WaterDropPixel = ({ size = 32, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    <div className={`w-full h-full bg-blue-500 rounded-full ${animated ? 'animate-bounce' : ''}`}
         style={{ 
           clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
           animationDuration: '2s'
         }}>
      <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full opacity-70" />
    </div>
  </div>
);

export const CoinPixel = ({ size = 32, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    <div className={`w-full h-full bg-yellow-400 rounded-full border-2 border-yellow-600 ${animated ? 'animate-spin' : ''}`}
         style={{ animationDuration: '3s' }}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-800 font-bold text-xs">$</div>
    </div>
  </div>
);

export const EnergyBoltPixel = ({ size = 32, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    <div className={`text-yellow-400 text-2xl ${animated ? 'animate-pulse' : ''}`}>⚡</div>
    {animated && (
      <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-ping" />
    )}
  </div>
);

// 효과 픽셀아트
export const PollutionCloudPixel = ({ size = 64, animated = true, intensity = 'medium' }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    {/* 오염 구름 */}
    <div className={`absolute top-0 left-0 w-full h-full ${
      intensity === 'high' ? 'bg-gray-800' : 
      intensity === 'medium' ? 'bg-gray-600' : 'bg-gray-400'
    } rounded-full opacity-70 ${animated ? 'animate-pulse' : ''}`} />
    
    {/* 독성 입자들 */}
    {animated && (
      <>
        <div className="absolute top-2 left-2 w-1 h-1 bg-red-500 rounded-full animate-ping" 
             style={{ animationDelay: '0s' }} />
        <div className="absolute top-4 right-3 w-1 h-1 bg-orange-500 rounded-full animate-ping" 
             style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-3 left-4 w-1 h-1 bg-yellow-600 rounded-full animate-ping" 
             style={{ animationDelay: '1s' }} />
      </>
    )}
  </div>
);

export const CleanAirPixel = ({ size = 64, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    {/* 깨끗한 공기 표현 */}
    <div className="absolute inset-0 bg-gradient-to-t from-blue-100 to-white rounded-full opacity-30" />
    
    {/* 반짝이는 입자들 */}
    {animated && (
      <>
        <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full animate-ping" 
             style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-6 right-2 w-1 h-1 bg-blue-200 rounded-full animate-ping" 
             style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute bottom-4 left-2 w-1 h-1 bg-green-200 rounded-full animate-ping" 
             style={{ animationDelay: '2s', animationDuration: '3s' }} />
        <div className="absolute bottom-2 right-4 w-1 h-1 bg-white rounded-full animate-ping" 
             style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
      </>
    )}
  </div>
);

// 고급 건물 애드온
export const SolarPanelAddon = ({ size = 24, animated = true }) => (
  <div className="absolute -top-2 -right-2" style={{ width: size, height: size }}>
    <div className={`w-full h-full bg-blue-600 rounded ${animated ? 'animate-pulse' : ''}`}
         style={{ animationDuration: '3s' }}>
      <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-300 rounded-full" />
    </div>
  </div>
);

export const GreenRoofAddon = ({ size = 24, animated = true }) => (
  <div className="absolute -top-1 left-0 right-0" style={{ height: size/2 }}>
    <div className={`w-full h-full bg-green-500 rounded-t-lg ${animated ? 'animate-pulse' : ''}`}
         style={{ animationDuration: '4s' }}>
      {/* 작은 식물들 */}
      <div className="absolute top-0 left-1 w-1 h-1 bg-green-300 rounded-full" />
      <div className="absolute top-0 right-1 w-1 h-1 bg-green-300 rounded-full" />
    </div>
  </div>
);

export const SmokestackAddon = ({ size = 16, animated = true, clean = false }) => (
  <div className="absolute -top-4 right-2" style={{ width: size, height: size*2 }}>
    <div className="w-full h-3/4 bg-gray-700 rounded-t-full" />
    {animated && (
      <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 ${
        clean ? 'bg-white' : 'bg-gray-500'
      } rounded-full animate-ping`} style={{ animationDuration: '2s' }} />
    )}
  </div>
);

export const SecurityAddon = ({ size = 20, animated = true }) => (
  <div className="absolute top-1 right-1" style={{ width: size, height: size }}>
    <div className="w-full h-full bg-red-600 rounded-full">
      <div className={`absolute inset-1 border border-white rounded-full ${animated ? 'animate-pulse' : ''}`} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />
    </div>
  </div>
);
