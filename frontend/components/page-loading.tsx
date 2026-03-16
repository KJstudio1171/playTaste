import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PageLoadingProps {
  title: string;
  description?: string;
}

export function PageLoading({ title, description }: PageLoadingProps) {
  return (
    <main className="space-y-6">
      <Card className="rounded-[32px] p-8">
        <p className="eyebrow">불러오는 중</p>
        <h1 className="display-title mt-3 text-4xl font-semibold">{title}</h1>
        {description ? <p className="mt-3 text-sm text-muted">{description}</p> : null}
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="rounded-[28px] p-4">
            <Skeleton className="aspect-[3/4] rounded-[22px]" />
            <Skeleton className="mt-4 h-5 rounded" />
            <Skeleton className="mt-3 h-4 w-2/3 rounded bg-border" />
          </Card>
        ))}
      </div>
    </main>
  );
}
