import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";

type LinkVariant = "default" | "accent" | "muted" | "inherit";

interface BaseLinkProps {
  children: ReactNode;
  variant?: LinkVariant;
  external?: boolean;
  className?: string;
}

type InternalLinkProps = BaseLinkProps &
  Omit<RouterLinkProps, "className" | "children"> & {
    href?: never;
  };

type ExternalLinkProps = BaseLinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    to?: never;
  };

export type LinkProps = InternalLinkProps | ExternalLinkProps;

const variants: Record<LinkVariant, string> = {
  default: "text-accent-1 hover:text-accent-1 hover:underline",
  accent: "text-accent-1 hover:text-accent-1 hover:underline",
  muted: "text-failure hover:text-foreground hover:underline",
  inherit: "text-inherit hover:text-inherit",
};

export function Link({
  children,
  variant = "default",
  external = false,
  className = "",
  ...props
}: LinkProps) {
  const classes = [
    "underline-offset-2 transition focus-visible:outline-2 focus-visible:outline-foreground",
    variants[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href !== undefined) {
    const externalProps = external
      ? {
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {};

    return (
      <a {...props} {...externalProps} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink {...props} className={classes}>
      {children}
    </RouterLink>
  );
}
