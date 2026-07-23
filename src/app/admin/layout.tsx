/**
 * Admin Layout — wraps all /admin/* pages
 * If authenticated, shows full layout with sidebar + top header bar.
 * If not authenticated (e.g. on /admin/login), renders children directly.
 */

import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          <AdminHeader />
          {children}
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
