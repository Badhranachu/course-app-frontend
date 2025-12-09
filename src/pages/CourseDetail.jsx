import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { loadRazorpayScript, handleRazorpayPayment } from '../services/razorpay'

function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [id])

  useEffect(() => {
    if (course?.is_enrolled) {
      fetchVideos()
    } else {
      setVideos([])
    }
  }, [course?.is_enrolled, course?.id])

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}/`)
      setCourse(response.data)
    } catch (err) {
      setError('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const fetchVideos = async () => {
    if (!course?.is_enrolled) {
      setVideos([])
      return
    }
    
    try {
      const response = await api.get(`/courses/${id}/videos/`)
      setVideos(response.data)
    } catch (err) {
      // User might not be enrolled, videos will be empty
      setVideos([])
    }
  }

  const handleEnroll = async () => {
    setProcessing(true)
    setError('')

    try {
      // Load Razorpay script
      await loadRazorpayScript()

      // Create order
      const orderResponse = await api.post('/payment/create-order/', {
        course_id: id
      })

      const { order_id, amount, currency, key_id } = orderResponse.data

      // Handle Razorpay payment
      const paymentData = await handleRazorpayPayment({
        order_id,
        amount,
        currency,
        key_id,
        name: course.title,
        description: course.description,
      })

      // Verify payment
      const verifyResponse = await api.post('/payment/verify/', {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        course_id: id,
      })

      // Refresh course data - fetchVideos will be called automatically via useEffect
      await fetchCourse()
      
      alert('Payment successful! You are now enrolled in this course.')
    } catch (err) {
      if (err.message && err.message.includes('Payment')) {
        setError('Payment was cancelled or failed')
      } else {
        setError(err.response?.data?.error || 'Enrollment failed')
      }
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading course...</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Course not found.</p>
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-indigo-600">₹{course.price}</span>
          {course.is_enrolled ? (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Enrolled
            </span>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={processing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Enroll Now'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Course Videos</h2>
        
        {course.is_enrolled ? (
          videos.length > 0 ? (
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{video.title}</h3>
                      {video.description && (
                        <p className="text-gray-600 text-sm mt-1">{video.description}</p>
                      )}
                    </div>
                    <Link
                      to={`/video/${video.id}`}
                      className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Watch
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No videos available for this course yet.</p>
          )
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Please enroll in this course to access videos.</p>
            <button
              onClick={handleEnroll}
              disabled={processing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Enroll Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetail

