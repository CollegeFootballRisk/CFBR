// SPDX-License-Identifier: MPL-2.0

import { Input } from "@/shared/components/form";
import { StarRating } from "./StarRating";

interface StarCategoryProps {
  category: {
    name: string;
    description: string;
    thresholds: readonly number[];
    thresholdLabels: readonly string[];
  };
  value: number;
  rating: number;
  onChange: (value: number) => void;
}
export function StarCategory({ category, value, rating, onChange }: StarCategoryProps) {
  return (
    <div className="@container flex h-full flex-col rounded-md border p-3">
      <div className="flex @xs:flex-row flex-col @xs:items-center @xs:gap-4 gap-3">
        <div className="@xs:min-w-0 @xs:flex-1 text-left">
          <h3 className="font-bold">{category.name}</h3>
          <p className="italic">{category.description}</p>
        </div>

        <div className="flex @xs:w-52 @xs:shrink-0 flex-col items-center gap-2">
          <StarRating value={rating} />
          <Input
            id={`${category.name}-value`}
            aria-label={`${category.name} value`}
            type="number"
            min={0}
            value={value}
            onChange={(event) => {
              onChange(Math.max(0, Number(event.target.value)));
            }}
            className="w-20"
          />
        </div>
      </div>

      <ul className="mt-auto list-inside list-disc pt-3 text-center">
        {category.thresholdLabels.map((threshold) => (
          <li key={threshold}>{threshold}</li>
        ))}
      </ul>
    </div>
  );
}
