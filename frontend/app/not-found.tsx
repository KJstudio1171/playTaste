import Link from "next/link";

export default function NotFound() {
  return (
    <main className="panel rounded-[32px] p-10 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display-title mt-3 text-4xl font-semibold sm:text-5xl">원하는 페이지를 찾지 못했어요</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
        요청한 게임이나 화면이 아직 준비되지 않았을 수 있어요. 홈이나 게임 탐색 화면으로 이동해서 다시
        찾아보세요.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href="/" className="button-primary">
          홈으로 가기
        </Link>
        <Link href="/games" className="button-secondary">
          게임 찾기
        </Link>
      </div>
    </main>
  );
}
