import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useMutation } from 'react-query'
import LiveKitRoomComponent from '~/components/LiveKit/LiveKitRoom'
import { 
  createLive, 
  stopLive, 
  updateLive, 
  validateStreamData, 
  generateStreamerIdentity,
  type CreateStreamResponse 
} from '~/apis/live.api'
import { mockImageUpload } from '~/utils/cloudinary'

interface StreamSetupData {
  title: string
  description: string
  thumbnailUrl: string
  category: string
  tags: string[]
}

interface ErrorWithResponse {
  response?: {
    status: number
  }
}

const Stream: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  // State management
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamId, setStreamId] = useState<string>('')
  const [roomId, setRoomId] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [streamSetup, setStreamSetup] = useState<StreamSetupData>({
    title: '',
    description: '',
    thumbnailUrl: '',
    category: 'general',
    tags: []
  })
  const [viewerCount, setViewerCount] = useState(0)
  const [streamDuration, setStreamDuration] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Check URL params for direct streaming (compatibility với HTML files)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlRoomId = urlParams.get('room')
    const urlToken = urlParams.get('token')
    
    if (urlRoomId && urlToken) {
      console.log('🎬 Direct streaming from URL params:', { roomId: urlRoomId })
      setRoomId(urlRoomId)
      setToken(urlToken)
      setIsStreaming(true)
    }
  }, [])

  // Timer cho stream duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isStreaming])

  // Tạo livestream mutation - Chuẩn hóa theo prompt.txt
  const createStreamMutation = useMutation({
    mutationFn: (data: StreamSetupData) => createLive(data),
    onSuccess: (response: { data: CreateStreamResponse }) => {
      console.log('✅ Stream created successfully:', response.data)
      
      const { stream, streamerToken } = response.data
      
      setStreamId(stream._id)
      setRoomId(stream.roomId)
      setToken(streamerToken)
      setIsStreaming(true)
      
      // Lưu thông tin stream vào localStorage để recovery
      localStorage.setItem('currentStream', JSON.stringify({
        streamId: stream._id,
        roomId: stream.roomId,
        token: streamerToken,
        startedAt: new Date().toISOString()
      }))
      
      toast.success(t('stream_started_successfully'))
    },
    onError: (error: unknown) => {
      console.error('❌ Failed to create stream:', error)
      
      let errorMessage = t('failed_to_start_stream')
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as ErrorWithResponse
        if (axiosError.response?.status === 401) {
          errorMessage = t('please_login_to_stream')
          setTimeout(() => navigate('/login'), 2000)
        } else if (axiosError.response?.status === 403) {
          errorMessage = t('no_permission_to_stream')
        } else if (axiosError.response?.status === 422) {
          errorMessage = t('invalid_stream_data')
        } else if (axiosError.response?.status === 500) {
          errorMessage = t('server_error_try_again')
        }
      }
      
      toast.error(errorMessage)
    }
  })

  // Dừng livestream mutation
  const stopStreamMutation = useMutation({
    mutationFn: (streamId: string) => stopLive(streamId),
    onSuccess: () => {
      console.log('✅ Stream stopped successfully')
      handleDisconnect()
      toast.success(t('stream_ended_successfully'))
    },
    onError: (error: unknown) => {
      console.error('❌ Failed to stop stream:', error)
      toast.error(t('failed_to_stop_stream'))
    }
  })

  // Cập nhật thông tin stream mutation
  const updateStreamMutation = useMutation({
    mutationFn: ({ streamId, data }: { streamId: string, data: Partial<StreamSetupData> }) => 
      updateLive(streamId, data),
    onSuccess: () => {
      toast.success(t('stream_updated_successfully'))
    },
    onError: (error: unknown) => {
      console.error('❌ Failed to update stream:', error)
      toast.error(t('failed_to_update_stream'))
    }
  })

  // Validate stream data khi thay đổi
  useEffect(() => {
    const validation = validateStreamData(streamSetup)
    setValidationErrors(validation.errors)
  }, [streamSetup])

  // Handle thumbnail upload
  const handleThumbnailUpload = async (file: File) => {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        toast.error(t('please_select_image_file'))
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error(t('image_too_large'))
        return
      }
      
      const uploadedUrl = await mockImageUpload(file)
      setStreamSetup(prev => ({ ...prev, thumbnailUrl: uploadedUrl }))
      toast.success(t('thumbnail_uploaded_successfully'))
    } catch (error) {
      console.error('❌ Thumbnail upload failed:', error)
      toast.error(t('thumbnail_upload_failed'))
    }
  }

  // Bắt đầu streaming
  const handleStartStream = async () => {
    // Validate dữ liệu trước khi gửi
    const validation = validateStreamData(streamSetup)
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error))
      return
    }

    try {
      // Generate unique identity cho streamer
      const identity = generateStreamerIdentity()
      
      console.log('🎬 Starting stream with data:', {
        ...streamSetup,
        identity
      })
      
      createStreamMutation.mutate(streamSetup)
    } catch (error) {
      console.error('❌ Start stream error:', error)
      toast.error(t('failed_to_start_stream'))
    }
  }

  // Dừng streaming
  const handleStopStream = async () => {
    if (!streamId) {
      toast.error(t('no_active_stream'))
      return
    }

    try {
      stopStreamMutation.mutate(streamId)
    } catch (error) {
      console.error('❌ Stop stream error:', error)
      toast.error(t('failed_to_stop_stream'))
    }
  }

  // Cập nhật thông tin stream trong khi streaming
  const handleUpdateStreamInfo = async () => {
    if (!streamId) return

    const updateData = {
      title: streamSetup.title,
      description: streamSetup.description,
      thumbnailUrl: streamSetup.thumbnailUrl
    }

    updateStreamMutation.mutate({ streamId, data: updateData })
  }

  // Handle disconnect
  const handleDisconnect = () => {
    setIsStreaming(false)
    setStreamId('')
    setRoomId('')
    setToken('')
    setViewerCount(0)
    setStreamDuration(0)
    
    // Clear localStorage
    localStorage.removeItem('currentStream')
  }

  // Handle participant change
  const handleParticipantChange = (count: number) => {
    setViewerCount(Math.max(0, count))
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Recovery stream từ localStorage (nếu có)
  useEffect(() => {
    const savedStream = localStorage.getItem('currentStream')
    if (savedStream && !isStreaming) {
      try {
        const streamData = JSON.parse(savedStream)
        const startedAt = new Date(streamData.startedAt)
        const now = new Date()
        const duration = Math.floor((now.getTime() - startedAt.getTime()) / 1000)
        
        // Nếu stream còn trong vòng 24h, cho phép recovery
        if (duration < 24 * 60 * 60) {
          setStreamId(streamData.streamId)
          setRoomId(streamData.roomId)
          setToken(streamData.token)
          setStreamDuration(duration)
          setIsStreaming(true)
          
          toast.success(t('stream_recovered'))
        } else {
          localStorage.removeItem('currentStream')
        }
      } catch (error) {
        console.error('❌ Failed to recover stream:', error)
        localStorage.removeItem('currentStream')
      }
    }
  }, [isStreaming, t])

  // Render streaming interface
  if (isStreaming && roomId && token) {
    return (
      <div className="stream-container">
        {/* Stream Info Bar */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">LIVE</span>
            </div>
            <div className="text-sm">
              ⏱️ {formatDuration(streamDuration)}
            </div>
            <div className="text-sm">
              👥 {viewerCount} {t('viewers')}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUpdateStreamInfo}
              disabled={updateStreamMutation.isLoading}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
              {updateStreamMutation.isLoading ? '...' : t('update_info')}
            </button>
            <button
              onClick={handleStopStream}
              disabled={stopStreamMutation.isLoading}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
            >
              {stopStreamMutation.isLoading ? '...' : t('end_stream')}
            </button>
          </div>
        </div>

        {/* LiveKit Room Component */}
        <LiveKitRoomComponent
          roomId={roomId}
          token={token}
          isHost={true}
          onDisconnect={handleDisconnect}
          onParticipantChange={handleParticipantChange}
        />
      </div>
    )
  }

  // Render setup form
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            🎬 {t('create_live_stream')}
          </h1>

          <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-900 border border-red-600 rounded p-4">
                <h3 className="font-medium mb-2">{t('validation_errors')}:</h3>
                <ul className="text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-red-300">• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stream Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('stream_title')} *
              </label>
              <input
                type="text"
                value={streamSetup.title}
                onChange={(e) => setStreamSetup(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t('enter_stream_title')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={100}
              />
              <div className="text-xs text-gray-400 mt-1">
                {streamSetup.title.length}/100
              </div>
            </div>

            {/* Stream Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('stream_description')}
              </label>
              <textarea
                value={streamSetup.description}
                onChange={(e) => setStreamSetup(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('enter_stream_description')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-gray-400 mt-1">
                {streamSetup.description.length}/500
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('category')}
              </label>
              <select
                value={streamSetup.category}
                onChange={(e) => setStreamSetup(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">{t('general')}</option>
                <option value="gaming">{t('gaming')}</option>
                <option value="music">{t('music')}</option>
                <option value="education">{t('education')}</option>
                <option value="entertainment">{t('entertainment')}</option>
                <option value="technology">{t('technology')}</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('tags')}
              </label>
              <input
                type="text"
                placeholder={t('enter_tags_separated_by_comma')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                  setStreamSetup(prev => ({ ...prev, tags }))
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-400 mt-1">
                {t('separate_tags_with_commas')}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('thumbnail')}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleThumbnailUpload(file)
                  }}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md cursor-pointer transition-colors"
                >
                  {t('choose_thumbnail')}
                </label>
                {streamSetup.thumbnailUrl && (
                  <img
                    src={streamSetup.thumbnailUrl}
                    alt="Thumbnail"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
              </div>
            </div>

            {/* Start Stream Button */}
            <button
              onClick={handleStartStream}
              disabled={createStreamMutation.isLoading || validationErrors.length > 0}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {createStreamMutation.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t('starting_stream')}</span>
                </>
              ) : (
                <>
                  <span>🎬</span>
                  <span>{t('start_live_stream')}</span>
                </>
              )}
            </button>

            {/* Info */}
            <div className="text-xs text-gray-400 text-center space-y-1">
              <p>{t('browser_support_info')}</p>
              <p>{t('mobile_optimized')}: 640x360@15fps</p>
              <p>{t('recommended_bitrate')}: 1000-2500 kbps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stream
