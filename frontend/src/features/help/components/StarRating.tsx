import { StarIcon } from "@/shared/components/Icons";

export function StarRating({ value }: { value: number }) {
  const stars = Array.from({ length: value }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-center">
      {stars.map((star) => (
        <StarIcon key={star} />
      ))}
    </div>
  );
}
