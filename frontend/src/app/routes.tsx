// SPDX-License-Identifier: MPL-2.0

import { createBrowserRouter, Navigate } from "react-router-dom";
import Bugs from "@/features/bugs/pages/Bug";
import Help from "@/features/help/pages/Help";
import Info from "@/features/help/pages/Info";
import Policies from "@/features/help/pages/Policies";
import Thanks from "@/features/help/pages/Thanks";
import Home from "@/features/home/pages/Home";
import Odds from "@/features/odds/pages/Odds";
import Settings from "@/features/settings/pages/Settings";
import AppLayout from "@/shared/layouts/AppLayout";
import ComingSoon from "@/shared/pages/ComingSoon";
import NotFound from "@/shared/pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,

    children: [
      {
        path: "/",
        element: <Home />,
        handle: {
          sidebar: true,
        },
      },

      {
        path: "/map",
        element: <ComingSoon title="Map" description="The CFBR map is being rebuilt." />,
        handle: {
          sidebar: true,
        },
      },

      {
        path: "/map/:season/:day",
        element: (
          <ComingSoon
            title="Historical Map"
            description="Historical map views are being rebuilt."
          />
        ),
        handle: {
          sidebar: true,
        },
      },

      {
        path: "/odds/:season/:day/:team",
        element: <ComingSoon title="Odds" description="Battle odds are being rebuilt." />,
        handle: {
          sidebar: true,
        },
      },

      {
        path: "/odds",
        element: <Odds />,
        handle: {
          sidebar: true,
        },
      },

      {
        path: "/visited/:team/:season",
        element: (
          <ComingSoon
            title="Visited Territories"
            description="Visited territory history is being rebuilt."
          />
        ),
        handle: {
          sidebar: true,
        },
      },

      {
        path: "/player/:player",
        element: <ComingSoon title="Player" description="Player profiles are being rebuilt." />,
        handle: {
          sidebar: true,
        },
      },

      {
        path: "/team/:team",
        element: <ComingSoon title="Team" description="Team pages are being rebuilt." />,
        handle: {
          sidebar: true,
        },
      },

      {
        path: "/settings",
        element: <Settings />,
      },

      {
        path: "/info",
        element: <Info />,
      },

      {
        path: "/about",
        element: <Info />,
      },

      {
        path: "/help",
        element: <Help />,
      },

      {
        path: "/policies",
        element: <Policies />,
      },

      {
        path: "/thanks",
        element: <Thanks />,
      },

      {
        path: "/bugs",
        element: <Bugs />,
      },

      {
        path: "/404",
        element: <NotFound />,
      },

      {
        path: "*",
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);
