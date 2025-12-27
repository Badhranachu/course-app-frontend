import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function TestPage() {
  const { course_id, test_id } = useParams();

  const [test, setTest] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const [score, setScore] = useState(null);
  const [total, setTotal] = useState(null);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!course_id || !test_id) return;
    fetchTest();
  }, [course_id, test_id]);

  const fetchTest = async () => {
    try {
      const res = await api.get(
        `/courses/${course_id}/tests/${test_id}/`
      );
      setAttempted(res.data.attempted);
      setScore(res.data.score);
      setTotal(res.data.total_marks);
      setTest(res.data.test);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qid, opt) => {
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  const handleSubmit = async () => {
    if (!window.confirm("Submit test?")) return;

    try {
      await api.post(
        `/courses/${course_id}/tests/${test_id}/submit/`,
        { answers }
      );

      const history = await api.get(
        `/courses/${course_id}/tests/history/`
      );

      const latest = history.data.find(
        (h) => h.test_id === Number(test_id)
      );

      const detail = await api.get(
        `/courses/${course_id}/tests/history/${latest.id}/`
      );

      setReview(detail.data);
      setAttempted(true);
      setScore(detail.data.score);
      setTotal(detail.data.total_marks);
    } catch (err) {
      alert(err.response?.data?.error || "Submission failed");
    }
  };

  if (loading)
    return <div className="p-10 text-center text-gray-500">Loading test…</div>;

  if (!test)
    return <div className="p-10 text-center text-red-600">Test not found</div>;

  /* ================= REVIEW MODE ================= */
  if (attempted && review) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl p-6 shadow mb-6">
          <h1 className="text-3xl font-bold">{review.test_name}</h1>
          <p className="mt-2 text-lg">
            Score <b>{review.score}</b> / {review.total_marks}
          </p>
        </div>

        {review.answers.map((a, index) => {
          const q = test.questions.find(
            (x) => x.text === a.question
          );

          const getOptionText = (opt) =>
            q ? q[`option_${opt.toLowerCase()}`] : "";

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-5 mb-6 border"
            >
              <h2 className="font-semibold mb-4">
                {index + 1}. {a.question}
              </h2>

              {["A", "B", "C", "D"].map((opt) => {
                let cls =
                  "p-3 rounded-lg mb-2 border flex justify-between";

                if (opt === a.correct_answer)
                  cls += " bg-green-50 border-green-400 text-green-700";
                else if (
                  opt === a.selected_answer &&
                  !a.is_correct
                )
                  cls += " bg-red-50 border-red-400 text-red-700";
                else cls += " bg-gray-50";

                return (
                  <div key={opt} className={cls}>
                    <span>
                      {opt}. {getOptionText(opt)}
                    </span>
                    {opt === a.correct_answer && <b>✓</b>}
                    {opt === a.selected_answer &&
                      opt !== a.correct_answer && <b>✕</b>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  /* ================= TEST MODE ================= */
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-3xl font-bold">{test.name}</h1>
        <p className="text-gray-600 mt-2">{test.description}</p>
      </div>

      {test.questions.map((q, index) => (
        <div
          key={q.id}
          className="bg-white rounded-xl shadow p-5 mb-6 border"
        >
          <h2 className="font-semibold mb-4">
            {index + 1}. {q.text}
          </h2>

          {["A", "B", "C", "D"].map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-3 p-3 rounded-lg border mb-2 cursor-pointer transition
                ${
                  answers[q.id] === opt
                    ? "bg-green-50 border-green-500"
                    : "hover:bg-gray-50"
                }`}
            >
              <input
                type="radio"
                name={`q_${q.id}`}
                checked={answers[q.id] === opt}
                onChange={() => handleSelect(q.id, opt)}
              />
              <span>{q[`option_${opt.toLowerCase()}`]}</span>
            </label>
          ))}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}
