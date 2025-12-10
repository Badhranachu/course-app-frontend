import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses/");
      setCourses(response.data.results || response.data);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-gray-700 animate-pulse">
          Loading courses…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-10 font-[Inter]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          🎓 Explore Our Courses
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Industry-level training programs curated for real-world skills.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg font-medium">
            {error}
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {course.title}
            </h2>

            <p className="text-gray-600 line-clamp-3 mb-4">
              {course.description}
            </p>

            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-extrabold text-indigo-600">
                ₹{course.price}
              </span>

              {course.is_enrolled && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  ✔ Enrolled
                </span>
              )}
            </div>

            {/* Button section */}
            {!course.is_active ? (
              <button
                disabled
                className="mt-3 w-full py-2 bg-gray-400 text-white rounded-md font-semibold cursor-not-allowed"
              >
                ❌ No Available Slots
              </button>
            ) : (
              <Link
                to={`/course/${course.id}`}
                className="mt-3 w-full block text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition"
              >
                View Course →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {courses.length === 0 && !loading && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-700">
            No courses available
          </h3>
          <p className="text-gray-500 mt-2">New programs will be added soon.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
