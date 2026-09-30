import { createBrowserRouter } from "react-router-dom";

import Help from "@/features/help/pages/Help";
import Info from "@/features/help/pages/Info";
import Policies from "@/features/help/pages/Policies";
import Home from "@/features/home/pages/Home";
import Settings from "@/features/settings/pages/Settings";
import ComingSoon from "@/shared/pages/ComingSoon";
import AppLayout from "@/shared/layouts/AppLayout";

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
        element: (
          <ComingSoon
            title="Map"
            description="The CFBR map is being rebuilt."
          />
        ),
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
        element: (
          <ComingSoon
            title="Odds"
            description="Battle odds are being rebuilt."
          />
        ),
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
        element: (
          <ComingSoon
            title="Player"
            description="Player profiles are being rebuilt."
          />
        ),
        handle: {
          sidebar: true,
        },
      },

      {
        path: "/team/:team",
        element: (
          <ComingSoon
            title="Team"
            description="Team pages are being rebuilt."
          />
        ),
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
        element: (
          <ComingSoon
            title="About"
            description="The CFBR about page is being rebuilt."
          />
        ),
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
        element: (
          <ComingSoon
            title="Thanks"
            description="The thanks page is being rebuilt."
          />
        ),
      },

      {
        path: "/error/:error",
        element: <ComingSoon title="Error" description="An error occurred." />,
      },

      {
        path: "*",
        element: (
          <ComingSoon
            title="Page Not Found"
            description="The page you're looking for doesn't exist."
          />
        ),
      },
    ],
  },
]);
