// SPDX-License-Identifier: MPL-2.0

import { useMemo } from "react";
import { MapControlPosition } from "@/features/map/components/MapControlPosition";
import { MapNavigationControls } from "@/features/map/components/MapNavigationControls";
import { Select } from "@/shared/components/Select";
import type { VisitedTeam } from "../data/visited";

interface VisitedControlsProps {
  seasons: number[];
  teams: VisitedTeam[];
  selectedSeason: number;
  selectedTeam: number;
  onSeasonChange: (season: number) => void;
  onTeamChange: (teamId: number) => void;
}

export function VisitedControls({
  seasons,
  teams,
  selectedSeason,
  selectedTeam,
  onSeasonChange,
  onTeamChange,
}: VisitedControlsProps) {
  const seasonOptions = useMemo(
    () => seasons.map((season) => ({ label: `Season ${season}`, value: season })),
    [seasons],
  );
  const teamOptions = useMemo(
    () => teams.map((team) => ({ label: team.name, value: team.id })),
    [teams],
  );

  return (
    <>
      <MapControlPosition placement="top">
        <div className="pointer-events-auto flex flex-col items-center gap-2 sm:flex-row sm:gap-0 sm:shadow-lg">
          <Select<number>
            value={selectedSeason}
            options={seasonOptions}
            onChange={(value) => {
              if (value !== "") onSeasonChange(value);
            }}
            width="full"
            className="sm:border-r sm:border-b-0"
            label="Visited season"
            variant="map-control"
            rounded="md-sm-left"
          />
          <Select<number>
            value={selectedTeam}
            options={teamOptions}
            onChange={(value) => {
              if (value !== "") onTeamChange(value);
            }}
            label="Visited team"
            variant="map-control"
            rounded="md-sm-right"
          />
        </div>
      </MapControlPosition>

      <MapNavigationControls />
    </>
  );
}
