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
          "relative inline-flex h-8 w-15 shrink-0 cursor-pointer items-center px-0.5",
          "rounded-full border border-control-border",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
          "disabled:cursor-not-allowed disabled:opacity-40",
        ],
        isChecked ? "bg-success" : "bg-control",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          [
            "pointer-events-none block h-6.5 w-6.5 rounded-full",
            "shadow-sm ring-0",
            "transition-transform duration-200 ease-in-out",
          ],
          isChecked ? "translate-x-7 bg-background" : "translate-x-0 bg-foreground",
        )}
      />
    </button>
  );
}
