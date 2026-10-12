// SPDX-License-Identifier: MPL-2.0

import { type InputHTMLAttributes, type ReactNode, useId } from "react";

import { cn } from "@/shared/utils/cn";
import { FormField } from "./FormField";

type InputProps =
  | ({
      label: ReactNode;
      "aria-label"?: never;
      error?: ReactNode;
    } & InputHTMLAttributes<HTMLInputElement>)
  | ({
      label?: never;
      "aria-label": string;
      error?: ReactNode;
    } & InputHTMLAttributes<HTMLInputElement>);

export function Input({
  id,
  label,
  error,
  required,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <FormField id={inputId} label={label} required={required} error={error}>
      <input
        id={inputId}
        required={required}
        aria-label={ariaLabel}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(ariaDescribedBy, errorId)}
        {...props}
        className={cn(
          "rounded-md border border-control-border bg-control px-2 py-1 transition-colors",
          "focus-visible:outline-2 focus-visible:outline-foreground",
          "disabled:cursor-not-allowed disabled:opacity-40",
          error && "border-failure",
          className,
        )}
      />
    </FormField>
  );
}
