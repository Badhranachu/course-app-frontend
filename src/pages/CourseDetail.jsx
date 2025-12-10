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

  // Tree View states
  const [tree, setTree] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const toggleModule = (id) => {
    setOpenModuleId(openModuleId === id ? null : id);
    setTree(null); // reset tree when opening new module
    setSelectedFile(null);
    setFileContent(null);
  };

  useEffect(() => {
    fetchCourse();
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

  // Load ZIP/SINGLE FILE tree
  const loadAttachmentTree = async (videoId) => {
    const res = await api.get(`/videos/${videoId}/attachment-tree/`);
    setTree(res.data.tree);
    setSelectedFile(null);
    setFileContent(null);
  };

  // Load file content
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
    } catch (e) {
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
            dangerouslySetInnerHTML={{ __html: formatDescription(course.description) }}
          />

          <div className="flex justify-between items-center mt-6">
            <div className="text-3xl font-bold text-indigo-600">₹{course.price}</div>

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

          {modules.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-4 shadow-sm mb-4"
            >
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

              {/* Dropdown */}
              {openModuleId === item.id && (
                <div className="mt-3 pl-4 border-l-2 border-indigo-300">

                  {/* Description */}
                  {item.description && (
                    <div
                      className="text-gray-600 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(item.description),
                      }}
                    />
                  )}

                  {/* VIDEO ENTRY */}
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
                          <h4 className="text-white mb-2">
                            {selectedFile}
                          </h4>
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
        </div>
      </div>
    </div>
  );
}
