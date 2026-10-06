// SPDX-License-Identifier: MPL-2.0

import { useEffect, useMemo, useState } from "react";
import { Link } from "../Link";

const ROLL_TIME = new Date("2027-06-21T00:00:00-04:00");

function getRemainingTime(target: Date, now: Date) {
  const difference = target.getTime() - now.getTime();

  if (difference <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(difference / 1000);

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function formatTime(value: number) {
  return String(value).padStart(2, "0");
}

export function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const remaining = useMemo(() => getRemainingTime(ROLL_TIME, now), [now]);

  return (
    <Link
      href="."
      className="block text-right text-sm font-medium text-info transition-colors hover:text-foreground hover:underline hover:underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      title="Timer"
    >
      {remaining ? (
        <>
          <div>
            <time dateTime={ROLL_TIME.toISOString()}>
              T-
              {formatTime(remaining.hours)}:{formatTime(remaining.minutes)}:
              {formatTime(remaining.seconds)}
            </time>
          </div>

          <div>until next roll</div>
        </>
      ) : (
        <div>Past Roll ↻</div>
      )}
    </Link>
  );
}
