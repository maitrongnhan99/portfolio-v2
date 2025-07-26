import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/middleware";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session || session.user?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={session.user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}