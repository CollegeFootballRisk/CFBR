import { RouterProvider } from "react-router-dom";

import AppSettingsProvider from "./AppSettingsProvider";
import { router } from "./routes";

export default function App() {
  return (
    // TODO: Error boundary
    <AppSettingsProvider>
      <RouterProvider router={router} />
    </AppSettingsProvider>
  );
}
