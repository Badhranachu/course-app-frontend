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

  // ===============================
  // Fetch test
  // ===============================
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

  // ===============================
  // Select answer
  // ===============================
  const handleSelect = (qid, opt) => {
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  // ===============================
  // Submit test
  // ===============================
  const handleSubmit = async () => {
    if (!window.confirm("Submit test?")) return;

    try {
      await api.post(
        `/courses/${course_id}/tests/${test_id}/submit/`,
        { answers }
      );

      // Get latest attempt
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

  if (loading) return <div className="p-10 text-center">Loading…</div>;
  if (!test) return <div className="p-10 text-center text-red-600">Test not found</div>;

  // ===============================
  // REVIEW MODE (AFTER SUBMIT)
  // ===============================
  if (attempted && review) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-2">
          {review.test_name}
        </h1>

        <p className="text-lg mb-6">
          Score: <b>{review.score}</b> / {review.total_marks}
        </p>

        {review.answers.map((a, index) => {
          // 🔑 find full question
          const q = test.questions.find(
            (x) => x.text === a.question
          );

          const getOptionText = (opt) =>
            q ? q[`option_${opt.toLowerCase()}`] : "";

          return (
            <div
              key={index}
              className="border p-4 rounded-lg mb-6 bg-gray-50"
            >
              <h2 className="font-semibold mb-3">
                {index + 1}. {a.question}
              </h2>

              {["A", "B", "C", "D"].map((opt) => {
                let cls = "text-gray-800";

                if (opt === a.correct_answer) {
                  cls = "text-green-600 font-bold";
                } else if (
                  opt === a.selected_answer &&
                  !a.is_correct
                ) {
                  cls = "text-red-600 font-bold";
                }

                return (
                  <div key={opt} className={cls}>
                    {opt}. {getOptionText(opt)}
                    {opt === a.selected_answer && " • your answer"}
                    {opt === a.correct_answer && " • correct"}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // ===============================
  // TEST MODE
  // ===============================
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-4">{test.name}</h1>
      <p className="text-gray-600 mb-6">{test.description}</p>

      {test.questions.map((q, index) => (
        <div key={q.id} className="mb-6 border-b pb-4">
          <h2 className="font-semibold mb-3">
            {index + 1}. {q.text}
          </h2>

          {["A", "B", "C", "D"].map((opt) => (
            <label key={opt} className="flex items-center gap-3">
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

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Submit Test
      </button>
    </div>
  );
}
