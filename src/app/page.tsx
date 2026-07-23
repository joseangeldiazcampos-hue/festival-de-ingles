/**
 * Home page — redirects to /admin/dashboard if admin, or shows a platform info page.
 * Students access the site via /<country-slug> directly.
 */

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-animated" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "2rem", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🕊️</div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "white", marginBottom: "0.5rem" }}>
          Violence Is Never The Answer
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2rem" }}>
          English Festival Quiz Platform
        </p>
        <Link
          href="/admin/login"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #1565c0, #0d47a1)",
            color: "white",
            padding: "0.85rem 2rem",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Admin Panel →
        </Link>
      </div>
    </div>
  );
}
