import { useEffect, useState } from "react";

import ChevronIcon from "../Icons/ChevronIcon";
import DiscordIcon from "../Icons/DiscordIcon";
import GitHubIcon from "../Icons/GithubIcon";

interface SidebarProps {
  defaultOpen?: boolean;
}

export default function Sidebar({ defaultOpen = true }: SidebarProps) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const handleChange = () => {
      if (media.matches) {
        setOpen(false);
      }
    };

    handleChange();
    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <aside
      aria-label="Sidebar"
      className={[
        "fixed left-0 top-16 bottom-0 z-40 w-60",
        "overflow-visible border-r-4",
        "transition-transform duration-500 ease-in-out",
        "bg-accent-1",
        open ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={[
          "absolute top-1/2 -translate-y-1/2",
          "flex h-16 w-10 items-center justify-center",
          "border-4",
          "bg-accent-1",
          "transition-all duration-500 ease-in-out",
          "rounded-r-xl",
          open ? "left-[calc(100%+8px)]" : "left-[calc(100%+4px)]",
        ].join(" ")}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        title={open ? "Close sidebar" : "Open sidebar"}
      >
        <ChevronIcon direction={open ? "right" : "left"} className="h-5 w-5" />
      </button>

      <div className="flex justify-center gap-1 my-4 mx-2 border-t-2 pt-4">
        <a
          href="https://discord.gg/NwXjDS7mGN"
          target="_blank"
          rel="noreferrer"
          aria-label="College Football Risk Discord"
        >
          <DiscordIcon />
        </a>
        <a
          href="https://github.com/CollegeFootballRisk/"
          target="_blank"
          rel="noreferrer"
          aria-label="College Football Risk GitHub"
        >
          <GitHubIcon />
        </a>
      </div>
    </aside>
  );
}
