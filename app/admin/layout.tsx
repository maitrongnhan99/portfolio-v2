import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { getAuthSession } from "@/lib/auth/middleware";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current pathname from headers
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Skip authentication check for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const session = await getAuthSession();

  if (!session || session.user?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader user={session.user} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
