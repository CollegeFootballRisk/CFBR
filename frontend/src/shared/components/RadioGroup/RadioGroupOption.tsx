// SPDX-License-Identifier: MPL-2.0

import { type ReactNode, useContext, useId } from "react";
import { RadioGroupContext } from "./RadioGroup";

interface RadioGroupOptionProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function RadioGroupOption({
  value,
  children,
  disabled = false,
  className = "",
}: RadioGroupOptionProps) {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupOption must be used inside RadioGroup.");
  }

  const id = useId();
  const selected = context.value === value;
  const optionDisabled = disabled || context.disabled;

  return (
    <label
      htmlFor={id}
      className={[
        "inline-flex cursor-pointer items-center justify-center gap-2 px-3 py-2",
        "text-xl font-medium transition-colors",
        selected ? "bg-accent-2" : "bg-accent-1",
        "hover:bg-accent-2",
        "has-focus-visible:ring-2 has-focus-visible:ring-foreground",
        optionDisabled && "cursor-not-allowed opacity-40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        id={id}
        type="radio"
        name={context.name}
        value={value}
        checked={selected}
        disabled={optionDisabled}
        onChange={() => context.setValue(value)}
        className="sr-only"
      />

      {children}
    </label>
  );
}
