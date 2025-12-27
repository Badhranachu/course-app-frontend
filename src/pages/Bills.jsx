import { useEffect, useState } from "react";
import api from "../services/api";

export default function Bills() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/student/enrollments/")
      .then((res) => {
        setEnrollments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load payment records");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading payments…
      </p>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Payments & Bills
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View your course payments and enrollment status
        </p>
      </div>

      {/* ================= CONTENT ================= */}
      {enrollments.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-gray-500">
          No payment records found.
        </div>
      ) : (
        <>
          {/* ===== Mobile / Tablet Cards ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
            {enrollments.map((item, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl shadow-sm p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {item.course_title}
                  </h3>
                  <StatusBadge status={item.status} />
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="text-gray-400">Payment Date:</span>{" "}
                    {item.payment_date || "—"}
                  </p>
                  <p>
                    <span className="text-gray-400">Method:</span>{" "}
                    <span className="capitalize">
                      {item.payment_method}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ===== Desktop Table ===== */}
          <div className="hidden lg:block bg-white border rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left">Course</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Payment Date</th>
                  <th className="px-6 py-4 text-left">Method</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {enrollments.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.course_title}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {item.payment_date || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-700 capitalize">
                      {item.payment_method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatusBadge({ status }) {
  const map = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
