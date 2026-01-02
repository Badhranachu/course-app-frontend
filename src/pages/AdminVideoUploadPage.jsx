import { useState, useRef } from "react";
import axios from "axios";

export default function AdminVideoUploadPage() {
  /**
   * step:
   * - login     → ask email/password
   * - upload    → admin upload page
   * - denied    → non-admin user
   */
  const [step, setStep] = useState("login");

  /**
   * phase:
   * - idle        → nothing
   * - uploading   → file upload in progress
   * - processing  → ffmpeg + R2 upload
   * - done        → success
   * - failed      → error
   */
  const [phase, setPhase] = useState("idle");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const pollRef = useRef(null);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login/", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);

      if (user.role === "admin") {
        setStep("upload");
      } else {
        setStep("denied");
      }
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
    const formData = new FormData();

    formData.append("course", form.course.value);
    formData.append("title", form.title.value);
    formData.append("description", form.description.value);
    formData.append("source_video", form.video.files[0]);

    try {
      setPhase("uploading");
      setUploadProgress(0);

      const res = await axios.post(
        "/api/admin-videos/upload/",
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

      // Upload finished → backend processing
      setPhase("processing");
      pollStatus(res.data.video_id);

    } catch (err) {
      setPhase("failed");
      alert("Upload failed");
    }
  };

  // =========================
  // POLL STATUS
  // =========================
  const pollStatus = (videoId) => {
    const token = localStorage.getItem("token");

    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(
          `/api/admin-videos/${videoId}/status/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (res.data.status === "ready") {
          clearInterval(pollRef.current);
          setPhase("done");
          alert("✅ Video processed and ready for streaming");
        }

        if (res.data.status === "failed") {
          clearInterval(pollRef.current);
          setPhase("failed");
          alert("❌ Video processing failed");
        }
      } catch {
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

      {/* ================= LOGIN ================= */}
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

      {/* ================= DENIED ================= */}
      {step === "denied" && (
        <h3 style={{ color: "red" }}>
          Access denied. Admin only.
        </h3>
      )}

      {/* ================= UPLOAD ================= */}
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
              <option value="1">Course 1</option>
            </select><br /><br />

            <input
              type="file"
              name="video"
              accept="video/mp4"
              required
            /><br /><br />

            {/* ===== UPLOAD PROGRESS ===== */}
            {phase === "uploading" && (
              <>
                <p>Uploading: {uploadProgress}%</p>
                <progress value={uploadProgress} max="100" />
              </>
            )}

            {/* ===== PROCESSING ===== */}
            {phase === "processing" && (
              <p>⏳ Processing video (HLS + Cloudflare)...</p>
            )}

            {/* ===== DONE ===== */}
            {phase === "done" && (
              <p style={{ color: "green" }}>
                ✅ Video ready and streaming enabled
              </p>
            )}

            {/* ===== FAILED ===== */}
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
