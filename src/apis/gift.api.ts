import http from '~/utils/http'

export const getGift = () => {
  return http.get('/gift/products/active')
}
