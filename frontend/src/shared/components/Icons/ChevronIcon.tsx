import { cn } from "../../utils/cn";

interface ChevronIconProps {
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export default function ChevronIcon({
  direction = "down",
  className,
}: ChevronIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn(
        "h-4 w-4 transition-transform",
        direction === "up" && "rotate-180",
        direction === "left" && "-rotate-90",
        direction === "right" && "rotate-90",
        className,
      )}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.15l3.71-3.92a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
      />
    </svg>
  );
}
