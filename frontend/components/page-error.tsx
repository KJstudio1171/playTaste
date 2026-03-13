"use client";

interface PageErrorProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function PageError({ title, description, onRetry }: PageErrorProps) {
  return (
    <main className="panel rounded-[32px] p-8">
      <p className="eyebrow">error</p>
      <h1 className="display-title mt-3 text-4xl font-semibold">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
        >
          다시 시도
        </button>
      ) : null}
    </main>
  );
}
