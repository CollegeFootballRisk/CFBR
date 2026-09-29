import {
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  type HTMLAttributes,
} from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/cn";
import ChevronIcon from "@/shared/components/Icons/ChevronIcon";

import SelectMeasure from "./SelectMeasure";
import SelectOptionItem from "./SelectOptionItem";
import type { SelectOption } from "./selectTypes";
import { selectVariants } from "./selectVariants";
import useSelect from "./useSelect";

export interface SelectProps<T = string>
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof selectVariants> {
  value?: T | "";
  options: SelectOption<T>[];
  onChange: (value: T | "") => void;
  placeholder?: string;
  label?: string;
  hideLabel?: boolean;
  disabled?: boolean;
}

export default function Select<T = string>({
  value,
  options,
  onChange,

  placeholder = "Select...",

  label,
  hideLabel = true,

  disabled = false,

  variant,
  size,
  chevron = true,

  className,

  ...props
}: SelectProps<T>) {
  const labelId = useId();
  const selectId = useId();

  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [alignTop, setAlignTop] = useState(false);

  const {
    open,
    setOpen,

    highlightedIndex,
    setHighlightedIndex,

    rootRef,
    measureRef,
    optionRefs,

    selectOptions,
    displayValue,
    longestOption,

    handleKeyDown,
  } = useSelect({
    value,
    options,
    placeholder,
    disabled,
    onChange,
  });

  useEffect(() => {
    if (!measureRef.current) return;

    setWidth(measureRef.current.offsetWidth);
    setHeight(measureRef.current.offsetHeight);
  }, [measureRef, longestOption, variant, size, chevron]);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;

    const updatePosition = () => {
      const rect = rootRef.current?.getBoundingClientRect();

      if (!rect) return;

      const dropdownHeight = 256;
      const viewportPadding = 8;

      setAlignTop(
        rect.bottom + dropdownHeight > window.innerHeight - viewportPadding &&
          rect.top - dropdownHeight >= viewportPadding,
      );
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, rootRef]);

  return (
    <div
      ref={rootRef}
      // eslint-disable-next-line no-restricted-syntax -- dynamic position can't be represented in Tailwind
      style={{
        width,
        height,
      }}
      className={cn("relative", className)}
      {...props}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={selectId}
          className={cn(hideLabel && "sr-only")}
        >
          {label}
        </label>
      )}

      <SelectMeasure
        measureRef={measureRef}
        variant={variant}
        size={size}
        chevron={chevron}
        open={open}
      >
        {longestOption}
      </SelectMeasure>

      <button
        id={selectId}
        type="button"
        aria-labelledby={label ? labelId : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          setOpen((previous) => !previous);

          const currentIndex = selectOptions.findIndex((option) =>
            Object.is(option.value, value),
          );

          setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          selectVariants({
            variant,
            size,
            chevron,
          }),
          "h-full w-full",
        )}
      >
        <span className="truncate">{displayValue}</span>

        {chevron && (
          <ChevronIcon
            className={cn(
              "shrink-0 transition-transform duration-150",
              open && "rotate-180",
            )}
          />
        )}
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          className={cn(
            "absolute left-0 z-50 w-full max-h-64 overflow-y-auto",
            "rounded-md border border-border",
            "bg-card text-card-foreground",
            "shadow-lg",
            alignTop ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {selectOptions.map((option, index) => (
            <SelectOptionItem
              key={String(option.value)}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              label={option.label}
              selected={Object.is(option.value, value)}
              highlighted={index === highlightedIndex}
              disabled={option.disabled}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => {
                if (option.disabled) return;

                onChange(option.value);
                setOpen(false);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
