import Link from "next/link";

export default function NotFound() {
  return (
    <main className="panel rounded-[32px] p-10 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display-title mt-3 text-5xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
        요청한 게임이나 유저 정보가 아직 준비되지 않았습니다. 홈이나 검색 화면으로 이동해서 다시 찾아보세요.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href="/" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
          홈으로
        </Link>
        <Link
          href="/search"
          className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-foreground"
        >
          검색하기
        </Link>
      </div>
    </main>
  );
}
