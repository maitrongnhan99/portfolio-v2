"use client";

import { FC, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  House, 
  FileText,
  ChartBar,
  Gear 
} from "@phosphor-icons/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: House },
  { name: "Knowledge Assistant", href: "/dashboard/assistant", icon: FileText },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBar },
  { name: "Settings", href: "/dashboard/settings", icon: Gear },
];

const AdminSidebar: FC = () => {
  const pathname = usePathname();

  const isActiveRoute = useMemo(() => {
    return (href: string) => {
      return pathname === href || 
        (href !== "/dashboard" && pathname.startsWith(href));
    };
  }, [pathname]);

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                )}
              >
                <item.icon
                  className={cn(
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-accent-foreground",
                    "mr-3 flex-shrink-0 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export { AdminSidebar };