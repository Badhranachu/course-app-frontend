import { useEffect, useState } from "react";
import api from "../services/api";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "closed", label: "Closed" },
];

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ===============================
  // FETCH TICKETS
  // ===============================
  const fetchTickets = async () => {
  try {
    setLoading(true);
    const res = await api.get("/support/my-tickets/");

    // ✅ SAFETY: ensure array
    const data = Array.isArray(res.data) ? res.data : [];

    setTickets(data);
    setFiltered(data);
  } catch (err) {
    console.error("Ticket load error:", err);
    // ❌ REMOVE alert
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTickets();
  }, []);

  // ===============================
  // FILTER LOGIC
  // ===============================
  useEffect(() => {
    if (activeTab === "all") {
      setFiltered(tickets);
    } else {
      setFiltered(
        tickets.filter((t) => t.status === activeTab)
      );
    }
  }, [activeTab, tickets]);

  // ===============================
  // CREATE TICKET
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      alert("All fields required");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/support/create/", {
        subject,
        message,
      });

      setSubject("");
      setMessage("");
      setShowForm(false);
      fetchTickets();
    } catch {
      alert("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Support</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Raise Ticket
        </button>
      </div>

      {/* ================= FILTER TABS ================= */}
      <div className="flex gap-3">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium
              ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 text-slate-700"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TICKETS LIST ================= */}
      {loading ? (
        <p>Loading tickets...</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-500">No tickets found</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">{t.subject}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium
                    ${
                      t.status === "open"
                        ? "bg-yellow-100 text-yellow-700"
                        : t.status === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }
                  `}
                >
                  {t.status.replace("_", " ")}
                </span>
              </div>

              <p className="text-slate-600 text-sm">
                {t.message}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Created: {new Date(t.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-semibold">
              Raise Support Ticket
            </h2>

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <textarea
              placeholder="Describe your issue"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded-lg p-2 h-28"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
