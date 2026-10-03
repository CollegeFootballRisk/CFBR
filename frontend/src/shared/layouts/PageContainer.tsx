import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return <main className={`mx-auto h-full w-[90%] overflow-auto ${className}`}>{children}</main>;
}
