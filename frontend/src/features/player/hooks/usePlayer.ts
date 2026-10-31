// SPDX-License-Identifier: MPL-2.0

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { searchPlayers } from "../api/player";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [value, delayMs]);

  return debouncedValue;
}

export function usePlayerSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  return useQuery({
    queryKey: ["players", "search", debouncedQuery],
    queryFn: () => searchPlayers(debouncedQuery),
    staleTime: 30_000,
  });
}
// TODO: After implementing players do this for the select
// const longestPlayerName = useMemo(
//   () =>
//     players.reduce(
//       (longest, player) => (player.name.length > longest.length ? player.name : longest),
//       "",
//     ),
//   [],
// );
