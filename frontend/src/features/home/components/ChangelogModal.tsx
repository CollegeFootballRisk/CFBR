// SPDX-License-Identifier: MPL-2.0

import type { ReactNode } from "react";
import { Modal } from "@/shared/components/Modal";

interface ChangelogEntry {
  turn: string;
  title: string;
  content: ReactNode;
}

const CHANGELOG: ChangelogEntry[] = [
  {
    turn: "6/0",
    title: "First changelog entry",
    content: <p>Coming soon</p>,
  },
];

interface ChangelogModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangelogModal({ open, onClose }: ChangelogModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Changelog">
      <div className="space-y-8 text-left">
        {CHANGELOG.map((entry) => (
          <section key={`${entry.turn}-${entry.title}`} className="space-y-3">
            <div>
              <h2 className="text-2xl font-bold italic">Turn {entry.turn}</h2>
              <br />

              <h3 className="text-xl font-bold">{entry.title}</h3>
            </div>

            <div>{entry.content}</div>
          </section>
        ))}
      </div>
    </Modal>
  );
}
