interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display-title mt-2 text-3xl font-semibold text-foreground">{title}</h2>
      </div>
      {description ? (
        <p className="max-w-xl text-sm leading-6 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
