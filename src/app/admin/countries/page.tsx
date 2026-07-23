"use client";

/**
 * Admin Countries Page — /admin/countries
 * Full CRUD for countries + instant QR Code generator & download for all countries.
 * Each country links to its questions management page for editing/adding/deleting questions.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

interface Country {
  id: string;
  name: string;
  slug: string;
  flagEmoji: string;
  monument: string;
  isActive: boolean;
  order: number;
  _count: { questions: number; attempts: number };
}

interface FormData {
  name: string;
  slug: string;
  flagEmoji: string;
  monument: string;
  order: number;
}

const emptyForm: FormData = { name: "", slug: "", flagEmoji: "", monument: "", order: 0 };

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Country | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // QR Code Modal State
  const [qrCountry, setQrCountry] = useState<Country | null>(null);
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const fetchCountries = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/countries");
    const data = await res.json();
    setCountries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c: Country) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, flagEmoji: c.flagEmoji, monument: c.monument, order: c.order });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/countries/${editing.id}` : "/api/admin/countries";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (res.ok) {
      const savedCountry = await res.json();
      setShowModal(false);
      fetchCountries();
      // Auto open QR modal for new countries so the admin gets the QR immediately!
      if (!editing && savedCountry?.slug) {
        setQrCountry(savedCountry);
      }
    } else {
      const data = await res.json();
      alert(data.error || "Failed to save country");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/countries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteConfirm(null);
      fetchCountries();
    } else {
      alert("Failed to delete country");
    }
  };

  const handleToggleActive = async (c: Country) => {
    await fetch(`/api/admin/countries/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    fetchCountries();
  };

  const downloadQR = () => {
    if (!qrRef.current || !qrCountry) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `QR_${qrCountry.slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyQuizLink = () => {
    if (!qrCountry) return;
    const fullUrl = `${baseUrl}/${qrCountry.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", margin: 0 }}>
            Countries & Quizzes
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
            Manage quiz countries, edit questions, and get QR codes for students
          </p>
        </div>
        <button className="btn-admin btn-admin-primary" onClick={openCreate}>
          + Add Country
        </button>
      </div>

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "2rem" }}>
            Loading...
          </p>
        ) : countries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌍</div>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No countries yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Slug / URL</th>
                <th>Questions</th>
                <th>Submissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.4rem" }}>{c.flagEmoji}</span>
                      <div>
                        <div style={{ fontWeight: 600, color: "white" }}>{c.name}</div>
                        {c.monument && (
                          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                            📍 {c.monument}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <code
                        style={{
                          fontSize: "0.8rem",
                          background: "rgba(255,255,255,0.06)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "6px",
                          color: "#42a5f5",
                        }}
                      >
                        /{c.slug}
                      </code>
                      <a
                        href={`/${c.slug}`}
                        target="_blank"
                        style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}
                      >
                        ↗
                      </a>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c._count.questions}</td>
                  <td>{c._count.attempts}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={c.isActive}
                          onChange={() => handleToggleActive(c)}
                        />
                        <span className="toggle-slider" />
                      </label>
                      <span className={`badge ${c.isActive ? "badge-active" : "badge-inactive"}`}>
                        {c.isActive ? "Active" : "Off"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {/* QR Code button */}
                      <button
                        className="btn-admin"
                        onClick={() => setQrCountry(c)}
                        style={{
                          background: "rgba(255, 214, 0, 0.15)",
                          color: "#ffd600",
                          border: "1px solid rgba(255, 214, 0, 0.3)",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        📱 QR Code
                      </button>

                      {/* Manage Questions button */}
                      <Link
                        href={`/admin/questions/${c.id}`}
                        className="btn-admin btn-admin-ghost"
                        style={{ textDecoration: "none", display: "inline-block", fontSize: "0.8rem" }}
                      >
                        📝 Questions
                      </Link>

                      {/* Edit Country button */}
                      <button
                        className="btn-admin btn-admin-ghost"
                        onClick={() => openEdit(c)}
                        style={{ fontSize: "0.8rem" }}
                      >
                        ✏️ Edit
                      </button>

                      {/* Delete button */}
                      <button
                        className="btn-admin btn-admin-danger"
                        onClick={() => setDeleteConfirm(c.id)}
                        style={{ fontSize: "0.8rem" }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR CODE MODAL */}
      {qrCountry && (
        <div className="modal-overlay" onClick={() => setQrCountry(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              {qrCountry.flagEmoji}
            </div>
            <h2 style={{ margin: "0 0 0.25rem", color: "white", fontSize: "1.3rem", fontWeight: 800 }}>
              {qrCountry.name} — QR Code
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", margin: "0 0 1.25rem" }}>
              Scan with smartphone camera to open quiz directly
            </p>

            {/* QR Canvas Container */}
            <div
              ref={qrRef}
              style={{
                background: "white",
                padding: "1.25rem",
                borderRadius: "16px",
                display: "inline-block",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                marginBottom: "1.25rem",
              }}
            >
              <QRCodeCanvas
                value={`${baseUrl}/${qrCountry.slug}`}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* URL Input & Controls */}
            <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
              <label className="admin-label">Base URL (Domain)</label>
              <input
                className="admin-input"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://festival-de-ingles.onrender.com"
                style={{ fontSize: "0.85rem" }}
              />
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem" }}>
                Target: <code style={{ color: "#42a5f5" }}>{baseUrl}/{qrCountry.slug}</code>
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                className="btn-admin"
                onClick={copyQuizLink}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {copied ? "✓ Copied!" : "📋 Copy Link"}
              </button>
              <button
                className="btn-admin btn-admin-primary"
                onClick={downloadQR}
                style={{ fontWeight: 700 }}
              >
                📥 Download PNG
              </button>
            </div>

            <button
              onClick={() => setQrCountry(null)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "0.85rem",
                marginTop: "1.25rem",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 1.5rem", color: "white", fontSize: "1.25rem", fontWeight: 700 }}>
              {editing ? "Edit Country" : "Add Country"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="admin-label">Country Name *</label>
                  <input
                    className="admin-input"
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm((f) => ({
                        ...f,
                        name,
                        slug: editing ? f.slug : slugify(name),
                      }));
                    }}
                    placeholder="e.g. Canada"
                  />
                </div>
                <div>
                  <label className="admin-label">URL Slug *</label>
                  <input
                    className="admin-input"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    placeholder="e.g. canada"
                  />
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem" }}>
                    URL: {baseUrl}/{form.slug || "..."}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                <div>
                  <label className="admin-label">Flag Emoji</label>
                  <input
                    className="admin-input"
                    value={form.flagEmoji}
                    onChange={(e) => setForm((f) => ({ ...f, flagEmoji: e.target.value }))}
                    placeholder="🇨🇦"
                    style={{ fontSize: "1.5rem" }}
                  />
                </div>
                <div>
                  <label className="admin-label">Monument / Landmark</label>
                  <input
                    className="admin-input"
                    value={form.monument}
                    onChange={(e) => setForm((f) => ({ ...f, monument: e.target.value }))}
                    placeholder="e.g. CN Tower, Toronto"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Display Order</label>
                <input
                  className="admin-input"
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  style={{ maxWidth: 120 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button className="btn-admin btn-admin-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="btn-admin btn-admin-primary"
                onClick={handleSave}
                disabled={saving || !form.name || !form.slug}
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Country & Generate QR"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}>⚠️</div>
            <h2 style={{ color: "white", textAlign: "center", margin: "0 0 0.5rem", fontSize: "1.1rem" }}>
              Delete Country?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", fontSize: "0.875rem" }}>
              This will also delete all questions and submissions for this country. This action cannot be
              undone.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem" }}>
              <button className="btn-admin btn-admin-ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-admin btn-admin-danger" onClick={() => handleDelete(deleteConfirm)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
