// SPDX-License-Identifier: MPL-2.0

import { useState } from "react";
import { getOverallStarRating, getStarRating, STAR_CATEGORIES } from "../utils/stars";
import { StarCategory } from "./StarCategory";
import { StarRating } from "./StarRating";

export function StarCalculator() {
  const [starValues, setStarValues] = useState({
    mvps: 0,
    turns: 0,
    gameTurns: 0,
    streak: 0,
  });

  const ratings = {
    mvps: getStarRating(starValues.mvps, STAR_CATEGORIES.mvps.thresholds),
    turns: getStarRating(starValues.turns, STAR_CATEGORIES.turns.thresholds),
    gameTurns: getStarRating(starValues.gameTurns, STAR_CATEGORIES.gameTurns.thresholds),
    streak: getStarRating(starValues.streak, STAR_CATEGORIES.streak.thresholds),
  };

  const overallStars = getOverallStarRating(Object.values(ratings));

  return (
    <div className="@container space-y-4">
      <p>
        You can see how your overall star count works with the median of the 4 categories with the
        model below:
      </p>
      <div className="space-y-2 text-center">
        <p>Overall:</p>
        <StarRating value={overallStars} />
      </div>

      <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2 @3xl:gap-6">
        <StarCategory
          category={STAR_CATEGORIES.mvps}
          value={starValues.mvps}
          rating={ratings.mvps}
          onChange={(value) => setStarValues((prev) => ({ ...prev, mvps: value }))}
        />

        <StarCategory
          category={STAR_CATEGORIES.turns}
          value={starValues.turns}
          rating={ratings.turns}
          onChange={(value) => setStarValues((prev) => ({ ...prev, turns: value }))}
        />

        <StarCategory
          category={STAR_CATEGORIES.gameTurns}
          value={starValues.gameTurns}
          rating={ratings.gameTurns}
          onChange={(value) => setStarValues((prev) => ({ ...prev, gameTurns: value }))}
        />

        <StarCategory
          category={STAR_CATEGORIES.streak}
          value={starValues.streak}
          rating={ratings.streak}
          onChange={(value) => setStarValues((prev) => ({ ...prev, streak: value }))}
        />
      </div>
    </div>
  );
}
