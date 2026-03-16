"use client";

import { cn } from "@/lib/utils";
import {
  Avatar as UiAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface AvatarProps {
  src?: string;
  name: string; // 이미지 없을 때 첫 글자를 이니셜로 사용
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "sm",
  md: "default",
  lg: "lg",
} as const;

export function Avatar({
  src,
  name,
  size = "md",
  className,
}: AvatarProps) {
  const initial = name.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <UiAvatar size={sizeMap[size]} className={className}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback className={cn(className)}>{initial}</AvatarFallback>
    </UiAvatar>
  );
}
