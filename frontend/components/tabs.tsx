import Link from "next/link";

export interface Tab {
  label: string;
  href: string;
  match?: (pathname: string) => boolean; // 커스텀 활성 판정 (없으면 href 직접 비교)
}

interface TabsProps {
  tabs: Tab[];
  activeHref: string;  // 현재 pathname (usePathname()은 호출자에서)
}

export function Tabs({ tabs, activeHref }: TabsProps) {
  return (
    <>
      {tabs.map((tab) => {
        const active = tab.match ? tab.match(activeHref) : activeHref === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              active
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </>
  );
}
