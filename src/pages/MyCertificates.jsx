import { useEffect, useState } from "react";
import api from "../services/api";

export default function MyCertificates() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    api.get("/certificate/my/")
      .then(res => setCerts(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">🎓 Completed Certificates</h1>

      {certs.length === 0 ? (
        <p className="text-gray-600">No certificates available yet.</p>
      ) : (
        <div className="space-y-4">
          {certs.map((c, index) => (
            <div key={index} className="p-4 border rounded-lg flex justify-between">
              <div>
                <h2 className="font-semibold">{c.course_name}</h2>
                <a
                  href={c.github_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Github Project
                </a>
              </div>

              <a
                href={c.certificate_url}
                download
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
