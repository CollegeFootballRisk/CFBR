// SPDX-License-Identifier: MPL-2.0

import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label?: ReactNode;
  required?: boolean;
  error?: ReactNode;
  children: ReactNode;
}

export function FormField({ id, label, required, error, children }: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-medium">
          {label}
          {required && (
            <span className="text-info" aria-hidden="true">
              {" *"}
            </span>
          )}
        </label>
      )}

      {children}

      {error && (
        <p id={errorId} className="text-failure text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
