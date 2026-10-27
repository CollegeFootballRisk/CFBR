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

export function SelectDropdown<T>({
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
      data-modal-portal
      className={[
        "fixed z-9999 flex flex-col overflow-hidden",
        "rounded-md border border-control-border bg-control shadow-xl",
      ].join(" ")}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: Math.min(position.height, MAX_DROPDOWN_HEIGHT),
      }}
    >
      {searchable && (
        <div className="shrink-0 border-control-border border-b bg-control p-2">
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            aria-label={`Search ${label ?? "options"}`}
            className={[
              "px-3 py-2",
              "w-full",
              "placeholder:text-foreground",
              "rounded-md border border-control-border bg-control outline-none focus-visible:outline-2",
              "focus-visible:outline-foreground",
            ].join(" ")}
          />
        </div>
      )}

      <div
        ref={listboxRef}
        id={`${selectId}-listbox`}
        role="listbox"
        aria-labelledby={label ? labelId : undefined}
        className="flex min-h-0 flex-col overflow-y-auto overflow-x-hidden overscroll-contain"
      >
        {filteredItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-4 py-3 text-center text-foreground">
            No options found
          </div>
        ) : (
          filteredItems.map((item) => {
            if (item.kind === "group") {
              return (
                // biome-ignore lint/a11y/useSemanticElements: the listbox doesn't need a group key
                <div key={`group-${item.label}`} role="group" aria-label={item.label}>
                  <div className="mx-3 mt-2 border-control-border border-b px-1 pb-1 font-semibold text-xs uppercase tracking-wider">
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
