# 🚀 Netlify 배포 가이드

## 📋 배포 준비 완료 상태
✅ **빌드 테스트**: 성공적으로 완료
✅ **Next.js 설정**: Netlify 호환 설정 완료
✅ **netlify.toml**: 배포 설정 파일 생성
✅ **GitHub 연동**: 저장소 준비 완료

## 🔧 Netlify CLI로 배포하기

### 1. Netlify 로그인
```bash
cd /home/ubuntu/ai_super_factory/my-app
netlify login
```

### 2. 사이트 초기화 및 연결
```bash
# GitHub 저장소와 연결하여 새 사이트 생성
netlify init

# 또는 기존 사이트에 연결
netlify link
```

### 3. 환경 변수 설정
```bash
# 개발용 환경 변수 (선택사항)
netlify env:set SUPABASE_URL "your-supabase-url"
netlify env:set SUPABASE_ANON_KEY "your-anon-key"
netlify env:set NODE_ENV "production"
```

### 4. 배포 실행
```bash
# 프로덕션 배포
netlify deploy --prod

# 또는 미리보기 배포
netlify deploy
```

## 🌐 웹 UI로 배포하기 (권장)

### 1. Netlify 대시보드 접속
- https://app.netlify.com 접속
- "New site from Git" 클릭

### 2. GitHub 연결
- "GitHub" 선택
- `kwenhwang/eco-quest-simulator` 저장소 선택

### 3. 빌드 설정
```
Build command: npm run build
Publish directory: .next
```

### 4. 환경 변수 설정 (Site settings > Environment variables)
```
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1
```

## 🔒 환경 변수 보안 설정

### 프로덕션 환경 변수 (필요시)
```bash
# Supabase 설정 (실제 값으로 교체)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 데이터베이스 (프로덕션 DB URL)
DATABASE_URL=your-production-database-url

# JWT 시크릿 (새로 생성 권장)
JWT_SECRET=your-production-jwt-secret
```

### 환경 변수 설정 방법
1. **Netlify 대시보드**: Site settings > Environment variables
2. **CLI**: `netlify env:set KEY "value"`
3. **netlify.toml**: 빌드 시 환경 변수

## 📊 빌드 최적화 설정

### netlify.toml 주요 설정
- **빌드 명령어**: `npm run build`
- **배포 디렉토리**: `.next`
- **Node.js 버전**: 18
- **리다이렉트**: SPA 라우팅 지원
- **보안 헤더**: XSS, CSRF 보호
- **캐시 설정**: 정적 파일 최적화

### 성능 최적화
- 이미지 최적화 비활성화 (Netlify 호환)
- 정적 생성 페이지 최대화
- 번들 크기 최적화

## 🔄 자동 배포 설정

### GitHub 연동 시 자동 배포
- **main 브랜치**: 프로덕션 자동 배포
- **PR**: 미리보기 배포 자동 생성
- **커밋**: 실시간 배포 트리거

### 배포 알림 설정
- Slack/Discord 웹훅 연동
- 이메일 알림 설정
- GitHub 상태 체크

## 🚨 문제 해결

### 빌드 실패 시
1. **로그 확인**: Netlify 대시보드에서 빌드 로그 확인
2. **로컬 테스트**: `npm run build` 로컬에서 재테스트
3. **의존성 확인**: package.json 의존성 버전 확인

### 라우팅 문제 시
- netlify.toml의 리다이렉트 설정 확인
- Next.js App Router 설정 확인

### 환경 변수 문제 시
- Netlify 대시보드에서 환경 변수 확인
- 빌드 로그에서 환경 변수 로딩 확인

## 📈 배포 후 모니터링

### 성능 모니터링
- Netlify Analytics 활성화
- Core Web Vitals 확인
- 로딩 속도 최적화

### 에러 모니터링
- 함수 로그 모니터링
- 404 에러 추적
- 사용자 피드백 수집

## 🎯 배포 완료 체크리스트

### 기본 기능 테스트
- [ ] 메인 페이지 로딩
- [ ] 픽셀아트 라이브러리 접근
- [ ] 게임 페이지 접근
- [ ] 반응형 디자인 확인
- [ ] API 라우트 동작

### 성능 테스트
- [ ] 페이지 로딩 속도 (< 3초)
- [ ] 이미지 최적화 확인
- [ ] 모바일 성능 확인

### SEO 및 접근성
- [ ] 메타 태그 확인
- [ ] Open Graph 설정
- [ ] 접근성 테스트

---

**배포 URL 예시**: `https://eco-quest-simulator.netlify.app`
