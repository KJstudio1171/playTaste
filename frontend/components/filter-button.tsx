import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

interface FilterButtonProps {
  active: boolean;
  children: ReactNode;
  href?: string;       // Link 모드 (서버 컴포넌트 호환, games/page.tsx용)
  disabled?: boolean;  // span 모드 (비활성, 검색 모드용)
  onClick?: () => void; // button 모드 (클라이언트 전용)
}

function getButtonClass(active: boolean, disabled?: boolean) {
  return cn(
    buttonVariants({
      variant: active ? "default" : "secondary",
      size: "sm",
    }),
    "h-9",
    disabled && "cursor-default opacity-50"
  );
}

export function FilterButton({
  active,
  children,
  href,
  disabled,
  onClick,
}: FilterButtonProps) {
  if (disabled) {
    return <span className={getButtonClass(active, true)}>{children}</span>;
  }

  if (href) {
    return (
      <Button asChild variant={active ? "default" : "secondary"} size="sm" className="h-9">
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button type="button" onClick={onClick} variant={active ? "default" : "secondary"} size="sm" className="h-9">
      {children}
    </Button>
  );
}
