/* SPDX-License-Identifier: MPL-2.0 */

export interface TeamStats {
  mercs: number;
  players: number;
  stars: number;
  territories: number;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  stats: TeamStats;
}

export interface TeamPlayer {
  id: number;
  name: string;
  turns: number;
  mvps: number;
  team?: string;
}

export interface PlayerStarsPoint {
  sequence: number;
  season: number;
  day: number;
  ones: number;
  twos: number;
  threes: number;
  fours: number;
  fives: number;
}

export interface StarPowerPoint {
  sequence: number;
  season: number;
  day: number;
  starPower: number;
}

export const teams: Team[] = [
  {
    id: 1,
    name: "Appalachian State",
    logo: "/images/logos/Appalachian State.svg",
    stats: { mercs: 5, players: 117, stars: 445, territories: 4 },
  },
  {
    id: 2,
    name: "Ohio State",
    logo: "/images/logos/Ohio State.svg",
    stats: { mercs: 8, players: 104, stars: 392, territories: 12 },
  },
  {
    id: 3,
    name: "Kansas",
    logo: "/images/logos/Kansas.svg",
    stats: { mercs: 3, players: 96, stars: 371, territories: 9 },
  },
];

export const mockPlayers: TeamPlayer[] = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  name: `Player ${index + 1}`,
  turns: 48 - (index % 12),
  mvps: Math.max(0, 10 - index),
}));

export const mockMercenaries: TeamPlayer[] = Array.from({ length: 5 }, (_, index) => ({
  id: index + 101,
  name: `Mercenary ${index + 1}`,
  team: teams[index % teams.length].name,
  turns: 30 - index * 2,
  mvps: Math.max(0, 5 - index),
}));

export const MOCK_LATEST_SEASON = 1;

export const mockPlayerStarsHistory: PlayerStarsPoint[] = [
  { sequence: 1, season: 1, day: 1, ones: 125, twos: 75, threes: 42, fours: 18, fives: 7 },
  { sequence: 2, season: 1, day: 2, ones: 138, twos: 81, threes: 45, fours: 20, fives: 8 },
  { sequence: 3, season: 1, day: 3, ones: 132, twos: 79, threes: 48, fours: 19, fives: 9 },
  { sequence: 4, season: 1, day: 4, ones: 151, twos: 87, threes: 51, fours: 23, fives: 10 },
  { sequence: 5, season: 1, day: 5, ones: 167, twos: 92, threes: 55, fours: 25, fives: 12 },
  { sequence: 6, season: 1, day: 6, ones: 160, twos: 96, threes: 58, fours: 27, fives: 13 },
  { sequence: 7, season: 1, day: 7, ones: 184, twos: 103, threes: 62, fours: 30, fives: 15 },
  { sequence: 8, season: 1, day: 8, ones: 193, twos: 108, threes: 67, fours: 32, fives: 16 },
  { sequence: 9, season: 1, day: 9, ones: 181, twos: 105, threes: 64, fours: 34, fives: 17 },
  { sequence: 10, season: 1, day: 10, ones: 207, twos: 116, threes: 72, fours: 37, fives: 19 },
  { sequence: 11, season: 1, day: 11, ones: 218, twos: 121, threes: 76, fours: 39, fives: 21 },
  { sequence: 12, season: 1, day: 12, ones: 226, twos: 129, threes: 81, fours: 42, fives: 23 },
  { sequence: 13, season: 1, day: 13, ones: 239, twos: 134, threes: 85, fours: 44, fives: 24 },
  { sequence: 14, season: 1, day: 14, ones: 231, twos: 139, threes: 88, fours: 47, fives: 26 },
  { sequence: 15, season: 1, day: 15, ones: 248, twos: 145, threes: 93, fours: 49, fives: 28 },
  { sequence: 16, season: 1, day: 16, ones: 261, twos: 151, threes: 97, fours: 52, fives: 30 },
  { sequence: 17, season: 1, day: 17, ones: 254, twos: 149, threes: 101, fours: 54, fives: 31 },
  { sequence: 18, season: 1, day: 18, ones: 273, twos: 158, threes: 105, fours: 57, fives: 33 },
  { sequence: 19, season: 1, day: 19, ones: 285, twos: 164, threes: 110, fours: 60, fives: 35 },
  { sequence: 20, season: 1, day: 20, ones: 278, twos: 169, threes: 114, fours: 62, fives: 36 },
  { sequence: 21, season: 1, day: 21, ones: 296, twos: 175, threes: 118, fours: 65, fives: 39 },
  { sequence: 22, season: 1, day: 22, ones: 308, twos: 182, threes: 123, fours: 68, fives: 41 },
  { sequence: 23, season: 1, day: 23, ones: 301, twos: 179, threes: 127, fours: 70, fives: 42 },
  { sequence: 24, season: 1, day: 24, ones: 321, twos: 190, threes: 132, fours: 73, fives: 44 },
  { sequence: 25, season: 1, day: 25, ones: 334, twos: 197, threes: 137, fours: 76, fives: 46 },
  { sequence: 26, season: 1, day: 26, ones: 326, twos: 201, threes: 141, fours: 79, fives: 48 },
  { sequence: 27, season: 1, day: 27, ones: 347, twos: 208, threes: 146, fours: 82, fives: 51 },
];

export const mockStarPowerHistory: StarPowerPoint[] = [
  { sequence: 1, season: 1, day: 1, starPower: 245.5 },
  { sequence: 2, season: 1, day: 2, starPower: 263.2 },
  { sequence: 3, season: 1, day: 3, starPower: 251.8 },
  { sequence: 4, season: 1, day: 4, starPower: 288.4 },
  { sequence: 5, season: 1, day: 5, starPower: 302.1 },
  { sequence: 6, season: 1, day: 6, starPower: 296.7 },
  { sequence: 7, season: 1, day: 7, starPower: 327.6 },
  { sequence: 8, season: 1, day: 8, starPower: 341.2 },
  { sequence: 9, season: 1, day: 9, starPower: 333.8 },
  { sequence: 10, season: 1, day: 10, starPower: 359.4 },
  { sequence: 11, season: 1, day: 11, starPower: 371.6 },
  { sequence: 12, season: 1, day: 12, starPower: 386.2 },
  { sequence: 13, season: 1, day: 13, starPower: 379.5 },
  { sequence: 14, season: 1, day: 14, starPower: 402.8 },
  { sequence: 15, season: 1, day: 15, starPower: 418.6 },
  { sequence: 16, season: 1, day: 16, starPower: 411.3 },
  { sequence: 17, season: 1, day: 17, starPower: 435.7 },
  { sequence: 18, season: 1, day: 18, starPower: 449.2 },
  { sequence: 19, season: 1, day: 19, starPower: 441.8 },
  { sequence: 20, season: 1, day: 20, starPower: 467.4 },
  { sequence: 21, season: 1, day: 21, starPower: 481.9 },
  { sequence: 22, season: 1, day: 22, starPower: 475.6 },
  { sequence: 23, season: 1, day: 23, starPower: 498.3 },
  { sequence: 24, season: 1, day: 24, starPower: 512.7 },
  { sequence: 25, season: 1, day: 25, starPower: 505.4 },
  { sequence: 26, season: 1, day: 26, starPower: 531.8 },
  { sequence: 27, season: 1, day: 27, starPower: 548.6 },
];
