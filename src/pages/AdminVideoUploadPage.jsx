import { useState, useRef, useEffect } from "react";
import axios from "axios";

/**
 * Uses:
 *  VITE_API_BASE=/api
 *  Vite proxy for local
 */
const API = import.meta.env.VITE_API_BASE || "";

export default function AdminVideoUploadPage() {
  /**
   * step:
   * - login
   * - upload
   * - denied
   */
  const [step, setStep] = useState("login");

  /**
   * phase:
   * - idle
   * - uploading
   * - processing
   * - done
   * - failed
   */
  const [phase, setPhase] = useState("idle");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [courses, setCourses] = useState([]);

  const pollRef = useRef(null);

  // =========================
  // CLEANUP POLLING ON UNMOUNT
  // =========================
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login/`, {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);

      if (user.role !== "admin") {
        setStep("denied");
        return;
      }

      // fetch courses for admin
      const courseRes = await axios.get(`${API}/admin-courses/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setCourses(courseRes.data);
      setStep("upload");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VIDEO UPLOAD
  // =========================
  const handleUpload = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

    const form = e.target;
    const file = form.video.files[0];

    if (!file) {
      alert("Select a video");
      return;
    }

    const formData = new FormData();
    formData.append("course", form.course.value);
    formData.append("title", form.title.value);
    formData.append("description", form.description.value);
    formData.append("source_video", file);

    try {
      setPhase("uploading");
      setUploadProgress(0);

      const res = await axios.post(
        `${API}/admin-videos/upload/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          onUploadProgress: (e) => {
            if (e.total) {
              setUploadProgress(
                Math.round((e.loaded * 100) / e.total)
              );
            }
          },
        }
      );

      // upload finished → processing
      setPhase("processing");
      pollStatus(res.data.id || res.data.video_id);
    } catch (err) {
      console.error(err);
      setPhase("failed");
      alert("Upload failed");
    }
  };

  // =========================
  // POLL VIDEO STATUS
  // =========================
  const pollStatus = (videoId) => {
    const token = localStorage.getItem("token");

    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(
          `${API}/admin-videos/${videoId}/status/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (res.data.status === "ready") {
          clearInterval(pollRef.current);
          setPhase("done");
        }

        if (res.data.status === "failed") {
          clearInterval(pollRef.current);
          setPhase("failed");
        }
      } catch (err) {
        clearInterval(pollRef.current);
        setPhase("failed");
      }
    }, 3000);
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>

      {/* ===== LOGIN ===== */}
      {step === "login" && (
        <>
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /><br /><br />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /><br /><br />

            <button disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </>
      )}

      {/* ===== DENIED ===== */}
      {step === "denied" && (
        <h3 style={{ color: "red" }}>
          ❌ Access denied. Admin only.
        </h3>
      )}

      {/* ===== UPLOAD ===== */}
      {step === "upload" && (
        <>
          <h2>Upload Video (Admin)</h2>

          <form onSubmit={handleUpload}>
            <input name="title" placeholder="Title" required /><br /><br />

            <textarea
              name="description"
              placeholder="Description"
            /><br /><br />

            <select name="course" required>
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select><br /><br />

            <input
              type="file"
              name="video"
              accept="video/mp4"
              required
            /><br /><br />

            {/* UPLOADING */}
            {phase === "uploading" && (
              <>
                <p>Uploading: {uploadProgress}%</p>
                <progress value={uploadProgress} max="100" />
              </>
            )}

            {/* PROCESSING */}
            {phase === "processing" && (
              <p>⏳ Processing video (FFmpeg → HLS → Cloudflare)</p>
            )}

            {/* DONE */}
            {phase === "done" && (
              <p style={{ color: "green" }}>
                ✅ Video ready & streaming enabled
              </p>
            )}

            {/* FAILED */}
            {phase === "failed" && (
              <p style={{ color: "red" }}>
                ❌ Upload or processing failed
              </p>
            )}

            <br />
            <button
              type="submit"
              disabled={phase === "uploading" || phase === "processing"}
            >
              Upload
            </button>
          </form>
        </>
      )}
    </div>
  );
}
