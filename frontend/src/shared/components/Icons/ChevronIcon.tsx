// SPDX-License-Identifier: MPL-2.0

import { cn } from "../../utils/cn";

interface ChevronIconProps {
  direction?: "up" | "down" | "left" | "right";
  size?: "default" | "lg";
  className?: string;
}

export default function ChevronIcon({
  direction = "down",
  size = "default",
  className,
}: ChevronIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "transition-transform",
        size === "default" && "size-4",
        size === "lg" && "size-6",
        direction === "up" && "rotate-180",
        direction === "left" && "-rotate-90",
        direction === "right" && "rotate-90",
        className,
      )}
    >
      <path d="M6 8l4 4 4-4" />
    </svg>
  );
}
