import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "";

export default function AdminVideoUploadPage() {
  const [step, setStep] = useState("login");
  const [courses, setCourses] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  // -------------------------
  // LOGIN
  // -------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/login/`, { email, password });
      const { token, user } = res.data;

      if (user.role !== "admin") return alert("Access denied");

      localStorage.setItem("token", token);

      const c = await axios.get(`${API}/admin-courses/`, {
        headers: { Authorization: `Token ${token}` },
      });

      setCourses(c.data);
      setStep("upload");
    } catch {
      alert("Login failed");
    }
  };

  // -------------------------
  // ZIP UPLOAD
  // -------------------------
  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const form = e.target;

    const zip = form.zip.files[0];
    if (!zip) return alert("Select ZIP file");

    const fd = new FormData();
    fd.append("zip", zip);
    fd.append("title", form.title.value);
    fd.append("description", form.description.value);
    fd.append("course", form.course.value);

    try {
      setStatus("Uploading...");
      await axios.post(`${API}/admin-videos/upload-zip/`, fd, {
        headers: { Authorization: `Token ${token}` },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      setStatus("✅ Video ready");
    } catch {
      setStatus("❌ Upload failed");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      {step === "login" && (
        <form onSubmit={handleLogin}>
          <h3>Admin Login</h3>
          <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <br /><br />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <br /><br />
          <button>Login</button>
        </form>
      )}

      {step === "upload" && (
        <form onSubmit={handleUpload}>
          <h3>Upload HLS ZIP</h3>

          <input name="title" placeholder="Title" required /><br /><br />
          <textarea name="description" placeholder="Description" /><br /><br />

          <select name="course" required>
            <option value="">Select course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select><br /><br />

          <input type="file" name="zip" accept=".zip" required /><br /><br />

          {progress > 0 && <progress value={progress} max="100" />}
          <p>{status}</p>

          <button>Upload</button>
        </form>
      )}
    </div>
  );
}
