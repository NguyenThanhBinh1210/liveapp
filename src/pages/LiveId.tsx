import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useMutation, useQuery } from 'react-query'
import LiveKitRoomComponent from '~/components/LiveKit/LiveKitRoom'
import { 
  getLiveById, 
  getViewerToken, 
  generateViewerIdentity,
  type StreamResponse 
} from '~/apis/live.api'

interface ErrorWithResponse {
  response?: {
    status: number
  }
}

const LiveId: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  // State management
  const [isConnected, setIsConnected] = useState(false)
  const [roomId, setRoomId] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [viewerCount, setViewerCount] = useState(0)
  const [connectionError, setConnectionError] = useState<string>('')
  const [streamData, setStreamData] = useState<StreamResponse | null>(null)

  // Get live stream info
  const { data: liveData, isLoading: isLoadingLive, error: liveError } = useQuery(
    ['live', id],
    () => getLiveById(id!),
    {
      enabled: !!id,
      retry: 2,
      refetchInterval: 30000, // Refresh mỗi 30s để cập nhật viewer count
      onSuccess: (data) => {
        console.log('📺 Live stream data:', data)
        const stream = data.data as StreamResponse
        setStreamData(stream)
        
        if (stream.roomId) {
          setRoomId(stream.roomId)
        }
        
        // Cập nhật viewer count từ API
        setViewerCount(stream.viewerCount || 0)
      },
      onError: (error: unknown) => {
        console.error('❌ Failed to get live stream:', error)
        let errorMessage = t('stream_not_found')
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as ErrorWithResponse
          if (axiosError.response?.status === 404) {
            errorMessage = t('stream_not_found')
          } else if (axiosError.response?.status === 403) {
            errorMessage = t('stream_access_denied')
          } else {
            errorMessage = t('failed_to_load_stream')
          }
        }
        
        setConnectionError(errorMessage)
        toast.error(errorMessage)
      }
    }
  )

  // Get viewer token mutation
  const getTokenMutation = useMutation({
    mutationFn: ({ streamId, identity }: { streamId: string, identity: string }) => 
      getViewerToken({ streamId, identity }),
    onSuccess: (response) => {
      console.log('✅ Viewer token received:', response.data)
      setToken(response.data.token)
      setIsConnected(true)
      toast.success(t('connected_to_stream'))
    },
    onError: (error: unknown) => {
      console.error('❌ Failed to get viewer token:', error)
      let errorMessage = t('failed_to_connect')
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as ErrorWithResponse
        if (axiosError.response?.status === 404) {
          errorMessage = t('stream_not_found_or_ended')
        } else if (axiosError.response?.status === 403) {
          errorMessage = t('no_permission_to_view')
        } else if (axiosError.response?.status === 500) {
          errorMessage = t('server_error_try_again')
        }
      }
      
      setConnectionError(errorMessage)
      toast.error(errorMessage)
    }
  })

  // Check URL params for direct connection (compatibility với HTML files)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlRoomId = urlParams.get('room')
    const urlToken = urlParams.get('token')
    
    if (urlRoomId && urlToken) {
      console.log('🔗 Direct connection from URL params:', { roomId: urlRoomId })
      setRoomId(urlRoomId)
      setToken(urlToken)
      setIsConnected(true)
      return
    }
    
    // If no URL params, try to connect using live stream data
    if (liveData?.data?.roomId && !token) {
      connectToStream()
    }
  }, [liveData, token])

  // Connect to stream function
  const connectToStream = () => {
    if (!id) {
      toast.error(t('invalid_stream_id'))
      return
    }

    try {
      // Generate unique viewer identity
      const identity = generateViewerIdentity()
      
      console.log('🔗 Connecting to stream:', { streamId: id, identity })
      
      getTokenMutation.mutate({ 
        streamId: id, 
        identity 
      })
    } catch (error) {
      console.error('❌ Connect to stream error:', error)
      toast.error(t('failed_to_connect'))
    }
  }

  // Handle retry connection
  const handleRetryConnection = () => {
    setConnectionError('')
    if (streamData?.roomId) {
      connectToStream()
    }
  }

  // Handle disconnect
  const handleDisconnect = () => {
    setIsConnected(false)
    setToken('')
    setViewerCount(0)
    
    toast(t('disconnected_from_stream'))
    
    // Navigate back to home after 2 seconds
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  // Handle participant change
  const handleParticipantChange = (count: number) => {
    setViewerCount(Math.max(0, count))
  }

  // Format duration
  const formatDuration = (startedAt: string) => {
    const start = new Date(startedAt)
    const now = new Date()
    const duration = Math.floor((now.getTime() - start.getTime()) / 1000)
    
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Loading state
  if (isLoadingLive) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t('loading_stream')}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (liveError || connectionError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold mb-4">{t('stream_error')}</h2>
          <p className="text-gray-300 mb-6">
            {connectionError || t('stream_not_available')}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRetryConnection}
              className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              🔄 {t('retry')}
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              🏠 {t('back_to_home')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Stream not found
  if (!streamData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">📺</div>
          <h2 className="text-2xl font-bold mb-4">{t('stream_not_found')}</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors"
          >
            {t('back_to_home')}
          </button>
        </div>
      </div>
    )
  }

  // Stream ended
  if (streamData.status === 'ended') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold mb-4">{t('stream_ended')}</h2>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-2">{streamData.title}</h3>
            <p className="text-gray-300 mb-4">{streamData.description}</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <span>👤 {streamData.streamer.name}</span>
              <span>⏱️ {formatDuration(streamData.startedAt)}</span>
              <span>👥 {streamData.viewerCount} {t('viewers')}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors"
          >
            {t('back_to_home')}
          </button>
        </div>
      </div>
    )
  }

  // Connecting state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <img
              src={streamData.thumbnailUrl}
              alt={streamData.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{streamData.title}</h2>
            <p className="text-gray-300 mb-4">{streamData.description}</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mb-4">
              <span>👤 {streamData.streamer.name}</span>
              <span>⏱️ {formatDuration(streamData.startedAt)}</span>
              <span>👥 {streamData.viewerCount} {t('viewers')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-red-500">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">LIVE</span>
            </div>
          </div>
          
          {getTokenMutation.isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p>{t('connecting_to_stream')}</p>
            </div>
          ) : (
            <button
              onClick={connectToStream}
              className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <span>📺</span>
              <span>{t('join_stream')}</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  // Render live stream
  return (
    <div className="stream-viewer-container">
      {/* Stream Info Bar */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium">LIVE</span>
          </div>
          <div className="text-sm font-medium">
            {streamData.title}
          </div>
          <div className="text-sm text-gray-300">
            👤 {streamData.streamer.name}
          </div>
          <div className="text-sm text-gray-300">
            👥 {viewerCount} {t('viewers')}
          </div>
        </div>
        
        <button
          onClick={handleDisconnect}
          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
        >
          {t('leave_stream')}
        </button>
      </div>

      {/* LiveKit Room Component */}
      <LiveKitRoomComponent
        roomId={roomId}
        token={token}
        isHost={false}
        onDisconnect={handleDisconnect}
        onParticipantChange={handleParticipantChange}
      />
    </div>
  )
}

export default LiveId
