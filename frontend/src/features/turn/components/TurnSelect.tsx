// SPDX-License-Identifier: MPL-2.0

import { Select } from "@/shared/components/Select";

export type TurnSelection = "latest" | number;

export interface Turn {
  id: number;
  season: number;
  day: number;
}

interface TurnSelectProps {
  value: TurnSelection;
  turns: Turn[];
  onChange: (value: TurnSelection) => void;
  label?: string;
  rounded?: "none" | "md";
  className?: string;
}

export default function TurnSelect({
  value,
  turns,
  onChange,
  label = "Turn",
  rounded = "md",
  className,
}: TurnSelectProps) {
  const options = [
    { label: "Latest", value: "latest" as const },
    ...turns.map((turn) => ({
      label: `${turn.season}/${turn.day}`,
      value: turn.id,
    })),
  ];

  return (
    <Select<TurnSelection>
      value={value}
      options={options}
      onChange={(nextValue) => {
        if (nextValue !== "") {
          onChange(nextValue);
        }
      }}
      label={label}
      variant="map-control"
      rounded={rounded}
      className={className}
    />
  );
}
