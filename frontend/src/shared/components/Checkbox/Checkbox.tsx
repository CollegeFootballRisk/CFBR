// SPDX-License-Identifier: MPL-2.0

import { type InputHTMLAttributes, type ReactNode, useId } from "react";

import { CheckIcon } from "../Icons";

type CheckboxInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

type CheckboxProps =
  | ({
      label: ReactNode;
      "aria-label"?: never;
      error?: ReactNode;
    } & CheckboxInputProps)
  | ({
      label?: never;
      "aria-label": string;
      error?: ReactNode;
    } & CheckboxInputProps);

export function Checkbox({
  id,
  label,
  error,
  className = "",
  "aria-describedby": ariaDescribedBy,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const errorId = error ? `${checkboxId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={checkboxId}
        className={[
          "flex items-center gap-2 font-medium",
          props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="relative size-4 shrink-0">
          <input
            {...props}
            id={checkboxId}
            type="checkbox"
            aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined}
            className={[
              "peer size-4 appearance-none rounded border border-control-border bg-control",
              "focus-visible:outline-2 focus-visible:outline-foreground",
              "checked:border-success checked:bg-success",
              error ? "border-failure" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
          />

          <span
            className={[
              "pointer-events-none absolute inset-0 hidden items-center justify-center",
              "text-foreground peer-checked:flex",
            ].join(" ")}
          >
            <span className="size-3 translate-y-0.5">
              <CheckIcon />
            </span>
          </span>
        </span>

        {label && <span>{label}</span>}
      </label>

      {error && (
        <p id={errorId} className="text-sm text-failure">
          {error}
        </p>
      )}
    </div>
  );
}
