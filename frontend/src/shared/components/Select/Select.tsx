import {
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  type HTMLAttributes,
} from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/cn";
import ChevronIcon from "../Icons/ChevronIcon";

import SelectMeasure from "./SelectMeasure";
import type { SelectOption } from "./selectTypes";
import { selectVariants } from "./selectVariants";
import useSelect from "./useSelect";
import { SelectOptionItem } from "./SelectOptionItem";

export interface SelectProps<T = string>
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof selectVariants> {
  value?: T | "";

  options: SelectOption<T>[];

  onChange: (value: T | "") => void;

  placeholder?: string;

  placeholderAsOption?: boolean;
  label?: string;

  hideLabel?: boolean;

  disabled?: boolean;
}

export default function Select<T = string>({
  value,
  options,
  onChange,

  placeholder = "Select...",

  placeholderAsOption = false,

  label,

  hideLabel = true,

  disabled = false,

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
    placeholderAsOption,
    disabled,
    onChange,
  });

  useEffect(() => {
    if (!measureRef.current) return;

    setWidth(measureRef.current.offsetWidth);
    setHeight(measureRef.current.offsetHeight);
  }, [measureRef, longestOption, size, chevron]);

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
      // eslint-disable-next-line no-restricted-syntax -- dynamic position can't be represented in tailwind
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
            size,
            chevron,
          }),
          "h-full w-full",
        )}
      >
        <span className="flex-1 whitespace-nowrap">{displayValue}</span>

        {chevron && <ChevronIcon className={cn(open && "rotate-180")} />}
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          className={cn(
            "absolute left-0 z-50 w-full overflow-y-auto",
            "max-h-64 rounded-lg border-2 bg-control",
            "shadow-xl",
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
