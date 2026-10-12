// SPDX-License-Identifier: MPL-2.0

import { type ReactNode, useEffect, useId } from "react";
import { useLocation } from "react-router-dom";
import type { Branding } from "@/app/settings";
import { useAppSettings } from "@/app/useAppSettings";
import { Link } from "@/shared/components/Link";
import { useModal } from "@/shared/components/Modal";
import { Select } from "@/shared/components/Select";
import { Switch } from "@/shared/components/Switch";
import { PageSizeSelect } from "@/shared/components/Table";
import { PageContainer } from "@/shared/layouts/PageContainer";

interface SettingsRowProps {
  label: string;
  children: ReactNode;
}

function SettingsRow({ label, children }: SettingsRowProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      {children}
      <span className="text-sm">{label}</span>
    </div>
  );
}

interface SettingsToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SettingsToggleRow({ label, checked, onChange }: SettingsToggleRowProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-4 py-4">
      <Switch id={id} aria-label={label} checked={checked} onCheckedChange={onChange} />
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
    </div>
  );
}

export function Settings() {
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
      <h1 className="my-4 text-center font-bold text-4xl">Settings</h1>

      <PageContainer>
        <div className="mt-8">
          <div className="divide-y">
            <SettingsToggleRow
              label="Background Images"
              checked={settings.showBackgroundImages}
              onChange={(value) => updateSetting("showBackgroundImages", value)}
            />

            <SettingsToggleRow
              label="Light Mode"
              checked={settings.theme === "light"}
              onChange={(checked) => updateSetting("theme", checked ? "light" : "dark")}
            />

            <SettingsToggleRow
              label="Prompt me to make a move if I haven't"
              checked={settings.showPromptMove}
              onChange={(value) => updateSetting("showPromptMove", value)}
            />

            <SettingsToggleRow
              label="Place a pin over the territory on which I am moving"
              checked={settings.showTerritoryPin}
              onChange={(value) => updateSetting("showTerritoryPin", value)}
            />

            <SettingsToggleRow
              label="Fade/pulse the territory in and out on which I am moving"
              checked={settings.showPulseTerritory}
              onChange={(value) => updateSetting("showPulseTerritory", value)}
            />

            <SettingsToggleRow
              label="Show bridges when the map first loads"
              checked={settings.showBridges}
              onChange={(value) => updateSetting("showBridges", value)}
            />

            <SettingsToggleRow
              label="Show regions when the map first loads"
              checked={settings.showRegions}
              onChange={(value) => updateSetting("showRegions", value)}
            />

            <SettingsToggleRow
              label="Opt-in to temporary experiments (e.g. bug fixes)"
              checked={settings.showExperiments}
              onChange={(value) => updateSetting("showExperiments", value)}
            />

            <SettingsToggleRow
              label="Show labels on map buttons"
              checked={settings.showMapLabels}
              onChange={(value) => updateSetting("showMapLabels", value)}
            />

            <SettingsToggleRow
              label="Add extra space to the bottom of some prompts (for scrolling)"
              checked={settings.addBottomSpace}
              onChange={(value) => updateSetting("addBottomSpace", value)}
            />

            <SettingsRow label="How many rows to show on tables by default">
              <PageSizeSelect
                value={settings.pageSize}
                onChange={(value) => updateSetting("pageSize", value)}
              />
            </SettingsRow>

            <SettingsRow label="Which branding to use">
              <Select<Branding>
                rounded="full"
                width="full"
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
                    label: "Risk 3.0",
                    options: [
                      { label: "Rainbow", value: "classic-rainbow" },
                      { label: "White", value: "classic-white" },
                    ],
                  },
                  {
                    type: "group",
                    label: "Risk 2.0",
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
            </SettingsRow>
          </div>
        </div>

        <Link to="/settings#info">Version Information</Link>
        <br />
        <Link to="/settings#logout" variant="exit">
          Logout
        </Link>
      </PageContainer>
    </>
  );
}
