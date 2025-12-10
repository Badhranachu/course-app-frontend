import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import TreeView from "../components/TreeView";
import { loadRazorpayScript, handleRazorpayPayment } from "../services/razorpay";

// Format description
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

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModuleId, setOpenModuleId] = useState(null);

  // Tree View
  const [tree, setTree] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  // NEW STATES
  const [openGithub, setOpenGithub] = useState(false);
  const [openCertificate, setOpenCertificate] = useState(false);
  const [githubLink, setGithubLink] = useState("");
  const [savedGithubLink, setSavedGithubLink] = useState(null);
  const [sendingCertificate, setSendingCertificate] = useState(false);

  const toggleModule = (id) => {
    setOpenModuleId(openModuleId === id ? null : id);
    setTree(null);
    setSelectedFile(null);
    setFileContent(null);
  };

  // Load initial data
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

  // 👉 Check if Github link already saved for this user + course
  const fetchGithubStatus = async () => {
    try {
      const res = await api.get(`/certificate/github-link/${id}/`);
      setSavedGithubLink(res.data.github_link);
    } catch (err) {
      console.log("No Github link found for this course.");
    }
  };

  // 👉 Save Github link (only once per user+course)
  const submitGithubLink = async () => {
    if (!githubLink.trim()) {
      alert("Please enter a valid Github repository link.");
      return;
    }

    try {
      await api.post("/certificate/github-link/", {
        course_id: id,
        github_link: githubLink.trim(),
      });

      alert("Github link submitted!");
      setSavedGithubLink(githubLink.trim()); // update UI
      setGithubLink("");
    } catch (err) {
      alert(
        err?.response?.data?.error ||
          "Failed to submit link. Please try again."
      );
    }
  };

  // 👉 Send certificate to user's email
  const sendCertificate = async () => {
    if (!savedGithubLink) {
      alert(
        "Please submit your Github repository link in the 'Github Files' section before requesting the certificate."
      );
      return;
    }

    try {
      setSendingCertificate(true);
      const res = await api.post(`/certificate/send/${id}/`);
      alert(res.data.message || "Certificate sent to your registered email.");
    } catch (err) {
      alert(
        err?.response?.data?.error ||
          "Failed to send certificate. Please try again later."
      );
    } finally {
      setSendingCertificate(false);
    }
  };

  // Video File Tree
  const loadAttachmentTree = async (videoId) => {
    const res = await api.get(`/videos/${videoId}/attachment-tree/`);
    setTree(res.data.tree);
    setSelectedFile(null);
    setFileContent(null);
  };

  const loadFileContent = async (videoId, filePath) => {
    const res = await api.get(
      `/videos/${videoId}/attachment-content/${filePath}/`
    );
    setSelectedFile(filePath);
    setFileContent(res.data.content);
  };

  // Payment
  const handleEnroll = async () => {
    try {
      await loadRazorpayScript();
      const order = await api.post("/payment/create-order/", { course_id: id });

      const pay = await handleRazorpayPayment({
        ...order.data,
        name: course.title,
        description: course.description,
      });

      await api.post("/payment/verify/", {
        ...pay,
        course_id: id,
      });

      alert("Enrollment successful");
      fetchCourse();
    } catch {
      alert("Payment failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 font-[Inter]">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white shadow-sm border rounded-2xl p-8">
          <h1 className="text-4xl font-extrabold">{course.title}</h1>

          <div
            className="text-gray-700 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{
              __html: formatDescription(course.description),
            }}
          />

          <div className="flex justify-between items-center mt-6">
            <div className="text-3xl font-bold text-indigo-600">
              ₹{course.price}
            </div>

            <div className="flex items-center gap-4">
              {course.is_enrolled && (
                <Link
                  to={`/course/${id}/test-history`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  📘 View Test History
                </Link>
              )}

              {!course.is_active ? (
                <button className="bg-gray-400 text-white px-6 py-2 rounded-md">
                  Locked
                </button>
              ) : course.is_enrolled ? (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full">
                  ✓ Enrolled
                </span>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow-sm border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-5">Course Content</h2>

          {/* Dynamic modules */}
          {modules.map((item) => (
            <div key={item.id} className="border rounded-xl p-4 shadow-sm mb-4">
              <div
                className="flex justify-between cursor-pointer"
                onClick={() => toggleModule(item.id)}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {item.item_type === "video" ? "🎬" : "📝"} {item.title}
                </h3>
                <span className="text-xl">
                  {openModuleId === item.id ? "▲" : "▼"}
                </span>
              </div>

              {openModuleId === item.id && (
                <div className="mt-3 pl-4 border-l-2 border-indigo-300">
                  {item.description && (
                    <div
                      className="text-gray-600 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(item.description),
                      }}
                    />
                  )}

                  {item.item_type === "video" ? (
                    <div className="mt-4 space-y-4">
                      <Link to={`/video/${item.item_id}`}>
                        <img
                          src={item.thumbnail || "/default-thumb.png"}
                          className="w-40 h-24 rounded shadow border"
                        />
                      </Link>

                      {item.attachment_url && (
                        <button
                          onClick={() => loadAttachmentTree(item.item_id)}
                          className="bg-gray-200 px-3 py-1 rounded"
                        >
                          📂 View Code Files
                        </button>
                      )}

                      {tree && (
                        <TreeView
                          tree={tree}
                          onSelect={(filePath) =>
                            loadFileContent(item.item_id, filePath)
                          }
                        />
                      )}

                      {fileContent && (
                        <div className="mt-4 bg-black text-green-400 p-4 rounded overflow-x-auto text-sm">
                          <h4 className="text-white mb-2">{selectedFile}</h4>
                          <pre>{fileContent}</pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={`/test/${item.item_id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-md inline-block mt-4"
                    >
                      Start Test →
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* FIXED BLOCK — GITHUB */}
          <div className="border rounded-xl p-4 shadow-sm mb-4">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() => setOpenGithub(!openGithub)}
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                📦 Github Files
              </h3>
              <span className="text-xl">{openGithub ? "▲" : "▼"}</span>
            </div>

            {openGithub && (
              <div className="mt-3 pl-4 border-l-2 border-indigo-300 text-sm text-gray-700">
                {savedGithubLink ? (
                  <div className="p-3 bg-green-100 text-green-800 rounded">
                    <p className="font-semibold">Github Link Uploaded</p>
                    <a
                      href={savedGithubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {savedGithubLink}
                    </a>
                  </div>
                ) : (
                  <>
                    <p className="mb-3">Paste your Github repository link:</p>

                    <input
                      type="text"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="w-full border p-2 rounded mb-3"
                    />

                    <button
                      onClick={submitGithubLink}
                      className="bg-indigo-600 text-white px-4 py-2 rounded shadow"
                    >
                      Submit Github Link
                    </button>
                  </>
                )}

                <hr className="my-4" />

                <button className="mt-3 bg-gray-200 px-3 py-1 rounded">
                  📂 View Github Files
                </button>
              </div>
            )}
          </div>

          {/* FIXED BLOCK — CERTIFICATE */}
          <div className="border rounded-xl p-4 shadow-sm mb-4">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() => setOpenCertificate(!openCertificate)}
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                🧾 Certificate
              </h3>
              <span className="text-xl">
                {openCertificate ? "▲" : "▼"}
              </span>
            </div>

            {openCertificate && (
              <div className="mt-3 pl-4 border-l-2 border-indigo-300 text-sm text-gray-700">
                <p>
                  Your certificate will be generated and sent to your registered
                  email after you submit your Github project link.
                </p>

                <button
                  onClick={sendCertificate}
                  disabled={sendingCertificate}
                  className={`mt-3 px-4 py-2 rounded text-white ${
                    sendingCertificate
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600"
                  }`}
                >
                  {sendingCertificate
                    ? "Sending..."
                    : "⬇️ Send Certificate to Email"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
