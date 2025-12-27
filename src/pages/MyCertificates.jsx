import { useEffect, useState } from "react";
import api from "../services/api";

export default function MyCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    api
      .get("/certificate/my/")
      .then((res) => setCerts(res.data))
      .finally(() => setLoading(false));
  }, []);

  // ✅ AUTHENTICATED DOWNLOAD (BLOB)
  const downloadCertificate = async (url, filename) => {
    try {
      setDownloading(filename);

      const res = await api.get(url, {
        responseType: "blob", // 🔑 IMPORTANT
      });

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to download certificate");
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading certificates…
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          My Certificates
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Download certificates for completed courses
        </p>
      </div>

      {/* ================= CONTENT ================= */}
      {certs.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-gray-500">
          🎓 No certificates available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((c, index) => {
            const filename = `${c.course_name}-certificate.pdf`;

            return (
              <div
                key={index}
                className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between"
              >
                {/* INFO */}
                <div>
                  <h2 className="font-semibold text-gray-900 mb-2">
                    {c.course_name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Certificate of Completion
                  </p>
                </div>

                {/* ACTION */}
                <button
                  onClick={() =>
                    downloadCertificate(c.certificate_url, filename)
                  }
                  disabled={downloading === filename}
                  className={`mt-4 inline-flex items-center justify-center gap-2
                    text-white text-sm font-medium px-4 py-2 rounded-lg transition
                    ${
                      downloading === filename
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }
                  `}
                >
                  {downloading === filename
                    ? "Downloading…"
                    : "⬇ Download PDF"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
