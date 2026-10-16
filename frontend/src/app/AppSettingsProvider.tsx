// SPDX-License-Identifier: MPL-2.0

import { type ReactNode, useEffect, useState } from "react";

import { AppSettingsContext } from "@/app/AppSettingsContext";
import { type AppSettings, BRANDING_IMAGES, DEFAULT_SETTINGS } from "@/app/settings";

const STORAGE_KEY = "cfbr-settings";

function getStoredSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsed: unknown = JSON.parse(stored);

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { ...DEFAULT_SETTINGS };
    }

    const values = parsed as Record<string, unknown>;
    const settings: AppSettings = { ...DEFAULT_SETTINGS };

    if (values.theme === "light" || values.theme === "dark") {
      settings.theme = values.theme;
    }

    if (typeof values.branding === "string" && Object.hasOwn(BRANDING_IMAGES, values.branding)) {
      settings.branding = values.branding as AppSettings["branding"];
    }

    if (
      typeof values.pageSize === "number" &&
      Number.isInteger(values.pageSize) &&
      values.pageSize > 0 &&
      values.pageSize <= 100
    ) {
      settings.pageSize = values.pageSize;
    }

    const booleanKeys = [
      "showBackgroundImages",
      "showPromptMove",
      "showTerritoryPin",
      "showPulseTerritory",
      "showBridges",
      "showRegions",
      "showExperiments",
      "showMapLabels",
      "addBottomSpace",
    ] as const;

    for (const key of booleanKeys) {
      if (typeof values[key] === "boolean") {
        settings[key] = values[key];
      }
    }

    return settings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

interface AppSettingsProviderProps {
  children: ReactNode;
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings);

  useEffect(() => {
    document.documentElement.style.colorScheme = settings.theme;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}
