// SPDX-License-Identifier: MPL-2.0

import { type Team, teams } from "@/features/team/data/teams";

export interface VisitedTeam {
  id: number;
  name: string;
}

export const seasons: number[] = [12, 11, 10];

const mockTeams: VisitedTeam[] = teams.map(({ id, name }: Team) => ({ id, name }));

export const teamsBySeason: Record<number, VisitedTeam[]> = Object.fromEntries(
  seasons.map((season) => [season, mockTeams]),
);

export function getTeamsForSeason(season: number): VisitedTeam[] {
  return teamsBySeason[season] ?? [];
}
