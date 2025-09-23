"use client";

export default function EcoQuestGame() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-8">
          🌱 Eco-Quest 게임
        </h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            게임 준비 중...
          </h2>
          <p className="text-gray-300 mb-6">
            환경 친화적 도시 건설 시뮬레이션 게임이 곧 시작됩니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-500/20 rounded-lg p-4">
              <div className="text-3xl mb-2">🏭</div>
              <h3 className="text-white font-semibold">시설 건설</h3>
              <p className="text-gray-300 text-sm">친환경 시설을 건설하세요</p>
            </div>
            
            <div className="bg-blue-500/20 rounded-lg p-4">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-white font-semibold">에너지 관리</h3>
              <p className="text-gray-300 text-sm">재생 에너지를 활용하세요</p>
            </div>
            
            <div className="bg-purple-500/20 rounded-lg p-4">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="text-white font-semibold">환경 보호</h3>
              <p className="text-gray-300 text-sm">지속 가능한 도시를 만드세요</p>
            </div>
          </div>
          
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            게임 시작하기
          </button>
        </div>
        
        <div className="text-gray-400">
          <p>🚧 현재 개발 중인 기능입니다</p>
          <p className="text-sm mt-2">완전한 게임 기능은 곧 업데이트됩니다</p>
        </div>
      </div>
    </div>
  );
}
