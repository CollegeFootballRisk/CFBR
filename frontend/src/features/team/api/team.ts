import { api } from "@/shared/api/client";

export interface Team {
  id: number;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  seasons: number[];
}

export async function getTeams(): Promise<Team[]> {
  const response = await api.get<Team[]>("/api/teams");
  return response.data;
}

/** Chaos (ID 0) is a valid team record but cannot be joined. */
export function getJoinableTeams(teams: Team[]): Team[] {
  return teams.filter((team) => team.id !== 0);
}
