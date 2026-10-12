// SPDX-License-Identifier: MPL-2.0

import { useMemo, useState } from "react";
import { Button } from "@/shared/components/Button";
import { Modal } from "@/shared/components/Modal";
import { Select } from "@/shared/components/Select";
import { teams } from "../data/teams";

export type JoinTeamReason = "new" | "eliminated";

interface JoinTeamModalProps {
  open: boolean;
  onClose: () => void;
  reason?: JoinTeamReason;
}

export function JoinTeamModal({ open, onClose, reason = "new" }: JoinTeamModalProps) {
  const joinableTeams = useMemo(
    () => teams.filter((team) => team.id > 0).sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const [selectedTeamId, setSelectedTeamId] = useState(
    joinableTeams[0] ? String(joinableTeams[0].id) : "",
  );
  const [message, setMessage] = useState("");

  const selectedTeam = joinableTeams.find((team) => String(team.id) === selectedTeamId);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
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
          <Select
            searchable
            centeredOptions
            label="Team"
            value={selectedTeamId}
            options={joinableTeams.map((team) => ({
              label: team.name,
              value: String(team.id),
            }))}
            onChange={(value) => {
              setSelectedTeamId(value ?? "");
              setMessage("");
            }}
          />
        </div>

        {selectedTeam && (
          <div className="flex items-center justify-center gap-3 rounded-md border border-control-border p-4">
            <img src={selectedTeam.logo} alt="" className="size-14 object-contain" />
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
          <Button type="submit" variant="primary" disabled={!selectedTeam}>
            Join Team
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
