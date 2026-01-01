import { useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Hls from "hls.js";
import api from "../services/api";

export default function VideoPlayer() {
  const { courseId, videoId } = useParams();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const lastSentRef = useRef(0);

  const [buffering, setBuffering] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [lastPosition, setLastPosition] = useState(0);

  // 1️⃣ Fetch video URL
  useEffect(() => {
    api.get(`/courses/${courseId}/videos/${videoId}/`)
      .then(res => setVideoUrl(res.data.video_url));
  }, [courseId, videoId]);

  // 2️⃣ Fetch progress
  useEffect(() => {
    api.get(`/courses/${courseId}/videos/${videoId}/progress/`)
      .then(res => {
        if (res.data.last_position) {
          setLastPosition(res.data.last_position);
        }
      });
  }, [courseId, videoId]);

  // 3️⃣ Setup HLS
  useEffect(() => {
  if (!videoUrl || !videoRef.current) return;

  const video = videoRef.current;

  if (Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,

      maxBufferLength: 10,
      backBufferLength: 5,
      startLevel: -1,
    });

    hls.loadSource(videoUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.startLoad(); // 🔥 REQUIRED
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      // DO NOTHING HERE
    });

    hls.on(Hls.Events.FRAG_BUFFERED, () => {
      if (lastPosition > 0 && video.currentTime < 1) {
        video.currentTime = lastPosition;
      }

      setBuffering(false);

      video
        .play()
        .catch(() => console.warn("Autoplay blocked"));
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error("HLS ERROR:", data);
    });

    hlsRef.current = hls;
  } 
  else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = videoUrl;
    video.addEventListener("loadeddata", () => {
      setBuffering(false);
      if (lastPosition > 0) video.currentTime = lastPosition;
    });
  }

  return () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };
}, [videoUrl]);





  // 4️⃣ Send progress
  const sendProgress = (force = false) => {
    if (!videoRef.current) return;
    const currentTime = Math.floor(videoRef.current.currentTime);
    if (!force && currentTime - lastSentRef.current < 5) return;

    lastSentRef.current = currentTime;

    api.post(`/courses/${courseId}/videos/${videoId}/progress/`, {
      current_time: currentTime,
    });
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <Link to={`/course/${courseId}`} className="mb-4 inline-block text-sm text-indigo-600">
        ← Back
      </Link>

      <div className="mx-auto max-w-6xl w-full md:w-3/4">
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">

          {buffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
              Loading…
            </div>
          )}

          <video
  ref={videoRef}
  controls
  playsInline
  muted              // REQUIRED for Chrome
  preload="auto"     // REQUIRED
  onWaiting={() => setBuffering(true)}
  onPlaying={() => setBuffering(false)}
  onTimeUpdate={() => sendProgress(false)}
  onPause={() => sendProgress(true)}
  onEnded={() => sendProgress(true)}
  className="w-full h-full object-contain"
/>



        </div>
      </div>
    </div>
  );
}
