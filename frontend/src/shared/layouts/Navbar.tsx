import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-primary text-primary-foreground backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center"
        >
          <img
            src="/images/logo-rainbow.png"
            alt="College Football Risk"
            className="h-10 w-10 object-contain"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="ml-auto hidden items-end gap-1 md:flex">
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
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-primary-foreground transition hover:bg-primary-foreground/10 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-primary-foreground/20 bg-primary md:hidden">
          <div className="space-y-1 px-4 py-3">
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

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        [
          "rounded-md px-3 py-2 text-sm font-medium transition",
          isActive
            ? "bg-primary-foreground/15 text-primary-foreground"
            : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
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
          "block rounded-md px-3 py-2 text-sm font-medium transition",
          isActive
            ? "bg-primary-foreground/15 text-primary-foreground"
            : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default Navbar;
