import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import TreeView from "../components/TreeView";
import "./CourseDetail.css"
import loadingImg from "../assets/loading.png";
import defaultThumb from "../assets/default-thumb.png";

// ------------------------------
// Format description
// ------------------------------
function formatDescription(text) {
  if (!text) return "";
  return text
    . replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");
}

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [attemptedTests, setAttemptedTests] = useState({});
  const [loading, setLoading] = useState(true);

    const [openModuleId, setOpenModuleId] = useState(null);

  const [fileContent, setFileContent] = useState(null);

  const [openGithub, setOpenGithub] = useState(false);
  const [githubLink, setGithubLink] = useState("");
  const [savedGithubLink, setSavedGithubLink] = useState(null);
  const [moduleProgress, setModuleProgress] = useState([]);
const [modulesLoading, setModulesLoading] = useState(false);
const [pendingRequests, setPendingRequests] = useState(0);
const [videoMeta, setVideoMeta] = useState({});
const [videoProgress, setVideoProgress] = useState({});
const [treeByVideo, setTreeByVideo] = useState({});
const [attachmentLoading, setAttachmentLoading] = useState({});















const fetchContents = async () => {
  try {
    setModulesLoading(true);
    const res = await api.get(`/courses/${id}/modules/`);
    setModules(res.data);
  } finally {
    setModulesLoading(false);
  }
};


  // ------------------------------
  // Load module progress
  // ------------------------------
  useEffect(() => {
    if (course?.is_enrolled) {
      fetchModuleProgress();
            fetchVideoProgress();

    }
  }, [course?.is_enrolled]);
  // ------------------------------
  // Progress calculation
  // ------------------------------
  const getProgressPercent = (module) => {
    if (module.item_type !== "video") {
      return module.is_completed ? 100 : 0;
    }

    const progress = videoProgress[module.video_id];
    if (!progress || !progress.duration) return 0;

    return Math.min(
      Math.round((progress.watched_seconds / progress.duration) * 100),
      100
    );
  };

  // ------------------------------
  // Load Razorpay script ONCE
  // ------------------------------
  useEffect(() => {
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("✅ Razorpay loaded");
    document.body.appendChild(script);
  }, []);

  // ------------------------------
  // ENROLL + PAYMENT
  // ------------------------------
  const handleEnrollNow = async () => {
    try {
      if (!window.Razorpay) {
        alert("Razorpay not loaded. Please refresh.");
        return;
      }

      // 1️⃣ Create order
      const res = await api.post("/payment/create-order/", {
        course_id: id,
      });

      const { order_id, amount, currency, key_id } = res.data;

      // 2️⃣ Razorpay options
      const options = {
        key: key_id,
        amount,
        currency,
        name: "Course App",
        description: course.title,
        order_id,

        handler: async (response) => {
          try {
            await api.post("/payment/verify/", {
              course_id: id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await fetchCourse();
            await fetchModules();
            alert("🎉 Enrollment successful");
          } catch {
            alert("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => alert("Payment cancelled"),
        },

        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);

      // 🔴 IMPORTANT: failure handler
      rzp.on("payment.failed", (resp) => {
        console.error("Razorpay error:", resp.error);
        alert(resp.error.description || "Payment failed");
      });

      rzp.open();
    } catch (err) {
      console.error("Enroll error:", err);
      alert(err?.response?.data?.error || err.message || "Payment failed");
    }
  };

  // ------------------------------
  // Fetch video progress
  // ------------------------------
  const fetchVideoProgress = async () => {
    const res = await api.get(`/courses/${id}/all-videos/progress/`);
    const map = {};
    res.data.forEach((v) => {
      map[v.video_id] = v;
    });
    setVideoProgress(map);
  };


  // ------------------------------
  // Module progress
  // ------------------------------
  const fetchModuleProgress = async () => {
    try {
      const res = await api.get(`/courses/${id}/module-progress/`);
      setModuleProgress(res.data.modules || []);
    } catch {
      setModuleProgress([]);
    }
  };

  // ------------------------------
  // MODULE TOGGLE
  // ------------------------------
  const toggleModule = (moduleId, unlocked) => {
    if (!unlocked) return;
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
    setFileContent(null);
  };

  // ------------------------------
  // INITIAL LOAD
  // ------------------------------
  useEffect(() => {
    fetchCourse();
    fetchGithubStatus();
  }, [id]);

  useEffect(() => {
    if (course?.is_enrolled) fetchModules();
  }, [course?.is_enrolled]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}/`);
      setCourse(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    const res = await api.get(`/courses/${id}/modules/`);
    setModules(res.data);
  };

  // ------------------------------
  // TEST ATTEMPTS
  // ------------------------------
  useEffect(() => {
    if (!modules.length) return;

    const map = {};
    Promise.all(
      modules.map(async (item) => {
        if (item.item_type === "test") {
          try {
            const res = await api.get(
              `/courses/${id}/tests/${item.item_id}/`
            );
            map[item.item_id] = res.data.attempted;
          } catch {
            map[item.item_id] = false;
          }
        }
      })
    ).then(() => setAttemptedTests(map));
  }, [modules, id]);

  // ------------------------------
  // GITHUB STATUS
  // ------------------------------
  const fetchGithubStatus = async () => {
    try {
      const res = await api.get(`/certificate/github-link/${id}/`);
      setSavedGithubLink(res.data.github_link || null);
    } catch {
      setSavedGithubLink(null);
    }
  };

  const submitGithubLink = async () => {
  if (savedGithubLink || isSubmitting) return;

  if (!githubLink.trim()) {
    alert("Github link is required");
    return;
  }

  try {
    setIsSubmitting(true); // 🔒 lock button

    await api.post(`/certificate/github-link/${id}/`, {
      github_link: githubLink.trim(),
    });

    setSavedGithubLink(githubLink.trim());
    setGithubLink("");
  } catch (err) {
    alert("Failed to submit Github link");
  } finally {
    setIsSubmitting(false); // 🔓 unlock only after response
  }
};

  // ------------------------------
  // ATTACHMENTS
  // ------------------------------
const loadAttachmentTree = async (videoId) => {
  try {
    setAttachmentLoading(prev => ({ ...prev, [videoId]: true }));

    const res = await api.get(
      `/courses/${id}/videos/${videoId}/attachment-tree/`
    );

    setTreeByVideo(prev => ({
      ...prev,
      [videoId]: res.data.tree
    }));
  } finally {
    setAttachmentLoading(prev => ({ ...prev, [videoId]: false }));
  }
};



  const loadFileContent = async (videoId, filePath) => {
    const res = await api.get(
      `/courses/${id}/videos/${videoId}/attachment-content/${filePath}/`
    );
    setFileContent(res.data.content);
  };

  // ------------------------------
  // START TEST
  // ------------------------------
  const handleStartTest = (testId) => {
    if (attemptedTests[testId]) return;
    navigate(`/courses/${id}/tests/${testId}`);
  };


  // ------------------------------
// OVERALL COURSE PROGRESS
// ------------------------------
const totalModules = moduleProgress.length;

const completedModules = moduleProgress.filter(
  (m) => m.is_completed
).length;

const overallProgress =
  totalModules > 0
    ? Math.round((completedModules / totalModules) * 100)
    : 0;


if (loading || (course?.is_enrolled && modulesLoading)) {
  return (


    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <img
        src={loadingImg}
        alt="Loading"
        className="w-48 opacity-90 animate-pulse"
      />
    </div>

    
  );
}
  // ------------------------------
  // RULES
  // ------------------------------
  const lastModule = [...moduleProgress]
    .sort((a, b) => a.order - b.order)
    .slice(-1)[0];

  const githubUnlocked =
    Boolean(lastModule) && lastModule.is_completed === true;

  const courseCompleted = Boolean(savedGithubLink);

  // ------------------------------
  // UI
  // ------------------------------
  return (
  <div className="min-h-screen bg-slate-50 py-10">
    <div className="max-w-7xl mx-auto px-6 space-y-10">

      {/* ================= HERO ================= */}
      <div className="bg-white border rounded-2xl shadow-sm p-8 flex flex-col lg:flex-row justify-between gap-8">

        <div className="space-y-4 max-w-3xl">
          

          <h1 className="text-4xl font-bold text-slate-900">
            {course.title}
          </h1>

          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{
              __html: formatDescription(course.description),
            }}
          />
        </div>

        <div className="bg-slate-50 border rounded-xl p-6 w-full lg:w-80 flex flex-col justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Course Fee</p>
            <p className="text-3xl font-bold text-indigo-600">
              ₹{course.price}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {course.is_enrolled ? (
              <span className="block text-center bg-emerald-100 text-emerald-700 py-2 rounded-full font-medium">
                ✓ Enrolled
              </span>
            ) : (
              <button
                onClick={handleEnrollNow}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium"
              >
                Enroll Now
              </button>
            )}

            {course.is_enrolled && (
  <Link
    to={`/courses/${id}/tests/history`}
    className="block text-center border border-indigo-600 text-indigo-600
               py-2.5 rounded-lg font-medium
               hover:bg-indigo-50 transition"
  >
    View Test History
  </Link>
)}
          </div>
        </div>
      </div>
      {/* ===== PREMIUM OVERALL COURSE PROGRESS ===== */}
{course.is_enrolled && (
  <div className="mt-6 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm p-4 shadow-sm">

    {/* Header */}
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
        <span className="text-sm font-semibold text-slate-700">
          Course Progress
        </span>
      </div>

      <span className="text-sm font-bold text-slate-800">
        {overallProgress}%
      </span>
    </div>

    {/* Progress Track */}
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-slate-200 to-slate-100 shadow-inner">

      {/* Progress Fill */}
      <div
        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out
          ${
            overallProgress === 100
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
              : "bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700"
          }
        `}
        style={{ width: `${overallProgress}%` }}
      />

      {/* Subtle Shine */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-40" />
    </div>

    {/* Status */}
    <div className="mt-2 flex items-center gap-2 text-xs">
      {overallProgress === 100 ? (
        <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
          ✔ Course completed
        </span>
      ) : (
        <span className="text-slate-500">
          Keep going — you're making great progress 🚀
        </span>
      )}
    </div>

  </div>
)}


      {/* ================= COURSE CONTENT ================= */}
      {course.is_enrolled && (
  <div className="bg-white border rounded-2xl shadow-sm p-8">
  <h2 className="text-2xl font-bold text-slate-900 mb-6">
    Course Content
  </h2>

  <div className="space-y-4">
    {moduleProgress.map((item) => {
      // 🔍 DEBUG LOGS (VERY IMPORTANT)
      console.log("MODULE:", item);
      console.log(
        "VIDEO PROGRESS:",
        item.video_id,
        videoProgress[item.video_id]
      );
      console.log(
        "TREE STATE:",
        treeByVideo[item.video_id]
      );

      return (
        <div
          key={item.module_id}
          className={`module-item p-4 ${
            item.is_unlocked ? "" : "module-locked"
          }`}
          onClick={() =>
            toggleModule(item.module_id, item.is_unlocked)
          }
        >
          {/* ---------- Header ---------- */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span>
                {item.item_type === "video" ? "🎬" : "📝"}
              </span>
              {item.title}
            </h3>

            <span className="text-slate-500">
              {!item.is_unlocked
                ? "🔒"
                : openModuleId === item.module_id
                ? "▲"
                : "▼"}
            </span>
          </div>

          {/* ---------- Expanded Content ---------- */}
          {openModuleId === item.module_id && item.is_unlocked && (
            <div
              className="mt-4 pl-4 border-l border-slate-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {item.item_type === "video" ? (
                <>
                  {/* ---------- Video Thumbnail ---------- */}
                  <Link
                    to={`/courses/${id}/video/${item.video_id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block"
                  >
                    <img
                      src={defaultThumb}
                      alt="Video thumbnail"
                      className="w-48 rounded-lg border hover:shadow-md transition"
                    />
                  </Link>
                  <br />

                  {/* ---------- Attachments Button ---------- */}
                  {videoProgress[item.video_id] ? (
  videoProgress[item.video_id].has_attachment ? (
    attachmentLoading[item.video_id] ? (
      <span className="flex items-center gap-2 text-sm text-indigo-500">
        <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        Loading files…
      </span>
    ) : (
      <button
        onClick={(e) => {
          e.stopPropagation();
          loadAttachmentTree(item.video_id);
        }}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 underline"
      >
        View Code Files
      </button>
    )
  ) : (
    <span className="text-sm text-slate-400 italic">
      No files
    </span>
  )
) : (
  <span className="text-sm text-slate-400 italic">
    Checking files…
  </span>
)}




                  {/* ---------- Tree View ---------- */}
                  {treeByVideo[item.video_id] && (
                    <TreeView
                      tree={treeByVideo[item.video_id]}
                      onSelect={(fp) => {
                        console.log(
                          "📄 Loading file:",
                          fp,
                          "for video:",
                          item.video_id
                        );
                        loadFileContent(item.video_id, fp);
                      }}
                    />
                  )}

                  {/* ---------- Code Viewer ---------- */}
                  {fileContent && (
                    <pre className="code-viewer p-4 overflow-auto">
                      {fileContent}
                    </pre>
                  )}
                </>
              ) : (
                /* ---------- Test Button ---------- */
                <button
                  disabled={attemptedTests[item.test_id]}
                  onClick={() => handleStartTest(item.test_id)}
                  className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                    attemptedTests[item.test_id]
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {attemptedTests[item.test_id]
                    ? "Test Attempted"
                    : "Start Test"}
                </button>
              )}
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>


)}

      {/* ================= GITHUB SUBMISSION ================= */}
      <div
  className={`border rounded-2xl shadow-sm p-6 transition ${
    githubUnlocked
      ? "bg-white"
      : "bg-slate-100 opacity-80"
  }`}
>
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-xl font-semibold">
      Github Project Submission
    </h3>

    {!githubUnlocked && (
      <span className="text-lg" title="Complete all modules to unlock">
        🔒
      </span>
    )}
  </div>

  {!githubUnlocked ? (
    /* 🔒 LOCKED STATE */
    <div className="text-sm text-slate-500 flex items-center gap-2">
      <span>Complete all course modules to unlock submission</span>
    </div>
  ) : (
    /* 🔓 UNLOCKED STATE */
    <>
      <input
        value={savedGithubLink || githubLink}
        onChange={(e) => setGithubLink(e.target.value)}
        disabled={courseCompleted}
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Paste your Github repository link"
      />

      <button
  onClick={submitGithubLink}
  disabled={courseCompleted || isSubmitting}
  className={`relative px-6 py-3 rounded-lg text-white font-medium
    flex items-center justify-center gap-2
    transition-all duration-300
    ${
      courseCompleted
        ? "bg-emerald-600"
        : isSubmitting
        ? "bg-indigo-500 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700"
    }`}
>
  {/* ⏳ Loading */}
  {isSubmitting && !courseCompleted && (
    <>
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>Submitting…</span>
    </>
  )}

  {/* ✅ Success */}
  {courseCompleted && (
    <span className="flex items-center gap-2 animate-fade-in">
      <span className="text-lg">✔</span>
      Submitted
    </span>
  )}

  {/* 🚀 Default */}
  {!isSubmitting && !courseCompleted && (
    <span>Submit Github Link</span>
  )}
</button>
    </>
  )}
</div>
      {/* ================= COMPLETION ================= */}
      {courseCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <h3 className="text-2xl font-bold text-emerald-700 mb-3">
            🎉 Course Completed Successfully
          </h3>
          <Link
            to="/my-certificates"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            View My Certificates
          </Link>
        </div>
      )}

    </div>
  </div>
);
}
