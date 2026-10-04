import { useEffect, useState } from "react";
import { ChevronIcon, DiscordIcon, GitHubIcon } from "../Icons";
import { Link } from "../Link";

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
        "bg-accent-1 text-foreground",
        "transition-transform duration-500 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={[
          "absolute top-1/2 -translate-y-1/2",
          "flex h-16 w-10 items-center justify-center",
          "rounded-r-xl border-4 bg-accent-1 text-foreground",
          "hover:bg-foreground hover:text-background",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
          "transition-all duration-500 ease-in-out",
          open ? "left-[calc(100%+8px)]" : "left-[calc(100%+4px)]",
        ].join(" ")}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        title={open ? "Close sidebar" : "Open sidebar"}
      >
        <ChevronIcon direction={open ? "right" : "left"} className="h-5 w-5" />
      </button>

      <div
        className={[
          "mx-2 my-4 flex justify-center gap-1 border-t-2 pt-4",
          "transition-[visibility] duration-500",
          open ? "visible" : "invisible",
        ].join(" ")}
      >
        <Link
          external
          href="https://discord.gg/NwXjDS7mGN"
          aria-label="College Football Risk Discord"
        >
          <DiscordIcon />
        </Link>
        <Link
          external
          href="https://github.com/CollegeFootballRisk/"
          aria-label="College Football Risk GitHub"
        >
          <GitHubIcon />
        </Link>
      </div>
    </aside>
  );
}
