import { useEffect, useState } from "react";
import api from "../services/api";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/student/profile/"),
      api.get("/student/enrollments/"),
    ])
      .then(([profileRes, billsRes]) => {
        setProfile(profileRes.data);
        setBills(billsRes.data);
        setError("");
      })
      .catch(() => {
        setError("Unable to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.patch("/student/profile/", {
        full_name: profile.full_name,
        phone: profile.phone,
        college_name: profile.college_name,
        course_name: profile.course_name,
        github_url: profile.github_url,
      });

      setProfile(res.data);
      setEditing(false);
      setSuccess("Profile updated successfully");
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* ================= STATES ================= */

  if (loading) {
    return <p className="p-6 text-gray-500">Loading profile…</p>;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-gray-500">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Student Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Manage your profile & enrollments
          </p>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* ================= PROFILE CARD ================= */}
      <section className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">
          Personal Information
        </h2>

        {success && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 px-4 py-2 rounded">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Email" value={profile.email} disabled />

          <Field
            label="Full Name"
            name="full_name"
            value={profile.full_name}
            editable={editing}
            onChange={handleChange}
          />

          <Field
            label="Phone"
            name="phone"
            value={profile.phone}
            editable={editing}
            onChange={handleChange}
          />

          <Field
            label="College"
            name="college_name"
            value={profile.college_name}
            editable={editing}
            onChange={handleChange}
          />

          {/* <Field
            label="Course"
            name="course_name"
            value={profile.course_name}
            editable={editing}
            onChange={handleChange}
          /> */}

          <Field
            label="GitHub"
            name="github_url"
            value={profile.github_url}
            editable={editing}
            onChange={handleChange}
          />
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Account created on{" "}
          {new Date(profile.created_at).toDateString()}
        </p>

        {editing && (
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>

            <button
              onClick={() => setEditing(false)}
              className="border px-5 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      {/* ================= ENROLLMENTS ================= */}
      <section className="bg-white border rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Enrollments & Payments
          </h2>
        </div>

        {bills.length === 0 ? (
          <p className="px-6 py-6 text-sm text-gray-500">
            No enrollment records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Course</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Payment Date</th>
                  <th className="px-6 py-3 text-left">Method</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {bills.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">
                      {b.course_title}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-6 py-3">
                      {b.payment_date || "—"}
                    </td>
                    <td className="px-6 py-3 capitalize">
                      {b.payment_method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Field({ label, value, name, editable, onChange, disabled }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>

      {editable && !disabled ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <div className="text-sm text-gray-900 bg-gray-50 border rounded-md px-3 py-2">
          {value || "—"}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
