# playTaste MVP 계획

## 서비스 개요

playTaste는 왓챠피디아 스타일의 게임 평점/리뷰 플랫폼 MVP입니다. 유저는 게임을 탐색하고, 별점과 리뷰를 남기고, 프로필과 랭킹을 확인할 수 있습니다. 이번 1차 목표는 로컬에서 즉시 실행 가능한 최소 기능 제품을 안정적으로 만드는 것입니다.

## MVP 범위

- 게임 목록, 검색, 상세 조회
- 별점 1~5점 등록 및 수정
- 리뷰 작성, 수정, 삭제
- 유저 프로필 조회
- 평점 기반 랭킹
- 인기 게임/최신 게임 목록
- Docker 기반 로컬 실행
- PostgreSQL 마이그레이션과 시드 데이터

## 핵심 기능

- 카드형 게임 탐색 UI
- 게임 상세 내 별점 및 리뷰 인터랙션
- 데모 인증 기반 현재 사용자 흐름
- 집계 필드 기반 인기/랭킹 조회
- 즉시 테스트 가능한 더미 데이터

## 제외 기능

- 실제 회원가입/비밀번호 로그인
- 소셜 기능(팔로우, 좋아요, 댓글)
- 관리자 CMS
- 외부 게임 API 연동
- 실제 취향 기반 추천 알고리즘

## 데이터 모델

- `User`: 프로필 정보, 리뷰/별점 작성 주체
- `Game`: 게임 메타데이터와 집계 필드
- `Genre`: 장르 기준 정보
- `Platform`: 플랫폼 기준 정보
- `GameGenre`: 게임-장르 연결
- `GamePlatform`: 게임-플랫폼 연결
- `Rating`: 유저의 1~5점 별점
- `Review`: 유저의 텍스트 리뷰

주요 제약:

- 한 유저는 한 게임에 별점 1개만 가능
- 한 유저는 한 게임에 리뷰 1개만 가능
- `Rating.score`는 1~5 정수
- `Game.avg_rating`, `rating_count`, `review_count`는 비정규화 집계 필드

## API 목록

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

## 주요 화면 목록

- 홈: 인기 게임, 최신 게임, 상위 평점 게임 섹션
- 검색: 제목 기반 검색과 결과 그리드
- 게임 상세: 메타데이터, 평균 평점, 내 별점, 리뷰 목록, 내 리뷰 작성 폼
- 프로필: 유저 정보, 최근 별점, 최근 리뷰
- 랭킹: 평균 평점 기반 게임 순위

## 향후 추천 시스템 확장 포인트

- 별점/리뷰 변경 시 추천 파이프라인 이벤트를 적재할 수 있는 서비스 훅 추가
- `User` 활동 로그와 `Game` 메타데이터를 기반으로 콘텐츠 기반 추천 실험 가능
- 선호 장르/플랫폼 통계를 프로필 집계에 추가 가능
- 추후 `RecommendationSnapshot` 또는 `UserTasteProfile` 테이블을 붙여도 현재 엔터티 구조를 유지할 수 있도록 설계
