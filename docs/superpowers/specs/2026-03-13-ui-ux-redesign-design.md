# playTaste UI/UX 전체 재설계 — 디자인 스펙

**날짜**: 2026-03-13
**상태**: 승인됨

---

## 1. 디자인 방향

**무드**: 클린 미니멀 — Letterboxd/IMDb 스타일. 흰 배경, 타이포그래피 중심, 콘텐츠가 주인공. 현재의 따뜻한 베이지·테라코타 팔레트에서 완전히 벗어남.

**구현 전략**: 페이지 단위 순차 작업 — 홈 → 게임 목록 → 게임 상세 → 랭킹 → 유저 프로필 순서로 완성.

---

## 2. 디자인 토큰

### 컬러
```
--background:     #ffffff
--surface:        #f9fafb
--surface-muted:  #f3f4f6
--foreground:     #111827
--muted:          #6b7280
--subtle:         #9ca3af
--line:           #e5e7eb
--line-strong:    #d1d5db

--accent:         #4f46e5   (Indigo 600)
--accent-hover:   #4338ca   (Indigo 700)
--accent-soft:    #eef2ff   (Indigo 50)
--accent-mid:     #c7d2fe   (Indigo 200)
--accent-text:    #4f46e5

--danger-bg:      #fef2f2
--danger-text:    #dc2626
--success-bg:     #f0fdf4
--success-text:   #16a34a

--shadow-card:    0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
--shadow-soft:    0 4px 12px rgba(0,0,0,0.08)
```

### 타이포그래피
- **폰트**: `'Pretendard', 'Noto Sans KR', -apple-system, sans-serif` (단일 패밀리)
- **계층화**: font-weight 차이로만 표현 (400/500/600/700/800/900)
- **letter-spacing**: 제목 `-0.03em`, 레이블 `+0.08em`, 본문 `0`
- **기존 Gowun Batang 세리프 제거**

### 간격 & 형태
- **border-radius**: `8px` (소형), `10px` (카드), `12px` (패널), `9999px` (pill 버튼)
- **기존 28~32px의 과도한 라운딩 제거**
- **레이아웃 max-width**: `1120px`

---

## 3. 네비게이션 구조

### 헤더 (sticky, 52px)
```
[playTaste 로고]   [검색바 200px]   [유저 아바타]
```
- 배경: `rgba(255,255,255,0.95)` + `backdrop-filter: blur(8px)`
- 하단 border: `1px solid var(--line)`

### 서브메뉴 탭 (34px)
```
[홈] [게임] [랭킹] [리뷰]
```
- 활성 탭: `color: var(--accent)`, `border-bottom: 2px solid var(--accent)`
- 비활성: `color: var(--muted)`, hover 시 `color: var(--foreground)`
- **반응형**: `md` (768px) 이상에서는 헤더 아래 서브메뉴 탭 노출. `md` 미만(모바일)에서는 `overflow-x: auto; white-space: nowrap` 수평 스크롤 탭으로 동작.
- **`mobile-bottom-nav.tsx` 삭제**: 서브메뉴 탭이 모바일 네비게이션을 완전히 대체. 컴포넌트 파일과 `layout.tsx`의 import 모두 제거.

---

## 4. 공통 컴포넌트

### 게임 카드 (2종)

**포스터 카드** (그리드용)
- 흰 배경, `border: 1px solid var(--line)`, `border-radius: 10px`
- 세로형 커버 이미지 `aspect-ratio: 3/4`
- 우하단 평점 배지: `background: var(--accent)`, 흰 텍스트
- 하단 패딩 영역: 제목 (`font-weight: 700`) + 장르 (`color: var(--subtle)`)
- hover: `box-shadow: var(--shadow-soft)`, `-translate-y-0.5`

**소형 가로 카드** (Featured 사이드, 리스트용)
- `display: flex`, 썸네일 44×58px + 텍스트 + 평점
- `background: var(--surface)`, `border-radius: 10px`

### SectionHeading
```
[LABEL - 인디고 소문자 레이블]
[제목 - font-weight: 800, -0.03em]
                            [전체 보기 →]
```
- **레이블**: `font-size: 10px`, `font-weight: 700`, `letter-spacing: 0.1em`, `text-transform: uppercase`, `color: var(--accent)`
- **제목**: `font-size: 18px`, `font-weight: 800`, `letter-spacing: -0.03em`, `color: var(--foreground)`
- **링크**: `font-size: 12px`, `font-weight: 600`, `color: var(--accent)`, hover: underline

### 버튼
- **Primary**: `background: var(--accent)`, 흰 텍스트, `border-radius: 9999px`, `padding: 8px 20px`
- **Secondary**: `border: 1px solid var(--line)`, `border-radius: 9999px`, hover: border 인디고
- **Ghost**: 텍스트만, hover: `color: var(--accent)`

### 별점 (RatingStars)
- 채워진 별: `color: var(--accent)` (현재 #d6b8a3 → 인디고로 변경)
- 빈 별: `color: var(--line-strong)`

---

## 5. 페이지별 레이아웃

### 홈 (`/`)
1. **이번 주 추천** — `grid: 2fr 1fr` (`md` 이상), 모바일은 단열 스택
   - 좌: Featured 카드 — 커버 이미지 `height: 200px` (가로 100% 채움), `aspect-ratio` 미적용, 하단 본문 영역에 제목/메타/평점/리뷰수
   - 우: 소형 가로 카드 3개 스택 (`height: 100%`로 Featured 카드와 높이 맞춤)
2. **최신 게임** — 포스터 카드 그리드: 2열 (`<640px`) → 3열 (`sm: 640px`) → 4열 (`md: 768px`) → 5열 (`lg: 1024px`)
3. **역대 최고 평점** — 포스터 카드 그리드 (동일 반응형 적용), 1위 카드는 `background: var(--accent-soft)`, `border-color: var(--accent-mid)`

### 게임 목록 (`/games`)
- 헤더 아래 필터/정렬 바 (장르, 플랫폼, 정렬 기준)
- 4열 포스터 카드 그리드
- 하단 페이지네이션 (pill 버튼)

### 게임 상세 (`/games/[id]`)
- **데스크탑** (`lg` 이상): `grid: 5fr 3fr` — 좌측 콘텐츠 | 우측 사이드바
  - 좌: 커버 이미지 + 제목/메타/설명/리뷰 피드
  - 우: 평점 위젯 (`position: sticky; top: 96px`) + 유사 게임 목록
- **모바일** (`lg` 미만): 단열 — 커버 이미지 → 제목/메타 → 평점 위젯 → 설명 → 리뷰 피드 순서로 수직 스택
- 평점 위젯: `background: var(--accent-soft)`, `border: 1px solid var(--accent-mid)`

### 랭킹 (`/rankings`)
- 순번 + 가로형 카드 리스트 (전체 폭)
- 각 행: `[순번] [커버 44×58px] [제목/장르] [평점 바] [숫자 평점]`
- **평점 바**: `height: 4px`, `background: var(--line)` (트랙), `background: var(--accent)` (채움), `border-radius: 2px`, `width: 120px` 고정. 5점 만점 기준 퍼센트로 너비 계산 (`fill-width = score / 5 * 100%`)
- 1~3위 행: `background: var(--accent-soft)`, `border-left: 3px solid var(--accent)`, 순번 텍스트 `color: var(--accent)`, `font-weight: 800`
- 4위 이하: `background: transparent`, `border-left: 3px solid transparent`

### 유저 프로필 (`/users/[id]`)
- 상단: 아바타 + 이름 + 통계 (평가수 / 리뷰수 / 평균 평점)
- 탭: 최근 평가 | 작성한 리뷰
- 콘텐츠: 포스터 카드 그리드 또는 리뷰 리스트

---

## 6. 제거 항목

- 배경 그리드 패턴 (32px grid overlay) 제거
- 다층 그라디언트 배경 제거 → 단색 `#ffffff`
- 28~32px 과도한 border-radius 제거
- Gowun Batang 세리프 폰트 제거
- `.panel-featured`, `.stat-tile` 등 현재 커스텀 클래스 전면 교체
- 테라코타/베이지 색상 변수 전체 교체

---

## 7. 파일 변경 범위

| 파일 | 변경 내용 |
|------|-----------|
| `frontend/app/globals.css` | CSS 변수 전체 재정의, 커스텀 클래스 재작성 |
| `frontend/app/layout.tsx` | 폰트 교체 (Pretendard/Noto Sans KR) |
| `frontend/app/page.tsx` | 홈 레이아웃 재구성 |
| `frontend/app/games/page.tsx` | 게임 목록 레이아웃 |
| `frontend/app/games/[id]/page.tsx` | 상세 페이지 2열 레이아웃 |
| `frontend/app/rankings/page.tsx` | 랭킹 리스트 레이아웃 |
| `frontend/app/users/[id]/page.tsx` | 유저 프로필 레이아웃 |
| `frontend/components/site-header.tsx` | 헤더 + 서브메뉴 탭 |
| `frontend/components/mobile-bottom-nav.tsx` | **삭제** (서브메뉴 탭으로 완전 대체, layout.tsx import 제거) |
| `frontend/components/game-card.tsx` | 포스터 카드 + 소형 카드 |
| `frontend/components/rating-stars.tsx` | 별 색상 인디고로 변경 |
| `frontend/components/rating-widget.tsx` | accent-soft 배경 스타일 |
| `frontend/components/review-editor.tsx` | 클린 스타일 적용 |
| `frontend/components/review-feed.tsx` | 클린 스타일 적용 |
| `frontend/components/section-heading.tsx` | 레이블+제목+링크 구조 |
