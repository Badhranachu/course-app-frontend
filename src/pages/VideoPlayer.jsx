import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function VideoPlayer() {
  const { courseId, videoId } = useParams();
  const videoRef = useRef(null);
  const lastSentRef = useRef(0);
  const [buffering, setBuffering] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE;
  const streamUrl =
    `${API_BASE}/courses/${courseId}/videos/${videoId}/stream/`;

  // 🔁 SEND PROGRESS (THROTTLED)
  const sendProgress = (force = false) => {
    if (!videoRef.current) return;

    const currentTime = Math.floor(videoRef.current.currentTime);

    if (!force && currentTime - lastSentRef.current < 5) return;

    lastSentRef.current = currentTime;

    api.post(`/courses/${courseId}/videos/progress/`, {
      video_id: parseInt(videoId),
      current_time: currentTime,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-6">
      <Link to={`/course/${courseId}`} className="text-indigo-400 mb-4 inline-block">
        ← Back
      </Link>

      <div className="relative mx-auto mt-6 w-[960px] h-[540px] bg-black rounded-xl shadow-2xl overflow-hidden">
        {buffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <div className="text-white text-sm animate-pulse">
              Loading video…
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          src={streamUrl}
          controls
          playsInline
          preload="metadata"
          onTimeUpdate={() => sendProgress(false)}
          onPause={() => sendProgress(true)}
          onEnded={() => {
            if (!videoRef.current) return;

            // 🔥 FORCE FINAL DURATION
            api.post(`/courses/${courseId}/videos/progress/`, {
              video_id: parseInt(videoId),
              current_time: Math.floor(videoRef.current.duration),
            });
          }}
          onWaiting={() => setBuffering(true)}
          onCanPlay={() => setBuffering(false)}
          onPlaying={() => setBuffering(false)}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
