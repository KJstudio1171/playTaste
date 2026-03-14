import Link from "next/link";
import type { ReactNode } from "react";

interface FilterButtonProps {
  active: boolean;
  children: ReactNode;
  href?: string;       // Link 모드 (서버 컴포넌트 호환, games/page.tsx용)
  disabled?: boolean;  // span 모드 (비활성, 검색 모드용)
  onClick?: () => void; // button 모드 (클라이언트 전용)
}

const activeClass = "bg-accent text-white";
const inactiveClass =
  "border border-line text-foreground transition hover:border-accent hover:text-accent";
const disabledClass = "border border-line text-foreground opacity-50 cursor-default";

export function FilterButton({
  active,
  children,
  href,
  disabled,
  onClick,
}: FilterButtonProps) {
  const base = `rounded-full px-4 py-1.5 text-sm font-semibold ${
    disabled ? disabledClass : active ? activeClass : inactiveClass
  }`;

  if (disabled) {
    return <span className={base}>{children}</span>;
  }

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={base}>
      {children}
    </button>
  );
}
