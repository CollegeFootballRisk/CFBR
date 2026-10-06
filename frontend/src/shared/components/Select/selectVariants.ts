// SPDX-License-Identifier: MPL-2.0

import { cva } from "class-variance-authority";

export const selectVariants = cva(
  "flex items-center justify-between border font-sans " +
    "bg-control border-control-border " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground " +
    "disabled:cursor-not-allowed disabled:opacity-40",
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

        "md-sm-left": "rounded-md sm:rounded-l-md sm:rounded-r-none",
        "md-sm-none": "rounded-md sm:rounded-none",
        "md-sm-right": "rounded-md sm:rounded-l-none sm:rounded-r-md",
      },

      variant: {
        default: "tracking",
        "map-control": "border-0 px-3 py-2 text-xl font-medium bg-accent-1 hover:bg-accent-2",
      },

      invalid: {
        true: "border-accent-1 focus-visible:outline-accent-1",
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
