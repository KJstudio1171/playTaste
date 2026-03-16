# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

게임 평점/리뷰 플랫폼 MVP (Watchapedia 스타일). FastAPI 백엔드 + Next.js 프론트엔드, Docker Compose로 운영.

## Commands

### 전체 서비스 실행
```bash
docker compose up --build -d
docker compose logs -f backend   # 백엔드 로그 확인
docker compose logs -f frontend
```

### 시드 데이터 로드
```bash
docker compose exec backend python -m app.db.seed
```

### DB 마이그레이션
```bash
docker compose exec backend alembic upgrade head
```

### 테스트 (백엔드)
```bash
docker compose exec backend sh -lc "PYTHONPATH=/app pytest -q"
# 단일 테스트 실행
docker compose exec backend sh -lc "PYTHONPATH=/app pytest tests/test_games.py -q"
```

### 프론트엔드 개발
```bash
cd frontend
npm run dev      # 개발 서버 (localhost:3000)
npm run lint
npm run build
```

### 서비스 접속
- 프론트엔드: http://localhost:3000
- 백엔드 API 문서: http://localhost:8000/docs
- 헬스체크: http://localhost:8000/api/v1/health

## Architecture

### 백엔드 (FastAPI + PostgreSQL)

**계층 구조:**
- `app/api/routes/` — 라우트 핸들러 (games, reviews, users, rankings, auth, health)
- `app/api/deps.py` — 의존성 주입: `get_current_user()` (현재 데모 유저 하드코딩), `get_db()`
- `app/models/` — SQLAlchemy 2.0 ORM 모델
- `app/schemas/api.py` — Pydantic 요청/응답 스키마
- `app/services/serializers.py` — ORM → Pydantic 변환
- `app/services/aggregates.py` — `refresh_game_aggregates()`: 평점/리뷰 변경 시 Game 테이블의 avg_rating, rating_count, review_count 재계산 (비정규화 집계)
- `app/db/seed.py` — 멱등성 시드 데이터

**핵심 도메인 규칙:**
- 사용자당 게임당 Rating 1개, Review 1개 (unique constraint)
- Game 테이블에 avg_rating, rating_count, review_count 비정규화 저장 → 성능용
- Rating/Review 변경 시 반드시 `refresh_game_aggregates()` 호출

**인증:**
- 현재 데모 모드: `deps.py`의 `get_current_user()`가 고정 유저 반환
- 환경변수: `DEMO_AUTH`, `DEMO_USERNAME`
- 실 인증으로 교체 시 `deps.py`만 수정하면 됨

### 프론트엔드 (Next.js App Router)

**페이지 구조:**
- `/` — 홈 (추천 섹션 + 게임 shelf 목록)
- `/games` — 게임 목록 (검색/정렬)
- `/games/[id]` — 게임 상세 (평점, 리뷰, 유저 상호작용)
- `/rankings` — 평점 기반 랭킹
- `/users/[id]` — 유저 프로필

**핵심 패턴:**
- `app/page.tsx` 등 서버 컴포넌트에서 `Promise.all()`로 병렬 데이터 페칭
- `app/api/` — Next.js API Routes가 백엔드로 요청 프록시 (인증 헤더 추가 등)
- `lib/api.ts` — `buildBackendUrl()`, `fetchBackendJson()` 사용
- `lib/types.ts` — 공유 TypeScript 인터페이스
- 클라이언트 상태관리 없음, React 로컬 state만 사용

**스타일링:**
- Tailwind CSS v4 + `globals.css`의 커스텀 CSS 변수 (`panel-featured`, `stat-tile`, `button-primary` 등)
- 모바일 퍼스트, `sm:`, `xl:` 반응형

### 데이터 흐름

```
Browser → Next.js Server Component (서버사이드 fetch)
        → Next.js API Route (프록시, 클라이언트 mutation)
        → FastAPI → PostgreSQL
```

뮤테이션(평점/리뷰 작성·수정·삭제) 후 반드시 `refresh_game_aggregates()` 호출로 집계 동기화.

## Key Files

| 파일 | 역할 |
|------|------|
| `backend/app/api/deps.py` | 인증/세션 의존성 |
| `backend/app/services/aggregates.py` | 게임 집계 갱신 로직 |
| `backend/app/services/serializers.py` | ORM→Schema 변환 |
| `backend/alembic/versions/20260313_000001_initial_mvp.py` | DB 스키마 전체 |
| `frontend/lib/api.ts` | 백엔드 API 클라이언트 |
| `frontend/lib/types.ts` | 공유 TypeScript 타입 |
| `docker-compose.yml` | 3개 서비스(db, backend, frontend) 오케스트레이션 |
