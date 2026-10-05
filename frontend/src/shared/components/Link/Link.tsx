// SPDX-License-Identifier: MPL-2.0

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";

type LinkVariant = "default" | "exit" | "nav";

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
  default: "text-info",
  exit: "text-failure",
  nav: "text-inherit",
};

export function Link({
  children,
  variant = "default",
  external = false,
  className = "",
  ...props
}: LinkProps) {
  const classes = [
    "underline-offset-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 hover:underline",
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
