// SPDX-License-Identifier: MPL-2.0

import { Component, type ErrorInfo, type ReactNode } from "react";

import { Link } from "@/shared/components/Link";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled application error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-lg text-center">
            <p className="text-sm font-medium uppercase tracking-wider">Something went wrong</p>

            <h1 className="mt-2 text-3xl tracking-tight">CFBR ran into an unexpected error.</h1>

            <p className="mt-4">Page could not be displayed. Try reloading or return to home.</p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex rounded-md px-4 py-2 text-sm font-medium"
              >
                Reload
              </button>

              <Link to="/" className="inline-flex rounded-md px-4 py-2 text-sm font-medium">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
