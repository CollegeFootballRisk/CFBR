// SPDX-License-Identifier: MPL-2.0

import { Select } from "@/shared/components/Select";

export const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50, 100] as const;

interface PageSizeSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  return (
    <Select<number>
      rounded="full"
      value={value}
      options={PAGE_SIZE_OPTIONS.map((option) => ({
        label: String(option),
        value: option,
      }))}
      onChange={(value) => {
        if (value !== "") {
          onChange(value);
        }
      }}
    />
  );
}
