// SPDX-License-Identifier: MPL-2.0

import type { Dispatch, RefObject, SetStateAction } from "react";
import { createPortal } from "react-dom";

import { SelectOptionItem } from "./SelectOptionItem";
import type { SelectRenderItem } from "./selectTypes";

export interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface SelectDropdownProps<T> {
  position: DropdownPosition | null;
  dropdownRef: RefObject<HTMLDivElement | null>;
  listboxRef: RefObject<HTMLDivElement | null>;
  searchInputRef: RefObject<HTMLInputElement | null>;
  selectId: string;
  labelId: string;
  label?: string;
  searchable: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  handleSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  filteredItems: SelectRenderItem<T>[];
  value?: T | "";
  highlightedIndex: number;
  setHighlightedIndex: Dispatch<SetStateAction<number>>;
  optionRefs: RefObject<(HTMLDivElement | null)[]>;
  centeredOptions: boolean;
  handleOptionSelect: (value: T | "") => void;
}

const MAX_DROPDOWN_HEIGHT = 256;

export default function SelectDropdown<T>({
  position,
  dropdownRef,
  listboxRef,
  searchInputRef,
  selectId,
  labelId,
  label,
  searchable,
  search,
  setSearch,
  handleSearchKeyDown,
  filteredItems,
  value,
  highlightedIndex,
  setHighlightedIndex,
  optionRefs,
  centeredOptions,
  handleOptionSelect,
}: SelectDropdownProps<T>) {
  if (!position) {
    return null;
  }

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-9999 flex flex-col overflow-hidden rounded-md border border-control-border bg-control shadow-xl"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        maxHeight: MAX_DROPDOWN_HEIGHT,
      }}
    >
      {searchable && (
        <div className="shrink-0 border-b border-control-border bg-control p-2">
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            aria-label={`Search ${label ?? "options"}`}
            className="w-full rounded-md border border-control-border bg-control px-3 py-2 placeholder:text-foreground outline-none focus-visible:outline-2 focus-visible:outline-foreground"
          />
        </div>
      )}

      <div
        ref={listboxRef}
        id={`${selectId}-listbox`}
        role="listbox"
        aria-labelledby={label ? labelId : undefined}
        className="flex flex-col min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
      >
        {filteredItems.length === 0 ? (
          <div className="flex flex-1 justify-center items-center px-4 py-3 text-center text-foreground">
            No options found
          </div>
        ) : (
          filteredItems.map((item) => {
            if (item.kind === "group") {
              return (
                // biome-ignore lint/a11y/useSemanticElements: the listbox doesn't need a group key
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
                      centeredOptions={centeredOptions}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => {
                        if (!option.disabled) {
                          handleOptionSelect(option.value);
                        }
                      }}
                    />
                  ))}
                </div>
              );
            }

            const { option, index } = item;

            return (
              <SelectOptionItem
                key={`option-${index}-${String(option.value)}`}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                label={option.label}
                selected={Object.is(option.value, value)}
                highlighted={index === highlightedIndex}
                disabled={option.disabled}
                centeredOptions={centeredOptions}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => {
                  if (!option.disabled) {
                    handleOptionSelect(option.value);
                  }
                }}
              />
            );
          })
        )}
      </div>
    </div>,
    document.body,
  );
}
