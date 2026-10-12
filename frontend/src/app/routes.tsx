// SPDX-License-Identifier: MPL-2.0

import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/shared/layouts/AppLayout";
import { ErrorPage } from "@/shared/pages/ErrorPage";

const loadHome = () => import("@/features/home/pages/Home");
const loadOdds = () => import("@/features/odds/pages/Odds");
const loadVisited = () => import("@/features/visited/pages/Visited");
const loadTeam = () => import("@/features/team/pages/Team");
const loadPlayer = () => import("@/features/player/pages/Player");
const loadSettings = () => import("@/features/settings/pages/Settings");
const loadInfo = () => import("@/features/help/pages/Info");
const loadHelp = () => import("@/features/help/pages/Help");
const loadPolicies = () => import("@/features/help/pages/Policies");
const loadThanks = () => import("@/features/help/pages/Thanks");
const loadBugs = () => import("@/features/bugs/pages/Bug");

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        lazy: async () => ({ Component: (await loadHome()).Home }),
        handle: { sidebar: true },
      },
      {
        path: "/odds/:season/:day/:team",
        lazy: async () => ({ Component: (await loadOdds()).Odds }),
        handle: { sidebar: true },
      },
      {
        path: "/odds",
        lazy: async () => ({ Component: (await loadOdds()).Odds }),
        handle: { sidebar: true },
      },
      {
        path: "/visited/:team/:season",
        lazy: async () => ({ Component: (await loadVisited()).Visited }),
      },
      {
        path: "/visited",
        lazy: async () => ({ Component: (await loadVisited()).Visited }),
        handle: { sidebar: true },
      },
      {
        path: "/player/:player",
        lazy: async () => ({ Component: (await loadPlayer()).Player }),
      },
      {
        path: "/team/:team",
        lazy: async () => ({ Component: (await loadTeam()).Team }),
      },
      {
        path: "/settings",
        lazy: async () => ({ Component: (await loadSettings()).Settings }),
      },
      {
        path: "/info",
        lazy: async () => ({ Component: (await loadInfo()).Info }),
      },
      {
        path: "/about",
        lazy: async () => ({ Component: (await loadInfo()).Info }),
      },
      {
        path: "/help",
        lazy: async () => ({ Component: (await loadHelp()).Help }),
      },
      {
        path: "/policies",
        lazy: async () => ({ Component: (await loadPolicies()).Policies }),
      },
      {
        path: "/thanks",
        lazy: async () => ({ Component: (await loadThanks()).Thanks }),
      },
      {
        path: "/bugs",
        lazy: async () => ({ Component: (await loadBugs()).Bugs }),
      },
      {
        path: "/error",
        element: <ErrorPage variant="unknown" />,
      },
      {
        path: "*",
        element: <ErrorPage variant="not-found" />,
      },
    ],
  },
]);
