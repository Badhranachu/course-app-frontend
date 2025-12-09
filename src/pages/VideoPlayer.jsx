import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

function VideoPlayer() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVideo()
  }, [id])

  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/${id}/stream/`, { responseType: "blob" })
      const videoUrl = URL.createObjectURL(response.data)
      setVideo({ video_url: videoUrl })
    } catch (err) {
      setError('Failed to load video')
    }
  }

  if (!video) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{error || 'Loading video...'}</p>
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <video
        src={video.video_url}
        controls
        autoPlay
        className="w-full rounded-lg shadow-md"
      />
      <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
        ← Back to Dashboard
      </Link>
    </div>
  )
}

export default VideoPlayer
