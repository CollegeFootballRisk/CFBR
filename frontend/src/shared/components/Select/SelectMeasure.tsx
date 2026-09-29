import type { RefObject } from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/cn";
import ChevronIcon from "@/shared/components/Icons/ChevronIcon";

import { selectVariants } from "./selectVariants";

interface SelectMeasureProps {
  measureRef: RefObject<HTMLButtonElement | null>;
  className?: string;
  variant: VariantProps<typeof selectVariants>["variant"];
  size: VariantProps<typeof selectVariants>["size"];
  chevron: VariantProps<typeof selectVariants>["chevron"];
  open: boolean;
  children: React.ReactNode;
}

export default function SelectMeasure({
  measureRef,
  className,
  variant,
  size,
  chevron,
  open,
  children,
}: SelectMeasureProps) {
  return (
    <button
      ref={measureRef}
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      className={cn(
        selectVariants({
          variant,
          size,
          chevron,
        }),
        "pointer-events-none absolute invisible whitespace-nowrap",
        className,
      )}
    >
      <span>{children}</span>

      {chevron && (
        <ChevronIcon
          className={cn(
            "shrink-0 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      )}
    </button>
  );
}
