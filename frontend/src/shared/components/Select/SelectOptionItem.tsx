// SPDX-License-Identifier: MPL-2.0

import { forwardRef, type ReactNode } from "react";

import { cn } from "../../utils/cn";

interface SelectOptionItemProps {
  label: ReactNode;
  selected: boolean;
  highlighted: boolean;
  disabled?: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  centeredOptions?: boolean;
}

export const SelectOptionItem = forwardRef<HTMLDivElement, SelectOptionItemProps>(
  function SelectOptionItem(
    {
      label,
      selected,
      highlighted,
      disabled = false,
      centeredOptions = false,
      onMouseEnter,
      onClick,
    },
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
          centeredOptions && "text-center",
          highlighted && "bg-accent-1",
          selected && "bg-accent-1 font-medium",
          disabled && "cursor-not-allowed opacity-40",
        )}
      >
        {label}
      </div>
    );
  },
);
