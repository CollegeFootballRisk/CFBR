// SPDX-License-Identifier: MPL-2.0

import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import AppSettingsProvider from "./AppSettingsProvider";
import { router } from "./routes";

export default function App() {
  return (
    <ErrorBoundary>
      <AppSettingsProvider>
        <RouterProvider router={router} />
      </AppSettingsProvider>
    </ErrorBoundary>
  );
}
