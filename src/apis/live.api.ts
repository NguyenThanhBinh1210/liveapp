import http from '~/utils/http'

// === LIVE STREAM API ===

// 1. Lấy danh sách streams đang LIVE
export const getLive = (params: { 
  page?: number
  limit?: number
  status?: 'live' | 'ended' | 'scheduled'
}) => {
  return http.get('/stream', { params })
}

// 2. Lấy chi tiết stream
export const getLiveById = (id: string) => {
  return http.get(`/stream/${id}`)
}

// 3. Tạo phiên livestream mới (Streamer) - Chuẩn hóa theo prompt.txt
export const createLive = (data: {
  title: string
  description: string
  thumbnailUrl: string
  category?: string
  tags?: string[]
}) => {
  return http.post('/stream', data)
}

// 4. Kết thúc livestream (Streamer)
export const stopLive = (streamId: string) => {
  return http.patch(`/stream/${streamId}/stop`)
}

// 5. Cập nhật thông tin stream
export const updateLive = (streamId: string, data: {
  title?: string
  description?: string
  thumbnailUrl?: string
}) => {
  return http.patch(`/stream/${streamId}`, data)
}

// 6. Lấy token viewer để xem stream
export const getViewerToken = (data: {
  streamId: string
  identity: string
}) => {
  return http.post('/stream/viewer-token', data)
}

// === LIVEKIT API (Tách riêng cho LiveKit integration) ===

export interface LiveKitTokenResponse {
  token: string
  wsUrl: string
  roomId: string
  identity: string
  expiresAt: string
  streamId?: string
  title?: string
  description?: string
  thumbnailUrl?: string
  streamer?: {
    _id: string
    name: string
    avatar: string
  }
}

export interface CreateLiveKitRoomRequest {
  title: string
  description: string
  thumbnailUrl: string
  chatEnabled: boolean
  giftEnabled: boolean
  identity: string
  isHost: boolean
}

// LiveKit APIs - Chuẩn hóa theo prompt.txt
export const liveKitApi = {
  // Tạo room LiveKit và bắt đầu stream (cho Streamer)
  createRoom: (data: CreateLiveKitRoomRequest) =>
    http.post<{
      message: string
      stream: {
        _id: string
        title: string
        status: string
        roomId: string
      }
      streamerToken: string
      wsUrl: string
    }>('/stream', {
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      category: 'general',
      tags: []
    }),

  // Lấy token để xem stream (cho Viewer)
  getToken: (roomId: string, identity: string) =>
    http.post<LiveKitTokenResponse>('/stream/viewer-token', {
      streamId: roomId,
      identity: identity
    }),

  // Join room (cho viewer) - Tương tự getToken nhưng với semantics khác
  joinRoom: (roomId: string, data: { identity: string }) =>
    http.post<LiveKitTokenResponse>('/stream/viewer-token', {
      streamId: roomId,
      identity: data.identity
    }),

  // Lấy token cho room đã tồn tại
  getRoomToken: (roomId: string, data: { identity: string }) =>
    http.post<LiveKitTokenResponse>('/stream/viewer-token', {
      streamId: roomId,
      identity: data.identity
    }),

  // Dừng stream (cho Streamer)
  stopDemo: (roomId: string) =>
    http.patch(`/stream/${roomId}/stop`, {
      context: 'react_app',
      timestamp: new Date().toISOString()
    }),

  // Ngắt kết nối stream
  stopStream: (roomId: string) =>
    http.patch(`/stream/${roomId}/stop`, {
      reason: 'manual_disconnect',
      timestamp: new Date().toISOString()
    }),
}

// === UTILITY FUNCTIONS ===

// Helper function để tạo identity unique
export const generateStreamerIdentity = (userId?: string) => {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  return userId ? `streamer_${userId}_${timestamp}` : `streamer_${timestamp}_${randomId}`
}

// Helper function để tạo viewer identity
export const generateViewerIdentity = (userId?: string, userName?: string) => {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  
  if (userId) {
    return `viewer_${userId}_${timestamp}`
  } else if (userName) {
    return `viewer_${userName.replace(/\s+/g, '_')}_${timestamp}`
  } else {
    return `viewer_guest_${timestamp}_${randomId}`
  }
}

// Validate stream data trước khi tạo
export const validateStreamData = (data: {
  title: string
  description?: string
  thumbnailUrl?: string
}) => {
  const errors: string[] = []
  
  if (!data.title || data.title.trim().length < 1) {
    errors.push('Tiêu đề stream là bắt buộc')
  }
  
  if (data.title && data.title.length > 100) {
    errors.push('Tiêu đề stream không được vượt quá 100 ký tự')
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('Mô tả stream không được vượt quá 500 ký tự')
  }
  
  if (data.thumbnailUrl && !isValidUrl(data.thumbnailUrl)) {
    errors.push('URL thumbnail không hợp lệ')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Helper function kiểm tra URL
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// === RESPONSE INTERFACES ===

export interface StreamResponse {
  _id: string
  title: string
  description: string
  thumbnailUrl: string
  status: 'live' | 'ended' | 'scheduled'
  viewerCount: number
  startedAt: string
  endedAt?: string
  streamer: {
    _id: string
    name: string
    avatar: string
  }
  roomId: string
  metadata?: {
    category: string
    tags: string[]
  }
}

export interface CreateStreamResponse {
  message: string
  stream: {
    _id: string
    title: string
    status: string
    roomId: string
  }
  streamerToken: string
  wsUrl: string
}
