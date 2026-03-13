"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "홈", match: (pathname: string) => pathname === "/", icon: HomeIcon },
  { href: "/games", label: "탐색", match: (pathname: string) => pathname.startsWith("/games") || pathname === "/search", icon: SearchIcon },
  { href: "/rankings", label: "랭킹", match: (pathname: string) => pathname.startsWith("/rankings"), icon: TrophyIcon },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[rgba(255,250,243,0.96)] px-3 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] pt-2 shadow-[0_-12px_30px_rgba(69,42,24,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {items.map(({ href, label, match, icon: Icon }) => {
          const active = match(pathname);

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                active ? "bg-accent-soft text-accent-strong" : "text-muted"
              }`}
            >
              <Icon active={active} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${active ? "text-accent-strong" : "text-muted"}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M3.5 10.5 12 4l8.5 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${active ? "text-accent-strong" : "text-muted"}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function TrophyIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${active ? "text-accent-strong" : "text-muted"}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M8 4h8v4a4 4 0 0 1-8 0Z" />
      <path d="M8 6H5a2 2 0 0 0 2 3h1" />
      <path d="M16 6h3a2 2 0 0 1-2 3h-1" />
      <path d="M12 12v4" />
      <path d="M9 20h6" />
      <path d="M10 16h4" />
    </svg>
  );
}
