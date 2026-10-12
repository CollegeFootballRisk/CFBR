// SPDX-License-Identifier: MPL-2.0

import { Link } from "@/shared/components/Link";

export type ErrorVariant =
  | "bad-request"
  | "unauthorized"
  | "forbidden"
  | "not-found"
  | "rate-limited"
  | "server-error"
  | "bad-gateway"
  | "unavailable"
  | "unknown";

interface ErrorPageProps {
  variant?: ErrorVariant;
}

const errorMessages: Record<ErrorVariant, { title: string; description: string }> = {
  "bad-request": {
    title: "Bad Request",
    description: "The request could not be understood.",
  },
  unauthorized: {
    title: "Unauthorized",
    description: "You need to sign in to access this page.",
  },
  forbidden: {
    title: "Access Denied",
    description: "You don't have permission to access this page.",
  },
  "not-found": {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or may have been moved.",
  },
  "rate-limited": {
    title: "Too Many Requests",
    description: "Please wait a moment before trying again.",
  },
  "server-error": {
    title: "Something Went Wrong",
    description: "An unexpected server error occurred. Please try again later.",
  },
  "bad-gateway": {
    title: "Connection Problem",
    description: "We couldn't get a valid response from the server.",
  },
  unavailable: {
    title: "Service Unavailable",
    description: "The service is temporarily unavailable. Please try again later.",
  },
  unknown: {
    title: "Something Went Wrong",
    description: "An unexpected problem occurred.",
  },
};

export function ErrorPage({ variant = "not-found" }: ErrorPageProps) {
  const { title, description } = errorMessages[variant];

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-8 text-center">
      <h1 className="font-bold text-3xl">This page has been Temped...</h1>

      <h2 className="mt-3 font-semibold text-xl">{title}</h2>

      <p className="mt-3 max-w-md">{description}</p>

      <div className="mt-6">
        <img
          src="/images/TempeSkyline.jpg"
          alt="Tempe, Arizona skyline"
          className="mx-auto max-w-full"
        />

        <p className="mt-2 text-sm">
          <i>
            Tempe, Arizona (CC-BY-SA 3.0:{" "}
            <Link external href="https://en.wikipedia.org/wiki/User:NickSchweitzer">
              Schwnj
            </Link>{" "}
            at{" "}
            <Link external href="https://commons.wikimedia.org/wiki/File:Tempeskyline3.jpg">
              Wikipedia
            </Link>
            )
          </i>
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Link to="/">Back to Home</Link>
        <Link to="/bugs">Report a Problem</Link>
      </div>
    </div>
  );
}
