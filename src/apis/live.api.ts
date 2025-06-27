import http from '~/utils/http'

export const getLive = (params: { page?: number; limit?: number }) => {
  return http.get('/stream/active', { params })
}

export const getLiveById = (id: string) => {
  return http.get(`/stream/metadata/${id}`)
}
