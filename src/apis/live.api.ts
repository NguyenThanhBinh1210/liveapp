import http from '~/utils/http'

export const getLive = (params: { page?: number; limit?: number }) => {
  return http.get('/stream', { params })
}

export const getLiveByRoomId = (roomId: string) => {
  return http.post(`/stream/${roomId}/join`)
}

export const createLive = (data: {
  title: string
  description: string
  thumbnailUrl: string
  chatEnabled: boolean
  giftEnabled: boolean
}) => {
  return http.post('/stream', data)
}

export const stopLive = (liveId: string) => {
  return http.delete(`/stream/${liveId}`)
}
