"use client";

import { FC, useCallback } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  user: {
    email?: string | null;
    name?: string | null;
  };
}

const AdminHeader: FC<AdminHeaderProps> = ({ user }) => {
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  }, [router]);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {user.name || user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export { AdminHeader };