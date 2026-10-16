// SPDX-License-Identifier: MPL-2.0

import { cva } from "class-variance-authority";

export const selectVariants = cva(
  [
    "flex items-center justify-between",
    "font-sans",
    "border border-control-border bg-control focus-visible:outline-2 focus-visible:outline-foreground",
    "focus-visible:outline-offset-2 disabled:opacity-40",
    "disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        medium: "px-5 py-2",
      },

      chevron: {
        true: "appearance-auto",
        false: "appearance-none",
      },

      rounded: {
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
        none: "rounded-none",
        left: "rounded-l-md",
        right: "rounded-r-md",

        "md-sm-left": "rounded-md sm:rounded-r-none sm:rounded-l-md",
        "md-sm-none": "rounded-md sm:rounded-none",
        "md-sm-right": "rounded-md sm:rounded-r-md sm:rounded-l-none",
      },

      variant: {
        default: "tracking",
        "map-control": "border-0 bg-accent-1 px-3 py-2 font-medium text-xl hover:bg-accent-2",
      },

      invalid: {
        true: "border-failure focus-visible:outline-failure",
        false: "",
      },
    },

    defaultVariants: {
      size: "medium",
      chevron: true,
      rounded: "md",
      variant: "default",
    },
  },
);
