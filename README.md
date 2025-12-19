# MOGI 2025

행사용 인터랙티브 앱 모음

## 프로젝트 구성

| 프로젝트 | 설명 | 포트 |
|----------|------|------|
| **multibuzzer** | 실시간 멀티플레이어 버저 시스템 (최대 200명) | 4000/4001 |
| **quiz** | 퀴즈 보드 | 3000 |
| **luckydraw** | 행운권 추첨 (룰렛 애니메이션) | 3000 |
| **mongawi** | 이벤트 앱 | 3000 |

## 빠른 시작

### Next.js 프로젝트 (quiz, luckydraw, mongawi)

```bash
cd <프로젝트>
pnpm install
pnpm dev
```

### Multibuzzer

```bash
cd multibuzzer
yarn install
yarn dev
```

## 기술 스택

### Next.js 프로젝트
- Next.js 16 / React 19
- Tailwind CSS 4
- shadcn/ui (new-york 스타일)
- TypeScript

### Multibuzzer
- React 18 (Create React App)
- boardgame.io (Socket.IO 기반 실시간 동기화)
- Koa 서버

## 배포

### Next.js 프로젝트
```bash
pnpm build
pnpm start
```

### Multibuzzer
```bash
yarn build
PORT=80 yarn start
```
