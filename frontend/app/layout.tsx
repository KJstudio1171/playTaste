import type { Metadata } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { fetchBackendJson } from "@/lib/api";
import type { UserSummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "playTaste",
  description: "WatchaPedia-inspired game rating and review MVP",
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
          <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-6 sm:px-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
