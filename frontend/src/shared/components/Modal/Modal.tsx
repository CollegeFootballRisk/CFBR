import { cva, type VariantProps } from "class-variance-authority";
import { type MouseEvent, type ReactNode, type RefObject, useEffect, useId, useRef } from "react";

import { cn } from "@/shared/utils/cn";

const modalContentInnerVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      constrained: "mx-auto max-w-[90%]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ModalProps extends VariantProps<typeof modalContentInnerVariants> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  headerActions?: ReactNode;
  className?: string;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
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

export default function Modal({
  open,
  onClose,
  title,
  children,
  headerActions,
  variant,
  className,
  scrollContainerRef,
}: ModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedElement.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const modal = modalRef.current;
    if (!modal) return;

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

      if (event.key !== "Tab") return;

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

      if (target instanceof Node && !modal.contains(target)) {
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

  if (!open) return null;

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
        className={cn(
          "relative m-8 flex max-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] max-w-240 flex-col",
          "rounded-sm bg-background text-foreground shadow-2xl",
          "focus:outline-none",
          className,
        )}
        role="dialog"
        tabIndex={-1}
      >
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

        {/* Modal header overlay */}
        {headerActions && (
          <div className="absolute inset-x-0 top-0 z-20 rounded-t-sm bg-background px-4 pb-2 pt-4">
            {headerActions}
          </div>
        )}

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={cn(
            "absolute right-4 top-5 z-30 flex h-6 w-6 items-end justify-center rounded-full outline-1 outline-black",
            "bg-white text-black transition-colors",
            "hover:bg-black hover:text-white",
            "focus-visible:outline-2 focus-visible:outline-accent-1",
          )}
        >
          <span aria-hidden="true" className="text-3xl leading-none">
            &times;
          </span>
        </button>

        {/* Scrollable modal body */}
        <div ref={scrollContainerRef} className="min-h-0 overflow-y-auto px-4 pb-4 text-center">
          <div className={cn(headerActions ? "pt-20" : "pt-4")}>
            <h2 id={titleId} className="text-center text-3xl font-bold leading-tight sm:text-4xl">
              {title}
            </h2>

            <div className="mt-6">
              <div className={cn(modalContentInnerVariants({ variant }))}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
