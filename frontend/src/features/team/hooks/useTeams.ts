import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../api/team";

export const teamQueryKeys = {
  all: ["teams"] as const,
};

export function useTeams() {
  return useQuery({
    queryKey: teamQueryKeys.all,
    queryFn: getTeams,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
