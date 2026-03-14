# 디자인 시스템 Design Spec

**Date:** 2026-03-15
**Status:** Approved

## 목적

기존 `globals.css`에 혼재된 CSS 변수와 컴포넌트 클래스를 역할별 파일로 분리하고,
인라인으로 반복되는 React 패턴을 5개 공통 컴포넌트로 추출한다.
기존 스타일 값은 변경하지 않는다.

## 접근 방식

멀티 파일 분리 (B안): `styles/tokens/`, `styles/components/` 폴더 구조.
`globals.css`는 @import 진입점으로만 사용.

## 아키텍처

### 토큰 레이어 (styles/tokens/)
- colors.css — 색상 CSS 변수 16개 (1-레이어, 값 직접 할당)
- shadows.css — 그림자 토큰 2개 + 신규 --shadow-focus
- typography.css — 폰트·크기·자간 토큰
- spacing.css — 간격 토큰 (참조용, Tailwind 유틸리티 보조)
- radius.css — border-radius 토큰 6단계

### 컴포넌트 CSS 레이어 (styles/components/)
- panels.css, buttons.css, forms.css, badges.css, typography-classes.css

### 신규 React 컴포넌트 (components/)
- Badge: variant(default|success|error|accent) + size(sm|md)
- Avatar: src + name(이니셜 fallback) + size(sm=24px|md=40px|lg=80px), "use client"
- FilterButton: href(Link)/disabled(span)/onClick(button) 3-way render
- Pagination: page + totalPages + baseUrl + params?(Record<string,string>)
- Tabs: tabs(Tab[]) + activeHref — Tab에 match?(fn) 선택 필드 포함

## 적용 대상 기존 파일
- site-header.tsx → Tabs, Avatar
- review-feed.tsx → Avatar
- games/page.tsx → FilterButton, Pagination
- rankings/page.tsx → Badge
- users/[id]/page.tsx → Avatar
- games/[id]/page.tsx → Badge
