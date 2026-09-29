import { forwardRef } from "react";

import { cn } from "@/shared/utils/cn";

interface SelectOptionItemProps {
  label: string;
  selected: boolean;
  highlighted: boolean;
  disabled?: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

const SelectOptionItem = forwardRef<HTMLLIElement, SelectOptionItemProps>(
  function SelectOptionItem(
    { label, selected, highlighted, disabled = false, onMouseEnter, onClick },
    ref,
  ) {
    return (
      <li
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        className={cn(
          "cursor-pointer px-3 py-2 font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          selected && "bg-primary text-primary-foreground",
          highlighted && !selected && "bg-muted text-foreground",
          disabled && "cursor-not-allowed opacity-40",
        )}
      >
        {label}
      </li>
    );
  },
);

export default SelectOptionItem;
