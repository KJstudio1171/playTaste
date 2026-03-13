import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const nextParams = new URLSearchParams();

  if (params.q) {
    nextParams.set("q", params.q);
  }
  if (params.page) {
    nextParams.set("page", params.page);
  }
  if (params.sort) {
    nextParams.set("sort", params.sort);
  }

  redirect(nextParams.toString() ? `/games?${nextParams.toString()}` : "/games");
}
