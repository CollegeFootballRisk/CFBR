// SPDX-License-Identifier: MPL-2.0

import type { ReactNode } from "react";

import { AltPromptModal } from "@/features/auth/components/AltPromptModal";
import { CaptchaModal } from "@/features/auth/components/CaptchaModal";
import { LoginModal } from "@/features/auth/components/LoginModal";
import { TutorialModal } from "@/features/help/components/TutorialModal";
import { ChangelogModal } from "@/features/home/components/ChangelogModal";
import { LeaderboardModal } from "@/features/leaderboard/components/LeaderboardModal";
import { OddsInfoModal } from "@/features/odds/components/OddsInfoModal";
import { MyMoveModal } from "@/features/player/components/MyMoveModal";
import { VersionInformationModal } from "@/features/settings/components/VersionInformationModal";
import { JoinTeamModal } from "@/features/team/components/JoinTeamModal";
import type { TurnSelection } from "@/features/turn/components/TurnSelect";

export interface ModalRenderContext {
  closeModal: () => void;
  modalTurn: TurnSelection | null;
}

interface ModalDefinition {
  hash: string;
  render: (context: ModalRenderContext) => ReactNode;
}

export const MODAL_DEFINITIONS = {
  "version-info": {
    hash: "#version-info",
    render: ({ closeModal }) => <VersionInformationModal open onClose={closeModal} />,
  },
  login: {
    hash: "#login",
    render: ({ closeModal }) => <LoginModal open onClose={closeModal} />,
  },
  tutorial: {
    hash: "#tutorial",
    render: ({ closeModal }) => <TutorialModal open onClose={closeModal} />,
  },
  "odds-info": {
    hash: "#odds-info",
    render: ({ closeModal }) => <OddsInfoModal open onClose={closeModal} />,
  },
  changelog: {
    hash: "#changelog",
    render: ({ closeModal }) => <ChangelogModal open onClose={closeModal} />,
  },
  leaderboard: {
    hash: "#leaderboard",
    render: ({ closeModal, modalTurn }) => (
      <LeaderboardModal open onClose={closeModal} initialTurn={modalTurn ?? "latest"} />
    ),
  },
  "join-team": {
    hash: "#join-team",
    render: ({ closeModal }) => <JoinTeamModal open onClose={closeModal} />,
  },
  captcha: {
    hash: "#captcha",
    render: ({ closeModal }) => <CaptchaModal open onClose={closeModal} />,
  },
  "alt-prompt": {
    hash: "#alt-prompt",
    render: ({ closeModal }) => <AltPromptModal open onClose={closeModal} />,
  },
  "my-move": {
    hash: "#my-move",
    render: ({ closeModal }) => (
      <MyMoveModal
        open
        onClose={closeModal}
        data={{
          currentMove: null,
          defendable: [
            { id: 1, name: "Columbus" },
            { id: 2, name: "Cleveland" },
          ],
          attackable: [
            { id: 3, name: "Ann Arbor" },
            { id: 4, name: "South Bend" },
            { id: 5, name: "State College" },
          ],
        }}
      />
    ),
  },
} satisfies Record<string, ModalDefinition>;

export type NonNullModalType = keyof typeof MODAL_DEFINITIONS;
export type ModalType = NonNullModalType | null;

interface ModalHostProps {
  activeModal: ModalType;
  modalTurn: TurnSelection | null;
  closeModal: () => void;
}

export function ModalHost({ activeModal, modalTurn, closeModal }: ModalHostProps) {
  if (!activeModal) {
    return null;
  }

  return MODAL_DEFINITIONS[activeModal].render({
    closeModal,
    modalTurn,
  });
}
