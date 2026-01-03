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
  const [baseUrl, setBaseUrl] = useState(null); // without /master.m3u8
  const [videoUrl, setVideoUrl] = useState(null);

  const [quality, setQuality] = useState("720p"); // DEFAULT QUALITY
  const [lastPosition, setLastPosition] = useState(0);

  /* ------------------------------------
     1️⃣ Fetch base video URL
  ------------------------------------ */
  useEffect(() => {
    api
      .get(`/courses/${courseId}/videos/${videoId}/`)
      .then((res) => {
        const url = res.data.video_url;
        const base = url.substring(0, url.lastIndexOf("/"));

        setBaseUrl(base);
      });
  }, [courseId, videoId]);

  /* ------------------------------------
     2️⃣ Fetch last progress
  ------------------------------------ */
  useEffect(() => {
    api
      .get(`/courses/${courseId}/videos/${videoId}/progress/`)
      .then((res) => {
        if (res.data.last_position) {
          setLastPosition(res.data.last_position);
        }
      });
  }, [courseId, videoId]);

  /* ------------------------------------
     3️⃣ Build quality-based URL
  ------------------------------------ */
  useEffect(() => {
    if (!baseUrl) return;
    setVideoUrl(`${baseUrl}/${quality}/index.m3u8`);

  }, [baseUrl, quality]);

  /* ------------------------------------
     4️⃣ Setup HLS Player
  ------------------------------------ */
  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const video = videoRef.current;
    const startTime = video.currentTime || lastPosition || 0;

    // Cleanup old instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setBuffering(true);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        maxBufferLength: 10,
        backBufferLength: 5,
        startLevel: -1,
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.currentTime = startTime;
        video
          .play()
          .catch(() => console.warn("Autoplay blocked"));
      });

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        setBuffering(false);
      });

      hls.on(Hls.Events.ERROR, (e, data) => {
        console.error("HLS ERROR:", data);
      });

      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadeddata", () => {
        video.currentTime = startTime;
        setBuffering(false);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl]);

  /* ------------------------------------
     5️⃣ Send progress
  ------------------------------------ */
  const sendProgress = (force = false) => {
    if (!videoRef.current) return;

    const currentTime = Math.floor(videoRef.current.currentTime);
    if (!force && currentTime - lastSentRef.current < 5) return;

    lastSentRef.current = currentTime;

    api.post(`/courses/${courseId}/videos/${videoId}/progress/`, {
      current_time: currentTime,
    });
  };

  /* ------------------------------------
     UI
  ------------------------------------ */
  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <Link
        to={`/course/${courseId}`}
        className="mb-4 inline-block text-sm text-indigo-600"
      >
        ← Back
      </Link>

      <div className="mx-auto max-w-6xl w-full md:w-3/4">
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">

          {/* Quality Selector */}
          <div className="absolute top-3 right-3 z-10">
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="bg-black/70 text-white text-sm px-3 py-1 rounded"
            >
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>

          {/* Buffering Overlay */}
          {buffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
              Loading…
            </div>
          )}

          <video
            ref={videoRef}
            controls
            playsInline
            muted
            preload="auto"
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
