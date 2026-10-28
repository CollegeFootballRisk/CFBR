/* SPDX-License-Identifier: MPL-2.0 */

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "@/shared/components/Alert";
import { Link } from "@/shared/components/Link";
import { Loader } from "@/shared/components/Loader";
import { Table, type TableColumn } from "@/shared/components/Table";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { PlayerStarsChart, StarPowerChart } from "../components/TeamCharts";
import { TeamSelect } from "../components/TeamSelect";
import {
  MOCK_LATEST_SEASON,
  mockMercenaries,
  mockPlayerStarsHistory,
  mockPlayers,
  mockStarPowerHistory,
  teams as mockTeams,
  type TeamPlayer,
} from "../data/teams";
import { useTeams } from "../hooks/useTeams";
import { getTeamLogo } from "../utils/getTeamLogo";

const statLabels = {
  mercs: "Mercs",
  players: "Players",
  stars: "Stars",
  territories: "Territories",
} as const;

type StatKey = keyof typeof statLabels;

function createPlayerColumns(includeTeam = false): TableColumn<TeamPlayer>[] {
  const columns: TableColumn<TeamPlayer>[] = [];

  if (includeTeam) {
    columns.push({
      key: "team",
      header: "Team",
      accessor: "team",
      tooltip: "Mercenary's team",
      cell: (player) =>
        player.team ? (
          <Link to={`/team/${encodeURIComponent(player.team)}`} variant="table">
            {player.team}
          </Link>
        ) : (
          "—"
        ),
    });
  }

  columns.push(
    {
      key: "name",
      header: "Name",
      accessor: "name",
      tooltip: includeTeam ? "Mercenary username" : "Player username",
      className: "min-w-36",
      headerClassName: "min-w-36",
      cell: (player) => (
        <Link to={`/player/${encodeURIComponent(player.name)}`} variant="table">
          {player.name}
        </Link>
      ),
    },
    {
      key: "turns",
      header: "Turns",
      accessor: "turns",
      tooltip: "Number of turns played",
    },
    {
      key: "mvps",
      header: "MVPs",
      accessor: "mvps",
      tooltip: "Number of MVPs received",
    },
  );

  return columns;
}

const playerColumns = createPlayerColumns();
const mercenaryColumns = createPlayerColumns(true);

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center text-2xl">
      <dt className="text-info italic">{label}:</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function TeamSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 text-center">
      <h2 className="mb-4 font-bold text-4xl">{title}:</h2>
      {children}
    </section>
  );
}

export function Team() {
  const navigate = useNavigate();
  const { team: teamParam } = useParams();

  const { data: apiTeams = [], isPending, isError, error } = useTeams();

  const selectedApiTeam = useMemo(() => {
    if (apiTeams.length === 0) {
      return undefined;
    }

    let decodedTeam = teamParam ?? "";

    try {
      decodedTeam = decodeURIComponent(decodedTeam);
    } catch {}

    return (
      apiTeams.find((team) => team.name.toLowerCase() === decodedTeam.toLowerCase()) ?? apiTeams[0]
    );
  }, [apiTeams, teamParam]);

  const selectedMockTeam = mockTeams.find(
    (team) => team.name.toLowerCase() === selectedApiTeam?.name.toLowerCase(),
  );

  const selectedTeam = selectedApiTeam
    ? {
        ...selectedApiTeam,
        stats: selectedMockTeam?.stats ?? {
          mercs: 0,
          players: 0,
          stars: 0,
          territories: 0,
        },
      }
    : undefined;

  const playerStarsData = mockPlayerStarsHistory
    .filter((point) => point.season === MOCK_LATEST_SEASON)
    .sort((a, b) => a.sequence - b.sequence);

  const starPowerData = mockStarPowerHistory
    .filter((point) => point.season === MOCK_LATEST_SEASON)
    .sort((a, b) => a.sequence - b.sequence);

  const leftStats: StatKey[] = ["mercs", "stars"];
  const rightStats: StatKey[] = ["players", "territories"];

  if (isPending) {
    return (
      <PageContainer>
        <Loader label="Loading teams..." fullHeight className="p-8" />
      </PageContainer>
    );
  }

  if (isError || !selectedTeam) {
    return (
      <PageContainer>
        <div className="mx-auto max-w-xl p-8">
          <Alert
            variant={isError ? "error" : "info"}
            title={isError ? "Unable to load teams" : "No teams available"}
          >
            {isError
              ? `Unable to load teams: ${error.message}`
              : "No teams were returned by the API."}
          </Alert>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-center">
        <TeamSelect
          teams={apiTeams}
          value={selectedTeam.name}
          onChange={(value) => {
            if (value) {
              navigate(`/team/${encodeURIComponent(value)}`);
            }
          }}
        />
      </div>

      <h1 className="sr-only">{selectedTeam.name}</h1>

      <PageContainer>
        <div className="mx-auto w-full max-w-7xl px-4">
          {/* Team logo */}
          <div className="flex justify-center">
            <img
              src={getTeamLogo(selectedTeam.logo)}
              alt={`${selectedTeam.name} logo`}
              className="size-32 object-contain"
            />
          </div>

          {/* Two-column team dashboard */}

          {/* Team dashboard */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-8">
            {/* Left stats */}
            <div className="order-1 lg:col-start-1 lg:row-start-1">
              <dl className="grid grid-cols-1 gap-4">
                {leftStats.map((key) => (
                  <StatCard key={key} label={statLabels[key]} value={selectedTeam.stats[key]} />
                ))}
              </dl>
            </div>

            {/* Right stats */}
            <div className="order-2 grid grid-cols-1 gap-4 lg:col-start-2 lg:row-start-1">
              <dl className="grid grid-cols-1 gap-4">
                {rightStats.map((key) => (
                  <StatCard key={key} label={statLabels[key]} value={selectedTeam.stats[key]} />
                ))}
              </dl>
            </div>

            {/* Player Stars chart */}
            <div className="order-3 lg:col-start-1 lg:row-start-2">
              <TeamSection title="Player Stars">
                <PlayerStarsChart data={playerStarsData} />
              </TeamSection>
            </div>

            {/* Star Power chart */}
            <div className="order-4 lg:col-start-2 lg:row-start-2">
              <TeamSection title="Star Power">
                <StarPowerChart data={starPowerData} />
              </TeamSection>
            </div>

            {/* Players table */}
            <div className="order-5 lg:col-start-1 lg:row-start-3">
              <TeamSection title="Players">
                <Table
                  ariaLabel="Players"
                  data={mockPlayers}
                  columns={playerColumns}
                  getRowKey={(player) => player.id}
                  initialSortKey="name"
                  initialSortDirection="asc"
                />
              </TeamSection>
            </div>

            {/* Mercenaries table */}
            <div className="order-6 lg:col-start-2 lg:row-start-3">
              <TeamSection title="Mercenaries">
                <Table
                  ariaLabel="Mercenaries"
                  data={mockMercenaries}
                  columns={mercenaryColumns}
                  getRowKey={(player) => player.id}
                  initialSortKey="name"
                  initialSortDirection="asc"
                />
              </TeamSection>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <Link to={`/visited/${encodeURIComponent(selectedTeam.name)}/5`}>
              View {selectedTeam.name}'s visited territories for season 5.
            </Link>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
