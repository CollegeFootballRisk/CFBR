import { cva } from "class-variance-authority";

export const selectVariants = cva(
  "flex items-center justify-between bg-control text-control-foreground rounded-full font-sans tracking-wider disabled:cursor-not-allowed disabled:opacity-50",

  {
    variants: {
      size: {
        medium: "px-5 py-2",
      },

      chevron: {
        true: "appearance-auto",
        false: "appearance-none",
      },
    },

    defaultVariants: {
      size: "medium",
      chevron: true,
    },
  },
);
