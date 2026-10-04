// SPDX-License-Identifier: MPL-2.0

import type { PropsWithChildren, SVGProps } from "react";

export type MapIconProps = PropsWithChildren<SVGProps<SVGSVGElement>>;

export default function MapIcon({
  children,
  className = "size-6 shrink-0",
  ...props
}: MapIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}
