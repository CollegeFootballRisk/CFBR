// SPDX-License-Identifier: MPL-2.0

import type { InputHTMLAttributes, ReactNode } from "react";
import { CheckIcon } from "../Icons";

type CheckboxProps =
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

export function Checkbox({ id, label, error, className = "", ...props }: CheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className={[
          "flex items-center gap-2 font-medium",
          props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="relative size-4 shrink-0">
          <input
            id={id}
            type="checkbox"
            {...props}
            aria-describedby={error && id ? `${id}-error` : undefined}
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
        <p id={id ? `${id}-error` : undefined} className="text-sm text-failure">
          {error}
        </p>
      )}
    </div>
  );
}
