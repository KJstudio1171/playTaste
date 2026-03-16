import { type ReactNode } from "react";

import {
  Badge as UiBadge,
} from "@/components/ui/badge";

type BadgeVariant = "default" | "success" | "error" | "accent";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
}

const variantMap: Record<BadgeVariant, "default" | "success" | "error" | "accent"> = {
  default: "default",
  success: "success",
  error: "error",
  accent: "accent",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0 text-[10px]",
  md: "",
};

export function Badge({
  variant = "default",
  size = "md",
  children,
  className = "",
}: BadgeProps) {
  return (
    <UiBadge
      variant={variantMap[variant]}
      className={`${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </UiBadge>
  );
}
