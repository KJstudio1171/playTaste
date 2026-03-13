import type { Metadata } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { fetchBackendJson } from "@/lib/api";
import type { UserSummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "playTaste",
  description: "게임을 탐색하고 평점과 리뷰를 남기는 playTaste",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let currentUser: UserSummary | null = null;

  try {
    currentUser = await fetchBackendJson<UserSummary>("/auth/me");
  } catch {
    currentUser = null;
  }

  return (
    <html lang="ko">
      <body>
        <div className="page-shell">
          <SiteHeader currentUser={currentUser} />
          <div className="mx-auto w-full max-w-[1120px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
