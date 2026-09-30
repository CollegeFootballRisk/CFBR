import { Outlet } from "react-router-dom";

import HashScroll from "../components/HashScroll";

import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <HashScroll />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
