// SPDX-License-Identifier: MPL-2.0

import { useMemo } from "react";
import { MapControlPosition } from "@/features/map/components/MapControlPosition";
import { MapNavigationControls } from "@/features/map/components/MapNavigationControls";
import { Button } from "@/shared/components/Button";
import { QuestionIcon, StarIcon } from "@/shared/components/Icons";
import { useModal } from "@/shared/components/Modal";
import { Select } from "@/shared/components/Select";

export interface OddsTurn {
  id: number;
  season: number;
  day: number;
}

export interface OddsTeam {
  id: number;
  name: string;
}

export type OddsDisplayMode =
  | "chance"
  | "players"
  | "wins"
  | "ones"
  | "twos"
  | "threes"
  | "fours"
  | "fives"
  | "teamPower"
  | "territoryPower";

interface OddsControlsProps {
  turns: OddsTurn[];
  teamsByTurn: Record<number, OddsTeam[]>;
  selectedTurn: number;
  selectedTeam: number;
  displayMode: OddsDisplayMode;
  onTurnChange: (turnId: number) => void;
  onTeamChange: (teamId: number) => void;
  onDisplayModeChange: (mode: OddsDisplayMode) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
}

const starIds = ["one", "two", "three", "four", "five"] as const;

const StarDisplay = ({ count }: { count: number }) => (
  <span className="flex items-center">
    {starIds.slice(0, count).map((star) => (
      <StarIcon key={star} className="size-4" />
    ))}
  </span>
);

const displayOptions: { label: React.ReactNode; value: OddsDisplayMode }[] = [
  { label: "Chance", value: "chance" },
  { label: "Players", value: "players" },
  { label: "Wins", value: "wins" },
  { label: <StarDisplay count={1} />, value: "ones" },
  { label: <StarDisplay count={2} />, value: "twos" },
  { label: <StarDisplay count={3} />, value: "threes" },
  { label: <StarDisplay count={4} />, value: "fours" },
  { label: <StarDisplay count={5} />, value: "fives" },
  { label: "Team Power", value: "teamPower" },
  { label: "Territory Power", value: "territoryPower" },
];

export function OddsControls({
  turns,
  teamsByTurn,
  selectedTurn,
  selectedTeam,
  displayMode,
  onTurnChange,
  onTeamChange,
  onDisplayModeChange,
  onZoomIn,
  onZoomOut,
  onReset,
}: OddsControlsProps) {
  const { openModal } = useModal();

  const turnOptions = useMemo(
    () =>
      turns.map((turn) => ({
        label: `${turn.season}/${turn.day}`,
        value: turn.id,
      })),
    [turns],
  );

  const teamOptions = useMemo(
    () =>
      (teamsByTurn[selectedTurn] ?? []).map((team) => ({
        label: team.name,
        value: team.id,
      })),
    [selectedTurn, teamsByTurn],
  );

  return (
    <>
      {/* Top odds controls */}
      <MapControlPosition placement="top">
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Odds selectors */}
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-0 sm:shadow-lg">
            <Select<number>
              value={selectedTurn}
              options={turnOptions}
              onChange={(value) => {
                if (value !== "") {
                  onTurnChange(value);
                }
              }}
              className="sm:border-r sm:border-b-0"
              label="Odds turn"
              variant="map-control"
              rounded="md-sm-left"
            />

            <Select<number>
              value={selectedTeam}
              options={teamOptions}
              onChange={(value) => {
                if (value !== "") {
                  onTeamChange(value);
                }
              }}
              label="Odds team"
              variant="map-control"
              disabled={teamOptions.length === 0}
              rounded="md-sm-none"
            />

            <Select<OddsDisplayMode>
              value={displayMode}
              options={displayOptions}
              onChange={(value) => {
                if (value !== "") {
                  onDisplayModeChange(value);
                }
              }}
              className="w-32 sm:border-t-0 sm:border-l"
              label="Odds display"
              variant="map-control"
              rounded="md-sm-right"
            />
          </div>

          {/* Odds information */}
          <Button
            rounded
            variant="icon"
            title="Odds information"
            aria-label="Odds information"
            onClick={() => openModal("odds-info")}
          >
            <QuestionIcon />
          </Button>
        </div>
      </MapControlPosition>

      <MapNavigationControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} onReset={onReset} />
    </>
  );
}
