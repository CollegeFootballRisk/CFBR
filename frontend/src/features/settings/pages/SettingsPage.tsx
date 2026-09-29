import { useAppSettings } from "@/app/useAppSettings";
import { Select } from "@/shared/components/Select";
import { Switch } from "@/shared/components/Switch";
import PageContainer from "@/shared/layouts/PageContainer";

export default function SettingsPage() {
  const { settings, updateSetting } = useAppSettings();

  return (
    <>
      <h1 className="text-2xl">Settings</h1>
      <PageContainer>
        <div className="mt-8">
          <div className="divide-y">
            <div className="flex items-center gap-4 px-6 py-4">
              <Switch
                aria-label="Show Background Images"
                checked={settings.showBackgroundImages}
                onCheckedChange={(value) =>
                  updateSetting("showBackgroundImages", value)
                }
              />
              <p className="text-sm">Background Images</p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Switch
                aria-label="Enable Light Mode"
                checked={settings.theme === "light"}
                onCheckedChange={(checked) =>
                  updateSetting("theme", checked ? "light" : "dark")
                }
              />
              <p className="text-sm">Light Mode</p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Switch
                aria-label="Show move prompting"
                checked={settings.showPromptMove}
                onCheckedChange={(value) =>
                  updateSetting("showPromptMove", value)
                }
              />
              <p className="text-sm">Prompt me to make a move if I haven't</p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Switch
                aria-label="Show territory pin"
                checked={settings.showTerritoryPin}
                onCheckedChange={(value) =>
                  updateSetting("showTerritoryPin", value)
                }
              />
              <p className="text-sm">
                Place a pin over the territory on which I am moving
              </p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Switch
                aria-label="Show territory fade/pulse"
                checked={settings.showPulseTerritory}
                onCheckedChange={(value) =>
                  updateSetting("showPulseTerritory", value)
                }
              />
              <p className="text-sm">
                Fade/pulse the territory in and out on which I am moving
              </p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Switch
                aria-label="Show bridges"
                checked={settings.showBridges}
                onCheckedChange={(value) => updateSetting("showBridges", value)}
              />
              <p className="text-sm">Show bridges when the map first loads</p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Switch
                aria-label="Show regions"
                checked={settings.showRegions}
                onCheckedChange={(value) => updateSetting("showRegions", value)}
              />
              <p className="text-sm">Show regions when the map first loads</p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Switch
                aria-label="Opt-in for experiments"
                checked={settings.showExperiments}
                onCheckedChange={(value) =>
                  updateSetting("showExperiments", value)
                }
              />
              <p className="text-sm">
                Opt-in to temporary experiments (e.g. bug fixes)
              </p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Switch
                aria-label="Show labels"
                checked={settings.showMapLabels}
                onCheckedChange={(value) =>
                  updateSetting("showMapLabels", value)
                }
              />
              <p className="text-sm">Show labels on map buttons</p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Switch
                aria-label="Add extra space for scrolling"
                checked={settings.addBottomSpace}
                onCheckedChange={(value) =>
                  updateSetting("addBottomSpace", value)
                }
              />
              <p className="text-sm">
                Add extra space to the bottom of some prompts (for scrolling)
              </p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Select
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
              <p className="text-sm">
                How many rows to show on tables by default
              </p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Select
                value={settings.branding}
                options={[
                  { label: "Normal - Rainbow", value: "normal-rainbow" },
                  { label: "Goose", value: "goose" },
                  { label: "Pizza", value: "pizza" },
                  { label: "Classic", value: "classic" },
                  { label: "Normal - White", value: "normal-white" },
                ]}
                onChange={(value) => {
                  if (
                    value === "normal-rainbow" ||
                    value === "goose" ||
                    value === "pizza" ||
                    value === "classic" ||
                    value === "normal-white"
                  ) {
                    updateSetting("branding", value);
                  }
                }}
              />
              <p className="text-sm">Which branding to use</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
