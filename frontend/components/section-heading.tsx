import Link from "next/link";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1.5 text-lg font-extrabold tracking-[-0.03em] text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="shrink-0 text-sm font-semibold text-accent transition hover:underline"
        >
          {actionLabel} →
        </Link>
      ) : null}
    </div>
  );
}
