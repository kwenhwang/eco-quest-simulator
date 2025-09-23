"use client";

import { useState } from 'react';

export default function EcoQuestGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [pollution, setPollution] = useState(0);
  const [buildings, setBuildings] = useState<string[]>([]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setEnergy(100);
    setPollution(0);
    setBuildings([]);
  };

  const buildFacility = (type: string) => {
    if (energy >= 20) {
      setBuildings([...buildings, type]);
      setEnergy(energy - 20);
      
      if (type === 'solar') {
        setScore(score + 10);
        setEnergy(energy + 5);
      } else if (type === 'wind') {
        setScore(score + 15);
        setEnergy(energy + 10);
      } else if (type === 'factory') {
        setScore(score + 5);
        setPollution(pollution + 10);
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-8">
            🌱 Eco-Quest 게임
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              환경 친화적 도시 건설하기
            </h2>
            <p className="text-gray-300 mb-6">
              재생 에너지를 활용하여 지속 가능한 도시를 건설하세요!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-500/20 rounded-lg p-4">
                <div className="text-3xl mb-2">☀️</div>
                <h3 className="text-white font-semibold">태양광 발전소</h3>
                <p className="text-gray-300 text-sm">깨끗한 에너지 생산</p>
              </div>
              
              <div className="bg-blue-500/20 rounded-lg p-4">
                <div className="text-3xl mb-2">💨</div>
                <h3 className="text-white font-semibold">풍력 발전소</h3>
                <p className="text-gray-300 text-sm">바람으로 전기 생산</p>
              </div>
              
              <div className="bg-purple-500/20 rounded-lg p-4">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="text-white font-semibold">환경 보호</h3>
                <p className="text-gray-300 text-sm">오염을 줄이고 점수 획득</p>
              </div>
            </div>
            
            <button 
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              게임 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          🌱 Eco-Quest 게임
        </h1>
        
        {/* 게임 상태 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-white font-semibold">점수</h3>
            <p className="text-2xl text-green-400">{score}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-white font-semibold">에너지</h3>
            <p className="text-2xl text-blue-400">{energy}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-white font-semibold">오염도</h3>
            <p className="text-2xl text-red-400">{pollution}</p>
          </div>
        </div>

        {/* 건설 버튼 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">시설 건설</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => buildFacility('solar')}
              disabled={energy < 20}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              ☀️ 태양광 발전소 (20 에너지)
            </button>
            <button
              onClick={() => buildFacility('wind')}
              disabled={energy < 20}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              💨 풍력 발전소 (20 에너지)
            </button>
            <button
              onClick={() => buildFacility('factory')}
              disabled={energy < 20}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              🏭 공장 (20 에너지)
            </button>
          </div>
        </div>

        {/* 건설된 시설들 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">건설된 시설</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {buildings.map((building, index) => (
              <div key={index} className="text-4xl text-center">
                {building === 'solar' && '☀️'}
                {building === 'wind' && '💨'}
                {building === 'factory' && '🏭'}
              </div>
            ))}
            {Array.from({ length: Math.max(0, 16 - buildings.length) }).map((_, index) => (
              <div key={`empty-${index}`} className="text-4xl text-center text-gray-600">
                ⬜
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setGameStarted(false)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            게임 재시작
          </button>
        </div>
      </div>
    </div>
  );
}
