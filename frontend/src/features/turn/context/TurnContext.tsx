// SPDX-License-Identifier: MPL-2.0

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import type { TurnSelection } from "../components/TurnSelect";

interface TurnContextValue {
  mapTurn: TurnSelection;
  setMapTurn: (turn: TurnSelection) => void;
}

const TurnContext = createContext<TurnContextValue | null>(null);

interface TurnProviderProps {
  children: ReactNode;
}

export function TurnProvider({ children }: TurnProviderProps) {
  const [mapTurn, setMapTurn] = useState<TurnSelection>("latest");

  const value = useMemo(
    () => ({
      mapTurn,
      setMapTurn,
    }),
    [mapTurn],
  );

  return <TurnContext.Provider value={value}>{children}</TurnContext.Provider>;
}

export function useTurn() {
  const context = useContext(TurnContext);

  if (!context) {
    throw new Error("useTurn must be used within TurnProvider");
  }

  return context;
}
