import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiMail, FiUser, FiLock } from "react-icons/fi";
import api from "../services/api";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    gender: "",
    password: "",
    password2: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ===============================
  // SEND OTP
  // ===============================
  const sendOtp = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/send-otp/", {
        email: formData.email,
      });
      setOtpSent(true);
      setMessage("OTP sented. Verify to unlock the remaining fields.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // VERIFY OTP
  // ===============================
  const verifyOtp = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/verify-otp/", {
        email: formData.email,
        otp,
      });
      setOtpVerified(true);
      setMessage("Email verified successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // SIGNUP
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otpVerified) {
      setError("Please verify your email first");
      return;
    }

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup(
        formData.email,
        formData.full_name,
        formData.gender,
        formData.password,
        formData.password2
      );

      alert("Signup successful! Please login to continue.");
      navigate("/auth/login");
    } catch (err) {
console.log("SIGNUP ERROR:", err.response?.data);

setError(
  err.response?.data?.errors
    ? Object.values(err.response.data.errors).flat().join(", ")
    : "Signup failed"
);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-6 py-10">

      {/* 🔥 PAGE HEADING */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-700 mb-6">
        Nexston Internship Portal – Signup
      </h1>

      <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE BANNER */}
        <div className="hidden md:flex flex-col justify-center bg-indigo-600 text-white p-10">
          <h2 className="text-4xl font-bold mb-4">
            Join Nexton Corporations
          </h2>
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
            <Link
              to="/auth/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 text-green-700 border border-green-300 px-4 py-3 rounded mb-4 text-sm">
              {message}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="flex items-center gap-2 border rounded-lg mt-1 px-3">
                <FiMail className="text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  disabled={otpVerified}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full p-2 bg-transparent outline-none"
                />
                {!otpSent && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={!formData.email || loading}
                    className="text-sm bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    Send OTP
                  </button>
                )}
              </div>
            </div>

            {/* OTP */}
            {otpSent && !otpVerified && (
              <div>
                <label className="text-sm font-medium">OTP</label>
                <div className="flex items-center gap-2 border rounded-lg mt-1 px-3">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full p-2 outline-none"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={loading}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}

            {/* USERNAME */}
            <div>
              <label className="text-sm font-medium">Username</label>
              <div className="flex items-center border rounded-lg mt-1 px-3">
                <FiUser className="text-gray-500" />
                <input
                  type="text"
                  name="full_name"
                  disabled={!otpVerified}
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full p-2 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* GENDER */}
<div>
  <label className="text-sm font-medium">Gender</label>
  <div className="flex gap-6 mt-2">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="gender"
        value="male"
        disabled={!otpVerified}
        checked={formData.gender === "male"}
        onChange={handleChange}
      />
      <span>Male</span>
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="gender"
        value="female"
        disabled={!otpVerified}
        checked={formData.gender === "female"}
        onChange={handleChange}
      />
      <span>Female</span>
    </label>
  </div>
</div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="flex items-center border rounded-lg mt-1 px-3">
                <FiLock className="text-gray-500" />
                <input
                  type="password"
                  name="password"
                  disabled={!otpVerified}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full p-2 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="flex items-center border rounded-lg mt-1 px-3">
                <FiLock className="text-gray-500" />
                <input
                  type="password"
                  name="password2"
                  disabled={!otpVerified}
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full p-2 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={!otpVerified || loading}
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
