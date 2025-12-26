import { useEffect, useState } from "react";
import api from "../services/api";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ======================
  // GET PROFILE
  // ======================
  useEffect(() => {
    Promise.all([
      api.get("/student/profile/"),
      api.get("/student/enrollments/"),
    ])
      .then(([profileRes, billsRes]) => {
        setProfile(profileRes.data);
        setBills(billsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load profile");
        setLoading(false);
      });
  }, []);

  // ======================
  // HANDLE CHANGE
  // ======================
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ======================
  // SAVE PROFILE
  // ======================
  const handleSave = async () => {
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
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-10">

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white shadow rounded-lg p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">My Profile</h2>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-indigo-600 hover:text-indigo-800"
              title="Edit Profile"
            >
              <FiEdit2 size={20} />
            </button>
          )}
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        <Field label="Email" value={profile.email} disabled />

        <Field
          label="Full Name"
          name="full_name"
          value={profile.full_name}
          onChange={handleChange}
          disabled={!editing}
        />

        <Field
          label="Phone"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          disabled={!editing}
        />

        <Field
          label="College Name"
          name="college_name"
          value={profile.college_name}
          onChange={handleChange}
          disabled={!editing}
        />

        <Field
          label="Course Name"
          name="course_name"
          value={profile.course_name}
          onChange={handleChange}
          disabled={!editing}
        />

        <Field
          label="GitHub URL"
          name="github_url"
          value={profile.github_url}
          onChange={handleChange}
          disabled={!editing}
        />

        {editing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded flex items-center gap-2"
            >
              <FiCheck /> Save
            </button>

            <button
              onClick={() => setEditing(false)}
              className="border px-5 py-2 rounded flex items-center gap-2"
            >
              <FiX /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* ================= BILLS SECTION ================= */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Bills</h2>

        {bills.length === 0 ? (
          <p>No bills available</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Course</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Payment Date</th>
                <th className="border px-4 py-2">Payment Method</th>
              </tr>
            </thead>

            <tbody>
              {bills.map((bill, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {bill.course_title}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {bill.status}
                  </td>
                  <td className="border px-4 py-2">
                    {bill.payment_date || "-"}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {bill.payment_method}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

/* ======================
   Reusable Field
====================== */
function Field({ label, value, name, onChange, disabled }) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded px-3 py-2 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}
