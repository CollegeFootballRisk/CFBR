import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/shared/layouts/AppLayout";
import Help from "@/features/help/pages/Help";
import Home from "@/features/home/pages/Home";
import ComingSoon from "@/shared/pages/ComingSoon";
import Settings from "@/features/settings/pages/Settings";
import Info from "@/features/help/pages/Info";
import Policies from "@/features/help/pages/Policies";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/map",
        element: (
          <ComingSoon
            title="Map"
            description="The CFBR map is being rebuilt."
          />
        ),
      },
      {
        path: "/map/:season/:day",
        element: (
          <ComingSoon
            title="Historical Map"
            description="Historical map views are being rebuilt."
          />
        ),
      },

      {
        path: "/odds/:season/:day/:team",
        element: (
          <ComingSoon
            title="Odds"
            description="Battle odds are being rebuilt."
          />
        ),
      },

      {
        path: "/visited/:team/:season",
        element: (
          <ComingSoon
            title="Visited Territories"
            description="Visited territory history is being rebuilt."
          />
        ),
      },

      {
        path: "/player/:player",
        element: (
          <ComingSoon
            title="Player"
            description="Player profiles are being rebuilt."
          />
        ),
      },

      {
        path: "/team/:team",
        element: (
          <ComingSoon
            title="Team"
            description="Team pages are being rebuilt."
          />
        ),
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
            description="This page is being rebuilt."
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
