// SPDX-License-Identifier: MPL-2.0

import { createContext, type ReactNode, useCallback, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type ModalType = "version-info" | "login" | "tutorial" | "odds-info" | null;

interface ModalContextValue {
  modal: ModalType;
  openModal: (modal: Exclude<ModalType, null>) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const MODAL_HASHES: Record<Exclude<ModalType, null>, string> = {
  "version-info": "#version-info",
  login: "#login",
  tutorial: "#tutorial",
  "odds-info": "#odds-info",
};

const HASH_TO_MODAL: Record<string, Exclude<ModalType, null>> = {
  "#version-info": "version-info",
  "#login": "login",
  "#tutorial": "tutorial",
  "#odds-info": "odds-info",
};

export function ModalProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const modal = HASH_TO_MODAL[location.hash] ?? null;

  const openModal = useCallback(
    (modal: Exclude<ModalType, null>) => {
      navigate(
        {
          pathname: location.pathname,
          search: location.search,
          hash: MODAL_HASHES[modal],
        },
        { replace: false },
      );
    },
    [location.pathname, location.search, navigate],
  );

  const closeModal = useCallback(() => {
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
      modal,
      openModal,
      closeModal,
    }),
    [modal, openModal, closeModal],
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
