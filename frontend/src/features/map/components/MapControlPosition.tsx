// SPDX-License-Identifier: MPL-2.0

import type { ReactNode } from "react";

interface MapControlPositionProps {
  placement: "top" | "bottom";
  layer?: "base" | "overlay";
  children: ReactNode;
}

export function MapControlPosition({
  placement,
  layer = "base",
  children,
}: MapControlPositionProps) {
  const positionClass = placement === "top" ? "" : "bottom-3";
  const layerClass = layer === "overlay" ? "z-20" : "z-10";

  return (
    <div
      className={[
        "pointer-events-none absolute inset-x-0",
        positionClass,
        layerClass,
        "flex justify-center px-3",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
