// SPDX-License-Identifier: MPL-2.0

export interface PlayerRatings {
  overall: number;
  totalTurns: number;
  gameTurns: number;
  mvps: number;
  streak: number;
}

export interface PlayerStats {
  totalTurns: number;
  gameTurns: number;
  mvps: number;
  streak: number;
}

export interface Player {
  id: number;
  name: string;
  team: string;
  ratings: PlayerRatings;
  stats: PlayerStats;
}

export interface PlayerTurn {
  id: number;
  season: number;
  day: number;
  team: string;
  territory: string;
  stars: number;
  weight: number;
  multiplier: number;
  power: number;
  mvp: boolean;
}

export const players: Player[] = [
  {
    id: 1,
    name: "BuckeyeFan",
    team: "Ohio State",
    ratings: {
      overall: 5,
      totalTurns: 5,
      gameTurns: 4,
      mvps: 5,
      streak: 5,
    },
    stats: {
      totalTurns: 106,
      gameTurns: 27,
      mvps: 41,
      streak: 27,
    },
  },
  {
    id: 2,
    name: "Mountaineer",
    team: "Appalachian State",
    ratings: {
      overall: 4,
      totalTurns: 4,
      gameTurns: 3,
      mvps: 3,
      streak: 4,
    },
    stats: {
      totalTurns: 84,
      gameTurns: 22,
      mvps: 18,
      streak: 14,
    },
  },
  {
    id: 3,
    name: "Jayhawk",
    team: "Kansas",
    ratings: {
      overall: 3,
      totalTurns: 3,
      gameTurns: 4,
      mvps: 2,
      streak: 3,
    },
    stats: {
      totalTurns: 61,
      gameTurns: 19,
      mvps: 9,
      streak: 8,
    },
  },
];

const mockTeams = ["Ohio State", "Appalachian State", "Kansas"];

const mockTerritories = [
  "Columbus",
  "Athens",
  "Toledo",
  "Cleveland",
  "Cincinnati",
  "Charleston",
  "Morgantown",
  "Lawrence",
  "Manhattan",
  "Topeka",
  "Akron",
  "Dayton",
];

const mockWeights = [0.5, 0.75, 1, 1.25, 1.5, 2];
const mockMultipliers = [0.5, 1, 1.25, 1.5, 2, 3];

function createPlayerTurnHistory(playerId: number): PlayerTurn[] {
  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const season = day <= 20 ? 2 : 3;
    const seed = playerId * 7 + index;

    const stars = (seed % 5) + 1;
    const weight = mockWeights[seed % mockWeights.length];
    const multiplier = mockMultipliers[(seed + 2) % mockMultipliers.length];
    const power = Number((stars * weight * multiplier).toFixed(2));

    return {
      id: playerId * 1000 + index + 1,
      season,
      day: season === 2 ? day : day - 20,
      team: mockTeams[seed % mockTeams.length],
      territory: mockTerritories[(seed * 3) % mockTerritories.length],
      stars,
      weight,
      multiplier,
      power,
      mvp: seed % 7 === 0,
    };
  });
}

export const playerTurnHistory: Record<number, PlayerTurn[]> = {
  1: createPlayerTurnHistory(1),
  2: createPlayerTurnHistory(2),
  3: createPlayerTurnHistory(3),
};
