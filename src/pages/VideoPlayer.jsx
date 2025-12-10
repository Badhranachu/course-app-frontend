import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function VideoPlayer() {
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // 🔥 Add token in URL so <video> can authenticate
    const url = `${import.meta.env.VITE_API_URL}/videos/${id}/stream/?token=${token}`;

    setVideoUrl(url);
  }, [id]);

  if (!videoUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <p className="text-gray-700 text-lg mb-3">
          {error || "Loading video…"}
        </p>

        <Link
          to="/dashboard"
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-10 py-8 font-[Inter]">
      <div className="max-w-6xl mx-auto">

        <Link
          to="/dashboard"
          className="text-indigo-600 hover:text-indigo-500 font-medium mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* ⭐ Native HTML5 Player */}
          <div className="w-full bg-black">
            <video
              src={videoUrl}
              controls
              muted
              autoPlay={false}
              className="w-full h-[70vh] rounded-lg"
            />
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Course Video Lesson
            </h1>
            <p className="text-gray-600 text-sm mb-4">
              You are watching a lesson from your enrolled course.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default VideoPlayer;
