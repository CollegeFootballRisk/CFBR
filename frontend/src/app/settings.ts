export type Theme = "light" | "dark";

export type Branding =
  "normal-rainbow" | "goose" | "pizza" | "classic" | "normal-white";

export const BRANDING_IMAGES: Record<Branding, string> = {
  "normal-rainbow": "/images/logo-rainbow.png",
  "normal-white": "/images/logo-white.svg",
  goose: "/images/logo-goose-white.svg",
  pizza: "/images/logo-pizza-white.svg",
  classic: "/images/logo-classic.png",
};

export interface AppSettings {
  theme: Theme;
  branding: Branding;
  pageSize: number;

  showBackgroundImages: boolean;
  showPromptMove: boolean;
  showTerritoryPin: boolean;
  showPulseTerritory: boolean;
  showBridges: boolean;
  showRegions: boolean;
  showExperiments: boolean;
  showMapLabels: boolean;
  addBottomSpace: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  branding: "normal-rainbow",
  pageSize: 25,

  showBackgroundImages: false,
  showPromptMove: false,
  showTerritoryPin: true,
  showPulseTerritory: true,
  showBridges: false,
  showRegions: false,
  showExperiments: false,
  showMapLabels: false,
  addBottomSpace: false,
};
