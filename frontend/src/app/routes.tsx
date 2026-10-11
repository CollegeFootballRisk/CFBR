// SPDX-License-Identifier: MPL-2.0

import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@/shared/layouts/AppLayout";
import ComingSoon from "@/shared/pages/ComingSoon";

const loadHome = () => import("@/features/home/pages/Home");
const loadOdds = () => import("@/features/odds/pages/Odds");
const loadTeam = () => import("@/features/team/pages/Team");
const loadPlayer = () => import("@/features/player/pages/Player");
const loadSettings = () => import("@/features/settings/pages/Settings");
const loadInfo = () => import("@/features/help/pages/Info");
const loadHelp = () => import("@/features/help/pages/Help");
const loadPolicies = () => import("@/features/help/pages/Policies");
const loadThanks = () => import("@/features/help/pages/Thanks");
const loadBugs = () => import("@/features/bugs/pages/Bug");
const loadNotFound = () => import("@/shared/pages/NotFound");

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        lazy: async () => ({ Component: (await loadHome()).default }),
        handle: { sidebar: true },
      },
      {
        path: "/odds/:season/:day/:team",
        element: <ComingSoon title="Odds" description="Battle odds are being rebuilt." />,
        handle: { sidebar: true },
      },
      {
        path: "/odds",
        lazy: async () => ({ Component: (await loadOdds()).default }),
        handle: { sidebar: true },
      },
      {
        path: "/visited/:team/:season",
        element: (
          <ComingSoon
            title="Visited Territories"
            description="Visited territory history is being rebuilt."
          />
        ),
        handle: { sidebar: true },
      },
      {
        path: "/player/:player",
        lazy: async () => ({ Component: (await loadPlayer()).default }),
      },
      {
        path: "/team/:team",
        lazy: async () => ({ Component: (await loadTeam()).default }),
      },
      {
        path: "/settings",
        lazy: async () => ({ Component: (await loadSettings()).default }),
      },
      {
        path: "/info",
        lazy: async () => ({ Component: (await loadInfo()).default }),
      },
      {
        path: "/about",
        lazy: async () => ({ Component: (await loadInfo()).default }),
      },
      {
        path: "/help",
        lazy: async () => ({ Component: (await loadHelp()).default }),
      },
      {
        path: "/policies",
        lazy: async () => ({ Component: (await loadPolicies()).default }),
      },
      {
        path: "/thanks",
        lazy: async () => ({ Component: (await loadThanks()).default }),
      },
      {
        path: "/bugs",
        lazy: async () => ({ Component: (await loadBugs()).default }),
      },
      {
        path: "/404",
        lazy: async () => ({ Component: (await loadNotFound()).default }),
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);
