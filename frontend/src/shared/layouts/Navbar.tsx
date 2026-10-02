import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { useAppSettings } from "@/app/useAppSettings";
import { BRANDING_IMAGES } from "@/app/settings";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { settings } = useAppSettings();

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const logo = BRANDING_IMAGES[settings.branding];

  return (
    <header className="sticky top-0 z-50 h-16 bg-linear-to-r from-accent-2 to-accent-1 backdrop-blur">
      <nav className="mx-auto flex h-full max-w-screen-2xl items-center px-4">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center"
        >
          <img
            src={logo}
            alt="College Football Risk"
            className="h-14 w-14 object-contain"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="ml-auto hidden items-end gap-2 md:flex">
          <NavItem to="login">Login</NavItem>

          <NavItem to="#leaderboard">Leaderboard</NavItem>

          <NavItem to="/">Map</NavItem>

          <NavItem to="/odds">Odds</NavItem>

          <NavItem to="/info">Info</NavItem>

          <NavItem to="/help">How to Play</NavItem>

          <NavItem to="/docs">API</NavItem>

          <NavItem to="/bugs">Bugs</NavItem>

          <NavItem to="/settings">Settings</NavItem>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t md:hidden">
          <div className="p-4">
            <MobileNavItem to="login" onClick={closeMobileMenu}>
              Login
            </MobileNavItem>

            <MobileNavItem to="#leaderboard" onClick={closeMobileMenu}>
              Leaderboard
            </MobileNavItem>

            <MobileNavItem to="/" onClick={closeMobileMenu}>
              Map
            </MobileNavItem>

            <MobileNavItem to="/odds" onClick={closeMobileMenu}>
              Odds
            </MobileNavItem>

            <MobileNavItem to="/info" onClick={closeMobileMenu}>
              Info
            </MobileNavItem>

            <MobileNavItem to="/help" onClick={closeMobileMenu}>
              How to Play
            </MobileNavItem>

            <MobileNavItem to="/docs" onClick={closeMobileMenu}>
              API
            </MobileNavItem>

            <MobileNavItem to="/bugs" onClick={closeMobileMenu}>
              Bugs
            </MobileNavItem>

            <MobileNavItem to="/settings" onClick={closeMobileMenu}>
              Settings
            </MobileNavItem>
          </div>
        </div>
      )}
    </header>
  );
}

// TODO Fix the anchor tag colors
function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        [
          "rounded-md px-4 py-2 text-sm font-medium transition text-white!",
          isActive ? "" : "",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

function MobileNavItem({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "block rounded-md px-4 py-2 text-sm font-medium transition",
          isActive ? "" : "",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
