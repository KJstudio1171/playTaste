# playTaste

왓챠피디아 스타일의 게임 평점/리뷰 플랫폼 MVP입니다. `frontend`와 `backend`를 분리한 Docker-first 구조로 구성되어 있으며, 데모 인증과 시드 데이터를 통해 로컬에서 바로 실행하고 검증할 수 있습니다.

## 프로젝트 구조

```text
playTaste/
├─ backend/    # FastAPI + SQLAlchemy + Alembic + seed + tests
├─ frontend/   # Next.js App Router + TypeScript + Tailwind
├─ docs/       # MVP 설계 문서
├─ .env.example
├─ docker-compose.yml
└─ README.md
```

## 사전 준비

- Docker Desktop
- Docker Compose v2

## 실행 방법

1. 환경 변수 파일을 준비합니다.

```powershell
Copy-Item .env.example .env
```

2. 전체 서비스를 빌드하고 실행합니다.

```powershell
docker compose up --build -d
```

3. 마이그레이션은 백엔드 시작 시 자동 적용됩니다. 시드 데이터는 별도 적재합니다.

```powershell
docker compose exec backend python -m app.db.seed
```

4. 접속 주소

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Backend health: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

## 백엔드/프론트엔드 실행 방법

기본 워크플로는 Docker Compose입니다.

```powershell
docker compose up --build -d
docker compose logs -f backend
docker compose logs -f frontend
```

서비스 중지:

```powershell
docker compose down
```

## DB 마이그레이션 방법

자동 적용:

```powershell
docker compose up --build -d
```

수동 적용:

```powershell
docker compose exec backend alembic upgrade head
```

## 시드 데이터 적재 방법

```powershell
docker compose exec backend python -m app.db.seed
```

시드는 idempotent하게 작성되어 있어 재실행 시 중복 생성되지 않습니다.

## 데모 인증

- 실제 회원가입/비밀번호 로그인 대신 `DEMO_AUTH=true` 환경에서 고정 데모 유저가 현재 로그인 사용자로 동작합니다.
- `GET /api/v1/auth/me`로 데모 유저 정보를 조회할 수 있습니다.
- 평점/리뷰 작성은 모두 이 데모 유저 기준으로 처리됩니다.

## 구현된 API 목록

- `GET /api/v1/health`
- `GET /api/v1/auth/me`
- `GET /api/v1/games`
- `GET /api/v1/games/search`
- `GET /api/v1/games/{game_id}`
- `GET /api/v1/games/rankings`
- `GET /api/v1/games/popular`
- `GET /api/v1/games/latest`
- `PUT /api/v1/games/{game_id}/rating`
- `POST /api/v1/games/{game_id}/review`
- `PUT /api/v1/games/{game_id}/review`
- `DELETE /api/v1/games/{game_id}/review`
- `GET /api/v1/users/{user_id}`

## 구현된 화면 목록

- 홈 화면 `/`
- 검색 화면 `/search`
- 게임 상세 `/games/[id]`
- 평점 랭킹 `/rankings`
- 유저 프로필 `/users/[id]`

## 기본 검증 순서

1. `docker compose up --build -d`
2. `docker compose exec backend python -m app.db.seed`
3. 홈 화면에서 인기/최신/랭킹 섹션이 노출되는지 확인
4. 검색 화면에서 제목 일부로 검색되는지 확인
5. 게임 상세에서 별점 저장/수정이 되는지 확인
6. 리뷰 작성/수정/삭제 후 상세/프로필 집계가 갱신되는지 확인

## 남은 TODO

- 실제 인증/인가 도입
- 추천 시스템 이벤트 적재 및 취향 벡터 설계
- 게임 외부 데이터 소스 연동
- 좋아요/팔로우/댓글 같은 소셜 기능

## 다음 단계 제안

1. 실제 로그인과 세션 또는 JWT 인증 도입
2. 추천 후보 생성을 위한 활동 로그 테이블 추가
3. 게임 상세 내 리뷰 정렬/필터 확장
4. 이미지 업로드 및 관리자 시드 관리 도구 추가
