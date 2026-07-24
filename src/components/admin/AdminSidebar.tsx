"use client";

/**
 * Admin Sidebar — navigation component for the admin panel
 */

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/grade-groups", label: "Grade Groups", icon: "🎓" },
  { href: "/admin/attempts", label: "Submissions", icon: "📋" },
  { href: "/admin/winners", label: "Winners ⭐", icon: "🏆" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>🎓</div>
        <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "white", lineHeight: 1.3 }}>
          English Festival
        </div>
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.2rem" }}>
          Admin Panel
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`admin-nav-link${pathname === item.href || pathname.startsWith(item.href + "/") ? " active" : ""}`}
          >
            <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Bottom actions */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <a
          href="/"
          target="_blank"
          className="admin-nav-link"
          style={{ fontSize: "0.85rem" }}
        >
          <span>🌐</span>
          <span>View Site</span>
        </a>
        <button
          className="btn-signout-premium"
          onClick={handleSignOut}
          style={{ width: "100%", justifyContent: "center" }}
        >
          <span style={{ fontSize: "1rem" }}>🚪</span>
          <span>Sign Out / Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
