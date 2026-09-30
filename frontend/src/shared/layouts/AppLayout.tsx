import { Outlet, useMatches } from "react-router-dom";

import HashScroll from "../components/HashScroll";
import { Sidebar } from "../components/Sidebar";

import Navbar from "./Navbar";

interface RouteHandle {
  sidebar?: boolean;
}

export default function AppLayout() {
  const matches = useMatches();

  const sidebarEnabled = matches.some((match) => {
    const handle = match.handle as RouteHandle | undefined;

    return handle?.sidebar === true;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {sidebarEnabled && <Sidebar />}

      <HashScroll />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
