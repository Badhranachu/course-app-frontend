import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiMail, FiLock } from "react-icons/fi";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      // Axios-safe error handling
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Invalid email or password";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-6 py-10">
      
      {/* PAGE HEADING */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-700 mb-6">
        Nexston Internship Portal – Login
      </h1>

      <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT BANNER */}
        <div className="hidden md:flex flex-col justify-center bg-indigo-600 text-white p-10">
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-lg text-indigo-100 leading-relaxed">
            Access your dashboard, manage projects, explore internships,
            and continue learning with Bekola.
          </p>

          <div className="mt-8 space-y-3 text-indigo-100">
            <p>✔ Access project dashboard</p>
            <p>✔ Track internship progress</p>
            <p>✔ Manage AI & automation tools</p>
            <p>✔ Connect with mentors</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Sign in to your Account
          </h2>

          <p className="text-center text-gray-600 mb-8">
            New here?{" "}
            <Link
              to="/auth/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="flex items-center border rounded-lg mt-1 px-3">
                <FiMail className="text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full p-2 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="flex items-center border rounded-lg mt-1 px-3">
                <FiLock className="text-gray-500" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full p-2 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-lg font-semibold shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
