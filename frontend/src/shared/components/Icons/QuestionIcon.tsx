// SPDX-License-Identifier: MPL-2.0

import { cn } from "@/shared/utils/cn";

interface OddsInfoIconProps {
  className?: string;
}

export default function QuestionIcon({ className }: OddsInfoIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={cn("h-6 w-6", className)}
    >
      {/* Circle/background */}
      <circle cx="256" cy="256" r="256" className="fill-accent-1 hover:fill-accent-2" />

      {/* Question mark/foreground */}
      <path
        className="fill-foreground"
        d="
          M169.8 165.3
          c7.9-22.3 29.1-37.3 52.8-37.3
          h58.3
          c34.9 0 63.1 28.3 63.1 63.1
          c0 22.6-12.1 43.5-31.7 54.8
          L280 264.4
          c-.2 13-10.9 23.6-24 23.6
          c-13.3 0-24-10.7-24-24
          V250.5
          c0-8.6 4.6-16.5 12.1-20.8
          l44.3-25.4
          c4.7-2.7 7.6-7.7 7.6-13.1
          c0-8.4-6.8-15.1-15.1-15.1
          H222.6
          c-3.4 0-6.4 2.1-7.5 5.3
          l-.4 1.2
          c-4.4 12.5-18.2 19-30.6 14.6
          s-19-18.2-14.6-30.6
          l.4-1.2z

          M224 352
          a32 32 0 1 1 64 0
          a32 32 0 1 1 -64 0z
        "
      />
    </svg>
  );
}
