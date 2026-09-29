import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";

import type { SelectOption } from "./selectTypes";

interface UseSelectProps<T> {
  value?: T | "";
  options: SelectOption<T>[];
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
  optionRefs: React.RefObject<(HTMLLIElement | null)[]>;

  selectOptions: SelectOption<T>[];
  displayValue: string;
  longestOption: string;

  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
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
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const typeaheadRef = useRef("");
  const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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

  const selectOptions = useMemo(() => {
    if (!placeholderAsOption) {
      return options;
    }

    // Show the placeholder as an option only while no value is selected.
    if (value !== "" && value !== undefined) {
      return options;
    }

    return [
      {
        label: placeholder,
        value: "" as T,
      },
      ...options,
    ];
  }, [options, placeholder, placeholderAsOption, value]);

  const selectedOption = useMemo(
    () => selectOptions.find((option) => Object.is(option.value, value)),
    [selectOptions, value],
  );

  const displayValue = selectedOption?.label ?? placeholder;

  const longestOption = useMemo(() => {
    return [placeholder, ...selectOptions.map((option) => option.label)].reduce(
      (largest, current) =>
        current.length > largest.length ? current : largest,
      "",
    );
  }, [placeholder, selectOptions]);

  function findMatchingOption(search: string, startIndex: number) {
    const normalized = search.toLowerCase();

    for (
      let selectOption = 0;
      selectOption < selectOptions.length;
      selectOption++
    ) {
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

    if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();

      const previous = typeaheadRef.current;

      const nextSearch =
        previous &&
        previous
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

        setHighlightedIndex((previous) =>
          Math.min(previous + 1, selectOptions.length - 1),
        );

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

        if (selected.disabled) return;

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

        setHighlightedIndex(selectOptions.length - 1);

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
    displayValue,
    longestOption,

    handleKeyDown,
  };
}
