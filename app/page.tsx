import Link from "next/link";

export default function Home() {
  const pages = [
    {
      title: "🎮 Eco-Quest 게임",
      description: "환경 친화적 도시 건설 시뮬레이션 게임",
      href: "/eco-quest/game",
      status: "게임",
      color: "from-green-500 to-blue-500"
    },
    {
      title: "🔗 데이터베이스 연결 테스트",
      description: "Supabase 데이터베이스 연결 상태 확인",
      href: "/test-db",
      status: "테스트",
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "🎨 기본 아이콘 테스트",
      description: "SVG 기반 게임 아이콘 미리보기",
      href: "/test-icons",
      status: "개발",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "✨ 창의적 픽셀 아트",
      description: "애니메이션 효과가 적용된 픽셀 아트 아이콘",
      href: "/creative-pixels",
      status: "신규",
      color: "from-pink-500 to-red-500"
    },
    {
      title: "🏗️ 업그레이드 시스템 데모",
      description: "시설 레벨업 및 애드온 시각화 시스템",
      href: "/upgradeable-demo",
      status: "최신",
      color: "from-red-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌱 Eco-Quest 개발 대시보드
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            환경 친화적 도시 건설 게임 개발 프로젝트
          </p>
          
          {/* 프로젝트 상태 */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-green-400 font-semibold">✅ 백엔드 구축 완료</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-blue-400 font-semibold">🎨 UI/UX 개선 완료</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-purple-400 font-semibold">🚀 배포 준비 완료</span>
            </div>
          </div>
        </div>

        {/* 페이지 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pages.map((page, index) => (
            <Link
              key={index}
              href={page.href}
              className="group relative bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* 상태 배지 */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${page.color} text-white`}>
                  {page.status}
                </span>
              </div>
              
              {/* 콘텐츠 */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {page.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {page.description}
                </p>
              </div>
              
              {/* 화살표 아이콘 */}
              <div className="flex justify-end">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
              
              {/* 호버 효과 */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${page.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            </Link>
          ))}
        </div>

        {/* 기술 스택 정보 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            🛠️ 기술 스택
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚛️</span>
              </div>
              <h3 className="text-white font-semibold">Next.js</h3>
              <p className="text-gray-400 text-sm">프론트엔드</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🗄️</span>
              </div>
              <h3 className="text-white font-semibold">Supabase</h3>
              <p className="text-gray-400 text-sm">백엔드</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-white font-semibold">CSS Art</h3>
              <p className="text-gray-400 text-sm">픽셀 아트</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">☁️</span>
              </div>
              <h3 className="text-white font-semibold">Cloudflare</h3>
              <p className="text-gray-400 text-sm">배포</p>
            </div>
          </div>
        </div>

        {/* 개발 진행 상황 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            📊 개발 진행 상황
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-white mb-2">
                <span>데이터베이스 설계</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-white mb-2">
                <span>UI/UX 디자인</span>
                <span>95%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-white mb-2">
                <span>게임 로직</span>
                <span>70%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-white mb-2">
                <span>배포 및 최적화</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center mt-8 text-gray-400">
          <p>🌱 지속 가능한 미래를 위한 게임 개발 프로젝트</p>
          <p className="text-sm mt-2">
            Made with ❤️ by AI Assistant
          </p>
        </div>
      </div>
    </div>
  );
}
