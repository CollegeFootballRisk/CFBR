// SPDX-License-Identifier: MPL-2.0

import LoginModal from "@/features/auth/components/LoginModal";
import TutorialModal from "@/features/help/components/TutorialModal";
import VersionInformationModal from "@/features/settings/components/VersionInformationModal";
import { useModal } from "./ModalProvider";

export default function ModalHost() {
  const { modal, closeModal } = useModal();

  switch (modal) {
    case "version-info":
      return <VersionInformationModal open onClose={closeModal} />;

    case "login":
      return <LoginModal open onClose={closeModal} />;

    case "tutorial":
      return <TutorialModal open onClose={closeModal} />;

    default:
      return null;
  }
}
