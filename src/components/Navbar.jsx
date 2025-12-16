import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiBell, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import "./Navbar.css";

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

  // ⭐ Internship navigation
  const handleApply = () => {
    if (user) navigate("/dashboard");
    else navigate("/auth/signup");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 font-[Inter]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 tracking-tight"
        >
          Bekola
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className="text-gray-700 hover:text-indigo-600 transition font-medium"
          >
            Home
          </Link>

          {/* ⭐ Internship Text Link */}
          <span
            onClick={handleApply}
            className="text-gray-700 hover:text-indigo-600 transition font-medium cursor-pointer"
          >
            Internship
          </span>

          {!user ? (
            <>
              <Link
                to="/auth/login"
                className="text-gray-700 hover:text-indigo-600 transition font-medium"
              >
                Login
              </Link>

              <Link
                to="/auth/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium shadow-md transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* Notification Icon */}
              <button className="relative text-gray-700 hover:text-indigo-600 transition">
                <FiBell size={22} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                    {user.username?.charAt(0).toUpperCase() ||
                      user.email.charAt(0).toUpperCase()}
                  </div>
                  <FiChevronDown />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-lg py-2 border border-gray-100 animate-fadeIn">

                    <p className="px-4 py-2 text-gray-700 font-medium border-b">
                      {user.username || user.email}
                    </p>

                    <Link
                      to="/my-certificates"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium"
                      onClick={() => setProfileOpen(false)}
                    >
                      🎓 My Certificates
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md animate-slideDown">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block py-3 px-4 text-gray-700 hover:bg-gray-100 font-medium"
          >
            Home
          </Link>

          {/* ⭐ Mobile Internship */}
          <span
            onClick={() => {
              handleApply();
              setMenuOpen(false);
            }}
            className="block py-3 px-4 text-gray-700 hover:text-indigo-600 font-medium cursor-pointer"
          >
            Internship
          </span>

          {!user ? (
            <>
              <Link
                to="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-4 text-gray-700 hover:bg-gray-100 font-medium"
              >
                Login
              </Link>

              <Link
                to="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-4 text-indigo-600 hover:bg-gray-100 font-semibold"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <p className="px-4 py-3 text-gray-700 font-medium border-t">
                {user.username || user.email}
              </p>

              <Link
                to="/my-certificates"
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-4 text-gray-700 hover:bg-gray-100 font-medium"
              >
                🎓 My Certificates
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-red-600 font-medium hover:bg-red-50"
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
