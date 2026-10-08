// SPDX-License-Identifier: MPL-2.0

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { TurnSelection } from "@/features/turn/components/TurnSelect";

export type ModalType =
  | "version-info"
  | "login"
  | "tutorial"
  | "odds-info"
  | "changelog"
  | "leaderboard"
  | null;

type NonNullModalType = Exclude<ModalType, null>;

export interface OpenModalOptions {
  turn?: TurnSelection;
}

interface ModalContextValue {
  activeModal: ModalType;
  modalTurn: TurnSelection | null;
  openModal: (modal: NonNullModalType, options?: OpenModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const MODAL_CONFIG = {
  "version-info": {
    hash: "#version-info",
  },
  login: {
    hash: "#login",
  },
  tutorial: {
    hash: "#tutorial",
  },
  "odds-info": {
    hash: "#odds-info",
  },
  changelog: {
    hash: "#changelog",
  },
  leaderboard: {
    hash: "#leaderboard",
  },
} satisfies Record<NonNullModalType, { hash: string }>;

const HASH_TO_MODAL = Object.fromEntries(
  Object.entries(MODAL_CONFIG).map(([modal, config]) => [config.hash, modal]),
) as Record<string, NonNullModalType>;

export function ModalProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeModal = HASH_TO_MODAL[location.hash] ?? null;

  const [modalTurn, setModalTurn] = useState<TurnSelection | null>(null);

  const openModal = useCallback(
    (nextModal: NonNullModalType, options?: OpenModalOptions) => {
      setModalTurn(options?.turn ?? null);

      navigate(
        {
          pathname: location.pathname,
          search: location.search,
          hash: MODAL_CONFIG[nextModal].hash,
        },
        { replace: false },
      );
    },
    [location.pathname, location.search, navigate],
  );

  const closeModal = useCallback(() => {
    setModalTurn(null);

    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: "",
      },
      { replace: true },
    );
  }, [location.pathname, location.search, navigate]);

  const value = useMemo(
    () => ({
      activeModal,
      modalTurn,
      openModal,
      closeModal,
    }),
    [activeModal, modalTurn, openModal, closeModal],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }

  return context;
}
