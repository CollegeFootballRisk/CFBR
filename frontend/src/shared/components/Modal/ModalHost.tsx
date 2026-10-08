// SPDX-License-Identifier: MPL-2.0

import LoginModal from "@/features/auth/components/LoginModal";
import TutorialModal from "@/features/help/components/TutorialModal";
import { ChangelogModal } from "@/features/home/components/ChangelogModal";
import LeaderboardModal from "@/features/leaderboard/components/LeaderboardModal";
import OddsInfoModal from "@/features/odds/components/OddsInfoModal";
import VersionInformationModal from "@/features/settings/components/VersionInformationModal";
import { useModal } from "./ModalProvider";

export default function ModalHost() {
  const { activeModal, modalTurn, closeModal } = useModal();

  switch (activeModal) {
    case "version-info":
      return <VersionInformationModal open onClose={closeModal} />;

    case "login":
      return <LoginModal open onClose={closeModal} />;

    case "tutorial":
      return <TutorialModal open onClose={closeModal} />;

    case "odds-info":
      return <OddsInfoModal open onClose={closeModal} />;

    case "changelog":
      return <ChangelogModal open onClose={closeModal} />;

    case "leaderboard":
      return <LeaderboardModal open onClose={closeModal} initialTurn={modalTurn ?? "latest"} />;

    default:
      return null;
  }
}
