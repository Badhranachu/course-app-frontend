import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE ;

export default function CertificateCheck() {
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/certificate/check/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference_number: reference,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid reference number");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Certificate Verification
        </h1>

        <form onSubmit={handleCheck} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Reference Number (e.g. NEX/INT/2025/65)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition"
          >
            {loading ? "Checking..." : "Verify Certificate"}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-md">
            ❌ {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 p-5 rounded-md space-y-2">
            <p className="text-green-700 font-semibold">
              ✅ Certificate is valid
            </p>

            <p><strong>Reference:</strong> {result.reference_number}</p>
            <p><strong>Student:</strong> {result.student_name}</p>
            <p><strong>Course:</strong> {result.course}</p>
            <p><strong>Issued On:</strong> {result.issued_on}</p>

            <a
              href={result.certificate_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 text-indigo-600 font-semibold hover:underline"
            >
              📄 View / Download Certificate
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
