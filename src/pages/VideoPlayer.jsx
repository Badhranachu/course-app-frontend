import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function VideoPlayer() {
  const { courseId, videoId } = useParams();
  const videoRef = useRef(null);

  const [buffering, setBuffering] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE;
  const streamUrl =
    `${API_BASE}/courses/${courseId}/videos/${videoId}/stream/`;

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-6">
      <Link
        to={`/course/${courseId}`}
        className="text-indigo-400 mb-4 inline-block"
      >
        ← Back
      </Link>

      {/* 🎥 FIXED VIDEO BOX */}
      <div className="relative mx-auto mt-6 w-[960px] h-[540px] bg-black rounded-xl shadow-2xl overflow-hidden">
        
        {/* 🔄 LOADING OVERLAY */}
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
          onWaiting={() => setBuffering(true)}
          onCanPlay={() => setBuffering(false)}
          onPlaying={() => setBuffering(false)}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
