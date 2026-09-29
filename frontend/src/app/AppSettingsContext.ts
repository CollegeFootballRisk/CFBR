import { createContext } from "react";

import type { AppSettings } from "@/app/settings";

export interface AppSettingsContextValue {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => void;
  resetSettings: () => void;
}

export const AppSettingsContext = createContext<
  AppSettingsContextValue | undefined
>(undefined);
