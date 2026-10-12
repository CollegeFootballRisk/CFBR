// SPDX-License-Identifier: MPL-2.0

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  OddsControls,
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
  { id: 3, name: "Appalachian State" },
  { id: 4, name: "Ohio State" },
];

const teamsByTurn: Record<number, OddsTeam[]> = {
  1234: teams,
  1233: teams,
  1232: teams,
};

function getOddsPath(turn: OddsTurn, team: OddsTeam) {
  return `/odds/${turn.season}/${turn.day}/${encodeURIComponent(team.name)}`;
}

export function Odds() {
  const navigate = useNavigate();
  const { season, day, team } = useParams<{
    season?: string;
    day?: string;
    team?: string;
  }>();

  const [displayMode, setDisplayMode] = useState<OddsDisplayMode>("chance");

  const requestedSeason = season && /^\d+$/.test(season) ? Number(season) : NaN;
  const requestedDay = day && /^\d+$/.test(day) ? Number(day) : NaN;

  const selectedTurnData =
    turns.find((turn) => turn.season === requestedSeason && turn.day === requestedDay) ?? turns[0];

  const availableTeams = teamsByTurn[selectedTurnData.id] ?? [];

  const selectedTeamData =
    availableTeams.find((item) => item.name.toLowerCase() === team?.toLowerCase()) ??
    availableTeams[0];

  const selectedTurn = selectedTurnData.id;
  const selectedTeam = selectedTeamData?.id ?? 0;

  const changeTurn = (turnId: number) => {
    const nextTurn = turns.find((turn) => turn.id === turnId);
    if (!nextTurn) return;

    const nextTeams = teamsByTurn[turnId] ?? [];
    const nextTeam = nextTeams.find((item) => item.id === selectedTeam) ?? nextTeams[0];

    if (nextTeam) {
      navigate(getOddsPath(nextTurn, nextTeam));
    }
  };

  const changeTeam = (teamId: number) => {
    const nextTeam = availableTeams.find((item) => item.id === teamId);

    if (nextTeam) {
      navigate(getOddsPath(selectedTurnData, nextTeam));
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      <OddsControls
        turns={turns}
        teamsByTurn={teamsByTurn}
        selectedTurn={selectedTurn}
        selectedTeam={selectedTeam}
        displayMode={displayMode}
        onTurnChange={changeTurn}
        onTeamChange={changeTeam}
        onDisplayModeChange={setDisplayMode}
      />

      {/* Temporary map placeholder */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="max-w-lg px-6">
          <h1 className="font-semibold text-2xl">College Football Risk</h1>

          <p className="mt-2">Odds map coming soon.</p>

          <p className="mt-4 text-sm">
            {selectedTurnData.season}/{selectedTurnData.day}
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
