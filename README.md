# playTaste

왓챠피디아 스타일의 게임 평점/리뷰 플랫폼 MVP입니다. `frontend`와 `backend`를 분리한 Docker-first 구조로 구성되어 있으며, 하드코딩된 dev user와 시드 데이터를 통해 로컬에서 바로 실행하고 검증할 수 있습니다.

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

## 임시 인증

- 이번 단계에서는 정식 인증 대신 하드코딩된 dev user를 현재 사용자로 사용합니다.
- `GET /api/v1/auth/me`로 현재 dev user 정보를 조회할 수 있습니다.
- 평점/리뷰 작성은 모두 이 dev user 기준으로 처리됩니다.
- 실제 인증으로 교체할 때는 `backend/app/api/deps.py`의 사용자 조회 의존성을 바꾸는 방식으로 확장합니다.

## 구현된 API 목록

### 코어 조회 API

- `GET /api/v1/games`
- `GET /api/v1/games/{game_id}`
- `GET /api/v1/games/search?q=`
- `GET /api/v1/games/popular`
- `GET /api/v1/games/latest`
- `GET /api/v1/games/rankings`
- `GET /api/v1/rankings?type=rating`
- `GET /api/v1/users/{user_id}`
- `GET /api/v1/auth/me`
- `GET /api/v1/health`

### 평점/리뷰 쓰기 API

- `POST /api/v1/games/{game_id}/rating`
- `PUT /api/v1/games/{game_id}/rating`
- `POST /api/v1/games/{game_id}/review`
- `POST /api/v1/games/{game_id}/reviews`
- `PUT /api/v1/games/{game_id}/review`
- `DELETE /api/v1/games/{game_id}/review`
- `PUT /api/v1/reviews/{review_id}`
- `DELETE /api/v1/reviews/{review_id}`

## 구현된 화면 목록

- 홈 화면 `/`
- 게임 목록 `/games`
- 검색 리다이렉트 `/search` → `/games`
- 게임 상세 `/games/[id]`
- 평점 랭킹 `/rankings`
- 유저 프로필 `/users/[id]`

## 기본 수동 테스트 절차

1. `docker compose up --build -d`
2. `docker compose exec backend python -m app.db.seed`
3. 홈 화면에서 인기 게임 / 최신 게임 / 상위 평점 섹션이 노출되는지 확인
4. `/games`에서 최신순, 인기순, 평점순 정렬이 바뀌는지 확인
5. `/games` 검색창에서 제목 일부로 검색되는지 확인
6. 게임 상세에서 별점을 클릭했을 때 즉시 반영되고 새로고침 후 유지되는지 확인
7. 게임 상세에서 리뷰를 작성, 수정, 삭제했을 때 리뷰 수와 목록이 갱신되는지 확인
8. `/rankings`에서 순위와 평점 정보가 정상 노출되는지 확인
9. `/users/1`에서 최근 별점과 최근 리뷰가 반영되는지 확인

## 자동 검증

```powershell
docker compose exec backend sh -lc "PYTHONPATH=/app pytest -q"
cd frontend
npm run lint
npm run build
```

## 남은 TODO

- 정식 인증/인가 도입
- 추천 시스템용 활동 이벤트 적재와 취향 프로필 설계
- 외부 게임 데이터 연동
- 댓글, 좋아요, 팔로우 같은 소셜 기능

## 다음 단계 제안

1. JWT 또는 세션 기반 실제 인증 도입
2. 리뷰 정렬/필터 확장과 프로필 활동 탭 고도화
3. 추천 시스템을 위한 활동 로그 테이블 추가
4. 관리자용 카탈로그 관리 도구 추가
