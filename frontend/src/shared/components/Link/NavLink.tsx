// SPDX-License-Identifier: MPL-2.0

import type { ReactNode } from "react";
import {
  NavLink as RouterNavLink,
  type NavLinkProps as RouterNavLinkProps,
} from "react-router-dom";

interface NavLinkProps extends Omit<RouterNavLinkProps, "className" | "children"> {
  children: ReactNode;
  className?: string;
}

export function NavLink({ children, className = "", ...props }: NavLinkProps) {
  const classes = [
    "underline-offset-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 hover:underline",
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
