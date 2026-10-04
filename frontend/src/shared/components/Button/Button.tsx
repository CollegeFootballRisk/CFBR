import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "nav";
}

export function Button({ children, variant = "secondary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-foreground";

  const variants = {
    primary:
      "bg-accent-1 text-foreground hover:bg-accent-2 aria-pressed:bg-accent-2 text-xl p-2 gap-2",
    secondary: "border border-control-border bg-control text-foreground hover:opacity-50 px-4 py-2",
    nav: "text-foreground text-sm px-4 py-2",
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
