import { cva, type VariantProps } from "class-variance-authority";
import { type MouseEvent, type ReactNode, useEffect, useId, useRef } from "react";

import { cn } from "@/shared/utils/cn";

const modalVariants = cva(
  [
    "relative flex max-h-[calc(100vh-2rem)] m-8 flex-col",
    "rounded-sm bg-background text-foreground shadow-2xl",
    "focus:outline-none",
  ],
  {
    variants: {
      variant: {
        default: "",
        compact: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const modalContentVariants = cva("min-h-0 overflow-y-auto pb-4 text-center sm:pb-8", {
  variants: {
    variant: {
      default: "px-4 sm:px-20",
      compact: "px-4 sm:px-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ModalProps extends VariantProps<typeof modalContentVariants> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function Modal({ open, onClose, title, children, variant, className }: ModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedElement.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const modal = modalRef.current;

    if (!modal) {
      return;
    }

    const getFocusableElements = () =>
      Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const focusFirstElement = () => {
      const focusableElements = getFocusableElements();

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        modal.focus();
      }
    };

    focusFirstElement();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        modal.focus();
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (
          document.activeElement === firstFocusableElement ||
          !modal.contains(document.activeElement)
        ) {
          event.preventDefault();
          lastFocusableElement.focus();
        }

        return;
      }

      if (
        document.activeElement === lastFocusableElement ||
        !modal.contains(document.activeElement)
      ) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!modal.contains(target)) {
        focusFirstElement();
      }
    };

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.body.style.overflow = originalOverflow;

      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);

      previouslyFocusedElement.current?.focus();
      previouslyFocusedElement.current = null;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/60 p-4"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={modalRef}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(modalVariants({ variant }), className)}
        role="dialog"
        tabIndex={-1}
      >
        {/* Rainbow border */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-0.75 -z-10",
            "rounded-md",
            "bg-[linear-gradient(60deg,#f79533,#f37055,#ef4e7b,#a166ab,#5073b8,#1098ad,#07b39b,#6fba82)]",
            "bg-size-[300%_300%]",
            "animate-modal-rainbow",
          )}
        />

        {/* Close button row */}
        <div className="flex shrink-0 justify-end px-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={cn(
              "flex h-6 w-6 shrink-0 items-end justify-center rounded-full outline-1 outline-black",
              "bg-white text-black",
              "transition-colors",
              "hover:bg-black hover:text-white",
              "focus-visible:outline-2",
              "focus-visible:outline-accent-1",
            )}
          >
            <span aria-hidden="true" className="text-3xl leading-none">
              &times;
            </span>
          </button>
        </div>

        {/* Title */}
        <div className="shrink-0 px-4 pb-4 pt-2 text-center">
          <h2
            id={titleId}
            className="mx-auto max-w-[90%] text-3xl font-semibold leading-tight sm:max-w-none sm:text-4xl"
          >
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className={cn(modalContentVariants({ variant }))}>{children}</div>
      </div>
    </div>
  );
}
