// SPDX-License-Identifier: MPL-2.0

import { MapControls } from "@/features/map/components/MapControls";
import { Button } from "@/shared/components/Button";
import { Clock } from "@/shared/components/Clock";
import { useModal } from "@/shared/components/Modal";

export function Home() {
  const { openModal } = useModal();
  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      <MapControls />

      <div className="absolute top-2 right-2 z-10 flex w-20 flex-col items-end text-sm sm:w-auto">
        <Clock />

        <Button
          variant="icon"
          onClick={() => openModal("changelog")}
          className="text-info transition-colors hover:text-foreground hover:underline hover:underline-offset-2"
        >
          Changelog
        </Button>
      </div>

      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div>
          <h1 className="font-semibold text-2xl">College Football Risk</h1>
          <p className="mt-2">Map coming soon.</p>
        </div>
      </div>
    </div>
  );
}
