// SPDX-License-Identifier: MPL-2.0

import { useId } from "react";

import MapIcon from "./MapIcon";

export default function ZoomInIcon() {
  const maskId = useId();

  return (
    <MapIcon>
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <path d="M10.5 7.5v6M7.5 10.5h6" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
      </mask>

      <circle
        cx="10.5"
        cy="10.5"
        r="6.5"
        fill="currentColor"
        stroke="none"
        mask={`url(#${maskId})`}
      />

      <path d="m16 16 4 4" />
    </MapIcon>
  );
}
