import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
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
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  // TODO: Implement PayloadCMS session check
  // For now, we'll use a temporary user object
  const user = {
    email: "admin@example.com",
    name: "Admin User"
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader user={user} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
