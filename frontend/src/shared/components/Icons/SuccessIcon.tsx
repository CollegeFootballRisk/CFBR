// SPDX-License-Identifier: MPL-2.0

export default function SuccessIcon() {
  return (
    <span className="inline-block h-12 w-12 text-current">
      <svg
        viewBox="0 0 64 64"
        className="h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="24" />
        <path d="M20 32 28 40 44 24" />
      </svg>
    </span>
  );
}
