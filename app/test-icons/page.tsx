"use client";

import { 
  ResearchLabIcon, 
  SolarPlantIcon, 
  WindPlantIcon,
  ResidentialIcon,
  CommercialIcon,
  ParkIcon,
  RecyclingIcon,
  MoneyIcon,
  EnergyIcon,
  PopulationIcon
} from '@/components/GameIcons';

export default function TestIcons() {
  const facilities = [
    { name: '연구소', icon: ResearchLabIcon, cost: 1000 },
    { name: '태양광 발전소', icon: SolarPlantIcon, cost: 2000 },
    { name: '풍력 발전소', icon: WindPlantIcon, cost: 2500 },
    { name: '주거 단지', icon: ResidentialIcon, cost: 1500 },
    { name: '상업 지구', icon: CommercialIcon, cost: 3000 },
    { name: '공원', icon: ParkIcon, cost: 800 },
    { name: '재활용 센터', icon: RecyclingIcon, cost: 1800 },
  ];

  const resources = [
    { name: '돈', icon: MoneyIcon, value: '1,000,000' },
    { name: '에너지', icon: EnergyIcon, value: '500/1000' },
    { name: '인구', icon: PopulationIcon, value: '2,500' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">🎮 Eco-Quest 게임 아이콘 테스트</h1>
      
      {/* 자원 표시 패널 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">자원 현황</h2>
        <div className="flex gap-6">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <resource.icon size={24} />
              <span className="font-medium">{resource.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 시설 건설 패널 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">시설 건설</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {facilities.map((facility, index) => (
            <div 
              key={index} 
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
            >
              <div className="flex flex-col items-center gap-2">
                <facility.icon size={48} />
                <h3 className="font-medium text-sm text-center">{facility.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <MoneyIcon size={16} />
                  <span>{facility.cost.toLocaleString()}</span>
                </div>
                <button className="w-full bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600">
                  건설
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 아이콘 크기 테스트 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">아이콘 크기 테스트</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <SolarPlantIcon size={16} />
            <p className="text-xs mt-1">16px</p>
          </div>
          <div className="text-center">
            <SolarPlantIcon size={24} />
            <p className="text-xs mt-1">24px</p>
          </div>
          <div className="text-center">
            <SolarPlantIcon size={32} />
            <p className="text-xs mt-1">32px</p>
          </div>
          <div className="text-center">
            <SolarPlantIcon size={48} />
            <p className="text-xs mt-1">48px</p>
          </div>
          <div className="text-center">
            <SolarPlantIcon size={64} />
            <p className="text-xs mt-1">64px</p>
          </div>
        </div>
      </div>

      {/* 색상 커스터마이징 테스트 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">색상 커스터마이징</h2>
        <div className="flex gap-4">
          <SolarPlantIcon size={48} className="text-blue-500" />
          <SolarPlantIcon size={48} className="text-green-500" />
          <SolarPlantIcon size={48} className="text-yellow-500" />
          <SolarPlantIcon size={48} className="text-red-500" />
        </div>
      </div>
    </div>
  );
}
