import AdminSidebar from "@/components/layout/Sidebar";
import AdminGuard from "./AdminGuard";

export const metadata = {
  title: "Admin Dashboard | IRA Fashion",
  description: "IRA Fashion admin panel — manage products, orders, customers and analytics.",
};

export default function DashboardLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex h-screen bg-[#F9F9F9] overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
