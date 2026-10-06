// SPDX-License-Identifier: MPL-2.0

import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center font-medium transition " +
    "disabled:cursor-not-allowed disabled:opacity-40 " +
    "focus-visible:outline-2 focus-visible:outline-foreground",
  {
    variants: {
      rounded: {
        true: "rounded-full",
        false: "rounded-md",
      },

      variant: {
        primary: "bg-accent-1 hover:bg-accent-2 aria-pressed:bg-accent-2 text-xl p-2 gap-2",
        secondary:
          "border border-control-border bg-control text-foreground hover:opacity-50 px-4 py-2",
        nav: "text-sm px-4 py-2",
        icon: "border-0 bg-transparent p-0",
      },
    },

    defaultVariants: {
      rounded: false,
      variant: "secondary",
    },
  },
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "nav" | "icon";
  rounded?: boolean;
}

export function Button({
  children,
  variant = "secondary",
  rounded = false,
  className = "",
  ...props
}: ButtonProps) {
  const content =
    variant === "nav" ? (
      <span className="inline-block hover:shadow-accent-glow hover:underline hover:decoration-dashed">
        {children}
      </span>
    ) : (
      children
    );

  return (
    <button type="button" className={buttonVariants({ variant, rounded, className })} {...props}>
      {content}
    </button>
  );
}
