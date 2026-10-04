// SPDX-License-Identifier: MPL-2.0

import { createContext, type ReactNode, useId } from "react";

interface RadioGroupContextValue {
  name: string;
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  children: ReactNode;
  className?: string;
  name?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export function RadioGroup<T extends string>({
  value,
  onChange,
  children,
  className = "",
  name,
  disabled = false,
  "aria-label": ariaLabel,
}: RadioGroupProps<T>) {
  const generatedName = useId();

  const handleChange = (nextValue: string) => {
    if (disabled) {
      return;
    }

    onChange(nextValue as T);
  };

  return (
    <RadioGroupContext.Provider
      value={{
        name: name ?? generatedName,
        value,
        setValue: handleChange,
        disabled,
      }}
    >
      <div role="radiogroup" aria-label={ariaLabel} aria-disabled={disabled} className={className}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}
