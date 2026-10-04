import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { ChevronIcon } from "@/shared/components/Icons";
import { RadioGroup, RadioGroupOption } from "@/shared/components/RadioGroup";
import { Select } from "@/shared/components/Select";
import {
  BridgesIcon,
  HeatmapIcon,
  LeaderboardIcon,
  OwnersIcon,
  RegionsIcon,
  ResetMapIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "../icons";

type MapMode = "owners" | "heatmap";

type TurnSelection = "latest" | number;

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

const turnOptions: { label: string; value: TurnSelection }[] = [
  { label: "Latest", value: "latest" },
  ...turns.map((turn) => ({
    label: `${turn.season}/${turn.day}`,
    value: turn.id,
  })),
];

export default function MapControls({ onModeChange }: MapControlsProps) {
  const [mode, setMode] = useState<MapMode>("owners");
  const [selectedTurn, setSelectedTurn] = useState<TurnSelection>("latest");
  const [regions, setRegions] = useState(false);
  const [bridges, setBridges] = useState(false);
  const [leaderboard, setLeaderboard] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const changeMode = (value: string) => {
    if (value !== "owners" && value !== "heatmap") {
      return;
    }

    const nextMode: MapMode = value;

    setMode(nextMode);
    onModeChange?.(nextMode);
  };

  const handleTurnChange = (value: TurnSelection | "") => {
    if (value === "") {
      return;
    }

    setSelectedTurn(value);
  };

  return (
    <>
      {/* Top map mode controls */}
      <div className="pointer-events-none absolute inset-x-0 z-10 flex justify-center px-3">
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
                className="order-1 border-r border-control-border rounded-l-md"
              >
                <OwnersIcon />
                <span className="hidden sm:inline">Owners</span>
              </RadioGroupOption>

              <RadioGroupOption
                value="heatmap"
                className="order-3 border-l border-control-border rounded-r-md"
              >
                <HeatmapIcon />
                <span className="hidden sm:inline">Heatmap</span>
              </RadioGroupOption>
            </RadioGroup>

            <Select<TurnSelection>
              value={selectedTurn}
              options={turnOptions}
              onChange={handleTurnChange}
              label="Map turn"
              variant="map-control"
              className="order-2"
            />
          </div>
        </div>
      </div>

      {/* Bottom map controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center px-3">
        <div className="pointer-events-auto flex flex-col-reverse items-center gap-1">
          {/* Mobile controls toggle */}
          <Button
            variant="primary"
            title={controlsOpen ? "Hide controls" : "Show controls"}
            aria-expanded={controlsOpen}
            aria-controls="map-controls"
            className="sm:hidden"
            onClick={() => setControlsOpen((current) => !current)}
          >
            <ChevronIcon size="lg" direction={controlsOpen ? "down" : "up"} />
            <span>Controls</span>
          </Button>

          {/* Map controls */}
          <div
            id="map-controls"
            className={[
              "flex flex-col gap-1",
              "sm:flex-row sm:flex-wrap sm:justify-center",
              controlsOpen ? "flex" : "hidden sm:flex",
            ].join(" ")}
          >
            <Button variant="primary" title="Zoom in">
              <ZoomInIcon />
              <span>Zoom In</span>
            </Button>

            <Button variant="primary" title="Zoom out">
              <ZoomOutIcon />
              <span>Zoom Out</span>
            </Button>

            <Button variant="primary" title="Reset map">
              <ResetMapIcon />
              <span>Reset Map</span>
            </Button>

            <Button
              variant="primary"
              aria-pressed={regions}
              title="Regions"
              onClick={() => setRegions((current) => !current)}
            >
              <RegionsIcon />
              <span>Regions</span>
            </Button>

            <Button
              variant="primary"
              aria-pressed={bridges}
              title="Bridges"
              onClick={() => setBridges((current) => !current)}
            >
              <BridgesIcon />
              <span>Bridges</span>
            </Button>

            <Button
              variant="primary"
              aria-pressed={leaderboard}
              title="Leaderboard"
              onClick={() => setLeaderboard((current) => !current)}
            >
              <LeaderboardIcon />
              <span>Leaderboard</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
