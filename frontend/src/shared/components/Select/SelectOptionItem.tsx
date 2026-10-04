// SPDX-License-Identifier: MPL-2.0

import { forwardRef } from "react";

import { cn } from "../../utils/cn";

interface SelectOptionItemProps {
  label: string;
  selected: boolean;
  highlighted: boolean;
  disabled?: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

export const SelectOptionItem = forwardRef<HTMLDivElement, SelectOptionItemProps>(
  function SelectOptionItem(
    { label, selected, highlighted, disabled = false, onMouseEnter, onClick },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="option"
        tabIndex={-1}
        aria-selected={selected}
        aria-disabled={disabled}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        }}
        className={cn(
          "px-4 py-2",
          highlighted && "bg-accent-1 text-foreground",
          selected && "bg-accent-1 font-medium",
          disabled && "cursor-not-allowed opacity-40",
        )}
      >
        {label}
      </div>
    );
  },
);
