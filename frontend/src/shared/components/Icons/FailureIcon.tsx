// SPDX-License-Identifier: MPL-2.0

export default function FailureIcon() {
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
        <path d="M24 24 40 40M40 24 24 40" />
      </svg>
    </span>
  );
}
