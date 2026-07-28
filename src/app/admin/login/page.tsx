"use client";

/**
 * Admin Login Page — /admin/login
 * Single-password authentication for the admin panel.
 */

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Trap history on login screen so back button cannot re-enter admin panel
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fadeInUp">
        {/* Logo */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎓</div>
          <h1
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "white",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Admin Panel
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginTop: "0.4rem" }}>
            Violence Is Never The Answer — English Festival
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ textAlign: "left" }}>
            <label className="admin-label">Password</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                className="admin-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                style={{ paddingRight: "2.75rem", width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.25rem",
                  borderRadius: "6px",
                  transition: "color 0.2s ease, background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)")}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(198, 40, 40, 0.15)",
                border: "1px solid rgba(198, 40, 40, 0.4)",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                color: "#ef9a9a",
                fontSize: "0.875rem",
                textAlign: "left",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-start"
            disabled={loading || !password}
            style={{ marginTop: "0.5rem", opacity: loading || !password ? 0.6 : 1 }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p
          style={{
            marginTop: "1.5rem",
            color: "rgba(255,255,255,0.2)",
            fontSize: "0.75rem",
          }}
        >
          🔒 Secure admin access only
        </p>
      </div>
    </div>
  );
}
