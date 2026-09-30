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

export const SelectOptionItem = forwardRef<
  HTMLLIElement,
  SelectOptionItemProps
>(function SelectOptionItem(
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
        "cursor-pointer px-4 py-2 text-control-foreground",
        selected && "",
        highlighted && !selected && "",
        disabled &&
          "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-inherit",
      )}
    >
      {label}
    </li>
  );
});
