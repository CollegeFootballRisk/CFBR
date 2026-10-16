// SPDX-License-Identifier: MPL-2.0

import type { VariantProps } from "class-variance-authority";
import { type HTMLAttributes, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { cn } from "../../utils/cn";
import { FormField } from "../form/FormField";
import { ChevronIcon } from "../Icons/ChevronIcon";
import { type DropdownPosition, SelectDropdown } from "./SelectDropdown";
import { SelectMeasure } from "./SelectMeasure";
import type { SelectItem } from "./selectTypes";
import { selectVariants } from "./selectVariants";
import { useSelect } from "./useSelect";

export interface SelectProps<T = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof selectVariants> {
  value?: T | "";
  options: SelectItem<T>[];
  onChange: (value: T | "") => void;
  width?: "auto" | "full";
  placeholder?: string;
  searchable?: boolean;
  centeredOptions?: boolean;
  placeholderAsOption?: boolean;
  label?: string;
  hideLabel?: boolean;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const MAX_DROPDOWN_HEIGHT = 256;
const VIEWPORT_PADDING = 8;
const DROPDOWN_GAP = 8;

export function Select<T = string>({
  rounded = "md",
  width = "auto",
  value,
  options,
  onChange,
  placeholder = "Select...",
  searchable = false,
  placeholderAsOption = false,
  label,
  hideLabel = true,
  required = false,
  error,
  disabled = false,
  size,
  chevron = true,
  variant = "default",
  className,
  centeredOptions = false,
  ...props
}: SelectProps<T>) {
  const labelId = useId();
  const selectId = useId();

  const [measuredWidth, setMeasuredWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const {
    open,
    setOpen,
    highlightedIndex,
    setHighlightedIndex,
    rootRef,
    measureRef,
    optionRefs,
    selectOptions,
    filteredItems,
    search,
    setSearch,
    displayValue,
    longestOption,
    handleKeyDown,
    handleSearchKeyDown,
  } = useSelect({
    value,
    options,
    placeholder,
    placeholderAsOption,
    disabled,
    searchable,
    onChange,
    dropdownRef,
  });

  useLayoutEffect(() => {
    const measureElement = measureRef.current;
    if (!measureElement) return;

    const updateSize = () => {
      setMeasuredWidth(measureElement.offsetWidth);
      setHeight(measureElement.offsetHeight);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(measureElement);

    return () => observer.disconnect();
  }, [measureRef]);

  useEffect(() => {
    if (!open || !searchable) return;
    searchInputRef.current?.focus();
  }, [open, searchable]);

  useLayoutEffect(() => {
    if (!open) {
      setDropdownPosition(null);
      return;
    }

    const updatePosition = () => {
      const control = rootRef.current;
      if (!control) return;

      const rect = control.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - DROPDOWN_GAP - VIEWPORT_PADDING;
      const spaceAbove = rect.top - DROPDOWN_GAP - VIEWPORT_PADDING;

      const alignTop = spaceBelow < Math.min(MAX_DROPDOWN_HEIGHT, 160) && spaceAbove > spaceBelow;

      const availableHeight = Math.max(
        0,
        Math.min(MAX_DROPDOWN_HEIGHT, alignTop ? spaceAbove : spaceBelow),
      );

      const dropdownHeight = Math.min(MAX_DROPDOWN_HEIGHT, availableHeight);

      const left = Math.max(
        VIEWPORT_PADDING,
        Math.min(rect.left, window.innerWidth - rect.width - VIEWPORT_PADDING),
      );

      const top = alignTop
        ? Math.max(VIEWPORT_PADDING, rect.top - DROPDOWN_GAP - dropdownHeight)
        : rect.bottom + DROPDOWN_GAP;

      setDropdownPosition({
        top,
        left,
        width: Math.min(rect.width, window.innerWidth - VIEWPORT_PADDING * 2),
        height: dropdownHeight,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, rootRef]);

  useLayoutEffect(() => {
    if (!open) return;

    const listbox = listboxRef.current;
    const option = optionRefs.current[highlightedIndex];

    if (!listbox || !option) return;

    const listRect = listbox.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();

    if (optionRect.top < listRect.top) {
      listbox.scrollTop -= listRect.top - optionRect.top;
    } else if (optionRect.bottom > listRect.bottom) {
      listbox.scrollTop += optionRect.bottom - listRect.bottom;
    }
  }, [highlightedIndex, open, optionRefs]);

  function handleOpen() {
    if (disabled) return;

    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      setSearch("");
      const currentIndex = selectOptions.findIndex((option) => Object.is(option.value, value));
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }

  function handleOptionSelect(optionValue: T | "") {
    onChange(optionValue);
    setSearch("");
    setOpen(false);
  }

  const selectContent = (
    <div
      ref={rootRef}
      style={{
        width: width === "auto" ? measuredWidth : undefined,
        height,
      }}
      className="relative max-w-full"
    >
      <SelectMeasure
        measureRef={measureRef}
        size={size}
        chevron={chevron}
        open={open}
        rounded={rounded}
        variant={variant}
      >
        {longestOption}
      </SelectMeasure>

      <button
        type="button"
        id={selectId}
        aria-label={!label ? placeholder : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        aria-controls={open ? `${selectId}-listbox` : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error ? true : undefined}
        disabled={disabled}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        className={cn(
          selectVariants({
            size,
            rounded,
            chevron,
            variant,
            invalid: Boolean(error),
          }),
          "h-full w-full",
        )}
      >
        <span className="flex-1 whitespace-nowrap font-semibold">{displayValue}</span>
        {chevron && <ChevronIcon className={cn(open && "rotate-180")} />}
      </button>

      <SelectDropdown
        position={open ? dropdownPosition : null}
        dropdownRef={dropdownRef}
        listboxRef={listboxRef}
        searchInputRef={searchInputRef}
        selectId={selectId}
        labelId={labelId}
        label={label}
        searchable={searchable}
        search={search}
        setSearch={setSearch}
        handleSearchKeyDown={handleSearchKeyDown}
        filteredItems={filteredItems}
        value={value}
        highlightedIndex={highlightedIndex}
        setHighlightedIndex={setHighlightedIndex}
        optionRefs={optionRefs}
        centeredOptions={centeredOptions}
        handleOptionSelect={handleOptionSelect}
      />
    </div>
  );

  return (
    <div className={cn("min-w-0", className)} {...props}>
      {required ? (
        <FormField
          id={selectId}
          label={
            label ? (
              <span id={labelId} className={cn(hideLabel && "sr-only")}>
                {label}
              </span>
            ) : undefined
          }
          required
          error={error}
        >
          {selectContent}
        </FormField>
      ) : (
        <>
          {label && (
            <span id={labelId} className="sr-only">
              {label}
            </span>
          )}
          {selectContent}
        </>
      )}
    </div>
  );
}
