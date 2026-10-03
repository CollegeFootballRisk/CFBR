import { useContext } from "react";

import { AppSettingsContext } from "@/app/AppSettingsContext";

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }

  return context;
}
