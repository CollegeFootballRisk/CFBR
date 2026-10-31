// SPDX-License-Identifier: MPL-2.0

import type { ReactNode } from "react";
import { Modal } from "@/shared/components/Modal";

interface ChangelogSection {
  title: string;
  content: ReactNode;
}

interface ChangelogEntry {
  turn: string;
  sections: ChangelogSection[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    turn: "6/...",
    sections: [
      {
        title: "Team Logos are available",
        content: (
          <p>All team logos are now available as SVG, including the addition of test game logos.</p>
        ),
      },
      {
        title: "Discord/Reddit Merging",
        content: (
          <p>
            Users can now merge their existing Discord/Reddit accounts into one profile, deleting
            the less desired account. This also means users can change their display name between
            their Discord/Reddit usernames. API responses will reference the user id rather than
            their display name now since there is potential name changing throughout turns.
          </p>
        ),
      },
    ],
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
          <section key={entry.turn} className="space-y-4">
            <h2 className="font-bold text-2xl italic">Turn {entry.turn}</h2>

            {entry.sections.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3 className="font-bold text-xl">{section.title}</h3>

                <div>{section.content}</div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </Modal>
  );
}
