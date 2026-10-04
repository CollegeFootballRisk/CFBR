// SPDX-License-Identifier: MPL-2.0

export const STAR_CATEGORIES = {
  mvps: {
    name: "MVPs",
    description: "when you are the MVP of a territory",
    thresholds: [1, 5, 10, 25],
    thresholdLabels: [
      "0 MVPs: 1 Star",
      "1-4 MVPs: 2 Stars",
      "5-9 MVPs: 3 Stars",
      "10-24 MVPs: 4 Stars",
      "25+ MVPs: 5 Stars",
    ],
  },
  turns: {
    name: "Turns",
    description: "how many turns you've had in all College Football Risk games",
    thresholds: [10, 25, 50, 100],
    thresholdLabels: [
      "0-9 Turns: 1 Star",
      "10-24 Turns: 2 Stars",
      "25-49 Turns: 3 Stars",
      "50-99 Turns: 4 Stars",
      "100+ Turns: 5 Stars",
    ],
  },
  gameTurns: {
    name: "Game Turns",
    description: "all the turns you've made in this game",
    thresholds: [5, 10, 25, 40],
    thresholdLabels: [
      "0-4 Turns: 1 Star",
      "5-9 Turns: 2 Stars",
      "10-24 Turns: 3 Stars",
      "25-39 Turns: 4 Stars",
      "40+ Turns: 5 Stars",
    ],
  },
  streak: {
    name: "Streak",
    description: "how many consecutive turns you've made",
    thresholds: [3, 5, 10, 25],
    thresholdLabels: [
      "0-2 Turns: 1 Star",
      "3-4 Turns: 2 Stars",
      "5-9 Turns: 3 Stars",
      "10-24 Turns: 4 Stars",
      "25+ Turns: 5 Stars",
    ],
  },
} as const;

export function getStarRating(value: number, thresholds: readonly number[]): number {
  return thresholds.reduce((rating, threshold) => rating + Number(value >= threshold), 1);
}

export function getOverallStarRating(ratings: number[]): number {
  const sorted = [...ratings].sort((a, b) => a - b);

  return Math.ceil((sorted[1] + sorted[2]) / 2);
}
