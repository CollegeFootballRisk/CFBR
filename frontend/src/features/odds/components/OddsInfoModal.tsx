// SPDX-License-Identifier: MPL-2.0

import { StarIcon } from "@/shared/components/Icons";
import { Modal } from "@/shared/components/Modal";

interface OddsInfoModalProps {
  open: boolean;
  onClose: () => void;
}

const displayTypes = [
  {
    name: "Chance",
    description:
      "The likelihood of a team winning a territory (i.e. what portion of the overall starpower that team had for each territory).",
  },
  {
    name: "Players",
    description: "The number of players that a team submitted to each territory.",
  },
  {
    name: "Wins",
    description:
      "The territories that the team won are shown in green, while the territories the team lost are shown in red.",
  },
  {
    stars: 1,
    description:
      "The number of players that a team submitted to each territory who had one star at the time of the roll.",
  },
  {
    stars: 2,
    description:
      "The number of players that a team submitted to each territory who had two stars at the time of the roll.",
  },
  {
    stars: 3,
    description:
      "The number of players that a team submitted to each territory who had three stars at the time of the roll.",
  },
  {
    stars: 4,
    description:
      "The number of players that a team submitted to each territory who had four stars at the time of the roll.",
  },
  {
    stars: 5,
    description:
      "The number of players that a team submitted to each territory who had five stars at the time of the roll.",
  },
  {
    name: "Team Power",
    description: "Where the team deployed the most power that turn.",
  },
  {
    name: "Territory Power",
    description: "Where all teams deployed the most power that turn.",
  },
];

export default function OddsInfoModal({ open, onClose }: OddsInfoModalProps) {
  const starIds = ["one", "two", "three", "four", "five"] as const;
  return (
    <Modal open={open} onClose={onClose} title="Odds Information">
      <div className="space-y-3 text-left">
        <p>
          The Odds page, for a given team and turn, statistics about the team turn overlaid on the
          map. The different map types are as follows:
        </p>

        <div>
          <ul className="mt-auto list-outside list-disc px-8 pt-2">
            {displayTypes.map((item) => (
              <li key={item.name ?? `stars-${item.stars}`}>
                {item.stars ? (
                  <>
                    <span className="inline-flex items-center gap-0.5 font-bold">
                      {starIds.slice(0, item.stars).map((star) => (
                        <StarIcon key={star} className="size-4" />
                      ))}
                    </span>
                    <span className="font-bold">: </span>
                  </>
                ) : (
                  <span className="font-bold">{item.name}: </span>
                )}

                <span>{item.description}</span>
              </li>
            ))}
          </ul>
        </div>

        <p>
          For this map, red is higher (greater chance/number of players/etc.) while green is lower.
        </p>
      </div>
    </Modal>
  );
}
