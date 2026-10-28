/* SPDX-License-Identifier: MPL-2.0 */

import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

// TODO: info and error used
const variantStyles: Record<AlertVariant, string> = {
  info: "border-control bg-control text-foreground",
  success: "border-accent-3 bg-accent-3 text-background",
  warning: "border-failure bg-failure text-foreground",
  error: "border-failure bg-failure text-foreground",
};

export function Alert({ variant = "info", title, children, className }: AlertProps) {
  const semanticRole = variant === "error" ? "alert" : "status";

  return (
    <div
      role={semanticRole}
      aria-live={semanticRole === "alert" ? "assertive" : "polite"}
      className={cn("rounded-md border p-3", variantStyles[variant], className)}
    >
      {title && <h3 className="mb-1 font-semibold">{title}</h3>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
