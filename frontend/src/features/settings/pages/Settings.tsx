import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Branding } from "@/app/settings";
import { useAppSettings } from "@/app/useAppSettings";
import { Link } from "@/shared/components/Link";
import { useModal } from "@/shared/components/Modal";
import { Select } from "@/shared/components/Select";
import { Switch } from "@/shared/components/Switch";
import PageContainer from "@/shared/layouts/PageContainer";

export default function Settings() {
  const { settings, updateSetting } = useAppSettings();
  const location = useLocation();
  const { openModal } = useModal();

  useEffect(() => {
    if (location.hash === "#info") {
      openModal("version-info");
    }
  }, [location.hash, openModal]);

  return (
    <>
      <h1 className="text-4xl font-bold text-center my-4">Settings</h1>
      <PageContainer>
        <div className="mt-8">
          <div className="divide-y">
            <div className="flex items-center gap-4 py-4">
              <Switch
                aria-label="Show Background Images"
                checked={settings.showBackgroundImages}
                onCheckedChange={(value) => updateSetting("showBackgroundImages", value)}
              />
              <span className="text-sm">Background Images</span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Switch
                aria-label="Enable Light Mode"
                checked={settings.theme === "light"}
                onCheckedChange={(checked) => updateSetting("theme", checked ? "light" : "dark")}
              />
              <span className="text-sm">Light Mode</span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Switch
                aria-label="Show move prompting"
                checked={settings.showPromptMove}
                onCheckedChange={(value) => updateSetting("showPromptMove", value)}
              />
              <span className="text-sm">Prompt me to make a move if I haven't</span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Switch
                aria-label="Show territory pin"
                checked={settings.showTerritoryPin}
                onCheckedChange={(value) => updateSetting("showTerritoryPin", value)}
              />
              <span className="text-sm">Place a pin over the territory on which I am moving</span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Switch
                aria-label="Show territory fade/pulse"
                checked={settings.showPulseTerritory}
                onCheckedChange={(value) => updateSetting("showPulseTerritory", value)}
              />
              <span className="text-sm">
                Fade/pulse the territory in and out on which I am moving
              </span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Switch
                aria-label="Show bridges"
                checked={settings.showBridges}
                onCheckedChange={(value) => updateSetting("showBridges", value)}
              />
              <span className="text-sm">Show bridges when the map first loads</span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Switch
                aria-label="Show regions"
                checked={settings.showRegions}
                onCheckedChange={(value) => updateSetting("showRegions", value)}
              />
              <span className="text-sm">Show regions when the map first loads</span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Switch
                aria-label="Opt-in for experiments"
                checked={settings.showExperiments}
                onCheckedChange={(value) => updateSetting("showExperiments", value)}
              />
              <span className="text-sm">Opt-in to temporary experiments (e.g. bug fixes)</span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Switch
                aria-label="Show labels"
                checked={settings.showMapLabels}
                onCheckedChange={(value) => updateSetting("showMapLabels", value)}
              />
              <span className="text-sm">Show labels on map buttons</span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Switch
                aria-label="Add extra space for scrolling"
                checked={settings.addBottomSpace}
                onCheckedChange={(value) => updateSetting("addBottomSpace", value)}
              />
              <span className="text-sm">
                Add extra space to the bottom of some prompts (for scrolling)
              </span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Select
                rounded={true}
                value={settings.pageSize}
                options={[
                  { label: "5", value: 5 },
                  { label: "10", value: 10 },
                  { label: "15", value: 15 },
                  { label: "20", value: 20 },
                  { label: "25", value: 25 },
                  { label: "50", value: 50 },
                  { label: "100", value: 100 },
                ]}
                onChange={(value) => {
                  if (value !== "") {
                    updateSetting("pageSize", value);
                  }
                }}
              />
              <span className="text-sm">How many rows to show on tables by default</span>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Select<Branding>
                rounded={true}
                value={settings.branding}
                options={[
                  {
                    type: "group",
                    label: "Default",
                    options: [
                      { label: "Rainbow", value: "default-rainbow" },
                      { label: "White", value: "default-white" },
                    ],
                  },
                  {
                    type: "group",
                    label: "Classic",
                    options: [
                      { label: "Rainbow", value: "classic-rainbow" },
                      { label: "White", value: "classic-white" },
                    ],
                  },
                  {
                    type: "group",
                    label: "Original",
                    options: [{ label: "White", value: "original" }],
                  },
                  {
                    type: "group",
                    label: "Variety",
                    options: [
                      { label: "Goose", value: "goose" },
                      { label: "Pizza", value: "pizza" },
                    ],
                  },
                ]}
                onChange={(value) => {
                  if (value !== "") {
                    updateSetting("branding", value);
                  }
                }}
              />
              <span className="text-sm">Which branding to use</span>
            </div>
          </div>
        </div>
        <Link to="/settings#info">Version Information</Link>
        <br />
        <Link to="/settings#logout" variant="muted">
          Logout
        </Link>
      </PageContainer>
    </>
  );
}
