# 🌱 Eco-Quest Game

환경 친화적 도시 건설 시뮬레이션 게임

## 📋 프로젝트 개요

Eco-Quest는 지속 가능한 도시 개발을 주제로 한 웹 기반 시뮬레이션 게임입니다. 플레이어는 친환경 시설을 건설하고 관리하여 환경과 경제의 균형을 맞춰야 합니다.

## 🚀 주요 기능

### 🎮 게임 시스템
- **시설 건설**: 태양광, 풍력, 주거, 상업 시설 등
- **업그레이드 시스템**: 3단계 레벨업 및 애드온 확장
- **자원 관리**: 돈, 에너지, 인구 관리
- **환경 지표**: 대기질, 수질, 생물다양성 모니터링

### 🎨 시각적 요소
- **픽셀아트 에셋**: 동적 애니메이션이 적용된 건물들
- **반응형 UI**: 모바일/태블릿/데스크톱 지원
- **실시간 효과**: 연기, 전기, 자연 효과

### 🔧 기술적 특징
- **Next.js 15**: 최신 React 프레임워크
- **Supabase**: 실시간 데이터베이스 및 인증
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **TypeScript**: 타입 안전성

## 📁 프로젝트 구조

```
my-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 대시보드
│   ├── eco-quest/         # 게임 페이지
│   ├── creative-pixels/   # 픽셀아트 라이브러리
│   ├── test-db/          # 데이터베이스 테스트
│   └── api/              # API 라우트
├── components/            # 재사용 가능한 컴포넌트
├── lib/                  # 유틸리티 및 설정
└── public/               # 정적 파일
```

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- Supabase 계정 (선택사항)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

### 환경 변수 설정

`.env.local` 파일 생성:

```env
# Supabase (개발 환경용)
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# 데이터베이스
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# JWT 시크릿
JWT_SECRET=your-jwt-secret
```

## 🎯 게임 플레이

### 기본 조작
1. **시설 건설**: 하단 패널에서 원하는 시설 선택
2. **업그레이드**: 시설 클릭 후 업그레이드 버튼
3. **자원 관리**: 상단 패널에서 현재 상태 확인
4. **목표 달성**: 환경 지표와 경제 지표 균형 유지

### 시설 종류
- **🏠 주거 시설**: 인구 증가, 3단계 업그레이드
- **🏭 생산 시설**: 에너지 생산, 친환경/일반 타입
- **🌿 환경 시설**: 공원, 나무, 재활용 센터
- **🚗 교통 시설**: 전기 버스, 충전소

## 🔧 개발 가이드

### 새로운 시설 추가

1. **픽셀아트 컴포넌트 생성**:
```tsx
const NewFacilityPixel = ({ size = 64, animated = true }) => (
  <div className="relative inline-block" style={{ width: size, height: size }}>
    {/* 시설 디자인 */}
  </div>
);
```

2. **게임 로직 추가**:
```tsx
const facilityTypes = {
  newFacility: {
    name: '새 시설',
    cost: 1000,
    effect: { energy: 10, environment: 5 }
  }
};
```

### 애니메이션 추가

```css
/* Tailwind 애니메이션 클래스 사용 */
.animate-custom {
  animation: custom 2s infinite;
}

@keyframes custom {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

## 📊 성능 최적화

- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **코드 분할**: 동적 import 활용
- **CSS 최적화**: Tailwind CSS purge 설정
- **캐싱**: API 응답 캐싱 구현

## 🔒 보안 고려사항

- **환경 변수**: 민감한 정보는 서버사이드에서만 사용
- **API 보호**: 인증 및 권한 검증
- **입력 검증**: 사용자 입력 데이터 검증
- **CORS 설정**: 허용된 도메인만 접근 가능

## 🚀 배포

### Vercel 배포
```bash
npm install -g vercel
vercel --prod
```

### Docker 배포
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 기여 가이드

1. Fork 프로젝트
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

- **이슈 리포트**: GitHub Issues
- **문서**: `/docs` 폴더 참조
- **데모**: https://your-demo-url.com

---

**Made with ❤️ for a sustainable future** 🌍
# Updated Tue Sep 23 14:50:33 UTC 2025
