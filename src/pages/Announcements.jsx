import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/announcements/`)
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading announcements…
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Announcements
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Important updates from the admin
        </p>
      </div>

      {/* ================= LIST ================= */}
      {announcements.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-gray-500">
          No announcements available.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="bg-white border rounded-xl shadow-sm overflow-hidden"
            >
              {/* HEADER */}
              <button
                onClick={() => toggle(a.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900">
                  {a.subject}
                </span>

                <span className="text-gray-400 text-sm">
                  {openId === a.id ? "▲" : "▼"}
                </span>
              </button>

              {/* BODY */}
              {openId === a.id && (
                <div className="px-6 py-4 border-t bg-gray-50 space-y-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {a.message}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
                    <span>
                      🕒 {new Date(a.created_at).toLocaleString()}
                    </span>
                    <span>
                      👤 Posted by{" "}
                      <b className="text-gray-700">
                        {a.created_by}
                      </b>
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
