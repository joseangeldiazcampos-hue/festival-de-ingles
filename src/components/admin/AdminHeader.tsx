"use client";

/**
 * Admin Top Header Bar — shown on all admin pages
 * Features a Mobile Hamburger Menu Drawer + Sign Out button.
 * Fully responsive across 320px to 4K displays.
 */

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/countries", label: "Countries & Quizzes", icon: "🌍" },
  { href: "/admin/attempts", label: "Submissions", icon: "📋" },
  { href: "/admin/winners", label: "Winners ⭐", icon: "🏆" },
];

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <>
      <header className="admin-header-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Hamburger button for mobile screens */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            ☰
          </button>

          <div className="header-logo-icon">🎓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", letterSpacing: "-0.2px" }}>
              Admin Panel
            </div>
            <div className="header-subtitle-text" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
              Violence Is Never The Answer
            </div>
          </div>

          <div className="header-admin-badge desktop-badge-only">
            <span className="badge-pulse-dot" />
            Administrator
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/" target="_blank" className="btn-header-ghost">
            <span>🌐</span>
            <span className="btn-text-desktop">View Site</span>
          </Link>

          {/* Glowing Pill Sign Out Button */}
          <button className="btn-signout-premium" onClick={handleSignOut}>
            <span className="btn-signout-icon">🚪</span>
            <span className="btn-text-desktop">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🎓</span>
                <span style={{ fontWeight: 800, color: "white", fontSize: "1.1rem" }}>English Festival</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer", padding: "0.2rem 0.5rem" }}
              >
                ✕
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`admin-nav-link${pathname === item.href || pathname.startsWith(item.href + "/") ? " active" : ""}`}
                  style={{ padding: "0.9rem 1rem", fontSize: "1.05rem" }}
                >
                  <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="admin-nav-link"
                style={{ padding: "0.9rem 1rem", fontSize: "1.05rem" }}
              >
                <span>🌐</span>
                <span>View Quiz Site</span>
              </Link>

              <button
                className="btn-signout-premium"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                style={{ width: "100%", padding: "0.85rem 1rem", fontSize: "1rem", justifyContent: "center" }}
              >
                <span className="btn-signout-icon">🚪</span>
                <span>Sign Out / Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
