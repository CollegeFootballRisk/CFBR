/* SPDX-License-Identifier: MPL-2.0 */

import type { ReactNode } from "react";
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface TeamLineChartProps<T extends object> {
  data: T[];
  children: ReactNode;
  ariaLabel: string;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  onMouseLeave?: () => void;
}

export const chartTooltipClassName =
  "rounded-lg border border-[var(--control-border)] bg-[var(--control)] text-sm text-[var(--foreground)]";

function ChartGrid() {
  return (
    <CartesianGrid stroke="var(--foreground)" strokeOpacity={0.15} strokeDasharray="3 3" vertical />
  );
}

function ChartXAxis() {
  return (
    <XAxis
      dataKey="day"
      type="number"
      domain={["dataMin", "dataMax"]}
      ticks={Array.from({ length: 14 }, (_, index) => index * 2 + 1)}
      tick={{ fill: "var(--foreground)", fontSize: 12 }}
      tickLine={false}
      axisLine={false}
      minTickGap={0}
      allowDecimals={false}
      height={36}
    />
  );
}

function ChartYAxis() {
  return (
    <YAxis
      width={52}
      tick={{ fill: "var(--foreground)", fontSize: 12 }}
      tickLine={false}
      axisLine={false}
      tickFormatter={(value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
      domain={[0, "auto"]}
      allowDecimals={false}
    />
  );
}

export default function TeamLineChart<T extends object>({
  data,
  children,
  ariaLabel,
  margin,
  onMouseLeave,
}: TeamLineChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={margin}
        onMouseLeave={onMouseLeave}
        accessibilityLayer
        title={ariaLabel}
      >
        <ChartGrid />
        <ChartXAxis />
        <ChartYAxis />
        {children}
      </LineChart>
    </ResponsiveContainer>
  );
}
