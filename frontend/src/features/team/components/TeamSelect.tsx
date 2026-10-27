/* SPDX-License-Identifier: MPL-2.0 */

import { Select } from "@/shared/components/Select";
import type { Team } from "../api/team";

interface TeamSelectProps {
  teams: Team[];
  value: string;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export function TeamSelect({ teams, value, onChange, disabled = false }: TeamSelectProps) {
  return (
    <Select
      searchable
      centeredOptions
      variant="map-control"
      label="Team"
      value={value}
      disabled={disabled}
      options={teams.map((team) => ({
        label: team.name,
        searchLabel: team.name,
        value: team.name,
      }))}
      onChange={onChange}
    />
  );
}
