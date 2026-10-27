/* SPDX-License-Identifier: MPL-2.0 */

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/Button";
import { Modal } from "@/shared/components/Modal";
import { getJoinableTeams } from "../api/team";
import { TeamSelect } from "../components/TeamSelect";
import { useTeams } from "../hooks/useTeams";
import { getTeamLogo } from "../utils/getTeamLogo";

export type JoinTeamReason = "new" | "eliminated";

interface JoinTeamModalProps {
  open: boolean;
  onClose: () => void;
  reason?: JoinTeamReason;
}

export function JoinTeamModal({ open, onClose, reason = "new" }: JoinTeamModalProps) {
  const { data: apiTeams = [], isPending, isError } = useTeams();

  const joinableTeams = useMemo(
    () => getJoinableTeams(apiTeams).sort((a, b) => a.name.localeCompare(b.name)),
    [apiTeams],
  );

  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (
      joinableTeams.length > 0 &&
      !joinableTeams.some((team) => String(team.id) === selectedTeamId)
    ) {
      setSelectedTeamId(String(joinableTeams[0].id));
    }
  }, [joinableTeams, selectedTeamId]);

  const selectedTeam = joinableTeams.find((team) => String(team.id) === selectedTeamId);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedTeam) return;

    setMessage(
      `Team selection for ${selectedTeam.name} is ready. Saving it will be available when team-join API integration is implemented.`,
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Join Team">
      <form className="mx-auto max-w-xl space-y-5" onSubmit={handleSubmit}>
        {reason === "eliminated" ? (
          <p>
            Oh no! Your team has been <strong>eliminated.</strong> Select a new team to keep
            playing.
          </p>
        ) : (
          <p>Welcome to CollegeFootballRisk! Choose your favorite FBS team to get started.</p>
        )}

        <div className="flex justify-center">
          <TeamSelect
            teams={joinableTeams}
            value={selectedTeam?.name ?? ""}
            disabled={isPending || isError || joinableTeams.length === 0}
            onChange={(name) => {
              const team = joinableTeams.find((item) => item.name === name);

              setSelectedTeamId(team ? String(team.id) : "");
              setMessage("");
            }}
          />
        </div>

        {isPending && (
          <p className="text-center text-info text-sm" role="status">
            Loading teams…
          </p>
        )}

        {isError && (
          <p className="text-center text-danger text-sm" role="alert">
            Unable to load teams. Please try again later.
          </p>
        )}

        {!isPending && !isError && joinableTeams.length === 0 && (
          <p className="text-center text-info text-sm" role="status">
            No teams are currently available to join.
          </p>
        )}

        {selectedTeam && (
          <div className="flex items-center justify-center gap-3 rounded-md border border-control-border p-4">
            <img src={getTeamLogo(selectedTeam.logo)} alt="" className="size-14 object-contain" />
            <div className="text-left">
              <p className="font-semibold">{selectedTeam.name}</p>
              <p className="text-info text-sm">Selected team</p>
            </div>
          </div>
        )}

        {message && (
          <p role="status" className="rounded-md border border-control-border p-3 text-sm">
            {message}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Button type="submit" variant="primary" disabled={!selectedTeam || isPending || isError}>
            Join Team
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
