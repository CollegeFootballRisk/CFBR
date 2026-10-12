/* SPDX-License-Identifier: MPL-2.0 */

import { useState } from "react";

import { TurnSelect } from "@/features/turn/components/TurnSelect";
import { useTurn } from "@/features/turn/context/TurnContext";
import { Button } from "@/shared/components/Button";
import { ChevronIcon } from "@/shared/components/Icons";
import { useModal } from "@/shared/components/Modal";
import { RadioGroup, RadioGroupOption } from "@/shared/components/RadioGroup";

import { BridgesIcon, HeatmapIcon, LeaderboardIcon, OwnersIcon, RegionsIcon } from "../icons";
import { MapControlPosition } from "./MapControlPosition";
import { MapNavigationControls } from "./MapNavigationControls";

type MapMode = "owners" | "heatmap";

interface MapControlsProps {
  onModeChange?: (mode: MapMode) => void;
}

interface MapTurn {
  id: number;
  season: number;
  day: number;
}

const turns: MapTurn[] = [
  { id: 1234, season: 12, day: 48 },
  { id: 1233, season: 12, day: 47 },
  { id: 1232, season: 12, day: 46 },
];

export function MapControls({ onModeChange }: MapControlsProps) {
  const { openModal } = useModal();
  const [mode, setMode] = useState<MapMode>("owners");
  const { mapTurn, setMapTurn } = useTurn();
  const [regions, setRegions] = useState(false);
  const [bridges, setBridges] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const changeMode = (value: string) => {
    if (value !== "owners" && value !== "heatmap") {
      return;
    }

    const nextMode: MapMode = value;

    setMode(nextMode);
    onModeChange?.(nextMode);
  };

  return (
    <>
      {/* Top map mode controls */}
      <MapControlPosition placement="top">
        <div className="pointer-events-auto rounded-md shadow-lg">
          <div className="flex">
            <RadioGroup
              value={mode}
              onChange={changeMode}
              aria-label="Map display mode"
              className="contents"
            >
              <RadioGroupOption
                value="owners"
                className="order-1 rounded-l-md border-control-border border-r"
              >
                <OwnersIcon />
                <span className="hidden sm:inline">Owners</span>
              </RadioGroupOption>

              <RadioGroupOption
                value="heatmap"
                className="order-3 rounded-r-md border-control-border border-l"
              >
                <span className="hidden sm:inline">Heatmap</span>
                <HeatmapIcon />
              </RadioGroupOption>
            </RadioGroup>

            <TurnSelect
              value={mapTurn}
              turns={turns}
              onChange={setMapTurn}
              label="Map turn"
              rounded="none"
              className="order-2"
            />
          </div>
        </div>
      </MapControlPosition>

      {/* Bottom map controls */}
      <MapControlPosition placement="bottom" layer="overlay">
        <div className="pointer-events-auto flex flex-col items-center gap-1">
          <div
            id="map-controls"
            className={[
              "flex flex-col items-center gap-1",
              "sm:flex-row sm:flex-wrap sm:justify-center",
              controlsOpen ? "flex" : "hidden sm:flex",
            ].join(" ")}
          >
            <MapNavigationControls
              positioned={false}
              showLabels={controlsOpen}
              className="flex-col sm:flex-row sm:flex-wrap"
            >
              <Button
                variant="primary"
                aria-pressed={regions}
                onClick={() => setRegions((current) => !current)}
              >
                <RegionsIcon />
                <span>Regions</span>
              </Button>

              <Button
                variant="primary"
                aria-pressed={bridges}
                onClick={() => setBridges((current) => !current)}
              >
                <BridgesIcon />
                <span>Bridges</span>
              </Button>

              <Button
                variant="primary"
                aria-label="Leaderboard for selected map turn"
                onClick={() => openModal("leaderboard", { turn: mapTurn })}
              >
                <LeaderboardIcon />
                <span>Leaderboard</span>
              </Button>
            </MapNavigationControls>
          </div>

          <Button
            variant="primary"
            aria-expanded={controlsOpen}
            aria-controls="map-controls"
            className="sm:hidden"
            onClick={() => setControlsOpen((current) => !current)}
          >
            <ChevronIcon size="lg" direction={controlsOpen ? "down" : "up"} />
            <span>Controls</span>
          </Button>
        </div>
      </MapControlPosition>
    </>
  );
}
