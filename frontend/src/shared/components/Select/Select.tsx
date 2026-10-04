import type { VariantProps } from "class-variance-authority";
import { type HTMLAttributes, useId, useLayoutEffect, useState } from "react";

import { cn } from "../../utils/cn";
import ChevronIcon from "../Icons/ChevronIcon";

import SelectMeasure from "./SelectMeasure";
import { SelectOptionItem } from "./SelectOptionItem";
import type { SelectItem } from "./selectTypes";
import { selectVariants } from "./selectVariants";
import useSelect from "./useSelect";

export interface SelectProps<T = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof selectVariants> {
  value?: T | "";

  options: SelectItem<T>[];

  onChange: (value: T | "") => void;

  placeholder?: string;

  placeholderAsOption?: boolean;

  label?: string;

  hideLabel?: boolean;

  disabled?: boolean;
}

export default function Select<T = string>({
  rounded = false,
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
    renderItems,
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

  useLayoutEffect(() => {
    const measureElement = measureRef.current;

    if (!measureElement) return;

    const updateSize = () => {
      setWidth(measureElement.offsetWidth);
      setHeight(measureElement.offsetHeight);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(measureElement);

    return () => observer.disconnect();
  }, [measureRef]);

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
      style={{
        width,
        height,
      }}
      className={cn("relative", className)}
      {...props}
    >
      {label && (
        <label id={labelId} htmlFor={selectId} className={cn(hideLabel && "sr-only")}>
          {label}
        </label>
      )}

      <SelectMeasure
        measureRef={measureRef}
        size={size}
        chevron={chevron}
        open={open}
        rounded={rounded}
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

          const currentIndex = selectOptions.findIndex((option) => Object.is(option.value, value));

          setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          selectVariants({
            size,
            rounded,
            chevron,
          }),
          "h-full w-full",
        )}
      >
        <span className="flex-1 whitespace-nowrap font-semibold">{displayValue}</span>

        {chevron && <ChevronIcon className={cn(open && "rotate-180")} />}
      </button>

      {open && (
        <div
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          className={cn(
            "absolute left-0 z-50 w-full overflow-y-auto max-h-64 rounded-md border " +
              "bg-control shadow-xl ",
            alignTop ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {renderItems.map((item) => {
            if (item.kind === "group") {
              return (
                // biome-ignore lint/a11y/useSemanticElements: listbox option groups are not form control groups
                <div key={`group-${item.label}`} role="group" aria-label={item.label}>
                  <div className="mx-3 mt-2 border-b border-control-border px-1 pb-1 text-xs font-semibold uppercase tracking-wider">
                    {item.label}
                  </div>

                  {item.options.map(({ option, index }) => (
                    <SelectOptionItem
                      key={`option-${index}-${String(option.value)}`}
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
                </div>
              );
            }

            const { option, index } = item;

            return (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
