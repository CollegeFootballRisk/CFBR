// SPDX-License-Identifier: MPL-2.0

import { type ReactNode, type TextareaHTMLAttributes, useId } from "react";

import { cn } from "@/shared/utils/cn";

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
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={textareaId} className="font-medium">
          {label}
          {required && (
            <span className="text-info" aria-hidden="true">
              {" *"}
            </span>
          )}
        </label>
      )}

      <textarea
        id={textareaId}
        required={required}
        aria-label={ariaLabel}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(ariaDescribedBy, errorId)}
        {...props}
        className={cn(
          "field-sizing-content min-h-24 max-h-[50vh] resize-y overflow-auto rounded-md border border-control-border bg-control px-2 py-1 transition-colors",
          "focus-visible:outline-2 focus-visible:outline-foreground",
          "disabled:cursor-not-allowed disabled:opacity-40",
          error && "border-failure",
          className,
        )}
      />

      {error && (
        <p id={errorId} className="text-sm text-failure">
          {error}
        </p>
      )}
    </div>
  );
}
