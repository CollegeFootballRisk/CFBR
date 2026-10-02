export type Theme = "light" | "dark";

export type Branding =
  | "default-rainbow"
  | "default-white"
  | "classic-rainbow"
  | "classic-white"
  | "original"
  | "goose"
  | "pizza";

export const BRANDING_IMAGES: Record<Branding, string> = {
  "default-rainbow": "/images/logo-rainbow.svg",
  "default-white": "/images/logo-white.svg",
  "classic-rainbow": "/images/logo-rust-rainbow.png",
  "classic-white": "/images/logo-rust-white.svg",
  original: "/images/logo-original.png",
  goose: "/images/logo-goose-white.svg",
  pizza: "/images/logo-pizza-white.svg",
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
  branding: "default-rainbow",
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
