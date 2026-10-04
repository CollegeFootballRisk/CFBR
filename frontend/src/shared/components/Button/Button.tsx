import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "nav";
}

export function Button({ children, variant = "secondary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 px-4 py-2";
  const variants = {
    primary: "bg-accent-1 text-white hover:opacity-90",
    secondary: "border border-control-border bg-control hover:bg-muted",
    nav: "text-white text-sm",
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
