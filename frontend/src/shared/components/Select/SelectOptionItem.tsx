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
          "cursor-pointer px-4 py-2 text-control-foreground",
          selected && "bg-accent-2 text-white font-medium",
          highlighted && !selected && "bg-accent-2 text-white",
          disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-inherit",
        )}
      >
        {label}
      </div>
    );
  },
);
