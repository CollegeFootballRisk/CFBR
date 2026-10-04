import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps =
  | ({
      label: ReactNode;
      "aria-label"?: never;
    } & InputHTMLAttributes<HTMLInputElement>)
  | ({
      label?: never;
      "aria-label": string;
    } & InputHTMLAttributes<HTMLInputElement>);

export function Input({ id, label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
      )}

      <input
        id={id}
        {...props}
        className={[
          "rounded-md border border-control-border bg-control px-2 py-1 text-control-foreground outline-none transition-colors",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  );
}
