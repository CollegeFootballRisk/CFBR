// SPDX-License-Identifier: MPL-2.0

import type { ReactNode } from "react";

export interface SelectOption<T = string> {
  label: ReactNode;
  searchLabel?: string;
  value: T;
  disabled?: boolean;
}

export interface SelectOptionGroup<T = string> {
  type: "group";
  label: string;
  options: SelectOption<T>[];
}

export type SelectItem<T = string> = SelectOption<T> | SelectOptionGroup<T>;

export interface SelectRenderOption<T = string> {
  kind: "option";
  option: SelectOption<T>;
  index: number;
}

export interface SelectRenderGroup<T = string> {
  kind: "group";
  label: string;
  options: SelectRenderOption<T>[];
}

export type SelectRenderItem<T = string> = SelectRenderOption<T> | SelectRenderGroup<T>;

export function isSelectOptionGroup<T>(item: SelectItem<T>): item is SelectOptionGroup<T> {
  return "type" in item && item.type === "group";
}

export function buildSelectItems<T>(
  options: SelectItem<T>[],
  placeholder: string,
  placeholderAsOption: boolean,
  value: T | "",
): {
  selectOptions: SelectOption<T>[];
  renderItems: SelectRenderItem<T>[];
} {
  const selectOptions: SelectOption<T>[] = [];
  const renderItems: SelectRenderItem<T>[] = [];

  let index = 0;

  const shouldShowPlaceholder = placeholderAsOption && (value === "" || value === undefined);

  if (shouldShowPlaceholder) {
    const placeholderOption: SelectOption<T> = {
      label: placeholder,
      value: "" as T,
    };

    selectOptions.push(placeholderOption);

    renderItems.push({
      kind: "option",
      option: placeholderOption,
      index,
    });

    index += 1;
  }

  for (const item of options) {
    if (isSelectOptionGroup(item)) {
      const groupOptions = item.options.map((option) => {
        const renderedOption: SelectRenderOption<T> = {
          kind: "option",
          option,
          index,
        };

        selectOptions.push(option);
        index += 1;

        return renderedOption;
      });

      renderItems.push({
        kind: "group",
        label: item.label,
        options: groupOptions,
      });

      continue;
    }

    selectOptions.push(item);

    renderItems.push({
      kind: "option",
      option: item,
      index,
    });

    index += 1;
  }

  return {
    selectOptions,
    renderItems,
  };
}
