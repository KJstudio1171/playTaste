# playTaste UI/UX 전체 재설계 구현 플랜

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 현재의 따뜻한 베이지/테라코타 디자인을 클린 미니멀 + 인디고 블루 팔레트로 완전히 교체하고, 네비게이션 구조와 주요 페이지 레이아웃을 재설계한다.

**Architecture:** 페이지 단위 순차 작업 — 디자인 토큰(globals.css) 교체 → 공통 컴포넌트 → 홈 → 게임 목록 → 게임 상세 → 랭킹 → 유저 프로필. 백엔드 변경 없음, 프론트엔드 시각 레이어만 수정.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-13-ui-ux-redesign-design.md`

**Verification (전체):** `cd frontend && npm run lint && npm run build`

---

## Chunk 1: 디자인 파운데이션

### Task 1: globals.css — 디자인 토큰 전면 교체

**Files:**
- Modify: `frontend/app/globals.css`

- [ ] **Step 1: globals.css 전체를 아래 내용으로 교체**

```css
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css");
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap");
@import "tailwindcss";

:root {
  --background: #ffffff;
  --surface: #f9fafb;
  --surface-muted: #f3f4f6;
  --foreground: #111827;
  --muted: #6b7280;
  --subtle: #9ca3af;
  --line: #e5e7eb;
  --line-strong: #d1d5db;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --accent-soft: #eef2ff;
  --accent-mid: #c7d2fe;
  --danger-bg: #fef2f2;
  --danger-text: #dc2626;
  --success-bg: #f0fdf4;
  --success-text: #16a34a;
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-subtle: var(--subtle);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-soft: var(--accent-soft);
  --color-accent-mid: var(--accent-mid);
  --color-danger-bg: var(--danger-bg);
  --color-danger-text: var(--danger-text);
  --color-success-bg: var(--success-bg);
  --color-success-text: var(--success-text);
  --font-sans: "Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  font-family: "Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif;
  text-rendering: optimizeLegibility;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}

input::placeholder,
textarea::placeholder {
  color: var(--subtle);
}

:where(a, button, input, textarea, select):focus-visible {
  outline: 2px solid color-mix(in srgb, var(--accent) 72%, white 28%);
  outline-offset: 2px;
}

.page-shell {
  min-height: 100vh;
}

/* 카드/패널 기본 스타일 (border + bg + shadow) */
.panel {
  border: 1px solid var(--line);
  background: var(--background);
  box-shadow: var(--shadow-card);
}

.panel-featured {
  border: 1px solid var(--accent-mid);
  background: var(--accent-soft);
}

.stat-tile {
  border: 1px solid var(--line);
  background: var(--surface);
}

/* 타이포그래피 */
.eyebrow {
  color: var(--accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* display-title은 제거 — 인라인 Tailwind로 대체 */
.display-title {
  letter-spacing: -0.03em;
}

/* 뱃지/칩 */
.chip {
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: var(--surface);
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.6;
}

/* 버튼 */
.button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 9999px;
  background: var(--accent);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 8px 20px;
  transition: background-color 150ms ease, transform 150ms ease;
}

.button-primary:hover {
  background: var(--accent-hover);
}

.button-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 9999px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--foreground);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 8px 20px;
  transition: border-color 150ms ease, color 150ms ease;
}

.button-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* 입력 필드 */
.input-field {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--foreground);
  padding: 8px 12px;
  font-size: 0.875rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent);
}

/* 상태 뱃지 */
.status-success {
  border: 1px solid color-mix(in srgb, var(--success-text) 20%, transparent);
  background: var(--success-bg);
  color: var(--success-text);
}

.status-error {
  border: 1px solid color-mix(in srgb, var(--danger-text) 20%, transparent);
  background: var(--danger-bg);
  color: var(--danger-text);
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 2: lint 확인**

```bash
cd frontend && npm run lint
```
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add frontend/app/globals.css
git commit -m "style: replace design tokens with clean minimal indigo palette"
```

---

### Task 2: layout.tsx — MobileBottomNav 제거 및 패딩 정리

**Files:**
- Modify: `frontend/app/layout.tsx`
- Delete: `frontend/components/mobile-bottom-nav.tsx`

- [ ] **Step 1: layout.tsx 업데이트**

`frontend/app/layout.tsx`를 아래로 교체:

```tsx
import type { Metadata } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { fetchBackendJson } from "@/lib/api";
import type { UserSummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "playTaste",
  description: "게임을 탐색하고 평점과 리뷰를 남기는 playTaste",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let currentUser: UserSummary | null = null;

  try {
    currentUser = await fetchBackendJson<UserSummary>("/auth/me");
  } catch {
    currentUser = null;
  }

  return (
    <html lang="ko">
      <body>
        <div className="page-shell">
          <SiteHeader currentUser={currentUser} />
          <div className="mx-auto w-full max-w-[1120px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: mobile-bottom-nav.tsx 삭제**

```bash
rm frontend/components/mobile-bottom-nav.tsx
```

- [ ] **Step 3: lint + build**

```bash
cd frontend && npm run lint && npm run build
```
Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add frontend/app/layout.tsx
git rm frontend/components/mobile-bottom-nav.tsx
git commit -m "refactor: remove mobile bottom nav, replace with subnav tabs"
```

---

### Task 3: site-header.tsx — 헤더 + 서브메뉴 탭 재설계

**Files:**
- Modify: `frontend/components/site-header.tsx`

현재: 로고 + 데스크탑 nav + 검색 + 아바타 (단층 헤더)
변경: 상단 헤더 (로고 + 검색 + 아바타) + 하단 서브메뉴 탭 (홈/게임/랭킹/리뷰)

- [ ] **Step 1: site-header.tsx 교체**

```tsx
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlobalSearch } from "@/components/global-search";
import type { UserSummary } from "@/lib/types";

interface SiteHeaderProps {
  currentUser: UserSummary | null;
}

const NAV_LINKS = [
  { href: "/", label: "홈", match: (p: string) => p === "/" },
  { href: "/games", label: "게임", match: (p: string) => p.startsWith("/games") || p === "/search" },
  { href: "/rankings", label: "랭킹", match: (p: string) => p.startsWith("/rankings") },
];

export function SiteHeader({ currentUser }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      {/* 메인 헤더 */}
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-base font-extrabold tracking-[-0.04em] text-foreground">
          play<span className="text-accent">Taste</span>
        </Link>

        <div className="hidden max-w-xs flex-1 sm:block lg:max-w-sm">
          <Suspense fallback={<div className="input-field h-9" />}>
            <GlobalSearch />
          </Suspense>
        </div>

        {currentUser ? (
          <Link
            href={`/users/${currentUser.id}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              {currentUser.display_name.slice(0, 1)}
            </div>
            <span className="hidden sm:inline">{currentUser.display_name}</span>
          </Link>
        ) : (
          <Link href="/games" className="button-secondary shrink-0 py-1.5 text-sm">
            게임 둘러보기
          </Link>
        )}
      </div>

      {/* 모바일 검색 */}
      <div className="border-t border-line px-4 py-2 sm:hidden">
        <Suspense fallback={<div className="input-field h-9" />}>
          <GlobalSearch />
        </Suspense>
      </div>

      {/* 서브메뉴 탭 */}
      <div className="mx-auto flex max-w-[1120px] overflow-x-auto px-4 scrollbar-none sm:px-6 lg:px-8">
        {NAV_LINKS.map((link) => {
          const active = link.match(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: lint + build**

```bash
cd frontend && npm run lint && npm run build
```
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add frontend/components/site-header.tsx
git commit -m "feat: redesign site header with subnav tabs"
```

---

## Chunk 2: 공통 컴포넌트

### Task 4: section-heading.tsx — 타이포그래피 스타일 업데이트

**Files:**
- Modify: `frontend/components/section-heading.tsx`

- [ ] **Step 1: 파일 교체**

```tsx
import Link from "next/link";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1.5 text-lg font-extrabold tracking-[-0.03em] text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="shrink-0 text-sm font-semibold text-accent transition hover:underline"
        >
          {actionLabel} →
        </Link>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add frontend/components/section-heading.tsx
git commit -m "style: update section-heading typography for clean minimal design"
```

---

### Task 5: game-card.tsx — 포스터 카드 + 소형 가로 카드 재설계

**Files:**
- Modify: `frontend/components/game-card.tsx`

현재 variant: `default` (포스터) | `compact` (가로형)
변경: `default` (포스터, 그리드용) | `compact` (가로형, 사이드/리스트용) — 구조 유지, 스타일만 클린 미니멀로 변경

- [ ] **Step 1: 파일 교체**

```tsx
import Image from "next/image";
import Link from "next/link";

import { formatDate, formatRating } from "@/lib/format";
import type { GameCard as GameCardType } from "@/lib/types";

interface GameCardProps {
  game: GameCardType;
  variant?: "default" | "compact";
}

export function GameCard({ game, variant = "default" }: GameCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/games/${game.id}`}
        className="group flex h-full items-center gap-3 rounded-[10px] border border-line bg-surface p-0 transition hover:shadow-[var(--shadow-soft)] overflow-hidden"
      >
        <div className="relative h-[58px] w-[44px] shrink-0 bg-surface-muted">
          <Image
            src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
            alt={game.title}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 py-2 pr-3">
          <h3 className="truncate text-sm font-bold leading-tight text-foreground">{game.title}</h3>
          <p className="mt-0.5 truncate text-xs text-muted">
            {game.developer ?? "개발사 정보 없음"} · {formatDate(game.release_date)}
          </p>
        </div>
        <div className="shrink-0 pr-3 text-right">
          <span className="text-sm font-extrabold text-accent">{formatRating(game.avg_rating)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/games/${game.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-line bg-background transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
        <Image
          src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
          alt={game.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 rounded-[4px] bg-accent px-1.5 py-0.5 text-[10px] font-extrabold text-white">
          {formatRating(game.avg_rating)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-sm font-bold leading-snug text-foreground">{game.title}</h3>
        <p className="text-xs text-subtle">
          {game.genres[0]?.name ?? game.developer ?? ""}
        </p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: lint + build**

```bash
cd frontend && npm run lint && npm run build
```

- [ ] **Step 3: 커밋**

```bash
git add frontend/components/game-card.tsx
git commit -m "style: redesign game card with clean minimal style"
```

---

### Task 6: rating-stars.tsx — 비활성 별 색상 업데이트

**Files:**
- Modify: `frontend/components/rating-stars.tsx`

현재: 비활성 별 `text-[#d6b8a3]` (베이지)
변경: `text-line-strong` (회색)

- [ ] **Step 1: 비활성 별 색상 2곳 수정**

`text-[#d6b8a3]` → `text-line-strong` (interactive 버튼과 span 각 1곳씩, 총 2곳)

```tsx
// interactive 버튼 (line 36):
className={`transition ${active ? "text-accent" : "text-line-strong"} ${pending ? "opacity-60" : "hover:-translate-y-0.5"}`}

// 일반 span (line 44):
<span key={score} className={active ? "text-accent" : "text-line-strong"}>
```

- [ ] **Step 2: 커밋**

```bash
git add frontend/components/rating-stars.tsx
git commit -m "style: update inactive star color to neutral gray"
```

---

### Task 7: rating-widget.tsx — accent-soft 배경 스타일 적용

**Files:**
- Modify: `frontend/components/rating-widget.tsx`

현재: `panel rounded-[30px]`, 내부 `rounded-[24px] bg-surface-muted/60`
변경: `panel-featured rounded-xl`, 내부 `rounded-lg bg-accent-soft`

- [ ] **Step 1: 클래스 업데이트**

```tsx
// 바깥 wrapper (line 59):
<div className="panel-featured rounded-xl p-5 sm:p-6">

// eyebrow 아래 heading (line 61):
<p className="eyebrow">내 별점</p>
<h3 className="mt-1.5 text-base font-bold text-foreground">이 게임, 몇 점인가요?</h3>

// 별점 컨테이너 (line 66):
<div className="mt-4 rounded-lg bg-accent-soft p-4">

// 피드백 (line 78):
<p className={`mt-3 rounded-lg px-4 py-2.5 text-sm font-medium ${...}`}>
```

- [ ] **Step 2: 커밋**

```bash
git add frontend/components/rating-widget.tsx
git commit -m "style: update rating widget to accent-soft panel style"
```

---

## Chunk 3: 페이지 — 홈 & 게임 목록

### Task 8: 홈 페이지 — Featured + 그리드 레이아웃

**Files:**
- Modify: `frontend/app/page.tsx`

현재: hero 패널 + stat 타일 3개 + GameShelf (수평 스크롤)
변경: Featured 카드 (2fr) + 소형 카드 사이드 (1fr) + 5열 그리드 섹션들

- [ ] **Step 1: page.tsx 교체**

```tsx
import Image from "next/image";
import Link from "next/link";

import { GameCard } from "@/components/game-card";
import { SectionHeading } from "@/components/section-heading";
import { fetchBackendJson } from "@/lib/api";
import { formatDate, formatRating } from "@/lib/format";
import type { GameCard as GameCardType, PaginatedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [popular, latest, rankings] = await Promise.all([
    fetchBackendJson<PaginatedResponse<GameCardType>>("/games/popular?page_size=8"),
    fetchBackendJson<PaginatedResponse<GameCardType>>("/games/latest?page_size=8"),
    fetchBackendJson<PaginatedResponse<GameCardType>>("/rankings?type=rating&page_size=8"),
  ]);

  const featuredGame = popular.items[0];
  const sideGames = popular.items.slice(1, 4);

  return (
    <main className="space-y-10">
      {/* 이번 주 추천 */}
      <section>
        <SectionHeading
          eyebrow="이번 주 추천"
          title="지금 주목받는 게임"
          actionLabel="전체 보기"
          actionHref="/games?sort=popular"
        />
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          {/* Featured 카드 */}
          {featuredGame && (
            <Link
              href={`/games/${featuredGame.id}`}
              className="group overflow-hidden rounded-xl border border-line bg-background transition hover:shadow-[var(--shadow-soft)]"
            >
              <div className="relative h-[200px] w-full overflow-hidden bg-surface-muted">
                <Image
                  src={featuredGame.cover_image_url ?? "https://placehold.co/1200x400/1f2937/f8fafc?text=Game"}
                  alt={featuredGame.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-[4px] bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                  Editor&apos;s Pick
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">{featuredGame.title}</h2>
                <p className="mt-0.5 text-xs text-muted">
                  {featuredGame.developer ?? "개발사 정보 없음"} · {formatDate(featuredGame.release_date)}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-2xl font-black tracking-[-0.04em] text-accent">
                    {formatRating(featuredGame.avg_rating)}
                  </span>
                  <div className="flex-1">
                    <div className="h-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${(featuredGame.avg_rating / 5) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-subtle">리뷰 {featuredGame.review_count}개</p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* 소형 사이드 카드 */}
          <div className="flex flex-col gap-2">
            {sideGames.map((game) => (
              <GameCard key={game.id} game={game} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* 최신 게임 */}
      <section>
        <SectionHeading
          eyebrow="최신 게임"
          title="새로 출시된 게임들"
          actionLabel="전체 보기"
          actionHref="/games?sort=latest"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {latest.items.slice(0, 5).map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* 역대 최고 평점 */}
      <section>
        <SectionHeading
          eyebrow="역대 최고 평점"
          title="플레이어들이 사랑한 명작"
          actionLabel="랭킹 보기"
          actionHref="/rankings"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {rankings.items.slice(0, 5).map((game, index) => (
            <div key={game.id} className="relative">
              {index < 3 && (
                <div className="absolute left-2 top-2 z-10 rounded-[4px] bg-foreground px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                  #{index + 1}
                </div>
              )}
              <div className={index === 0 ? "rounded-[10px] ring-2 ring-accent ring-offset-2" : ""}>
                <GameCard game={game} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: lint + build**

```bash
cd frontend && npm run lint && npm run build
```

- [ ] **Step 3: 커밋**

```bash
git add frontend/app/page.tsx
git commit -m "feat: redesign home page with featured card and grid layout"
```

---

### Task 9: 게임 목록 페이지 — 클린 헤더 + 그리드

**Files:**
- Modify: `frontend/app/games/page.tsx`

현재: panel-featured 큰 헤더 + 정렬 버튼 + 검색박스 + 4열 그리드
변경: 심플 헤더 + 정렬 탭 + 4열 그리드 (기존 기능 유지, 스타일 클린업)

- [ ] **Step 1: 헤더 섹션 및 빈 상태 패널 라운딩 업데이트**

`frontend/app/games/page.tsx`에서 아래 변경:

```tsx
// line 63: 메인 헤더 섹션 panel → 클린 스타일
<section className="rounded-xl border border-line bg-background p-5 sm:p-6">

// line 67: eyebrow 제거, 제목 스타일 단순화
<h1 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
  {isSearch ? `"${query}" 검색 결과` : "게임 탐색"}
</h1>

// line 84: 정렬 버튼 — active 스타일 업데이트
className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
  active ? "bg-accent text-white" : "border border-line text-foreground hover:border-accent hover:text-accent"
}`}

// line 110: 검색박스 우측 정보 영역
<div className="rounded-lg bg-surface-muted p-4">

// line 127: 게임 그리드 — 반응형 컬럼
<section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

// line 133: 빈 상태 패널
<section className="rounded-xl border border-line p-6">

// line 144: 페이지네이션 패널
<section className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
```

- [ ] **Step 2: lint + build**

```bash
cd frontend && npm run lint && npm run build
```

- [ ] **Step 3: 커밋**

```bash
git add frontend/app/games/page.tsx
git commit -m "style: update games list page to clean minimal layout"
```

---

## Chunk 4: 페이지 — 게임 상세, 랭킹, 유저 프로필

### Task 10: 게임 상세 페이지 — 2열 반응형 레이아웃

**Files:**
- Modify: `frontend/app/games/[id]/page.tsx`

현재: `xl:grid-cols-[340px_minmax(0,1fr)]` 2섹션
변경: 좌측 커버+정보(5fr) | 우측 평점위젯 sticky(3fr), 모바일은 단열 스택

- [ ] **Step 1: 레이아웃 재구성**

```tsx
// 전체 main을 아래로 교체:
return (
  <main>
    {/* 게임 정보 + 사이드바 */}
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)]">
      {/* 좌측: 커버 + 메타 정보 */}
      <div className="space-y-6">
        {/* 커버 + 제목 그리드 */}
        <div className="flex gap-5">
          <div className="relative h-[180px] w-[130px] shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:h-[220px] sm:w-[160px]">
            <Image
              src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
              alt={game.title}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="eyebrow">게임 상세</p>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">{game.title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted">{game.description}</p>
          </div>
        </div>

        {/* 스탯 타일 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="stat-tile rounded-lg p-3 text-center">
            <p className="eyebrow">평균 평점</p>
            <p className="mt-1.5 text-2xl font-black text-accent">{formatRating(game.avg_rating)}</p>
            <div className="mt-1 flex justify-center">
              <RatingStars value={Math.round(game.avg_rating)} size="sm" />
            </div>
          </div>
          <div className="stat-tile rounded-lg p-3 text-center">
            <p className="eyebrow">평가 수</p>
            <p className="mt-1.5 text-2xl font-black text-foreground">{game.rating_count}</p>
            <p className="mt-1 text-xs text-muted">명 참여</p>
          </div>
          <div className="stat-tile rounded-lg p-3 text-center">
            <p className="eyebrow">리뷰 수</p>
            <p className="mt-1.5 text-2xl font-black text-foreground">{game.review_count}</p>
            <p className="mt-1 text-xs text-muted">개 작성</p>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Meta label="개발사" value={game.developer ?? "정보 없음"} />
          <Meta label="퍼블리셔" value={game.publisher ?? "정보 없음"} />
          <Meta label="출시일" value={formatDate(game.release_date)} />
          <Meta label="플랫폼" value={game.platforms.length > 0 ? game.platforms.map((p) => p.name).join(", ") : "정보 없음"} />
        </div>

        {/* 장르/플랫폼 태그 */}
        <div className="flex flex-wrap gap-2">
          {game.genres.map((genre) => (
            <span key={genre.id} className="chip bg-accent-soft text-accent">
              {genre.name}
            </span>
          ))}
          {game.platforms.map((platform) => (
            <span key={platform.id} className="chip">
              {platform.name}
            </span>
          ))}
        </div>

        {/* 리뷰 피드 */}
        <div>
          <SectionHeading
            eyebrow="최신 리뷰"
            title="최신 리뷰"
          />
          <ReviewFeed reviews={game.latest_reviews} highlightReviewId={game.my_review?.id} />
        </div>
      </div>

      {/* 우측: 평점 위젯 (sticky) */}
      <div className="space-y-4 lg:sticky lg:top-[96px] lg:self-start">
        <RatingWidget
          key={`${game.id}-${game.my_rating ?? 0}`}
          gameId={game.id}
          initialRating={game.my_rating}
        />
        <ReviewEditor
          key={`${game.id}-${game.my_review?.id ?? "new"}-${game.my_review?.updated_at ?? "empty"}`}
          gameId={game.id}
          initialReview={game.my_review}
        />
      </div>
    </div>
  </main>
);

// Meta 컴포넌트 (파일 하단):
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-muted p-3">
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
```

- [ ] **Step 2: lint + build**

```bash
cd frontend && npm run lint && npm run build
```

- [ ] **Step 3: 커밋**

```bash
git add frontend/app/games/[id]/page.tsx
git commit -m "feat: redesign game detail page with responsive 5fr/3fr layout"
```

---

### Task 11: 랭킹 페이지 — 평점 바 + 1~3위 인디고 강조

**Files:**
- Modify: `frontend/app/rankings/page.tsx`

현재: `panel-featured`/`panel` 카드 + 평점 숫자
변경: 가로형 리스트 + 4px 평점 바 (5점 만점 기준) + 1~3위 인디고 강조

- [ ] **Step 1: rankings/page.tsx 교체**

```tsx
import Image from "next/image";
import Link from "next/link";

import { fetchBackendJson } from "@/lib/api";
import { formatDate, formatRating } from "@/lib/format";
import type { GameCard, PaginatedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RankingsPage() {
  const rankings = await fetchBackendJson<PaginatedResponse<GameCard>>("/rankings?type=rating&page_size=20");

  return (
    <main className="space-y-6">
      <div>
        <p className="eyebrow">평점 랭킹</p>
        <h1 className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">평점 기준 게임 랭킹</h1>
        <p className="mt-2 text-sm text-muted">
          평균 평점과 참여 수를 함께 고려해 현재 가장 좋은 반응을 얻는 작품입니다.
        </p>
      </div>

      <div className="divide-y divide-line overflow-hidden rounded-xl border border-line">
        {rankings.items.map((game, index) => {
          const isTop3 = index < 3;
          const fillPercent = (game.avg_rating / 5) * 100;

          return (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className={`flex items-center gap-4 p-4 transition hover:bg-surface ${
                isTop3 ? "border-l-[3px] border-l-accent bg-accent-soft hover:bg-accent-soft" : "border-l-[3px] border-l-transparent"
              }`}
            >
              {/* 순번 */}
              <div
                className={`w-7 shrink-0 text-center text-sm font-extrabold ${
                  isTop3 ? "text-accent" : "text-muted"
                }`}
              >
                {index + 1}
              </div>

              {/* 커버 */}
              <div className="relative h-[58px] w-[44px] shrink-0 overflow-hidden rounded-md bg-surface-muted">
                <Image
                  src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
                  alt={game.title}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>

              {/* 제목/메타 */}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold text-foreground">{game.title}</h2>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {game.developer ?? "개발사 정보 없음"} · {formatDate(game.release_date)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {game.genres.slice(0, 2).map((genre) => (
                    <span key={genre.id} className="chip bg-accent-soft text-accent">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 평점 바 + 숫자 */}
              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                <div className="w-[120px]">
                  <div className="h-1 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-xs text-muted">평가 {game.rating_count}개</p>
                </div>
                <span className="w-10 text-right text-base font-extrabold text-accent">
                  {formatRating(game.avg_rating)}
                </span>
              </div>

              {/* 모바일: 숫자만 */}
              <div className="shrink-0 sm:hidden">
                <span className="text-sm font-extrabold text-accent">{formatRating(game.avg_rating)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: lint + build**

```bash
cd frontend && npm run lint && npm run build
```

- [ ] **Step 3: 커밋**

```bash
git add frontend/app/rankings/page.tsx
git commit -m "feat: redesign rankings page with rating bar and top-3 indigo highlight"
```

---

### Task 12: 유저 프로필 페이지 — 클린 스타일 적용

**Files:**
- Modify: `frontend/app/users/[id]/page.tsx`

현재: panel 헤더 + stat-tile 3개 + 리뷰/평점 리스트
변경: 동일 구조 유지, `rounded-[32px]` → `rounded-xl`, `rounded-[28px]` → `rounded-xl`, `rounded-[24px]` → `rounded-lg`, `rounded-[22px]` → `rounded-lg`로 라운딩 통일

- [ ] **Step 1: 라운딩 및 스타일 업데이트**

`frontend/app/users/[id]/page.tsx`에서 아래 교체:

```tsx
// line 33: 메인 헤더 panel
<section className="panel rounded-xl p-6 sm:p-8">

// line 36: 아바타
<div className="flex h-20 w-20 items-center justify-center rounded-xl bg-accent-soft text-2xl font-bold text-accent">

// line 50: stat-tile 3개 각각
<div className="stat-tile rounded-lg px-4 py-3">

// line 73: 리뷰/평점 없을 때 empty 패널
<div className="rounded-lg border border-line p-5 text-sm text-muted">

// line 77: 평점 항목 wrapper
<div className="rounded-lg bg-surface-muted px-4 py-2.5 text-sm text-muted">

// line 93: 리뷰 article
<article key={review.id} className="panel rounded-xl p-5">
```

- [ ] **Step 2: lint + build**

```bash
cd frontend && npm run lint && npm run build
```

- [ ] **Step 3: 커밋**

```bash
git add frontend/app/users/[id]/page.tsx
git commit -m "style: update user profile page rounding and panel styles"
```

---

## 최종 검증

- [ ] **전체 빌드 확인**

```bash
cd frontend && npm run lint && npm run build
```
Expected: 에러 없음, 빌드 성공

- [ ] **Docker 환경에서 확인 (선택)**

```bash
docker compose up --build -d
# 브라우저에서 http://localhost:3000 확인
```

- [ ] **최종 커밋**

```bash
git add -A
git commit -m "style: complete clean minimal UI/UX redesign with indigo accent"
```
