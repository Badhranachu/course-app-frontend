import { useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function VideoPlayer() {
  const { courseId, videoId } = useParams();

  const videoRef = useRef(null);
  const lastSentRef = useRef(0);

  const [buffering, setBuffering] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [lastPosition, setLastPosition] = useState(0);

  // ==============================
  // 1️⃣ FETCH VIDEO URL
  // ==============================
  useEffect(() => {
    api
      .get(`/courses/${courseId}/videos/${videoId}/`)
      .then(res => setVideoUrl(res.data.video_url));
  }, [courseId, videoId]);

  // ==============================
  // 2️⃣ FETCH PROGRESS
  // ==============================
  useEffect(() => {
    api
      .get(`/courses/${courseId}/videos/${videoId}/progress/`)
      .then(res => {
        if (res.data.last_position) {
          setLastPosition(res.data.last_position);
        }
      });
  }, [courseId, videoId]);

  // ==============================
  // 3️⃣ SEND PROGRESS
  // ==============================
  const sendProgress = (force = false) => {
    if (!videoRef.current) return;

    const currentTime = Math.floor(videoRef.current.currentTime);
    if (!force && currentTime - lastSentRef.current < 5) return;

    lastSentRef.current = currentTime;

    api.post(`/courses/${courseId}/videos/${videoId}/progress/`, {
      current_time: currentTime,
    });
  };

  // ==============================
  // 4️⃣ RESUME
  // ==============================
  const handleLoadedMetadata = () => {
    if (videoRef.current && lastPosition > 0) {
      videoRef.current.currentTime = lastPosition;
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <Link
        to={`/course/${courseId}`}
        className="mb-4 inline-block text-sm text-indigo-600"
      >
        ← Back
      </Link>

      <div className="mx-auto max-w-6xl w-full md:w-3/4">

        <div className="relative aspect-video bg-black rounded-xl overflow-hidden scale-[0.75] origin-top mx-auto">


          {buffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
              Loading…
            </div>
          )}

          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              playsInline
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={() => sendProgress(false)}
              onPause={() => sendProgress(true)}
              onEnded={() => sendProgress(true)}
              onWaiting={() => setBuffering(true)}
              onCanPlay={() => setBuffering(false)}
              onPlaying={() => setBuffering(false)}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
