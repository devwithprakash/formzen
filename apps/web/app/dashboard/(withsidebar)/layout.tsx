import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex max-w-full overflow-x-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 max-w-full">
        <DashboardHeader />

        <main className="flex-1 p-6 w-full max-w-full min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
