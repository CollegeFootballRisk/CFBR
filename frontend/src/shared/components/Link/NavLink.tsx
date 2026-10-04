import type { ReactNode } from "react";
import {
  NavLink as RouterNavLink,
  type NavLinkProps as RouterNavLinkProps,
} from "react-router-dom";

type NavLinkVariant = "default" | "accent" | "muted" | "inherit";

interface NavLinkProps extends Omit<RouterNavLinkProps, "className" | "children"> {
  children: ReactNode;
  variant?: NavLinkVariant;
  className?: string;
}

const variants: Record<NavLinkVariant, string> = {
  default: "text-accent-1 hover:text-accent-1 hover:underline",
  accent: "text-accent-1 hover:text-accent-1 hover:underline",
  muted: "text-foreground/70 hover:text-foreground hover:underline",
  inherit: "text-inherit hover:text-inherit",
};

export function NavLink({ children, variant = "default", className = "", ...props }: NavLinkProps) {
  const classes = [
    "underline-offset-2 transition focus-visible:outline-2 focus-visible:outline-foreground",
    variants[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <RouterNavLink {...props} className={classes}>
      {children}
    </RouterNavLink>
  );
}
