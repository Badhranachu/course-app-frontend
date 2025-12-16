import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import VideoPlayer from "./pages/VideoPlayer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TestPage from "./pages/TestPage";
import TestHistoryPage from "./pages/TestHistoryPage";
import MyCertificates from "./pages/MyCertificates";

// ===============================
// Private Route Wrapper
// ===============================
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

// ===============================
// App
// ===============================
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="pt-16 min-h-[calc(100vh-4rem)] bg-gray-50 overflow-y-auto">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />

            {/* Auth */}
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/login" element={<Login />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Course Detail */}
            <Route
              path="/course/:id"
              element={
                <PrivateRoute>
                  <CourseDetail />
                </PrivateRoute>
              }
            />

            {/* Video Player */}
              <Route
  path="/courses/:courseId/video/:videoId"
  element={
    <PrivateRoute>
      <VideoPlayer />
    </PrivateRoute>
  }
/>


            {/* ✅ FIXED TEST ROUTE (IMPORTANT) */}
            {/* Matches backend + TestPage useParams */}
            <Route
              path="/courses/:course_id/tests/:test_id"
              element={
                <PrivateRoute>
                  <TestPage />
                </PrivateRoute>
              }
            />

            {/* Test History */}
            {/* ✅ Test History — MUST BE FIRST */}
<Route
  path="/courses/:id/tests/history"
  element={
    <PrivateRoute>
      <TestHistoryPage />
    </PrivateRoute>
  }
/>

{/* ✅ Single Test */}
<Route
  path="/courses/:course_id/tests/:test_id"
  element={
    <PrivateRoute>
      <TestPage />
    </PrivateRoute>
  }
/>

            {/* Certificates */}
            <Route
              path="/my-certificates"
              element={
                <PrivateRoute>
                  <MyCertificates />
                </PrivateRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
