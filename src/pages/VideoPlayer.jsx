import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function VideoPlayer() {
  const { courseId, videoId } = useParams();
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE;
  const token = localStorage.getItem("access_token");

  // ===============================
  // LOAD VIDEO STREAM
  // ===============================
  useEffect(() => {
    if (!token) {
      setError("No auth token");
      return;
    }

    const url = `${API_BASE}/api/courses/${courseId}/videos/${videoId}/stream/`;

    fetch(url, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Forbidden");
        return res.blob();
      })
      .then((blob) => {
        videoRef.current.src = URL.createObjectURL(blob);
      })
      .catch(() => setError("Video access denied"));
  }, [courseId, videoId]);

  // ===============================
  // SEND PROGRESS EVERY 5s
  // ===============================
  const sendProgress = async () => {
    const video = videoRef.current;
    if (!video || video.currentTime === 0) return;

    await fetch(
      `${API_BASE}/api/courses/${courseId}/videos/progress/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          video_id: videoId,
          current_time: Math.floor(video.currentTime),
        }),
      }
    );
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

  // ===============================
  // DOUBLE TAP SEEK
  // ===============================
  const handleDoubleTap = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = video.getBoundingClientRect();
    const x = e.clientX || e.touches?.[0]?.clientX;
    const mid = rect.left + rect.width / 2;

    video.currentTime =
      x < mid
        ? Math.max(video.currentTime - 10, 0)
        : Math.min(video.currentTime + 10, video.duration);
  };

  useEffect(() => () => stopTracking(), []);

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <Link to={`/course/${courseId}`} className="text-indigo-400 mb-4 inline-block">
        ← Back
      </Link>

      {error && <div className="text-red-400 mb-3">{error}</div>}

      <video
  ref={videoRef}
  controls
  playsInline
  onPlay={startTracking}
  onPause={stopTracking}
  onEnded={() => {
    const video = videoRef.current;
    if (video) {
      fetch(`${API_BASE}/api/courses/${courseId}/videos/progress/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          video_id: videoId,
          current_time: Math.floor(video.duration),
        }),
      });
    }
    stopTracking();
  }}
/>
    </div>
  );
}
