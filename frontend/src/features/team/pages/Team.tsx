/* SPDX-License-Identifier: MPL-2.0 */

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Line, Tooltip } from "recharts";
import { StarIcon } from "@/shared/components/Icons";
import { Link } from "@/shared/components/Link";
import { Table, type TableColumn } from "@/shared/components/Table";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { ChartLegend, starLegendItems, starPowerLegendItems } from "../components/ChartLegend";
import { chartTooltipClassName, TeamLineChart } from "../components/TeamLineChart";
import { TeamSelect } from "../components/TeamSelect";
import {
  MOCK_LATEST_SEASON,
  mockMercenaries,
  mockPlayerStarsHistory,
  mockPlayers,
  mockStarPowerHistory,
  teams as mockTeams,
  type PlayerStarsPoint,
  type StarPowerPoint,
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

const starSeries = [
  { key: "ones", label: 1, color: "var(--color-chart-1)" },
  { key: "twos", label: 2, color: "var(--color-chart-2)" },
  { key: "threes", label: 3, color: "var(--color-chart-3)" },
  { key: "fours", label: 4, color: "var(--color-chart-4)" },
  { key: "fives", label: 5, color: "var(--color-chart-5)" },
] as const;

const chartColorClasses = {
  1: "border-[var(--color-chart-1)] text-[var(--color-chart-1)]",
  2: "border-[var(--color-chart-2)] text-[var(--color-chart-2)]",
  3: "border-[var(--color-chart-3)] text-[var(--color-chart-3)]",
  4: "border-[var(--color-chart-4)] text-[var(--color-chart-4)]",
  5: "border-[var(--color-chart-5)] text-[var(--color-chart-5)]",
} as const;

function formatChartValue(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

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

function PlayerStarsChart({ data }: { data: PlayerStarsPoint[] }) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    day: number;
    seriesKey: string;
  } | null>(null);

  return (
    <div className="h-72 w-full min-w-0">
      <ChartLegend items={starLegendItems} />

      <TeamLineChart
        data={data}
        ariaLabel="Player Stars by day"
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <Tooltip
          content={(props) => {
            if (!props.active || !hoveredPoint) {
              return null;
            }

            const series = starSeries.find((item) => item.key === hoveredPoint.seriesKey);
            const point = data.find((item) => item.day === hoveredPoint.day);

            if (!series || !point) {
              return null;
            }

            return (
              <div className={`px-3 py-2 text-left ${chartTooltipClassName}`}>
                <div className="mb-1 font-semibold">{point.day}</div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center ${chartColorClasses[series.label].split(" ")[1]}`}
                  >
                    {Array.from({ length: series.label }, (_, index) => (
                      <StarIcon key={`${series.key}-${"x".repeat(index + 1)}`} className="size-3" />
                    ))}
                    :
                  </span>
                  <span>{formatChartValue(point[series.key])}</span>
                </div>
              </div>
            );
          }}
        />

        {starSeries.map((series) => (
          <Line
            key={series.key}
            type="monotone"
            dataKey={series.key}
            name={`${series.label} star${series.label > 1 ? "s" : ""}`}
            stroke={series.color}
            strokeWidth={2}
            dot={(dotProps) => {
              const point = data[dotProps.index];

              const handleHover = () => {
                if (point) {
                  setHoveredPoint({
                    day: point.day,
                    seriesKey: series.key,
                  });
                }
              };

              return (
                // biome-ignore lint/a11y/noStaticElementInteractions: SVG chart markers use hover to display point details
                <g className="cursor-pointer" onMouseEnter={handleHover}>
                  <circle
                    cx={dotProps.cx}
                    cy={dotProps.cy}
                    r={5}
                    fill="transparent"
                    stroke={series.color}
                    strokeWidth={2}
                  />
                  <circle
                    cx={dotProps.cx}
                    cy={dotProps.cy}
                    r={1.5}
                    fill="var(--color-foreground)"
                    stroke="none"
                    pointerEvents="none"
                  />
                </g>
              );
            }}
            activeDot={false}
            isAnimationActive={false}
          />
        ))}
      </TeamLineChart>
    </div>
  );
}

function StarPowerChart({ data }: { data: StarPowerPoint[] }) {
  return (
    <div className="h-72 w-full min-w-0">
      <ChartLegend items={starPowerLegendItems} />
      <TeamLineChart data={data} ariaLabel="Star Power by day">
        <Tooltip
          content={(props) => {
            if (!props.active || !props.payload?.length) {
              return null;
            }

            const value = props.payload[0].value;

            return (
              <div className={`px-3 py-2 text-left ${chartTooltipClassName}`}>
                <div className="mb-1 font-semibold">{String(props.label)}</div>
                <div>
                  <span className="text-(--chart-1)">Star Power:</span>{" "}
                  {typeof value === "number" ? formatChartValue(value) : String(value)}
                </div>
              </div>
            );
          }}
        />

        <Line
          type="monotone"
          dataKey="starPower"
          name="Star Power"
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
          dot={(dotProps) => (
            <g>
              <circle
                cx={dotProps.cx}
                cy={dotProps.cy}
                r={5}
                fill="transparent"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
              />
              <circle
                cx={dotProps.cx}
                cy={dotProps.cy}
                r={1.5}
                fill="var(--color-foreground)"
                stroke="none"
                pointerEvents="none"
              />
            </g>
          )}
          activeDot={false}
          connectNulls={false}
          isAnimationActive={false}
        />
      </TeamLineChart>
    </div>
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
        <div className="p-8 text-center" role="status">
          Loading teams…
        </div>
      </PageContainer>
    );
  }

  if (isError || !selectedTeam) {
    return (
      <PageContainer>
        <div className="p-8 text-center" role="alert">
          {isError
            ? `Unable to load teams: ${error.message}`
            : "No teams were returned by the API."}
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
            <div className="mt-10 flex justify-center">
              <Link to={`/visited/${encodeURIComponent(selectedTeam.name)}/5`}>
                View {selectedTeam.name}'s visited territories for season 5.
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
