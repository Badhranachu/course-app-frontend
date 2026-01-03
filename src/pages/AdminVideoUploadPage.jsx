import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "";

export default function AdminVideoUploadPage() {
  const [step, setStep] = useState("login");
  const [phase, setPhase] = useState("idle");

  const [uploadProgress, setUploadProgress] = useState(0); // R2 upload
  const [serverProgress, setServerProgress] = useState(0); // conversion / hls
  const [serverStage, setServerStage] = useState("");

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courses, setCourses] = useState([]);
  const [readyVideoUrl, setReadyVideoUrl] = useState(null);


  const pollRef = useRef(null);

  useEffect(() => {
    return () => pollRef.current && clearInterval(pollRef.current);
  }, []);

  // -------------------------
  // LOGIN
  // -------------------------
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

  // -------------------------
  // UPLOAD FLOW
  // -------------------------
  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const form = e.target;
    const file = form.video.files[0];

    if (!file) return alert("Select a video");

    try {
      setPhase("uploading");
      setUploadProgress(0);
      setServerProgress(0);
      setServerStage("");

      // 1️⃣ Presign
      const presignRes = await axios.post(
        `${API}/admin-videos/presign/`,
        { filename: file.name, content_type: file.type },
        { headers: { Authorization: `Token ${token}` } }
      );

      const { upload_url, key } = presignRes.data;

      // 2️⃣ Upload → R2
      await axios.put(upload_url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (e) => {
          if (e.total) {
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      // 3️⃣ Create DB record + Celery job
      const createRes = await axios.post(
        `${API}/admin-videos/create/`,
        {
          title: form.title.value,
          description: form.description.value,
          course: form.course.value,
          r2_key: key,
        },
        { headers: { Authorization: `Token ${token}` } }
      );

      setPhase("processing");
      pollStatus(createRes.data.video_id);
    } catch (err) {
      console.error(err);
      setPhase("failed");
    }
  };

  // -------------------------
  // STATUS POLLING
  // -------------------------
  const pollStatus = (videoId) => {
    const token = localStorage.getItem("token");

    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(
          `${API}/admin-videos/${videoId}/status/`,
          { headers: { Authorization: `Token ${token}` } }
        );

        setServerStage(res.data.stage || "");
        setServerProgress(res.data.progress || 0);

        if (res.data.status === "ready" || res.data.stage === "ready") {
  clearInterval(pollRef.current);
  setReadyVideoUrl(res.data.video_url);
  setPhase("ready");
}




        if (res.data.status === "failed") {
          clearInterval(pollRef.current);
          setPhase("failed");
        }
      } catch {
        clearInterval(pollRef.current);
        setPhase("failed");
      }
    }, 2000);
  };

  // -------------------------
  // UI
  // -------------------------
  const stageLabel = {
    uploading: "Uploading to Cloudflare R2",
    converting: "Converting video (FFmpeg)",
    uploading_hls: "Uploading HLS segments",
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
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

          {/* 1️⃣ Upload Progress */}
          {phase === "uploading" && (
            <>
              <p>Upload → Cloudflare ({uploadProgress}%)</p>
              <progress value={uploadProgress} max="100" />
            </>
          )}

          {/* 2️⃣ + 3️⃣ Server Progress */}
          {phase === "processing" && (
            <>
              <p>{stageLabel[serverStage] || "Processing…"}</p>
              <progress value={serverProgress} max="100" />
              <p>{serverProgress}%</p>
            </>
          )}

          {phase === "ready" && (
  <div style={{ marginTop: 20 }}>
    <p style={{ color: "green", fontWeight: "bold" }}>
      ✅ Video ready to play
    </p>

    
  </div>
)}


          {phase === "done" && <p style={{ color: "green" }}>✅ Video ready</p>}
          {phase === "failed" && <p style={{ color: "red" }}>❌ Failed</p>}

          <button disabled={phase === "uploading" || phase === "processing"}>
            Upload
          </button>
        </form>
      )}
    </div>
  );
}

