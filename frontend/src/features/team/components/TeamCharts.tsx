/* SPDX-License-Identifier: MPL-2.0 */

import { useState } from "react";
import { Line, Tooltip } from "recharts";
import { StarIcon } from "@/shared/components/Icons";
import type { PlayerStarsPoint, StarPowerPoint } from "../data/teams";
import { ChartLegend, starLegendItems, starPowerLegendItems } from "./ChartLegend";
import { chartTooltipClassName, TeamLineChart } from "./TeamLineChart";

const starSeries = [
  { key: "ones", label: 1, color: "var(--color-chart-1)" },
  { key: "twos", label: 2, color: "var(--color-chart-2)" },
  { key: "threes", label: 3, color: "var(--color-chart-3)" },
  { key: "fours", label: 4, color: "var(--color-chart-4)" },
  { key: "fives", label: 5, color: "var(--color-chart-5)" },
] as const;

const chartColorClasses = {
  1: "border-[var(--color-chart-1)] text-[var(--color-chart-1)]",
  2: "border-[var(--color-chart-2)] text-[var(--color-chart-2)]",
  3: "border-[var(--color-chart-3)] text-[var(--color-chart-3)]",
  4: "border-[var(--color-chart-4)] text-[var(--color-chart-4)]",
  5: "border-[var(--color-chart-5)] text-[var(--color-chart-5)]",
} as const;

function formatChartValue(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function PlayerStarsChart({ data }: { data: PlayerStarsPoint[] }) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    day: number;
    seriesKey: string;
  } | null>(null);

  return (
    <div className="h-72 w-full min-w-0">
      <ChartLegend items={starLegendItems} />

      <TeamLineChart
        data={data}
        ariaLabel="Player Stars by day"
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <Tooltip
          content={(props) => {
            if (!props.active || !hoveredPoint) {
              return null;
            }

            const series = starSeries.find((item) => item.key === hoveredPoint.seriesKey);
            const point = data.find((item) => item.day === hoveredPoint.day);

            if (!series || !point) {
              return null;
            }

            return (
              <div className={`px-3 py-2 text-left ${chartTooltipClassName}`}>
                <div className="mb-1 font-semibold">{point.day}</div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center ${chartColorClasses[series.label].split(" ")[1]}`}
                  >
                    {Array.from({ length: series.label }, (_, index) => (
                      <StarIcon key={`${series.key}-${"x".repeat(index + 1)}`} className="size-3" />
                    ))}
                    :
                  </span>
                  <span>{formatChartValue(point[series.key])}</span>
                </div>
              </div>
            );
          }}
        />

        {starSeries.map((series) => (
          <Line
            key={series.key}
            type="monotone"
            dataKey={series.key}
            name={`${series.label} star${series.label > 1 ? "s" : ""}`}
            stroke={series.color}
            strokeWidth={2}
            dot={(dotProps) => {
              const point = data[dotProps.index];

              const handleHover = () => {
                if (point) {
                  setHoveredPoint({
                    day: point.day,
                    seriesKey: series.key,
                  });
                }
              };

              return (
                // biome-ignore lint/a11y/noStaticElementInteractions: SVG chart markers use hover to display point details
                <g className="cursor-pointer" onMouseEnter={handleHover}>
                  <circle
                    cx={dotProps.cx}
                    cy={dotProps.cy}
                    r={5}
                    fill="transparent"
                    stroke={series.color}
                    strokeWidth={2}
                  />
                  <circle
                    cx={dotProps.cx}
                    cy={dotProps.cy}
                    r={1.5}
                    fill="var(--color-foreground)"
                    stroke="none"
                    pointerEvents="none"
                  />
                </g>
              );
            }}
            activeDot={false}
            isAnimationActive={false}
          />
        ))}
      </TeamLineChart>
    </div>
  );
}

export function StarPowerChart({ data }: { data: StarPowerPoint[] }) {
  return (
    <div className="h-72 w-full min-w-0">
      <ChartLegend items={starPowerLegendItems} />

      <TeamLineChart data={data} ariaLabel="Star Power by day">
        <Tooltip
          content={(props) => {
            if (!props.active || !props.payload?.length) {
              return null;
            }

            const value = props.payload[0].value;

            return (
              <div className={`px-3 py-2 text-left ${chartTooltipClassName}`}>
                <div className="mb-1 font-semibold">{String(props.label)}</div>
                <div>
                  <span className="text-(--chart-1)">Star Power:</span>{" "}
                  {typeof value === "number" ? formatChartValue(value) : String(value)}
                </div>
              </div>
            );
          }}
        />

        <Line
          type="monotone"
          dataKey="starPower"
          name="Star Power"
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
          dot={(dotProps) => (
            <g>
              <circle
                cx={dotProps.cx}
                cy={dotProps.cy}
                r={5}
                fill="transparent"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
              />
              <circle
                cx={dotProps.cx}
                cy={dotProps.cy}
                r={1.5}
                fill="var(--color-foreground)"
                stroke="none"
                pointerEvents="none"
              />
            </g>
          )}
          activeDot={false}
          connectNulls={false}
          isAnimationActive={false}
        />
      </TeamLineChart>
    </div>
  );
}
