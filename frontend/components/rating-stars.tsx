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
              aria-label={`${score} star`}
              disabled={pending}
              onClick={() => onChange?.(score)}
              className={`transition ${active ? "text-accent" : "text-[#d8b9a4]"} ${pending ? "opacity-60" : "hover:scale-110"}`}
            >
              ★
            </button>
          );
        }

        return (
          <span key={score} className={active ? "text-accent" : "text-[#d8b9a4]"}>
            ★
          </span>
        );
      })}
    </div>
  );
}
