import type { ReactNode } from "react";

interface TopbarProps {
  title: string;
  children?: ReactNode;
}

export default function Topbar({ title, children }: TopbarProps) {
  return (
    <div className="bg-bg-2 border-b border-white/5 px-4 md:px-7 py-3 md:py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="md:hidden text-lg font-bold tracking-tight">
          Life<span className="text-accent-2">OS</span>
        </span>
        <h1 className="text-base md:text-xl font-semibold tracking-tight">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
