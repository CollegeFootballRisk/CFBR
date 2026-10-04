// SPDX-License-Identifier: MPL-2.0

import { StarIcon } from "@/shared/components/Icons";

export function StarRating({ value }: { value: number }) {
  const stars = Array.from({ length: value }, (_, index) => index + 1);

  return (
    <div className="flex min-h-8 items-center justify-center sm:min-h-10">
      {stars.map((star) => (
        <StarIcon key={star} className="size-8 shrink-0 sm:size-10" />
      ))}
    </div>
  );
}
