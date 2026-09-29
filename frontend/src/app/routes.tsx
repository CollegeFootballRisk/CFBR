import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/features/home/pages/HomePage";
import HelpPage from "@/features/help/pages/HelpPage";
import AppLayout from "@/shared/layouts/AppLayout";
import ComingSoonPage from "@/shared/pages/ComingSoonPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Main
      {
        path: "/",
        element: <HomePage />,
      },

      // Map
      {
        path: "/map",
        element: (
          <ComingSoonPage
            title="Map"
            description="The CFBR map is being rebuilt."
          />
        ),
      },
      {
        path: "/map/:season/:day",
        element: (
          <ComingSoonPage
            title="Historical Map"
            description="Historical map views are being rebuilt."
          />
        ),
      },

      // Odds
      {
        path: "/odds/:season/:day/:team",
        element: (
          <ComingSoonPage
            title="Odds"
            description="Battle odds are being rebuilt."
          />
        ),
      },

      // Visited territories
      {
        path: "/visited/:team/:season",
        element: (
          <ComingSoonPage
            title="Visited Territories"
            description="Visited territory history is being rebuilt."
          />
        ),
      },

      // Players
      {
        path: "/player/:player",
        element: (
          <ComingSoonPage
            title="Player"
            description="Player profiles are being rebuilt."
          />
        ),
      },

      // Teams
      {
        path: "/team/:team",
        element: (
          <ComingSoonPage
            title="Team"
            description="Team pages are being rebuilt."
          />
        ),
      },

      // Settings
      {
        path: "/settings",
        element: <SettingsPage />,
      },

      // Information
      {
        path: "/info",
        element: (
          <ComingSoonPage
            title="Info"
            description="CFBR information pages are being rebuilt."
          />
        ),
      },
      {
        path: "/about",
        element: (
          <ComingSoonPage
            title="About"
            description="The CFBR about page is being rebuilt."
          />
        ),
      },
      {
        path: "/help",
        element: <HelpPage />,
      },
      {
        path: "/policies",
        element: (
          <ComingSoonPage
            title="Policies"
            description="CFBR policies are being rebuilt."
          />
        ),
      },

      // Miscellaneous
      {
        path: "/thanks",
        element: (
          <ComingSoonPage
            title="Thanks"
            description="This page is being rebuilt."
          />
        ),
      },
      {
        path: "/error/:error",
        element: (
          <ComingSoonPage title="Error" description="An error occurred." />
        ),
      },

      // Catch-all
      {
        path: "*",
        element: (
          <ComingSoonPage
            title="Page Not Found"
            description="The page you're looking for doesn't exist."
          />
        ),
      },
    ],
  },
]);
