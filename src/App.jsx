import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import VideoPlayer from "./pages/VideoPlayer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TestPage from "./pages/TestPage";      // ✅ IMPORTANT IMPORT
import TestHistoryPage from "./pages/TestHistoryPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/auth/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />

            {/* Auth */}
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/login" element={<Login />} />

            {/* Private Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/course/:id"
              element={
                <PrivateRoute>
                  <CourseDetail />
                </PrivateRoute>
              }
            />

            <Route
              path="/video/:id"
              element={
                <PrivateRoute>
                  <VideoPlayer />
                </PrivateRoute>
              }
            />

            {/* ⭐ TEST PAGE MUST ALSO BE PRIVATE ⭐ */}
            <Route
              path="/test/:id"
              element={
                <PrivateRoute>
                  <TestPage />
                </PrivateRoute>
              }
            />


            <Route
  path="/course/:id/test-history"
  element={
    <PrivateRoute>
      <TestHistoryPage />
    </PrivateRoute>
  }
/>


            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
