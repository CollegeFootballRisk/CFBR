// SPDX-License-Identifier: MPL-2.0

import { useEffect, useState } from "react";

import { Button } from "@/shared/components/Button";
import { Link } from "@/shared/components/Link";
import { Modal } from "@/shared/components/Modal/Modal";

export interface MoveTerritory {
  id: number;
  name: string;
}

export interface MyMoveData {
  currentMove: string | null;
  defendable: MoveTerritory[];
  attackable: MoveTerritory[];
}

export type MyMoveStatus = "ready" | "loading" | "error";

interface MyMoveModalProps {
  open: boolean;
  onClose: () => void;
  data?: MyMoveData;
  status?: MyMoveStatus;
}

const sortTerritories = (territories: MoveTerritory[]) =>
  [...territories].sort((a, b) => a.name.localeCompare(b.name));

export function MyMoveModal({ open, onClose, data, status = "ready" }: MyMoveModalProps) {
  const [selectedTerritory, setSelectedTerritory] = useState<MoveTerritory | null>(null);

  useEffect(() => {
    if (!open) setSelectedTerritory(null);
  }, [open]);

  const defendable = sortTerritories(data?.defendable ?? []);
  const attackable = sortTerritories(data?.attackable ?? []);

  const selectTerritory = (territory: MoveTerritory) => {
    setSelectedTerritory(territory);
  };

  return (
    <Modal open={open} onClose={onClose} title="My Move">
      <div className="mx-auto max-w-2xl space-y-6">
        {status === "loading" ? (
          <div role="status" className="flex min-h-32 items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="size-6 animate-spin rounded-full border-2 border-foreground border-t-foreground"
            />
            <span>Loading your move...</span>
          </div>
        ) : status === "error" ? (
          <p role="alert" className="font-semibold text-failure">
            Error fetching your move.
          </p>
        ) : !data ? (
          <p>Move information will be available once gameplay data is connected.</p>
        ) : (
          <>
            <div className="space-y-2">
              {data.currentMove ? (
                <>
                  <p>Your move is on:</p>
                  <h3 className="font-bold text-2xl text-accent-2">{data.currentMove}</h3>
                </>
              ) : (
                <p className="font-semibold">Your move has not yet been made.</p>
              )}
            </div>

            <p className="italic">You can select a territory to make your move on below:</p>

            <div className="space-y-5 text-left">
              {defendable.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-center font-semibold text-xl">Defend</h3>

                  <div className="flex flex-wrap justify-center gap-2">
                    {defendable.map((territory) => (
                      <Button
                        key={territory.id}
                        type="button"
                        onClick={() => selectTerritory(territory)}
                        aria-pressed={selectedTerritory?.id === territory.id}
                        variant="success"
                      >
                        {territory.name}
                      </Button>
                    ))}
                  </div>
                </section>
              )}

              {attackable.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-center font-semibold text-xl">Attack</h3>

                  <div className="flex flex-wrap justify-center gap-2">
                    {attackable.map((territory) => (
                      <Button
                        key={territory.id}
                        type="button"
                        onClick={() => selectTerritory(territory)}
                        aria-pressed={selectedTerritory?.id === territory.id}
                        variant="failure"
                      >
                        {territory.name}
                      </Button>
                    ))}
                  </div>
                </section>
              )}

              {defendable.length === 0 && attackable.length === 0 && (
                <p className="text-center text-info">
                  No available territories to attack or defend.
                </p>
              )}
            </div>

            {selectedTerritory && (
              <div role="status" className="space-y-3 rounded-md border border-control-border p-4">
                <p>
                  Selected territory: <strong>{selectedTerritory.name}</strong>
                </p>
                <p className="text-info text-sm">
                  Move submission will be enabled when the gameplay API is connected. No move has
                  been submitted.
                </p>
                <Button onClick={() => setSelectedTerritory(null)}>Clear Selection</Button>
              </div>
            )}
          </>
        )}

        <div className="space-y-2 border-control-border border-t pt-4 text-sm italic">
          <p>
            This site is protected by reCAPTCHA and the Google{" "}
            <Link external href="https://policies.google.com/privacy">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link external href="https://policies.google.com/terms">
              Terms of Service
            </Link>{" "}
            apply.
          </p>
          <p>
            By making a move, you agree to play by the <Link href="/policies">code of conduct</Link>{" "}
            and, if this is a test game, you acknowledge and agree to the{" "}
            <Link href="/policies#test-game-policy">test game policy</Link>.
          </p>
        </div>
      </div>
    </Modal>
  );
}
