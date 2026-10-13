// SPDX-License-Identifier: MPL-2.0

import { useContext } from "react";
import { ModalContext } from "./ModalContext";

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }

  return context;
}
