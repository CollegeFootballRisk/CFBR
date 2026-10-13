// SPDX-License-Identifier: MPL-2.0

import { createContext } from "react";
import type { TurnSelection } from "@/features/turn/components/TurnSelect";
import type { NonNullModalType } from "./ModalHost";

export interface OpenModalOptions {
  turn?: TurnSelection;
}

export interface ModalContextValue {
  activeModal: NonNullModalType | null;
  modalTurn: TurnSelection | null;
  openModal: (modal: NonNullModalType, options?: OpenModalOptions) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);
