// SPDX-License-Identifier: MPL-2.0

import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VisitedControls from "../components/VisitedControls";
import { getTeamsForSeason, seasons } from "../data/visited";

export default function Visited() {
  const { team: teamParam, season: seasonParam } = useParams<{
    team?: string;
    season?: string;
  }>();
  const navigate = useNavigate();

  const selectedSeason = useMemo(() => {
    const value = seasonParam && /^\d+$/.test(seasonParam) ? Number(seasonParam) : NaN;
    return seasons.includes(value) ? value : seasons[0];
  }, [seasonParam]);

  const availableTeams = useMemo(() => getTeamsForSeason(selectedSeason), [selectedSeason]);
  const selectedTeam = useMemo(() => {
    const decoded = teamParam ?? "";
    return (
      availableTeams.find((team) => team.name.toLowerCase() === decoded.toLowerCase()) ??
      availableTeams[0]
    );
  }, [availableTeams, teamParam]);

  const selectedTeamId = selectedTeam?.id ?? 0;
  const canonicalPath = selectedTeam
    ? `/visited/${encodeURIComponent(selectedTeam.name)}/${selectedSeason}`
    : "/visited";

  useEffect(() => {
    if (teamParam !== undefined || seasonParam !== undefined) {
      if (window.location.pathname !== canonicalPath) {
        navigate(canonicalPath, { replace: true });
      }
    }
  }, [canonicalPath, navigate, seasonParam, teamParam]);

  const changeSeason = (season: number) => {
    const nextTeams = getTeamsForSeason(season);
    const nextTeam = nextTeams.find((team) => team.id === selectedTeamId) ?? nextTeams[0];
    if (nextTeam) navigate(`/visited/${encodeURIComponent(nextTeam.name)}/${season}`);
  };

  const changeTeam = (teamId: number) => {
    const nextTeam = availableTeams.find((team) => team.id === teamId);
    if (nextTeam) navigate(`/visited/${encodeURIComponent(nextTeam.name)}/${selectedSeason}`);
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      <VisitedControls
        seasons={seasons}
        teams={availableTeams}
        selectedSeason={selectedSeason}
        selectedTeam={selectedTeamId}
        onSeasonChange={changeSeason}
        onTeamChange={changeTeam}
      />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="max-w-lg px-6">
          <h1 className="text-2xl font-semibold">College Football Risk</h1>
          <p className="mt-2">Visited map coming soon.</p>
          <p className="mt-4 text-sm">
            Season {selectedSeason} · {selectedTeam?.name ?? "No team"}
          </p>
        </div>
      </div>
    </div>
  );
}
