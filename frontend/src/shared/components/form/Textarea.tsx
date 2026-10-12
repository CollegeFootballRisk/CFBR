// SPDX-License-Identifier: MPL-2.0

import { type ReactNode, type TextareaHTMLAttributes, useId } from "react";
import { cn } from "@/shared/utils/cn";
import { FormField } from "./FormField";

type TextareaProps =
  | ({
      label: ReactNode;
      "aria-label"?: never;
      error?: ReactNode;
    } & TextareaHTMLAttributes<HTMLTextAreaElement>)
  | ({
      label?: never;
      "aria-label": string;
      error?: ReactNode;
    } & TextareaHTMLAttributes<HTMLTextAreaElement>);

export function Textarea({
  id,
  label,
  error,
  required,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <FormField id={textareaId} label={label} required={required} error={error}>
      <textarea
        id={textareaId}
        required={required}
        aria-label={ariaLabel}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(ariaDescribedBy, errorId)}
        {...props}
        className={cn(
          [
            "overflow-auto",
            "px-2 py-1",
            "max-h-[50vh] min-h-24",
            "rounded-md border border-control-border bg-control focus-visible:outline-2",
            "focus-visible:outline-foreground disabled:opacity-40",
            "transition-colors",
            "resize-y disabled:cursor-not-allowed",
            "field-sizing-content",
          ].join(" "),
          error && "border-failure",
          className,
        )}
      />
    </FormField>
  );
}
