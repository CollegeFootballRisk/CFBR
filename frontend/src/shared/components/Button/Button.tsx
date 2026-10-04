import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "nav";
}

export function Button({ children, variant = "secondary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-foreground";

  const variants = {
    primary: "bg-accent-1 text-foreground",
    secondary: "border border-control-border bg-control text-foreground hover:opacity-50",
    nav: "text-foreground text-sm",
  };

  const content =
    variant === "nav" ? (
      <span className="inline-block hover:shadow-accent-glow hover:underline hover:decoration-dashed">
        {children}
      </span>
    ) : (
      children
    );

  return (
    <button type="button" className={[base, variants[variant], className].join(" ")} {...props}>
      {content}
    </button>
  );
}
