"use client";

import { useState } from "react";

interface AvatarProps {
  src?: string;
  name: string; // 이미지 없을 때 첫 글자를 이니셜로 사용
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { px: 24, text: "text-xs" },
  md: { px: 40, text: "text-sm" },
  lg: { px: 80, text: "text-2xl" },
} as const;

export function Avatar({
  src,
  name,
  size = "md",
  // 기본값으로 색상 지정 — callers can override by passing className
  className = "bg-accent text-white",
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { px, text } = sizeMap[size];
  const initial = name.slice(0, 1);

  // 구조적 클래스만 base에 포함; 색상/모양은 className으로 완전 제어
  const base =
    `inline-flex shrink-0 items-center justify-center rounded-full font-bold ${text} ${className}`.trim();

  if (src && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={`rounded-full object-cover ${className}`.trim()}
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <span className={base} style={{ width: px, height: px }}>
      {initial}
    </span>
  );
}
