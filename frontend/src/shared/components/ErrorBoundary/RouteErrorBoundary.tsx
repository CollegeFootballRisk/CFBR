// SPDX-License-Identifier: MPL-2.0

import { useRouteError } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";

function ThrowRouteError({ error }: { error: unknown }): never {
  throw error instanceof Error ? error : new Error(String(error));
}

export function RouteErrorBoundary() {
  const error = useRouteError();

  return (
    <ErrorBoundary>
      <ThrowRouteError error={error} />
    </ErrorBoundary>
  );
}
