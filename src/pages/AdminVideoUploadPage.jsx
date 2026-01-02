import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "";

export default function AdminVideoUploadPage() {
  const [step, setStep] = useState("login");
  const [phase, setPhase] = useState("idle");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courses, setCourses] = useState([]);

  const pollRef = useRef(null);

  useEffect(() => {
    return () => pollRef.current && clearInterval(pollRef.current);
  }, []);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login/`, { email, password });
      const { token, user } = res.data;

      if (user.role !== "admin") {
        setStep("denied");
        return;
      }

      localStorage.setItem("token", token);

      const courseRes = await axios.get(`${API}/admin-courses/`, {
        headers: { Authorization: `Token ${token}` },
      });

      setCourses(courseRes.data);
      setStep("upload");
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // UPLOAD
  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const form = e.target;
    const formData = new FormData();
    formData.append("course", form.course.value);
    formData.append("title", form.title.value);
    formData.append("description", form.description.value);
    formData.append("source_video", form.video.files[0]);

    try {
      setPhase("uploading");
      setUploadProgress(0);

      const res = await axios.post(`${API}/admin-videos/upload/`, formData, {
        headers: { Authorization: `Token ${token}` },
        onUploadProgress: (e) =>
          e.total && setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      });

      setPhase("processing");
      pollStatus(res.data.video_id);
    } catch {
      setPhase("failed");
    }
  };

  // STATUS POLLING
  const pollStatus = (videoId) => {
    const token = localStorage.getItem("token");

    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(
          `${API}/admin-videos/${videoId}/status/`,
          { headers: { Authorization: `Token ${token}` } }
        );

        if (res.data.status === "ready") {
          clearInterval(pollRef.current);
          setPhase("done");
        }

        if (res.data.status === "failed") {
          clearInterval(pollRef.current);
          setPhase("failed");
        }
      } catch {
        clearInterval(pollRef.current);
        setPhase("failed");
      }
    }, 3000);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      {step === "login" && (
        <form onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <br /><br />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <br /><br />
          <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
      )}

      {step === "denied" && <h3 style={{ color: "red" }}>❌ Admin only</h3>}

      {step === "upload" && (
        <form onSubmit={handleUpload}>
          <h2>Upload Video</h2>
          <input name="title" placeholder="Title" required /><br /><br />
          <textarea name="description" placeholder="Description" /><br /><br />

          <select name="course" required>
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select><br /><br />

          <input type="file" name="video" accept="video/mp4" required /><br /><br />

          {phase === "uploading" && (
            <>
              <p>Uploading {uploadProgress}%</p>
              <progress value={uploadProgress} max="100" />
            </>
          )}

          {phase === "processing" && <p>⏳ Processing video...</p>}
          {phase === "done" && <p style={{ color: "green" }}>✅ Video ready</p>}
          {phase === "failed" && <p style={{ color: "red" }}>❌ Failed</p>}

          <button disabled={phase === "uploading" || phase === "processing"}>Upload</button>
        </form>
      )}
    </div>
  );
}
