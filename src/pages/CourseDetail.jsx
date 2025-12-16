import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import TreeView from "../components/TreeView";

// ------------------------------
// Format description
// ------------------------------
function formatDescription(text) {
  if (!text) return "";
  return text
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");
}

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [attemptedTests, setAttemptedTests] = useState({});
  const [loading, setLoading] = useState(true);

  const [openModuleId, setOpenModuleId] = useState(null);

  const [tree, setTree] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const [openGithub, setOpenGithub] = useState(false);
  const [githubLink, setGithubLink] = useState("");
  const [savedGithubLink, setSavedGithubLink] = useState(null);
  const [moduleProgress, setModuleProgress] = useState([]);

useEffect(() => {
  if (course?.is_enrolled) {
    fetchModuleProgress();
  }
}, [course?.is_enrolled]);


const fetchModuleProgress = async () => {
  try {
    const res = await api.get(
      `/courses/${id}/module-progress/`
    );
    setModuleProgress(res.data.modules || []);
  } catch (err) {
    console.error("Module progress error", err);
    setModuleProgress([]);
  }
};






  // ------------------------------
  // MODULE TOGGLE
  // ------------------------------
  const toggleModule = (moduleId, unlocked) => {
    if (!unlocked) return;
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
    setTree(null);
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
    if (savedGithubLink) return;

    if (!githubLink.trim()) {
      alert("Github link is required");
      return;
    }

    try {
      await api.post(`/certificate/github-link/${id}/`, {
        github_link: githubLink.trim(),
      });
      setSavedGithubLink(githubLink.trim());
      setGithubLink("");
    } catch {
      alert("Failed to submit Github link");
    }
  };

  // ------------------------------
  // ATTACHMENTS
  // ------------------------------
  const loadAttachmentTree = async (videoId) => {
    const res = await api.get(
      `/courses/${id}/videos/${videoId}/attachment-tree/`
    );
    setTree(res.data.tree);
    setFileContent(null);
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

  if (loading) return <div className="p-10 text-center">Loading…</div>;

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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-white border rounded-2xl p-8">
          <h1 className="text-4xl font-bold">{course.title}</h1>

          <div
            dangerouslySetInnerHTML={{
              __html: formatDescription(course.description),
            }}
          />

          {/* STATUS BAR */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-2xl font-bold text-indigo-600">
              ₹{course.price}
            </div>

            <div className="flex gap-3 items-center">
              {course.is_enrolled && (
                <Link
                  to={`/courses/${id}/tests/history`}
                  className="text-sm underline text-blue-600"
                >
                  View Test History →
                </Link>
              )}

              {course.is_enrolled ? (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full">
                  ✓ Enrolled
                </span>
              ) : (
                <span className="px-4 py-2 bg-gray-300 rounded">
                  Not Enrolled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* MODULES */}
        {course.is_enrolled && (
          <div className="bg-white border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-5">Course Content</h2>

            {modules.map((item) => (
              <div key={item.id} className="border rounded-xl p-4 mb-4">
                <div
                  className={`flex justify-between ${
                    !item.is_unlocked
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() =>
                    toggleModule(item.id, item.is_unlocked)
                  }
                >
                  <h3 className="font-semibold">
                    {item.item_type === "video" ? "🎬" : "📝"}{" "}
                    {item.title}
                  </h3>
                  <span>
                    {!item.is_unlocked
                      ? "🔒"
                      : openModuleId === item.id
                      ? "▲"
                      : "▼"}
                  </span>
                </div>

                {openModuleId === item.id && item.is_unlocked && (
                  <div className="mt-4 pl-4 border-l">
                    {item.item_type === "video" ? (
                      <>
                        <Link
                          to={`/courses/${id}/video/${item.item_id}`}
                        >
                          <img
                            src={
                              item.thumbnail ||
                              "/default-thumb.png"
                            }
                            className="w-40 h-24 rounded border"
                          />
                        </Link>

                        {item.attachment_url && (
                          <button
                            onClick={() =>
                              loadAttachmentTree(item.item_id)
                            }
                            className="mt-2 bg-gray-200 px-3 py-1 rounded"
                          >
                            📂 View Code Files
                          </button>
                        )}

                        {tree && (
                          <TreeView
                            tree={tree}
                            onSelect={(fp) =>
                              loadFileContent(item.item_id, fp)
                            }
                          />
                        )}

                        {fileContent && (
                          <pre className="bg-black text-green-400 p-4 mt-3 rounded">
                            {fileContent}
                          </pre>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          disabled={
                            attemptedTests[item.item_id]
                          }
                          onClick={() =>
                            handleStartTest(item.item_id)
                          }
                          className={`px-4 py-2 rounded-md mt-4 text-white ${
                            attemptedTests[item.item_id]
                              ? "bg-gray-400"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {attemptedTests[item.item_id]
                            ? "Test Attempted ✔"
                            : "Start Test →"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* GITHUB */}
        <div
          className={`border rounded-xl p-4 ${
            !githubUnlocked && "opacity-50"
          }`}
        >
          <div
            className="flex justify-between cursor-pointer"
            onClick={() =>
              githubUnlocked && setOpenGithub(!openGithub)
            }
          >
            <h3 className="font-semibold">📦 Github Files</h3>
            <span>{openGithub ? "▲" : "▼"}</span>
          </div>

          {openGithub && githubUnlocked && (
            <div className="mt-3">
              <input
                value={savedGithubLink || githubLink}
                onChange={(e) =>
                  setGithubLink(e.target.value)
                }
                disabled={courseCompleted}
                className="w-full border p-2 rounded mb-2"
              />

              <button
                onClick={submitGithubLink}
                disabled={courseCompleted}
                className="px-4 py-2 rounded text-white bg-indigo-600"
              >
                {courseCompleted
                  ? "Submitted ✔"
                  : "Submit Github Link"}
              </button>
            </div>
          )}
        </div>

        {/* COMPLETED */}
        {courseCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-700 mb-2">
              🎉 Course Completed Successfully!
            </h3>
            <Link
              to="/my-certificates"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded"
            >
              View My Certificates
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
