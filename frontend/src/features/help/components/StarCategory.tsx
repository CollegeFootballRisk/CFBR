import { Input } from "@/shared/components/Input";
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
    <div className="flex h-full flex-col rounded-md border p-3">
      <div className="flex gap-3">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
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
        <div className="w-36 shrink-0 text-left">
          <h3 className="font-bold">{category.name}</h3>
          <p className="italic">{category.description}</p>
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
