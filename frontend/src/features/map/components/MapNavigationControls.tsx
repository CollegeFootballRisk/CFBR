/* SPDX-License-Identifier: MPL-2.0 */

import type { ReactNode } from "react";

import { Button } from "@/shared/components/Button";

import { ResetMapIcon, ZoomInIcon, ZoomOutIcon } from "../icons";

interface MapNavigationControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  positioned?: boolean;
  showLabels?: boolean;
}

export function MapNavigationControls({
  onZoomIn,
  onZoomOut,
  onReset,
  disabled = false,
  children,
  className = "",
  positioned = true,
  showLabels = false,
}: MapNavigationControlsProps) {
  const controls = (
    <div className={`pointer-events-auto flex items-center justify-center gap-1 ${className}`}>
      <Button variant="primary" onClick={onZoomIn} disabled={disabled} aria-label="Zoom In">
        <ZoomInIcon />
        <span className={showLabels ? "inline" : "hidden sm:inline"}>Zoom In</span>
      </Button>

      <Button variant="primary" onClick={onZoomOut} disabled={disabled} aria-label="Zoom Out">
        <ZoomOutIcon />
        <span className={showLabels ? "inline" : "hidden sm:inline"}>Zoom Out</span>
      </Button>

      <Button variant="primary" onClick={onReset} disabled={disabled} aria-label="Reset Map">
        <ResetMapIcon />
        <span className={showLabels ? "inline" : "hidden sm:inline"}>Reset Map</span>
      </Button>

      {children}
    </div>
  );

  if (!positioned) {
    return controls;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
      {controls}
    </div>
  );
}
