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
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display-title mt-2 text-3xl font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="button-secondary shrink-0 self-start sm:self-auto">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
