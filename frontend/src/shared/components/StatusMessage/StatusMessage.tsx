// SPDX-License-Identifier: MPL-2.0

import { cn } from "@/shared/utils/cn";
import { FailureIcon, SuccessIcon } from "../Icons";

interface StatusMessageProps {
  status: "success" | "failure";
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function StatusMessage({ status, title, children, className }: StatusMessageProps) {
  return (
    <div className={cn("rounded-md border p-4", className)}>
      <div className={cn("text-center", status === "success" ? "text-accent-3" : "text-failure")}>
        <div className="mb-2 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
          {status === "success" ? <SuccessIcon /> : <FailureIcon />}
          <h2 className="text-3xl">{title}</h2>
        </div>

        {children}
      </div>
    </div>
  );
}
