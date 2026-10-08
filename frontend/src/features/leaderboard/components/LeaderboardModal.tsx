// SPDX-License-Identifier: MPL-2.0

import { useState } from "react";
import TurnSelect, { type Turn, type TurnSelection } from "@/features/turn/components/TurnSelect";
import { Link } from "@/shared/components/Link";
import { Modal } from "@/shared/components/Modal";
import { Table, type TableColumn } from "@/shared/components/Table";

interface LeaderboardModalProps {
  open: boolean;
  onClose: () => void;
  initialTurn: TurnSelection;
}

interface LeaderboardTeam {
  id: number;
  rank: number;
  name: string;
  logo: string | null;
  territoryCount: number;
  playerCount: number;
  mercCount: number;
  starPower: number;
  efficiency: number;
  regions: number;
}

const columns = (onClose: () => void): TableColumn<LeaderboardTeam>[] => [
  {
    key: "rank",
    header: "Rank",
    accessor: "rank",
  },
  {
    key: "name",
    header: "Team",
    accessor: "name",
    tooltip: "Team Name",
    className: "min-w-36",
    headerClassName: "min-w-36",
    cell: (team) => (
      <Link to={`/team/${encodeURIComponent(team.name)}`} variant="table" onClick={onClose}>
        {team.name}
      </Link>
    ),
  },
  {
    key: "playerCount",
    header: "Players",
    accessor: "playerCount",
    tooltip: "Number of players on team",
  },
  {
    key: "territoryCount",
    header: "Territories",
    accessor: "territoryCount",
    tooltip: "Number of territories won by team",
  },
  {
    key: "mercCount",
    header: "Mercs",
    accessor: "mercCount",
    tooltip: "Number of mercenaries on the team",
  },
  {
    key: "starPower",
    header: "Stars",
    accessor: "starPower",
    tooltip: "Team's total star power",
    cell: (team) => team.starPower.toString(),
  },
  {
    key: "efficiency",
    header: "Efficiency",
    accessor: "efficiency",
    tooltip: "Team Efficiency (Stars/Territories)",
    cell: (team) => team.efficiency.toFixed(2),
  },
  {
    key: "ppp",
    header: "PPP",
    tooltip: "Power per Player",
    sortValue: (team) => {
      const players = team.mercCount + team.playerCount;

      return players === 0 ? 0 : team.starPower / players;
    },
    cell: (team) => {
      const players = team.mercCount + team.playerCount;

      return players === 0 ? "0.00" : (team.starPower / players).toFixed(2);
    },
  },
  {
    key: "regions",
    header: "Regions",
    accessor: "regions",
    tooltip: "Regions held by team",
  },
  {
    key: "adjustedStars",
    header: "Adj. Stars",
    tooltip: "The amount of star power available to a team, accounting for regions.",
    sortValue: (team) => (1 + 0.5 * team.regions) * team.starPower,
    cell: (team) => ((1 + 0.5 * team.regions) * team.starPower).toFixed(1),
  },
];

const teams: LeaderboardTeam[] = Array.from({ length: 100 }, (_, index) => {
  const rank = index + 1;
  const playerCount = 50 + ((rank * 17) % 101);
  const mercCount = (rank * 3) % 11;
  const territoryCount = Math.max(1, 30 - Math.floor(rank / 4));
  const starPower = Number(
    (territoryCount * (12 + ((rank * 7) % 15)) + (rank % 10) * 0.5).toFixed(1),
  );
  const efficiency = Number((starPower / territoryCount).toFixed(2));
  const regions = Math.min(8, Math.floor((territoryCount + 2) / 7));

  return {
    id: rank,
    rank,
    name: `Team ${rank}`,
    logo: null,
    territoryCount,
    playerCount,
    mercCount,
    starPower,
    efficiency,
    regions,
  };
});

const turns: Turn[] = [
  { id: 1234, season: 12, day: 48 },
  { id: 1233, season: 12, day: 47 },
  { id: 1232, season: 12, day: 46 },
];

export default function LeaderboardModal({ open, onClose, initialTurn }: LeaderboardModalProps) {
  const [selectedTurn, setSelectedTurn] = useState<TurnSelection>(initialTurn);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Leaderboard${selectedTurn === "latest" ? " (current)" : ""}`}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <TurnSelect
            value={selectedTurn}
            turns={turns}
            onChange={setSelectedTurn}
            label="Leaderboard turn"
            rounded="md"
          />
        </div>

        <Table
          data={teams}
          columns={columns(onClose)}
          getRowKey={(team) => team.id}
          initialSortKey="rank"
          initialSortDirection="asc"
        />
      </div>
    </Modal>
  );
}
