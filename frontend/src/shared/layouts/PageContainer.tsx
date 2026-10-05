// SPDX-License-Identifier: MPL-2.0

import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return <div className={`mx-auto h-full w-[90%] overflow-auto ${className}`}>{children}</div>;
}
