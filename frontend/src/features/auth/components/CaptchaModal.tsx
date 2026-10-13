// SPDX-License-Identifier: MPL-2.0

import { Button } from "@/shared/components/Button";
import { Modal } from "@/shared/components/Modal";

interface CaptchaModalProps {
  open: boolean;
  onClose: () => void;
}

export function CaptchaModal({ open, onClose }: CaptchaModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Security Check">
      <div className="mx-auto max-w-lg space-y-5">
        <p>
          Before your move can be submitted, we need to verify that you're a real person. Complete
          the security challenge below to continue.
        </p>

        <div className="rounded-md border border-control-border p-5 text-left">
          <p className="font-semibold">reCAPTCHA verification</p>
          <p className="mt-2 text-info text-sm">
            The Google reCAPTCHA v2 challenge will appear here once the site key and provider
            integration are configured.
          </p>
        </div>

        <p className="text-info text-sm">
          Your move has not been submitted. Closing this window will return you to the game.
        </p>

        <div className="flex justify-center">
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}
