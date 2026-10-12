// SPDX-License-Identifier: MPL-2.0

import { useMemo } from "react";
import { ResetMapIcon, ZoomInIcon, ZoomOutIcon } from "@/features/map/icons";
import { Button } from "@/shared/components/Button";
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

export default function VisitedControls({
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
      <div className="pointer-events-none absolute inset-x-0 z-10 flex justify-center px-3">
        <div className="pointer-events-auto flex flex-col items-center gap-2 sm:flex-row sm:gap-0 sm:shadow-lg">
          <Select<number>
            value={selectedSeason}
            options={seasonOptions}
            onChange={(value) => {
              if (value !== "") onSeasonChange(value);
            }}
            width="full"
            className="sm:border-b-0 sm:border-r"
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
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
        <div className="pointer-events-auto flex items-center gap-1">
          <Button variant="primary" aria-label="Zoom In" title="Map coming soon">
            <ZoomInIcon />
            <span className="hidden sm:inline">Zoom In</span>
          </Button>
          <Button variant="primary" aria-label="Zoom Out" title="Map coming soon">
            <ZoomOutIcon />
            <span className="hidden sm:inline">Zoom Out</span>
          </Button>
          <Button variant="primary" aria-label="Reset Map" title="Map coming soon">
            <ResetMapIcon />
            <span className="hidden sm:inline">Reset Map</span>
          </Button>
        </div>
      </div>
    </>
  );
}
