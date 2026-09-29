import { cva } from "class-variance-authority";

export const selectVariants = cva(
  [
    "flex items-center justify-between",
    "rounded-md",
    "font-medium",
    "transition-colors",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "border border-border",
          "bg-card text-card-foreground",
          "hover:border-primary/60",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-primary",
        ],

        form: [
          "border border-border",
          "bg-card text-card-foreground",
          "hover:border-primary/60",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-primary",
        ],

        gray: [
          "border border-border",
          "bg-muted text-foreground",
          "hover:border-primary/60",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-primary",
        ],
      },

      size: {
        medium: "px-3 py-2",
      },

      chevron: {
        true: "",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "medium",
      chevron: true,
    },
  },
);
