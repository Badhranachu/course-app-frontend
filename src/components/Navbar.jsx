import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiBell, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
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
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleApply = () => {
    if (user) navigate("/dashboard");
    else navigate("/auth/signup");
    setMenuOpen(false);
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

        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={bekolaLogo}
            alt="Bekola Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex items-center gap-8">

          <Link to="/" className="nav-link">Home</Link>

          <span onClick={handleApply} className="nav-link cursor-pointer">
            Internship
          </span>

          <Link to="/verify-certificate" className="nav-link">
            Verify Certificate
          </Link>

          {!user ? (
            <>
              <Link to="/auth/login" className="nav-link">Login</Link>
              <Link
                to="/auth/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* Notifications */}
              <Link to="/announcements">
                <button className="relative text-gray-700 hover:text-indigo-600">
                  <FiBell size={22} />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                </button>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <FiChevronDown />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg py-2">
                    <DropdownLink to="/profile" onClick={() => setProfileOpen(false)}>
                      👤 Profile
                    </DropdownLink>
                    <DropdownLink to="/bills" onClick={() => setProfileOpen(false)}>
                      💳 Bills
                    </DropdownLink>
                    <DropdownLink to="/my-certificates" onClick={() => setProfileOpen(false)}>
                      🎓 My Certificates
                    </DropdownLink>
                    <DropdownLink to="/support" onClick={() => setProfileOpen(false)}>
                      🧑‍💻 Support
                    </DropdownLink>
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

          <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>

          <MobileLink onClick={handleApply}>Internship</MobileLink>

          <MobileLink to="/verify-certificate" onClick={() => setMenuOpen(false)}>
            Verify Certificate
          </MobileLink>

          {!user ? (
            <>
              <MobileLink to="/auth/login" onClick={() => setMenuOpen(false)}>
                Login
              </MobileLink>
              <MobileLink to="/auth/signup" onClick={() => setMenuOpen(false)}>
                Sign Up
              </MobileLink>
            </>
          ) : (
            <>
              <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>
                👤 Profile
              </MobileLink>
              <MobileLink to="/bills" onClick={() => setMenuOpen(false)}>
                💳 Bills
              </MobileLink>
              <MobileLink to="/my-certificates" onClick={() => setMenuOpen(false)}>
                🎓 My Certificates
              </MobileLink>
              <MobileLink to="/announcements" onClick={() => setMenuOpen(false)}>
                Announcements
              </MobileLink>
              <MobileLink to="/support" onClick={() => setMenuOpen(false)}>
                Support
              </MobileLink>
              <button
                onClick={handleLogout}
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

/* ================= SMALL HELPERS ================= */

const DropdownLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 hover:bg-gray-100"
  >
    {children}
  </Link>
);

const MobileLink = ({ to, children, onClick }) =>
  to ? (
    <Link to={to} onClick={onClick} className="block py-3 px-4 hover:bg-gray-100">
      {children}
    </Link>
  ) : (
    <span onClick={onClick} className="block py-3 px-4 hover:bg-gray-100 cursor-pointer">
      {children}
    </span>
  );

export default Navbar;
