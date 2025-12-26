import { useEffect, useState } from "react";
import api from "../services/api";

export default function Bills() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================
  // GET ENROLLMENTS
  // ======================
  useEffect(() => {
    api
      .get("/student/enrollments/")
      .then((res) => {
        setEnrollments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load bills");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading bills...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Bills</h2>

      {enrollments.length === 0 ? (
        <p>No bills found</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Course</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Payment Date</th>
              <th className="border px-4 py-2">Payment Method</th>
            </tr>
          </thead>

          <tbody>
            {enrollments.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {item.course_title}
                </td>

                <td className="border px-4 py-2 capitalize">
                  {item.status}
                </td>

                <td className="border px-4 py-2">
                  {item.payment_date || "-"}
                </td>

                <td className="border px-4 py-2 capitalize">
                  {item.payment_method}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
