import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function TestHistoryPage() {
  const { id } = useParams(); // course_id

  const [history, setHistory] = useState([]);
  const [details, setDetails] = useState({});
  const [tests, setTests] = useState({});
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Load history list
  // -------------------------------
  useEffect(() => {
    fetchHistory();
  }, [id]);

  const fetchHistory = async () => {
    try {
      const res = await api.get(
        `/courses/${id}/tests/history/`
      );
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Load details per attempt
  // -------------------------------
  const loadDetails = async (studentTestId, testId) => {
    if (details[studentTestId]) {
      setOpenId(openId === studentTestId ? null : studentTestId);
      return;
    }

    try {
      const [detailRes, testRes] = await Promise.all([
        api.get(
          `/courses/${id}/tests/history/${studentTestId}/`
        ),
        api.get(`/courses/${id}/tests/${testId}/`),
      ]);

      setDetails((prev) => ({
        ...prev,
        [studentTestId]: detailRes.data,
      }));

      setTests((prev) => ({
        ...prev,
        [testId]: testRes.data.test,
      }));

      setOpenId(studentTestId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Test History</h1>

        <Link
          to={`/course/${id}`}
          className="text-blue-600 underline text-sm"
        >
          ← Back to Course
        </Link>
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500">
          You haven't attempted any tests yet.
        </p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-xl mb-4"
          >
            {/* HEADER */}
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold text-lg">
                  {item.test_name}
                </h2>
                <p className="text-gray-500 text-sm">
                  Submitted:{" "}
                  {new Date(item.submitted_at).toLocaleString()}
                </p>
              </div>

              <div className="text-right font-bold">
                <div className="text-indigo-600">
                  {item.score}/{item.total_marks}
                </div>
                <div className="text-sm">
                  {item.passed ? (
                    <span className="text-green-600">✔ Passed</span>
                  ) : (
                    <span className="text-red-600">✘ Failed</span>
                  )}
                </div>
              </div>
            </div>

            {/* TOGGLE */}
            <button
              onClick={() =>
                loadDetails(item.id, item.test_id)
              }
              className="mt-3 text-blue-600 underline text-sm"
            >
              {openId === item.id
                ? "Hide Details"
                : "View Details →"}
            </button>

            {/* DETAILS */}
            {openId === item.id &&
              details[item.id] &&
              tests[item.test_id] && (
                <div className="mt-4 space-y-4">
                  {details[item.id].answers.map(
                    (ans, idx) => {
                      const q =
                        tests[item.test_id].questions.find(
                          (qq) => qq.text === ans.question
                        );

                      const getText = (opt) =>
                        q
                          ? q[
                              `option_${opt.toLowerCase()}`
                            ]
                          : "";

                      return (
                        <div
                          key={idx}
                          className="border-b pb-4"
                        >
                          <h3 className="font-semibold mb-2">
                            {idx + 1}. {ans.question}
                          </h3>

                          {["A", "B", "C", "D"].map((opt) => {
                            let cls =
                              "px-3 py-2 rounded-md border mb-1 ";

                            if (opt === ans.correct_answer) {
                              cls +=
                                "bg-green-100 border-green-600 text-green-700";
                            } else if (
                              opt === ans.selected_answer &&
                              !ans.is_correct
                            ) {
                              cls +=
                                "bg-red-100 border-red-600 text-red-700";
                            } else {
                              cls +=
                                "bg-gray-50 border-gray-300";
                            }

                            return (
                              <div key={opt} className={cls}>
                                <b>{opt}.</b> {getText(opt)}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
          </div>
        ))
      )}
    </div>
  );
}
