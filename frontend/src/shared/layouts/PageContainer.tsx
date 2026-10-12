// SPDX-License-Identifier: MPL-2.0

import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return <div className={`mx-auto h-full w-[90%] overflow-auto pb-8 ${className}`}>{children}</div>;
}
