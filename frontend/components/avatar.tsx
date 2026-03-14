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

export function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { px, text } = sizeMap[size];
  const initial = name.slice(0, 1);

  // className으로 shape/color 오버라이드 가능 (Tailwind 클래스 후순위가 우선)
  const base =
    `inline-flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-white ${text} ${className}`.trim();

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
