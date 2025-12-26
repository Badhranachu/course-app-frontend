import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function VideoPlayer() {
  const { courseId, videoId } = useParams();
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE; // "/api"
  const token = localStorage.getItem("access_token");

  // ===============================
  // LOAD VIDEO STREAM
  // ===============================
  useEffect(() => {
    if (!token) {
      setError("No auth token");
      return;
    }

    const url = `${API_BASE}/courses/${courseId}/videos/${videoId}/stream/`;

    fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Forbidden");
        return res.blob();
      })
      .then((blob) => {
        videoRef.current.src = URL.createObjectURL(blob);
      })
      .catch(() => setError("Video access denied"));
  }, [courseId, videoId, token]);

  // ===============================
  // SEND PROGRESS EVERY 5s
  // ===============================
  const sendProgress = async () => {
    const video = videoRef.current;
    if (!video || video.currentTime === 0) return;

    await fetch(`${API_BASE}/courses/${courseId}/videos/progress/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        video_id: videoId,
        current_time: Math.floor(video.currentTime),
      }),
    });
  };

  const startTracking = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(sendProgress, 5000);
    }
  };

  const stopTracking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    sendProgress();
  };

  useEffect(() => () => stopTracking(), []);

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <Link
        to={`/course/${courseId}`}
        className="text-indigo-400 mb-4 inline-block"
      >
        ← Back
      </Link>

      {error && <div className="text-red-400 mb-3">{error}</div>}

      <video
        ref={videoRef}
        controls
        playsInline
        onPlay={startTracking}
        onPause={stopTracking}
        onEnded={stopTracking}
        className="w-full max-h-[80vh]"
      />
    </div>
  );
}
