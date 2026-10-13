// SPDX-License-Identifier: MPL-2.0

import { cn } from "@/shared/utils/cn";

export type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  label?: string;
  size?: LoaderSize;
  className?: string;
  fullHeight?: boolean;
}

const spinnerSizes: Record<LoaderSize, string> = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-12 border-4",
};

export function Loader({
  label = "Loading...",
  size = "lg",
  className,
  fullHeight = false,
}: LoaderProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3",
        fullHeight && "min-h-48",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={cn(
          "animate-spin rounded-full border-foreground/25 border-t-foreground",
          spinnerSizes[size],
        )}
      />

      <span className="text-sm">{label}</span>
    </div>
  );
}
