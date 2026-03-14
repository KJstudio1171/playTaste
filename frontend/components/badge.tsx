import { type ReactNode } from "react";

type BadgeVariant = "default" | "success" | "error" | "accent";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "chip",
  success: "chip status-success",
  error: "chip status-error",
  accent: "chip border-accent-mid bg-accent-soft text-accent",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0 text-[10px]",
  md: "", // .chip 기본값 사용
};

export function Badge({
  variant = "default",
  size = "md",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
