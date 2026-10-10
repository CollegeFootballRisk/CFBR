// SPDX-License-Identifier: MPL-2.0

import type { VariantProps } from "class-variance-authority";
import { type HTMLAttributes, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { cn } from "../../utils/cn";
import ChevronIcon from "../Icons/ChevronIcon";

import SelectDropdown, { type DropdownPosition } from "./SelectDropdown";
import SelectMeasure from "./SelectMeasure";
import type { SelectItem } from "./selectTypes";
import { selectVariants } from "./selectVariants";
import useSelect from "./useSelect";

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

export default function Select<T = string>({
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

  // Keep keyboard-highlighted options visible without scrolling page ancestors.
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

  return (
    <div
      ref={rootRef}
      style={{
        width: width === "auto" ? measuredWidth : undefined,
        height,
      }}
      className={cn("relative", className)}
      {...props}
    >
      {label && (
        <label id={labelId} htmlFor={selectId} className={cn(hideLabel && "sr-only")}>
          {label}
          {required && <span className="ml-1 text-info">*</span>}
        </label>
      )}

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
        id={selectId}
        type="button"
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

      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-accent-1">
          {error}
        </p>
      )}

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
}
