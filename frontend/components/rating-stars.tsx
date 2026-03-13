interface RatingStarsProps {
  value: number;
  interactive?: boolean;
  pending?: boolean;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-base gap-1",
  md: "text-2xl gap-1.5",
  lg: "text-3xl gap-2",
};

export function RatingStars({
  value,
  interactive = false,
  pending = false,
  onChange,
  size = "md",
}: RatingStarsProps) {
  return (
    <div className={`flex items-center ${sizeMap[size]}`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const score = index + 1;
        const active = score <= value;

        if (interactive) {
          return (
            <button
              key={score}
              type="button"
              aria-label={`${score}점 주기`}
              disabled={pending}
              onClick={() => onChange?.(score)}
              className={`transition ${active ? "text-accent" : "text-line-strong"} ${pending ? "opacity-60" : "hover:-translate-y-0.5"}`}
            >
              <StarIcon filled={active} />
            </button>
          );
        }

        return (
          <span key={score} className={active ? "text-accent" : "text-line-strong"}>
            <StarIcon filled={active} />
          </span>
        );
      })}
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1em] w-[1em]"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="m12 3.6 2.65 5.37 5.93.86-4.29 4.18 1.01 5.91L12 17.14l-5.3 2.78 1.01-5.91-4.29-4.18 5.93-.86L12 3.6Z" />
    </svg>
  );
}
