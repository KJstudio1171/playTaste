interface PageLoadingProps {
  title: string;
  description?: string;
}

export function PageLoading({ title, description }: PageLoadingProps) {
  return (
    <main className="space-y-6">
      <section className="panel rounded-[32px] p-8">
        <p className="eyebrow">불러오는 중</p>
        <h1 className="display-title mt-3 text-4xl font-semibold">{title}</h1>
        {description ? <p className="mt-3 text-sm text-muted">{description}</p> : null}
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="panel animate-pulse rounded-[28px] p-4">
            <div className="aspect-[3/4] rounded-[22px] bg-accent-soft" />
            <div className="mt-4 h-5 rounded bg-accent-soft" />
            <div className="mt-3 h-4 w-2/3 rounded bg-[rgba(67,43,24,0.08)]" />
          </div>
        ))}
      </div>
    </main>
  );
}
