// SPDX-License-Identifier: MPL-2.0

import { type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from "react";

import {
  buildSelectItems,
  type SelectItem,
  type SelectOption,
  type SelectRenderItem,
} from "./selectTypes";
import useSelectKeyboard from "./useSelectKeyboard";

interface UseSelectProps<T> {
  value?: T | "";
  options: SelectItem<T>[];
  placeholder: string;
  placeholderAsOption: boolean;
  disabled: boolean;
  searchable: boolean;
  onChange: (value: T | "") => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
}

interface UseSelectReturn<T> {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  highlightedIndex: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;

  rootRef: RefObject<HTMLDivElement | null>;
  measureRef: RefObject<HTMLButtonElement | null>;
  optionRefs: React.RefObject<(HTMLDivElement | null)[]>;

  selectOptions: SelectOption<T>[];
  renderItems: SelectRenderItem<T>[];
  filteredItems: SelectRenderItem<T>[];

  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  displayValue: ReactNode;
  longestOption: string;

  handleKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  handleSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

function getSearchLabel<T>(option: SelectOption<T>): string {
  return option.searchLabel ?? (typeof option.label === "string" ? option.label : "");
}

function getDisplayLabel<T>(
  option: SelectOption<T>,
  renderItems: SelectRenderItem<T>[],
): ReactNode {
  for (const item of renderItems) {
    if (item.kind !== "group") {
      continue;
    }

    const isInGroup = item.options.some(({ option: groupOption }) =>
      Object.is(groupOption.value, option.value),
    );

    if (isInGroup) {
      return `${item.label} - ${option.label}`;
    }
  }

  return option.label;
}

function getItemIndexes<T>(items: SelectRenderItem<T>[]): number[] {
  const indexes: number[] = [];

  for (const item of items) {
    if (item.kind === "option") {
      if (!item.option.disabled) {
        indexes.push(item.index);
      }

      continue;
    }

    for (const renderedOption of item.options) {
      if (!renderedOption.option.disabled) {
        indexes.push(renderedOption.index);
      }
    }
  }

  return indexes;
}

export default function useSelect<T>({
  value,
  options,
  placeholder,
  placeholderAsOption,
  disabled,
  searchable,
  onChange,
  dropdownRef,
}: UseSelectProps<T>): UseSelectReturn<T> {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [search, setSearch] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (rootRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
      setSearch("");
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const { selectOptions, renderItems } = useMemo(
    () => buildSelectItems(options, placeholder, placeholderAsOption, value ?? ""),
    [options, placeholder, placeholderAsOption, value],
  );

  const filteredItems = useMemo<SelectRenderItem<T>[]>(() => {
    if (!searchable || !search.trim()) {
      return renderItems;
    }

    const normalizedSearch = search.trim().toLowerCase();
    const filtered: SelectRenderItem<T>[] = [];

    for (const item of renderItems) {
      if (item.kind === "option") {
        if (getSearchLabel(item.option).toLowerCase().includes(normalizedSearch)) {
          filtered.push(item);
        }

        continue;
      }

      const filteredOptions = item.options.filter(({ option }) =>
        getSearchLabel(option).toLowerCase().includes(normalizedSearch),
      );

      if (filteredOptions.length > 0) {
        filtered.push({
          kind: "group",
          label: item.label,
          options: filteredOptions,
        });
      }
    }

    return filtered;
  }, [renderItems, search, searchable]);

  const filteredIndexes = useMemo(() => getItemIndexes(filteredItems), [filteredItems]);

  const selectedOption = useMemo(
    () => selectOptions.find((option) => Object.is(option.value, value)),
    [selectOptions, value],
  );

  const displayValue = useMemo(() => {
    if (!selectedOption) {
      return placeholder;
    }

    return getDisplayLabel(selectedOption, renderItems);
  }, [placeholder, renderItems, selectedOption]);

  const longestOption = useMemo(
    () =>
      [placeholder, ...selectOptions.map((option) => getSearchLabel(option))].reduce(
        (largest, current) => (current.length > largest.length ? current : largest),
        "",
      ),
    [placeholder, selectOptions],
  );

  useEffect(() => {
    if (!searchable || !open) {
      return;
    }

    if (filteredIndexes.length === 0) {
      setHighlightedIndex(-1);
      return;
    }

    setHighlightedIndex((current) => {
      if (filteredIndexes.includes(current)) {
        return current;
      }

      return filteredIndexes[0];
    });
  }, [filteredIndexes, open, searchable]);

  const { handleKeyDown, handleSearchKeyDown } = useSelectKeyboard({
    disabled,
    searchable,
    open,
    setOpen,
    highlightedIndex,
    setHighlightedIndex,
    search,
    setSearch,
    selectOptions,
    filteredIndexes,
    onChange,
  });

  return {
    open,
    setOpen,

    highlightedIndex,
    setHighlightedIndex,

    rootRef,
    measureRef,
    optionRefs,

    selectOptions,
    renderItems,
    filteredItems,

    search,
    setSearch,

    displayValue,
    longestOption,

    handleKeyDown,
    handleSearchKeyDown,
  };
}
