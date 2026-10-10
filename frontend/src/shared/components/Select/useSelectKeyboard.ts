// SPDX-License-Identifier: MPL-2.0

import { type KeyboardEvent, useEffect, useRef } from "react";

import type { SelectOption } from "./selectTypes";

interface UseSelectKeyboardProps<T> {
  disabled: boolean;
  searchable: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  highlightedIndex: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selectOptions: SelectOption<T>[];
  filteredIndexes: number[];
  onChange: (value: T | "") => void;
}

export default function useSelectKeyboard<T>({
  disabled,
  searchable,
  open,
  setOpen,
  highlightedIndex,
  setHighlightedIndex,
  setSearch,
  selectOptions,
  filteredIndexes,
  onChange,
}: UseSelectKeyboardProps<T>) {
  const typeaheadRef = useRef("");
  const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }
    };
  }, []);

  function findMatchingOption(searchValue: string, startIndex: number) {
    if (selectOptions.length === 0) {
      return -1;
    }

    const normalized = searchValue.toLowerCase();

    for (let offset = 0; offset < selectOptions.length; offset++) {
      const index = (startIndex + offset) % selectOptions.length;
      const option = selectOptions[index];

      if (!option.disabled && getSearchLabel(option).toLowerCase().startsWith(normalized)) {
        return index;
      }
    }

    return -1;
  }

  function moveSearchHighlight(direction: 1 | -1) {
    if (filteredIndexes.length === 0) {
      return;
    }

    setHighlightedIndex((current) => {
      const currentPosition = filteredIndexes.indexOf(current);

      if (currentPosition === -1) {
        return filteredIndexes[0];
      }

      const nextPosition =
        (currentPosition + direction + filteredIndexes.length) % filteredIndexes.length;

      return filteredIndexes[nextPosition];
    });
  }

  function selectHighlightedOption() {
    if (highlightedIndex < 0) {
      return;
    }

    const selected = selectOptions[highlightedIndex];

    if (!selected || selected.disabled) {
      return;
    }

    onChange(selected.value);
    setSearch("");
    setOpen(false);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveSearchHighlight(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveSearchHighlight(-1);
        break;
      case "Enter":
        event.preventDefault();
        selectHighlightedOption();
        break;
      case "Escape":
        event.preventDefault();
        setSearch("");
        setOpen(false);
        break;
      case "Home":
        event.preventDefault();
        if (filteredIndexes.length > 0) {
          setHighlightedIndex(filteredIndexes[0]);
        }
        break;
      case "End":
        event.preventDefault();
        if (filteredIndexes.length > 0) {
          setHighlightedIndex(filteredIndexes[filteredIndexes.length - 1]);
        }
        break;
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    if (searchable) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (!open) {
            setOpen(true);
            return;
          }
          moveSearchHighlight(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!open) {
            setOpen(true);
            return;
          }
          moveSearchHighlight(-1);
          break;
        case "Enter":
          event.preventDefault();
          if (!open) {
            setOpen(true);
            return;
          }
          selectHighlightedOption();
          break;
        case "Escape":
          event.preventDefault();
          setSearch("");
          setOpen(false);
          break;
        case "Home":
          event.preventDefault();
          if (filteredIndexes.length > 0) {
            setHighlightedIndex(filteredIndexes[0]);
          }
          break;
        case "End":
          event.preventDefault();
          if (filteredIndexes.length > 0) {
            setHighlightedIndex(filteredIndexes[filteredIndexes.length - 1]);
          }
          break;
      }

      return;
    }

    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();

      const previous = typeaheadRef.current;
      const nextSearch = previous
        .toLowerCase()
        .split("")
        .every((character) => character === event.key.toLowerCase())
        ? event.key
        : previous + event.key;

      typeaheadRef.current = nextSearch;

      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }

      typeaheadTimeoutRef.current = setTimeout(() => {
        typeaheadRef.current = "";
      }, 750);

      const match = findMatchingOption(nextSearch, highlightedIndex + 1);

      if (match >= 0) {
        setOpen(true);
        setHighlightedIndex(match);
      }

      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setOpen(true);
        setHighlightedIndex((previous) => Math.min(previous + 1, selectOptions.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setOpen(true);
        setHighlightedIndex((previous) => Math.max(previous - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        selectHighlightedOption();
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Home":
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        event.preventDefault();
        setHighlightedIndex(Math.max(selectOptions.length - 1, 0));
        break;
    }
  }

  return { handleKeyDown, handleSearchKeyDown };
}

function getSearchLabel<T>(option: SelectOption<T>): string {
  return option.searchLabel ?? (typeof option.label === "string" ? option.label : "");
}
