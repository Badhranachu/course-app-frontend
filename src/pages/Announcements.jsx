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
      .catch((err) => {
        console.error("Failed to load announcements", err);
        setLoading(false);
      });
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return <p>Loading announcements...</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2>📢 Announcements</h2>

      {announcements.length === 0 && (
        <p>No announcements available</p>
      )}

      {announcements.map((a) => (
        <div
          key={a.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            marginBottom: "10px",
            padding: "12px",
          }}
        >
          {/* SUBJECT */}
          <div
            onClick={() => toggle(a.id)}
            style={{
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{a.subject}</span>
            <span>{openId === a.id ? "▲" : "▼"}</span>
          </div>

          {/* DROPDOWN CONTENT */}
          {openId === a.id && (
            <div style={{ marginTop: "10px", color: "#444" }}>
              <p>{a.message}</p>

              <small>
                🕒 {new Date(a.created_at).toLocaleString()}
              </small>
              <br />
              <small>
                👤 Posted by: <b>{a.created_by}</b>
              </small>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
