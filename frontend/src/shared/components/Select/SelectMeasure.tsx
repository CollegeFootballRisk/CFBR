// SPDX-License-Identifier: MPL-2.0

import type { VariantProps } from "class-variance-authority";
import type { RefObject } from "react";

import { cn } from "../../utils/cn";
import ChevronIcon from "../Icons/ChevronIcon";

import { selectVariants } from "./selectVariants";

interface SelectMeasureProps {
  measureRef: RefObject<HTMLButtonElement | null>;
  className?: string;
  size: VariantProps<typeof selectVariants>["size"];
  chevron: VariantProps<typeof selectVariants>["chevron"];
  open: boolean;
  rounded: VariantProps<typeof selectVariants>["rounded"];
  variant: VariantProps<typeof selectVariants>["variant"];
  children: React.ReactNode;
}

export default function SelectMeasure({
  measureRef,
  className,
  size,
  chevron,
  open,
  rounded,
  children,
  variant,
}: SelectMeasureProps) {
  return (
    <button
      ref={measureRef}
      type="button"
      className={cn(
        selectVariants({
          size,
          chevron,
          rounded,
          variant,
        }),
        "absolute invisible whitespace-nowrap pointer-events-none",
        className,
      )}
    >
      <span>{children}</span>

      {chevron && <ChevronIcon className={cn(open && "rotate-180")} />}
    </button>
  );
}
