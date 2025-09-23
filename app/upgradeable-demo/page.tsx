"use client";

import React, { useState } from 'react';
import { 
  UpgradeableResearchLab, 
  UpgradeableSolarPlant,
  FacilityUpgradeInfo 
} from '@/components/UpgradeableIcons';

export default function UpgradeableDemo() {
  const [researchLevel, setResearchLevel] = useState(1);
  const [solarLevel, setSolarLevel] = useState(1);
  const [researchAddons, setResearchAddons] = useState<string[]>([]);
  const [solarAddons, setSolarAddons] = useState<string[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  const researchAddonOptions = [
    { name: 'antenna', label: '통신 안테나', cost: 500, benefit: '연구 속도 +20%' },
    { name: 'solar', label: '보조 태양광', cost: 800, benefit: '에너지 자급자족' },
    { name: 'storage', label: '데이터 저장소', cost: 1200, benefit: '연구 데이터 보존' }
  ];

  const solarAddonOptions = [
    { name: 'battery', label: '에너지 저장소', cost: 1000, benefit: '에너지 저장 +50%' },
    { name: 'inverter', label: '인버터', cost: 600, benefit: '효율성 +15%' }
  ];

  const toggleAddon = (facility: 'research' | 'solar', addon: string) => {
    if (facility === 'research') {
      setResearchAddons(prev => 
        prev.includes(addon) 
          ? prev.filter(a => a !== addon)
          : [...prev, addon]
      );
    } else {
      setSolarAddons(prev => 
        prev.includes(addon) 
          ? prev.filter(a => a !== addon)
          : [...prev, addon]
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏗️ 업그레이드 가능한 시설 시스템
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            레벨업과 애드온으로 시설을 확장하고 시각적 변화를 확인하세요
          </p>
        </div>

        {/* 메인 데모 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* 연구소 데모 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              🔬 연구소 업그레이드
            </h2>
            
            <div className="flex justify-center mb-6">
              <UpgradeableResearchLab
                size={120}
                level={researchLevel}
                addons={researchAddons}
                animated={true}
                efficiency={85}
              />
            </div>

            {/* 레벨 컨트롤 */}
            <div className="mb-4">
              <label className="block text-white mb-2">레벨: {researchLevel}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={researchLevel}
                onChange={(e) => setResearchLevel(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 애드온 컨트롤 */}
            <div className="mb-4">
              <label className="block text-white mb-2">애드온 시설:</label>
              <div className="space-y-2">
                {researchAddonOptions.map((addon) => (
                  <label key={addon.name} className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={researchAddons.includes(addon.name)}
                      onChange={() => toggleAddon('research', addon.name)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      {addon.label} ({addon.cost.toLocaleString()}💰)
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedFacility(
                selectedFacility === 'research' ? null : 'research'
              )}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {selectedFacility === 'research' ? '정보 숨기기' : '업그레이드 정보'}
            </button>
          </div>

          {/* 태양광 발전소 데모 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              ☀️ 태양광 발전소 업그레이드
            </h2>
            
            <div className="flex justify-center mb-6">
              <UpgradeableSolarPlant
                size={120}
                level={solarLevel}
                addons={solarAddons}
                animated={true}
                efficiency={92}
              />
            </div>

            {/* 레벨 컨트롤 */}
            <div className="mb-4">
              <label className="block text-white mb-2">레벨: {solarLevel}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={solarLevel}
                onChange={(e) => setSolarLevel(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 애드온 컨트롤 */}
            <div className="mb-4">
              <label className="block text-white mb-2">애드온 시설:</label>
              <div className="space-y-2">
                {solarAddonOptions.map((addon) => (
                  <label key={addon.name} className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={solarAddons.includes(addon.name)}
                      onChange={() => toggleAddon('solar', addon.name)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      {addon.label} ({addon.cost.toLocaleString()}💰)
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedFacility(
                selectedFacility === 'solar' ? null : 'solar'
              )}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {selectedFacility === 'solar' ? '정보 숨기기' : '업그레이드 정보'}
            </button>
          </div>
        </div>

        {/* 업그레이드 정보 패널 */}
        {selectedFacility && (
          <div className="mb-8">
            {selectedFacility === 'research' && (
              <FacilityUpgradeInfo
                facilityName="연구소"
                currentLevel={researchLevel}
                maxLevel={5}
                upgradeCost={researchLevel * 1000}
                nextLevelBenefits={[
                  `연구 속도 +${researchLevel * 20}%`,
                  `새로운 기술 해제`,
                  `실험 장비 ${researchLevel + 1}개 추가`,
                  `에너지 효율 개선`
                ]}
                availableAddons={researchAddonOptions.map(addon => ({
                  name: addon.label,
                  cost: addon.cost,
                  benefit: addon.benefit,
                  installed: researchAddons.includes(addon.name)
                }))}
              />
            )}
            
            {selectedFacility === 'solar' && (
              <FacilityUpgradeInfo
                facilityName="태양광 발전소"
                currentLevel={solarLevel}
                maxLevel={5}
                upgradeCost={solarLevel * 1500}
                nextLevelBenefits={[
                  `에너지 생산량 +${solarLevel * 50}`,
                  `태양광 패널 ${(solarLevel + 1) * 2}개`,
                  `효율성 +${solarLevel * 5}%`,
                  `날씨 저항성 향상`
                ]}
                availableAddons={solarAddonOptions.map(addon => ({
                  name: addon.label,
                  cost: addon.cost,
                  benefit: addon.benefit,
                  installed: solarAddons.includes(addon.name)
                }))}
              />
            )}
          </div>
        )}

        {/* 레벨별 비교 섹션 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            📊 레벨별 시각적 변화 비교
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="text-center">
                <div className="flex justify-center mb-2">
                  <UpgradeableResearchLab
                    size={80}
                    level={level}
                    addons={level >= 3 ? ['antenna'] : []}
                    animated={true}
                  />
                </div>
                <p className="text-white text-sm">레벨 {level}</p>
                <p className="text-gray-300 text-xs">
                  {level === 1 && '기본형'}
                  {level === 2 && '확장형'}
                  {level === 3 && '고급형'}
                  {level === 4 && '전문형'}
                  {level === 5 && '최고급형'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 애드온 조합 예시 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            🔧 애드온 조합 예시
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <UpgradeableSolarPlant
                  size={100}
                  level={3}
                  addons={[]}
                  animated={true}
                />
              </div>
              <h3 className="text-white font-semibold mb-2">기본형</h3>
              <p className="text-gray-300 text-sm">애드온 없음</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <UpgradeableSolarPlant
                  size={100}
                  level={3}
                  addons={['battery']}
                  animated={true}
                />
              </div>
              <h3 className="text-white font-semibold mb-2">저장형</h3>
              <p className="text-gray-300 text-sm">배터리 저장소 추가</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <UpgradeableSolarPlant
                  size={100}
                  level={3}
                  addons={['battery', 'inverter']}
                  animated={true}
                />
              </div>
              <h3 className="text-white font-semibold mb-2">완전형</h3>
              <p className="text-gray-300 text-sm">모든 애드온 설치</p>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center mt-8 text-gray-400">
          <p>🎨 레벨과 애드온에 따른 동적 시각 변화 시스템</p>
          <p className="text-sm mt-2">
            각 시설은 업그레이드와 애드온 설치에 따라 실시간으로 모습이 변합니다
          </p>
        </div>
      </div>
    </div>
  );
}
