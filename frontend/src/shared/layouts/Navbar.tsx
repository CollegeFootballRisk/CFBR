// SPDX-License-Identifier: MPL-2.0

import { useState } from "react";
import { BRANDING_IMAGES } from "@/app/settings";
import { useAppSettings } from "@/app/useAppSettings";
import { Link, NavLink } from "@/shared/components/Link";
import { useModal } from "@/shared/components/Modal";
import { Button } from "../components/Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useModal();
  const { settings } = useAppSettings();

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const openLatestLeaderboard = () => {
    openModal("leaderboard", { turn: "latest" });
  };

  const logo = BRANDING_IMAGES[settings.branding];

  return (
    <header className="sticky top-0 z-50 h-16 bg-linear-to-r from-accent-2 to-accent-1 backdrop-blur">
      <nav className="mx-auto flex h-full max-w-screen-2xl items-center px-4">
        <Link to="/" onClick={closeMobileMenu} className="flex shrink-0 items-center">
          <img src={logo} alt="College Football Risk" className="h-14 w-14 object-contain" />
        </Link>

        {/* Desktop navigation */}
        <div className="ml-auto hidden items-end gap-2 md:flex">
          <NavItem onClick={() => openModal("login")}>Login</NavItem>

          <NavItem onClick={openLatestLeaderboard}>Leaderboard</NavItem>

          <NavItem to="/">Map</NavItem>

          <NavItem to="/odds">Odds</NavItem>

          <NavItem onClick={() => openModal("tutorial")}>Info</NavItem>

          <NavItem to="/help">How to Play</NavItem>

          <ExternalNavItem href="/docs">API</ExternalNavItem>

          <NavItem to="/bugs">Bugs</NavItem>

          <NavItem to="/settings">Settings</NavItem>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="nav"
          onClick={() => setMobileOpen((open) => !open)}
          className="ml-auto p-2 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <span className="text-2xl">{mobileOpen ? "✕" : "☰"}</span>
        </Button>
      </nav>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-16 border-t border-foreground bg-linear-to-r from-accent-2 to-accent-1 md:hidden">
          <div className="divide-y divide-foreground">
            <MobileNavItem
              onClick={() => {
                closeMobileMenu();
                openModal("login");
              }}
            >
              Login
            </MobileNavItem>
            <MobileNavItem
              onClick={() => {
                closeMobileMenu();
                openLatestLeaderboard();
              }}
            >
              Leaderboard
            </MobileNavItem>

            <MobileNavItem to="/" onClick={closeMobileMenu}>
              Map
            </MobileNavItem>

            <MobileNavItem to="/odds" onClick={closeMobileMenu}>
              Odds
            </MobileNavItem>

            <MobileNavItem
              onClick={() => {
                closeMobileMenu();
                openModal("tutorial");
              }}
            >
              Info
            </MobileNavItem>

            <MobileNavItem to="/help" onClick={closeMobileMenu}>
              How to Play
            </MobileNavItem>

            <ExternalMobileNavItem href="/docs" onClick={closeMobileMenu}>
              API
            </ExternalMobileNavItem>

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

type NavItemProps =
  | {
      to: string;
      onClick?: never;
      children: React.ReactNode;
    }
  | {
      to?: never;
      onClick: () => void;
      children: React.ReactNode;
    };

function NavItem({ children, ...props }: NavItemProps) {
  if ("onClick" in props) {
    return (
      <Button variant="nav" onClick={props.onClick}>
        {children}
      </Button>
    );
  }

  return (
    <NavLink
      to={props.to}
      end={props.to === "/"}
      className="rounded-md px-4 py-2 text-sm font-medium"
    >
      <span className="inline-block hover:shadow-accent-glow hover:underline hover:decoration-dashed">
        {children}
      </span>
    </NavLink>
  );
}

function ExternalNavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} variant="nav" className="rounded-md px-4 py-2 text-sm font-medium">
      <span className="inline-block hover:shadow-accent-glow hover:underline hover:decoration-dashed">
        {children}
      </span>
    </Link>
  );
}

function MobileNavItem({
  to,
  onClick,
  children,
}: {
  to?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  if (!to) {
    return (
      <Button
        variant="nav"
        onClick={onClick}
        className="w-full justify-center rounded-none py-3 text-sm text-center"
      >
        {children}
      </Button>
    );
  }

  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className="block w-full rounded-none py-3 text-center text-sm font-medium"
    >
      {children}
    </NavLink>
  );
}

function ExternalMobileNavItem({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      variant="nav"
      onClick={onClick}
      className="block w-full rounded-none py-3 text-center text-sm font-medium"
    >
      {children}
    </Link>
  );
}
