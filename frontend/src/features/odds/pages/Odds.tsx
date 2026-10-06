// SPDX-License-Identifier: MPL-2.0

import { useEffect, useMemo, useState } from "react";
import OddsControls, {
  type OddsDisplayMode,
  type OddsTeam,
  type OddsTurn,
} from "../components/OddsControls";

const turns: OddsTurn[] = [
  { id: 1234, season: 12, day: 48 },
  { id: 1233, season: 12, day: 47 },
  { id: 1232, season: 12, day: 46 },
];

const teams: OddsTeam[] = [
  { id: 1, name: "Alabama" },
  { id: 2, name: "Georgia" },
  { id: 3, name: "Michigan" },
  { id: 4, name: "Ohio State" },
];

const teamsByTurn: Record<number, OddsTeam[]> = {
  1234: teams,
  1233: teams,
  1232: teams,
};

export default function Odds() {
  const [selectedTurn, setSelectedTurn] = useState(turns[0].id);
  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const [displayMode, setDisplayMode] = useState<OddsDisplayMode>("chance");

  const availableTeams = useMemo(() => teamsByTurn[selectedTurn] ?? [], [selectedTurn]);

  /*
   * If changing the turn causes the selected team to no longer
   * exist for that turn, automatically select the first available
   * team.
   */
  useEffect(() => {
    if (!availableTeams.some((team) => team.id === selectedTeam)) {
      setSelectedTeam(availableTeams[0]?.id ?? 0);
    }
  }, [availableTeams, selectedTeam]);

  const selectedTurnData = turns.find((turn) => turn.id === selectedTurn);

  const selectedTeamData = availableTeams.find((team) => team.id === selectedTeam);

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      <OddsControls
        turns={turns}
        teamsByTurn={teamsByTurn}
        selectedTurn={selectedTurn}
        selectedTeam={selectedTeam}
        displayMode={displayMode}
        onTurnChange={setSelectedTurn}
        onTeamChange={setSelectedTeam}
        onDisplayModeChange={setDisplayMode}
      />

      {/* Temporary map placeholder */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="max-w-lg px-6">
          <h1 className="text-2xl font-semibold">College Football Risk</h1>

          <p className="mt-2">Odds map coming soon.</p>

          <p className="mt-4 text-sm">
            {selectedTurnData?.season}/{selectedTurnData?.day}
            {" · "}
            {selectedTeamData?.name ?? "No team"}
            {" · "}
            {displayMode}
          </p>
        </div>
      </div>
    </div>
  );
}
