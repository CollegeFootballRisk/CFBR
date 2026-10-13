// SPDX-License-Identifier: MPL-2.0

import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-medium",
    "focus-visible:outline-2 focus-visible:outline-foreground disabled:opacity-40",
    "transition",
    "cursor-pointer disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      rounded: {
        true: "rounded-full",
        false: "rounded-md",
        none: "rounded-none",
        left: "rounded-l-md",
        right: "rounded-r-md",
      },

      variant: {
        primary: "gap-2 bg-accent-1 p-2 text-xl hover:bg-accent-2 aria-pressed:bg-accent-2",
        secondary:
          "border border-control-border bg-control px-4 py-2 text-foreground hover:opacity-50",
        nav: "px-4 py-2 text-sm",
        icon: "border-0 bg-transparent p-0",
        pagination: "bg-accent-1 px-2 py-1 font-semibold hover:bg-accent-2",
        success: "gap-2 bg-accent-3 p-2 text-background text-xl hover:outline-2",
        failure: "gap-2 bg-failure p-2 text-background text-xl hover:outline-2",
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
  variant?: "primary" | "secondary" | "nav" | "icon" | "pagination" | "success" | "failure";
  rounded?: boolean | "none" | "left" | "right";
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
      <span className="inline-block hover:underline hover:decoration-dashed hover:shadow-accent-glow">
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
