// SPDX-License-Identifier: MPL-2.0

import { api } from "@/shared/api/client";

export interface PlayerSearchResult {
  id: number;
  displayName: string;
}

export async function searchPlayers(query: string, limit = 10): Promise<PlayerSearchResult[]> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
  });

  const response = await api.get<PlayerSearchResult[]>(`/api/players/search?${params.toString()}`);

  return response.data;
}
