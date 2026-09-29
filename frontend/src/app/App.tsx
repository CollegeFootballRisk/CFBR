import { RouterProvider } from "react-router-dom";

import { router } from "./routes";
import AppSettingsProvider from "./AppSettingsProvider";

export default function App() {
  return (
    <AppSettingsProvider>
      <RouterProvider router={router} />
    </AppSettingsProvider>
  );
}
