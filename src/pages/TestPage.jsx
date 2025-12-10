import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function TestPage() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const [score, setScore] = useState(null);
  const [total, setTotal] = useState(null);
  const [results, setResults] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTest();
  }, [id]);

  const fetchTest = async () => {
    try {
      const res = await api.get(`/test/${id}/`);
      
      setAttempted(res.data.attempted);
      setScore(res.data.score);
      setTotal(res.data.total_marks);

      // Received test object
      setTest(res.data.test);

      // Attempt result details
      if (res.data.results) {
        setResults(res.data.results);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qid, opt) => {
    setAnswers({ ...answers, [qid]: opt });
  };

  const handleSubmit = async () => {
    if (!window.confirm("Submit test?")) return;

    try {
      const res = await api.post(`/test/${id}/submit/`, {
        answers: answers,
      });

      alert(`Score: ${res.data.score}/${res.data.total_marks}`);
      fetchTest(); // reload page with results

    } catch (err) {
      alert(err.response?.data?.error || "Submission failed");
    }
  };

  const optionText = (q, opt) => q[`option_${opt.toLowerCase()}`];

  if (loading) return <div className="p-10 text-center">Loading test…</div>;
  if (!test) return <div className="p-10 text-center text-red-600">Test not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">

      {/* ==============================
          ALREADY ATTEMPTED VIEW
      =============================== */}
      {attempted ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{test.name}</h1>

          <p className="text-green-600 text-xl font-semibold">
            ✅ You already attempted this test
          </p>

          <p className="mt-2 text-lg">
            Score: <b>{score}</b> / {total}
          </p>

          {/* ==============================
              DISPLAY ANSWER REVIEW
          =============================== */}
          <div className="mt-8 space-y-6">
            {results.map((r, index) => {
              
              // option color logic
              const getColor = (opt) => {
                if (opt === r.correct_answer)
                  return "text-green-600 font-bold"; // correct answer

                if (opt === r.selected_answer && !r.is_correct)
                  return "text-red-600 font-bold"; // wrong chosen

                return "text-gray-800";
              };

              return (
                <div
                  key={index}
                  className="border p-4 rounded-lg bg-gray-50 shadow-sm"
                >
                  <h2 className="font-semibold mb-3">
                    {index + 1}. {r.question}
                  </h2>

                  <ul className="space-y-2">

                    <li className={getColor("A")}>
                      A. {r.option_a}
                      {r.selected_answer === "A" && " • your answer"}
                    </li>

                    <li className={getColor("B")}>
                      B. {r.option_b}
                      {r.selected_answer === "B" && " • your answer"}
                    </li>

                    <li className={getColor("C")}>
                      C. {r.option_c}
                      {r.selected_answer === "C" && " • your answer"}
                    </li>

                    <li className={getColor("D")}>
                      D. {r.option_d}
                      {r.selected_answer === "D" && " • your answer"}
                    </li>

                  </ul>
                </div>
              );
            })}
          </div>
        </>
      ) : (

      /* ==============================
         NEW TEST ATTEMPT VIEW
      =============================== */
        <>
          <h1 className="text-3xl font-bold mb-4">{test.name}</h1>
          <p className="text-gray-600 mb-6">{test.description}</p>

          {test.questions.map((q, index) => (
            <div key={q.id} className="mb-6 border-b pb-4">

              <h2 className="font-semibold mb-3">
                {index + 1}. {q.text}
              </h2>

              {["A", "B", "C", "D"].map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    checked={answers[q.id] === opt}
                    onChange={() => handleSelect(q.id, opt)}
                  />
                  <span>{optionText(q, opt)}</span>
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
          >
            Submit Test
          </button>
        </>
      )}
    </div>
  );
}
