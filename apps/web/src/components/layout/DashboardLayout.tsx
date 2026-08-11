import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import type { NavKey, Teacher } from "../../types";

interface DashboardLayoutProps {
  children: ReactNode;
  active?: NavKey;
  onNavigate?: (key: NavKey) => void;
  breadcrumbs?: string[];
  teacher?: Teacher;
}

export default function DashboardLayout({
  children,
  active,
  onNavigate,
  breadcrumbs,
  teacher,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex bg-canopy-950 text-parchment-100">
      <Sidebar active={active} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar breadcrumbs={breadcrumbs} teacher={teacher} />
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}