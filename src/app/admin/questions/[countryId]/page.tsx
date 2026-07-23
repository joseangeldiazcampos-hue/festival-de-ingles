"use client";

/**
 * Admin Questions Page — /admin/questions/[countryId]
 * Full CRUD for quiz questions within a country.
 * Includes AI review before saving a question.
 */

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  order: number;
}

interface Country {
  id: string;
  name: string;
  flagEmoji: string;
  slug: string;
}

interface AIReview {
  grammarIssues: string[];
  spellingIssues: string[];
  writingIssues: string[];
  correctAnswerCheck: string;
  overallSuggestion: string;
  isApproved: boolean;
}

interface QuestionForm {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  order: number;
}

const emptyForm: QuestionForm = {
  text: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A",
  order: 0,
};

const OPTIONS = ["A", "B", "C", "D"] as const;

export default function QuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const countryId = params.countryId as string;

  const [country, setCountry] = useState<Country | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [form, setForm] = useState<QuestionForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [aiReview, setAiReview] = useState<AIReview | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [countriesRes, questionsRes] = await Promise.all([
      fetch("/api/admin/countries"),
      fetch(`/api/admin/questions?countryId=${countryId}`),
    ]);
    const countriesData = await countriesRes.json();
    const questionsData = await questionsRes.json();
    const found = countriesData.find((c: Country) => c.id === countryId);
    setCountry(found ?? null);
    setQuestions(questionsData);
    setLoading(false);
  }, [countryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: questions.length + 1 });
    setAiReview(null);
    setShowModal(true);
  };

  const openEdit = (q: Question) => {
    setEditing(q);
    setForm({
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      order: q.order,
    });
    setAiReview(null);
    setShowModal(true);
  };

  const handleAIReview = async () => {
    if (!form.text || !form.optionA || !form.optionB || !form.optionC || !form.optionD) {
      alert("Please fill in all fields before requesting an AI review.");
      return;
    }
    setReviewing(true);
    setAiReview(null);
    try {
      const res = await fetch("/api/admin/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: form.text,
          optionA: form.optionA,
          optionB: form.optionB,
          optionC: form.optionC,
          optionD: form.optionD,
          correctOption: form.correctOption,
        }),
      });
      const data = await res.json();
      setAiReview(data);
    } catch {
      setAiReview({
        grammarIssues: [],
        spellingIssues: [],
        writingIssues: [],
        correctAnswerCheck: "",
        overallSuggestion: "Could not connect to AI review. You can save the question manually.",
        isApproved: true,
      });
    }
    setReviewing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/questions/${editing.id}` : "/api/admin/questions";

    const body = editing ? form : { ...form, countryId };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (res.ok) {
      setShowModal(false);
      fetchData();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to save question");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteConfirm(null);
      fetchData();
    } else {
      alert("Failed to delete question");
    }
  };

  const isFormValid = form.text && form.optionA && form.optionB && form.optionC && form.optionD;

  const totalIssues =
    (aiReview?.grammarIssues.length ?? 0) +
    (aiReview?.spellingIssues.length ?? 0) +
    (aiReview?.writingIssues.length ?? 0);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
        }}
      >
        <div>
          <button
            onClick={() => router.push("/admin/countries")}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: "0.85rem",
              padding: 0,
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            ← Back to Countries
          </button>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", margin: 0 }}>
            {country ? (
              <>
                {country.flagEmoji} {country.name} — Questions
              </>
            ) : (
              "Loading..."
            )}
          </h1>
          {country && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", alignItems: "center" }}>
              <code
                style={{
                  fontSize: "0.8rem",
                  background: "rgba(255,255,255,0.06)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "6px",
                  color: "#42a5f5",
                }}
              >
                /{country.slug}
              </code>
              <a
                href={`/${country.slug}`}
                target="_blank"
                style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}
              >
                Preview Quiz ↗
              </a>
            </div>
          )}
        </div>
        <button className="btn-admin btn-admin-primary" onClick={openCreate}>
          + Add Question
        </button>
      </div>

      {/* Questions table */}
      <div className="admin-card">
        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "2rem" }}>Loading...</p>
        ) : questions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>
              No questions yet. Add the first question for this country!
            </p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Correct Answer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => (
                <tr key={q.id}>
                  <td style={{ color: "rgba(255,255,255,0.4)", width: 40 }}>{i + 1}</td>
                  <td>
                    <div style={{ maxWidth: 480 }}>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: "0.875rem",
                          lineHeight: 1.5,
                          marginBottom: "0.25rem",
                        }}
                      >
                        {q.text}
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {OPTIONS.map((opt) => (
                          <span
                            key={opt}
                            style={{
                              fontSize: "0.7rem",
                              background:
                                opt === q.correctOption
                                  ? "rgba(46, 125, 50, 0.25)"
                                  : "rgba(255,255,255,0.04)",
                              border: `1px solid ${opt === q.correctOption ? "rgba(76,175,80,0.4)" : "rgba(255,255,255,0.08)"}`,
                              borderRadius: "6px",
                              padding: "0.15rem 0.5rem",
                              color:
                                opt === q.correctOption
                                  ? "#81c784"
                                  : "rgba(255,255,255,0.4)",
                            }}
                          >
                            {opt}: {opt === "A" ? q.optionA : opt === "B" ? q.optionB : opt === "C" ? q.optionC : q.optionD}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        background: "rgba(46, 125, 50, 0.25)",
                        border: "1px solid rgba(76,175,80,0.4)",
                        borderRadius: "8px",
                        padding: "0.35rem 0.75rem",
                        color: "#81c784",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      ✓ Option {q.correctOption}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn-admin btn-admin-ghost"
                        onClick={() => openEdit(q)}
                        style={{ fontSize: "0.8rem" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-admin btn-admin-danger"
                        onClick={() => setDeleteConfirm(q.id)}
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
        )}
      </div>

      {/* Question Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 1.5rem", color: "white", fontSize: "1.2rem", fontWeight: 700 }}>
              {editing ? "Edit Question" : "Add Question"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Question text */}
              <div>
                <label className="admin-label">Question Text *</label>
                <textarea
                  className="admin-input"
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  placeholder="Enter the question..."
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Options grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {OPTIONS.map((opt) => (
                  <div key={opt}>
                    <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "6px",
                          background:
                            form.correctOption === opt ? "#1565c0" : "rgba(255,255,255,0.1)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {opt}
                      </span>
                      Option {opt} {form.correctOption === opt && "✓ (Correct)"}
                    </label>
                    <input
                      className="admin-input"
                      value={form[`option${opt}` as keyof QuestionForm] as string}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [`option${opt}`]: e.target.value }))
                      }
                      placeholder={`Option ${opt}...`}
                    />
                  </div>
                ))}
              </div>

              {/* Correct answer */}
              <div>
                <label className="admin-label">Correct Answer *</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, correctOption: opt }))}
                      style={{
                        padding: "0.5rem 1.25rem",
                        borderRadius: "10px",
                        border: "2px solid",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        transition: "all 0.2s",
                        borderColor: form.correctOption === opt ? "#42a5f5" : "rgba(255,255,255,0.12)",
                        background: form.correctOption === opt ? "rgba(21,101,192,0.35)" : "transparent",
                        color: form.correctOption === opt ? "#42a5f5" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Review */}
              <div>
                <button
                  type="button"
                  className="btn-admin btn-admin-ghost"
                  onClick={handleAIReview}
                  disabled={reviewing || !isFormValid}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                >
                  {reviewing ? (
                    <>⏳ Reviewing with AI...</>
                  ) : (
                    <>🤖 AI Grammar & Quality Review</>
                  )}
                </button>

                {aiReview && (
                  <div className={`ai-review-panel ${aiReview.isApproved && totalIssues === 0 ? "ai-approved" : ""}`}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.75rem",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: aiReview.isApproved && totalIssues === 0 ? "#81c784" : "#ffb74d",
                      }}
                    >
                      {aiReview.isApproved && totalIssues === 0 ? "✅ Approved" : "⚠️ Issues Found"}
                    </div>

                    {aiReview.grammarIssues.length > 0 && (
                      <div style={{ marginBottom: "0.5rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>
                          GRAMMAR
                        </div>
                        <ul className="ai-issue-list">
                          {aiReview.grammarIssues.map((issue, i) => (
                            <li key={i} className="ai-issue-item">
                              <span>•</span> {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiReview.spellingIssues.length > 0 && (
                      <div style={{ marginBottom: "0.5rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>
                          SPELLING
                        </div>
                        <ul className="ai-issue-list">
                          {aiReview.spellingIssues.map((issue, i) => (
                            <li key={i} className="ai-issue-item">
                              <span>•</span> {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiReview.writingIssues.length > 0 && (
                      <div style={{ marginBottom: "0.5rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>
                          WRITING
                        </div>
                        <ul className="ai-issue-list">
                          {aiReview.writingIssues.map((issue, i) => (
                            <li key={i} className="ai-issue-item">
                              <span>•</span> {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiReview.correctAnswerCheck && (
                      <div style={{ marginBottom: "0.5rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>
                          CORRECT ANSWER
                        </div>
                        <p className="ai-issue-item" style={{ margin: 0 }}>{aiReview.correctAnswerCheck}</p>
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.6rem 0.75rem",
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.7)",
                        fontStyle: "italic",
                      }}
                    >
                      💡 {aiReview.overallSuggestion}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button className="btn-admin btn-admin-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="btn-admin btn-admin-primary"
                onClick={handleSave}
                disabled={saving || !isFormValid}
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Question"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}>⚠️</div>
            <h2 style={{ color: "white", textAlign: "center", margin: "0 0 0.5rem", fontSize: "1.1rem" }}>
              Delete Question?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", fontSize: "0.875rem" }}>
              This action cannot be undone.
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
