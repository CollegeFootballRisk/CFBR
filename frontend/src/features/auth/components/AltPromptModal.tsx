// SPDX-License-Identifier: MPL-2.0

import { Link } from "@/shared/components/Link";
import { Modal } from "@/shared/components/Modal";

interface AltPromptModalProps {
  open: boolean;
  onClose: () => void;
}

export function AltPromptModal({ open, onClose }: AltPromptModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Banned">
      <div className="mx-auto max-w-xl space-y-4">
        <p>Your account has been flagged as an alternate account.</p>

        <p>
          If you believe this is an error, please{" "}
          <Link
            external
            href="https://discord.com/channels/1085080625159090226/1085080625805004900"
            aria-label="College Football Risk Discord"
          >
            send a message to the mods
          </Link>{" "}
          immediately.
        </p>

        <p>
          You can still submit moves and build up stars, but your moves will not affect the game.
        </p>
      </div>
    </Modal>
  );
}
