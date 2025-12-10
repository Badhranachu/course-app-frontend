import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function TestHistoryPage() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [id]);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/courses/${id}/test-history/`);
      setHistory(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">

      <h1 className="text-3xl font-bold mb-6">Test History</h1>

      {history.length === 0 ? (
        <p className="text-gray-500">You haven't attempted any tests yet.</p>
      ) : (
        <>
          {history.map((item, idx) => (
            <div key={idx} className="border p-4 rounded-xl mb-4">

              {/* HEADER */}
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{item.test_name}</h2>
                  <p className="text-gray-500 text-sm">
                    Submitted: {new Date(item.submitted_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right font-bold text-indigo-600">
                  Score: {item.score}/{item.total_marks}
                </div>
              </div>

              {/* Toggle button */}
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="mt-3 text-blue-600 underline text-sm"
              >
                {openIndex === idx ? "Hide Details" : "View Details →"}
              </button>

              {/* ANSWERS */}
              {openIndex === idx && (
                <div className="mt-4 space-y-4">

                  {item.answers.map((ans, qIndex) => (
                    <div key={qIndex} className="border-b pb-4">
                      <h3 className="font-semibold mb-2">
                        {qIndex + 1}. {ans.question_text}
                      </h3>

                      {["A", "B", "C", "D"].map((opt) => {
                        const text = ans[`option_${opt.toLowerCase()}`];

                        let classes =
                          "px-3 py-2 rounded-md border mb-1";

                        if (opt === ans.correct_answer) {
                          classes += " bg-green-100 border-green-600 text-green-700";
                        } else if (opt === ans.selected_answer && !ans.is_correct) {
                          classes += " bg-red-100 border-red-600 text-red-700";
                        } else {
                          classes += " bg-gray-50 border-gray-300";
                        }

                        return (
                          <div key={opt} className={classes}>
                            <span className="font-bold">{opt}.</span> {text}
                          </div>
                        );
                      })}

                      <p className="text-sm mt-2">
                        {ans.is_correct ? (
                          <span className="text-green-600 font-semibold">✔ Correct</span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            ✘ Your answer: {ans.selected_answer}
                          </span>
                        )}
                      </p>
                    </div>
                  ))}

                </div>
              )}

            </div>
          ))}
        </>
      )}
    </div>
  );
}
