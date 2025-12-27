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
    <div className="min-h-screen bg-white px-3 sm:px-6 lg:px-10 py-6">
      
      {/* Back */}
      <Link
        to={`/course/${courseId}`}
        className="mb-4 inline-block text-sm text-indigo-600 hover:underline"
      >
        ← Back
      </Link>

      {/* Video Container */}
      <div className="mx-auto mt-6 w-full max-w-6xl">
        <div className="relative aspect-video w-full bg-black rounded-2xl shadow-2xl overflow-hidden">

          {/* Buffering */}
          {buffering && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70">
              <span className="text-white text-sm animate-pulse">
                Loading video…
              </span>
            </div>
          )}

          {/* Video */}
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
              api.post(`/courses/${courseId}/videos/progress/`, {
                video_id: parseInt(videoId),
                current_time: Math.floor(videoRef.current.duration),
              });
            }}
            onWaiting={() => setBuffering(true)}
            onCanPlay={() => setBuffering(false)}
            onPlaying={() => setBuffering(false)}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
