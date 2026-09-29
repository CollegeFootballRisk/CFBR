import { useEffect, useState, type ReactNode } from "react";

import { AppSettingsContext } from "@/app/AppSettingsContext";
import { DEFAULT_SETTINGS, type AppSettings } from "@/app/settings";

const STORAGE_KEY = "cfbr-settings";

function getStoredSettings(): AppSettings {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsed = JSON.parse(stored);

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface AppSettingsProviderProps {
  children: ReactNode;
}

function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    document.documentElement.classList.toggle(
      "light",
      settings.theme === "light",
    );

    document.documentElement.style.colorScheme = settings.theme;
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
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

export default AppSettingsProvider;
