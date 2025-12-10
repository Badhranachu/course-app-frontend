import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiMail, FiUser, FiLock } from "react-icons/fi";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await signup(
        formData.email,
        formData.username,
        formData.password,
        formData.password2
      );
      alert("Signup successful! Please login to continue.");
      navigate("/auth/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.password?.[0] ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-6 py-10">

    {/* 🔥 PAGE HEADING */}
    <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-700 mb-6">
      Bekola Internship Portal – Signup
    </h1>

    <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

      {/* LEFT SIDE BANNER */}
      <div className="hidden md:flex flex-col justify-center bg-indigo-600 text-white p-10">
        <h2 className="text-4xl font-bold mb-4">Join Bekola Technical Solutions</h2>
        <p className="text-lg text-indigo-100 leading-relaxed">
          Start your journey with high-quality training, internships and
          hands-on engineering experience.
        </p>

        <div className="mt-8 space-y-3 text-indigo-100">
          <p>✔ Industry-level Internships</p>
          <p>✔ Microservices, AI, MERN Stack</p>
          <p>✔ Real Live Projects</p>
          <p>✔ Placement Assistance</p>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="p-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Create your Account
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-indigo-600 font-semibold hover:underline">
            Login
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

          {/* Username */}
          <div>
            <label className="text-sm font-medium">Username</label>
            <div className="flex items-center border rounded-lg mt-1 px-3">
              <FiUser className="text-gray-500" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
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

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="flex items-center border rounded-lg mt-1 px-3">
              <FiLock className="text-gray-500" />
              <input
                type="password"
                name="password2"
                required
                value={formData.password2}
                onChange={handleChange}
                placeholder="Re-enter password"
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  </div>
);

}

export default Signup;
