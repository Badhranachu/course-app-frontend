import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiBell, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import "./Navbar.css";
import bekolaLogo from "../assets/bekola-logo.png";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleApply = () => {
    if (user) navigate("/dashboard");
    else navigate("/auth/signup");
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 font-[Inter]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={bekolaLogo}
            alt="Bekola Logo"
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex items-center gap-8">

          <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">
            Home
          </Link>

          <span
            onClick={handleApply}
            className="text-gray-700 hover:text-indigo-600 font-medium cursor-pointer"
          >
            Internship
          </span>

          {/* ✅ Certificate Verification */}
          <Link
            to="/verify-certificate"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Verify Certificate
          </Link>

          {!user ? (
            <>
              <Link
                to="/auth/login"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Login
              </Link>

              <Link
                to="/auth/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium shadow-md"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* Notification */}
              <button className="relative text-gray-700 hover:text-indigo-600">
                <FiBell size={22} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              </button>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                    {user.username?.charAt(0).toUpperCase() ||
                      user.email.charAt(0).toUpperCase()}
                  </div>
                  <FiChevronDown />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-lg py-2 border">

                    <p className="px-4 py-2 font-medium border-b">
                      {user.username || user.email}
                    </p>

                    <Link
                      to="/my-certificates"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      🎓 My Certificates
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block py-3 px-4 hover:bg-gray-100"
          >
            Home
          </Link>

          <span
            onClick={() => {
              handleApply();
              setMenuOpen(false);
            }}
            className="block py-3 px-4 hover:bg-gray-100 cursor-pointer"
          >
            Internship
          </span>

          {/* ✅ Verify Certificate (Mobile) */}
          <Link
            to="/verify-certificate"
            onClick={() => setMenuOpen(false)}
            className="block py-3 px-4 hover:bg-gray-100"
          >
            Verify Certificate
          </Link>

          {!user ? (
            <>
              <Link
                to="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-4 hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                to="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-4 text-indigo-600 font-semibold"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <p className="px-4 py-3 border-t font-medium">
                {user.username || user.email}
              </p>

              <Link
                to="/my-certificates"
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-4 hover:bg-gray-100"
              >
                🎓 My Certificates
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
