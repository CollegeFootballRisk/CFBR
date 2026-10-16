/* SPDX-License-Identifier: MPL-2.0 */

import { StarIcon } from "@/shared/components/Icons";

const chartColorClasses = {
  1: "border-[var(--color-chart-1)] text-[var(--color-chart-1)]",
  2: "border-[var(--color-chart-2)] text-[var(--color-chart-2)]",
  3: "border-[var(--color-chart-3)] text-[var(--color-chart-3)]",
  4: "border-[var(--color-chart-4)] text-[var(--color-chart-4)]",
  5: "border-[var(--color-chart-5)] text-[var(--color-chart-5)]",
} as const;

interface ChartLegendItem {
  key: string;
  label: React.ReactNode;
  colorClass: string;
}

export function ChartLegend({ items }: { items: ChartLegendItem[] }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-1">
          <span
            className={`inline-block h-4 w-8 shrink-0 rounded-sm border-2 bg-transparent ${item.colorClass}`}
          />
          <span className="flex h-4 items-center leading-none">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

const starSeries = [
  { key: "ones", label: 1 },
  { key: "twos", label: 2 },
  { key: "threes", label: 3 },
  { key: "fours", label: 4 },
  { key: "fives", label: 5 },
] as const;

export const starLegendItems: ChartLegendItem[] = starSeries.map((series) => ({
  key: series.key,
  colorClass: chartColorClasses[series.label].split(" ")[0],
  label: (
    <span className={`flex items-center ${chartColorClasses[series.label].split(" ")[1]}`}>
      {([1, 2, 3, 4, 5] as const).slice(0, series.label).map((starPosition) => (
        <StarIcon key={`${series.key}-star-${starPosition}`} className="size-3" />
      ))}
    </span>
  ),
}));

export const starPowerLegendItems: ChartLegendItem[] = [
  {
    key: "starPower",
    colorClass: "border-[var(--color-chart-1)]",
    label: "Star Power",
  },
];
