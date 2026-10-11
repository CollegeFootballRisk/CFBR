// SPDX-License-Identifier: MPL-2.0

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { teams } from "@/features/team/data/teams";
import { StarIcon } from "@/shared/components/Icons";
import { Link } from "@/shared/components/Link";
import { Select } from "@/shared/components/Select";
import { Table, type TableColumn } from "@/shared/components/Table";
import PageContainer from "@/shared/layouts/PageContainer";
import { type PlayerTurn, players, playerTurnHistory } from "../data/players";

const turnColumns: TableColumn<PlayerTurn>[] = [
  {
    key: "turn",
    header: "Turn",
    sortValue: (turn) => turn.season * 1000 + turn.day,
    cell: (turn) => `${turn.season}/${turn.day}`,
    className: "whitespace-nowrap",
  },
  {
    key: "team",
    header: "Team",
    accessor: "team",
    cell: (turn) => (
      <Link to={`/team/${encodeURIComponent(turn.team)}`} variant="table">
        {turn.team}
      </Link>
    ),
    className: "min-w-36 whitespace-nowrap",
  },
  {
    key: "territory",
    header: "Territory",
    accessor: "territory",
    className: "min-w-28 whitespace-nowrap",
  },
  {
    key: "stars",
    header: "Stars",
    accessor: "stars",
  },
  {
    key: "weight",
    header: "Weight",
    accessor: "weight",
    cell: (turn) =>
      turn.weight.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }),
  },
  {
    key: "multiplier",
    header: "Mult",
    accessor: "multiplier",
    cell: (turn) =>
      turn.multiplier.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }),
  },
  {
    key: "power",
    header: "Power",
    accessor: "power",
    cell: (turn) =>
      turn.power.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }),
  },
  {
    key: "mvp",
    header: "MVP",
    accessor: "mvp",
    cell: (turn) =>
      turn.mvp ? (
        <span className="flex justify-center">
          <StarIcon className="size-5 fill-current" />
        </span>
      ) : (
        "N"
      ),
  },
];

export default function Player() {
  const navigate = useNavigate();
  const { player: playerParam } = useParams();

  const selectedPlayer = useMemo(() => {
    if (!playerParam) {
      return null;
    }

    let decodedPlayer: string;

    try {
      decodedPlayer = decodeURIComponent(playerParam);
    } catch {
      return null;
    }

    return players.find((player) => player.name === decodedPlayer) ?? null;
  }, [playerParam]);

  const playerTeam = teams.find((team) => team.name === selectedPlayer?.team);

  const turnHistory = selectedPlayer ? (playerTurnHistory[selectedPlayer.id] ?? []) : [];

  const renderStars = (rating: number) => (
    <div
      className="flex justify-center gap-1"
      // architecture-ignore: dynamic team color comes from API data
      style={playerTeam ? { color: playerTeam.primaryColor } : undefined}
    >
      {Array.from({ length: rating }, (_, index) => (
        <StarIcon
          key={`${rating}-${"x".repeat(index + 1)}`}
          className="size-10 fill-current"
          textShadow={playerTeam?.secondaryColor}
        />
      ))}
    </div>
  );

  return (
    <>
      <div className="mb-6 flex justify-center">
        <Select
          searchable
          centeredOptions
          variant="map-control"
          label="Player"
          value={selectedPlayer?.name ?? ""}
          options={players.map((player) => ({
            label: player.name,
            value: player.name,
          }))}
          onChange={(value) => {
            if (value) {
              navigate(`/player/${encodeURIComponent(value)}`);
            }
          }}
        />
      </div>

      <PageContainer>
        <div className="mx-auto w-full max-w-7xl px-4">
          {selectedPlayer ? (
            <>
              <h1 className="text-center text-3xl font-bold text-info">{selectedPlayer.name}</h1>

              <p className="mt-2 text-center text-lg">
                <Link to={`/team/${encodeURIComponent(selectedPlayer.team)}`}>
                  {selectedPlayer.team}
                </Link>
              </p>

              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-8">
                {/* Left column */}
                <div className="text-center">
                  {renderStars(selectedPlayer.ratings.totalTurns)}

                  <dl className="mt-2 text-2xl">
                    <dt className="italic text-info">Total turns:</dt>
                    <dd className="font-semibold">{selectedPlayer.stats.totalTurns}</dd>
                  </dl>

                  <div className="mt-6">{renderStars(selectedPlayer.ratings.gameTurns)}</div>

                  <dl className="mt-2 text-2xl">
                    <dt className="italic text-info">Round turns:</dt>
                    <dd className="font-semibold">{selectedPlayer.stats.gameTurns}</dd>
                  </dl>
                </div>

                {/* Right column */}
                <div className="text-center">
                  {renderStars(selectedPlayer.ratings.streak)}

                  <dl className="mt-2 text-2xl">
                    <dt className="italic text-info">Streak:</dt>
                    <dd className="font-semibold">{selectedPlayer.stats.streak}</dd>
                  </dl>

                  <div className="mt-6">{renderStars(selectedPlayer.ratings.mvps)}</div>

                  <dl className="mt-2 text-2xl">
                    <dt className="italic text-info">Total MVPs:</dt>
                    <dd className="font-semibold">{selectedPlayer.stats.mvps}</dd>
                  </dl>
                </div>
              </div>

              {/* Turn history */}
              <section className="mt-12 min-w-0">
                <h2 className="mb-4 text-center text-3xl font-bold">Turn History</h2>

                <Table
                  ariaLabel="Turns"
                  data={turnHistory}
                  columns={turnColumns}
                  getRowKey={(turn) => turn.id}
                  initialSortKey="turn"
                  initialSortDirection="desc"
                  emptyMessage="No turn history available for this player."
                  scrollClassName="max-h-[70dvh]"
                />
              </section>
            </>
          ) : (
            <p className="text-center text-3xl font-bold text-info">Player not found.</p>
          )}
        </div>
      </PageContainer>
    </>
  );
}
