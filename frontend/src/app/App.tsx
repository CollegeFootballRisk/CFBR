import { RouterProvider } from "react-router-dom";

import AppSettingsProvider from "./AppSettingsProvider";
import { router } from "./routes";

export default function App() {
  return (
    <AppSettingsProvider>
      <RouterProvider router={router} />
    </AppSettingsProvider>
  );
}
