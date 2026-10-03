import { type KeyboardEvent, type RefObject, useEffect, useMemo, useRef, useState } from "react";

import {
  buildSelectItems,
  type SelectItem,
  type SelectOption,
  type SelectRenderItem,
} from "./selectTypes";

interface UseSelectProps<T> {
  value?: T | "";
  options: SelectItem<T>[];
  placeholder: string;
  placeholderAsOption: boolean;
  disabled: boolean;
  onChange: (value: T | "") => void;
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

  displayValue: string;
  longestOption: string;

  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

function getDisplayLabel<T>(option: SelectOption<T>, renderItems: SelectRenderItem<T>[]): string {
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

export default function useSelect<T>({
  value,
  options,
  placeholder,
  placeholderAsOption,
  disabled,
  onChange,
}: UseSelectProps<T>): UseSelectReturn<T> {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const typeaheadRef = useRef("");
  const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    optionRefs.current[highlightedIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightedIndex, open]);

  useEffect(() => {
    return () => {
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }
    };
  }, []);

  const { selectOptions, renderItems } = useMemo(
    () => buildSelectItems(options, placeholder, placeholderAsOption, value ?? ""),
    [options, placeholder, placeholderAsOption, value],
  );

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

  const longestOption = useMemo(() => {
    return [
      placeholder,
      ...selectOptions.map((option) => getDisplayLabel(option, renderItems)),
    ].reduce((largest, current) => (current.length > largest.length ? current : largest), "");
  }, [placeholder, renderItems, selectOptions]);

  function findMatchingOption(search: string, startIndex: number) {
    const normalized = search.toLowerCase();

    for (let selectOption = 0; selectOption < selectOptions.length; selectOption++) {
      const index = (startIndex + selectOption) % selectOptions.length;
      const option = selectOptions[index];

      if (option.disabled) continue;

      if (option.label.toLowerCase().startsWith(normalized)) {
        return index;
      }
    }

    return -1;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();

      const previous = typeaheadRef.current;

      const nextSearch = previous
        ?.toLowerCase()
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

      case "Enter": {
        event.preventDefault();

        if (!open) {
          setOpen(true);
          return;
        }

        const selected = selectOptions[highlightedIndex];

        if (!selected || selected.disabled) return;

        onChange(selected.value);
        setOpen(false);

        break;
      }

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

    displayValue,
    longestOption,

    handleKeyDown,
  };
}
