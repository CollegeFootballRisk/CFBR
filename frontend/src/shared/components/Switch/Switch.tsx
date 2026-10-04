import * as React from "react";

import { cn } from "@/shared/utils/cn";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "aria-label"> {
  "aria-label": string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function Switch({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  "aria-label": ariaLabel,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleClick = () => {
    if (disabled) return;

    const nextChecked = !isChecked;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-label={ariaLabel}
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        [
          "relative inline-flex h-8 w-15 shrink-0 cursor-pointer items-center",
          "rounded-full border border-control-border",
          "focus-visible:outline-2 focus-visible:outline-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
        ],
        isChecked ? "bg-control-checked" : "bg-control",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          [
            "pointer-events-none block h-6.5 w-6.5 rounded-full",
            "bg-white shadow-sm ring-0",
            "transition-transform duration-200 ease-in-out",
          ],
          isChecked ? "translate-x-full" : "translate-x-0",
        )}
      />
    </button>
  );
}
