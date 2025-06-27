/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccesTokenToLS,
  setProfileFromLS,
  setRefreshTokenToLS
} from './auth'

function createHttp(): AxiosInstance {
  let accessToken: string | null = getAccessTokenFromLS()
  let refreshToken: string | null = getRefreshTokenFromLS()
  let refreshTokenRequest: Promise<string> | null = null

  const instance = axios.create({
    baseURL: 'https://apilive.loltips.net/api/v1',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  })

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (accessToken && config.headers) {
        config.headers['authorization'] = `Bearer ${accessToken}`
        return config
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const { url } = response.config
      if (url === '/auth/login' || url === '/auth/register') {
        const loginResponse = response.data.data as any
        const dataProfile = loginResponse.user
        accessToken = loginResponse.accessToken
        refreshToken = loginResponse.refreshToken
        console.log(dataProfile, accessToken, refreshToken)
        setProfileFromLS(dataProfile)
        setAccesTokenToLS(accessToken || '')
        setRefreshTokenToLS(refreshToken || '')
      } else if (url === '/auth/log-out') {
        accessToken = ''
        refreshToken = ''
        clearLS()
      }
      return response
    },
    async (error) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

      // Nếu lỗi 401 và chưa retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          if (!refreshTokenRequest) {
            refreshTokenRequest = handleRefreshToken()
          }

          const newAccessToken = await refreshTokenRequest
          refreshTokenRequest = null

          // Cập nhật accessToken vào request gốc
          accessToken = newAccessToken
          if (originalRequest.headers) {
            originalRequest.headers['authorization'] = `Bearer ${newAccessToken}`
          }

          return instance(originalRequest)
        } catch (_error) {
          refreshTokenRequest = null
          clearLS()
          window.location.href = '/login'
          return Promise.reject(_error)
        }
      }

      return Promise.reject(error)
    }
  )

  async function handleRefreshToken(): Promise<string> {
    try {
      const response = await axios.post('https://apilive.loltips.net/api/v1/auth/refresh-token', {
        refreshToken: getRefreshTokenFromLS()
      })

      if (response.data?.accessToken && response.data?.refreshToken) {
        const newAccessToken = response.data.accessToken
        const newRefreshToken = response.data.refreshToken

        accessToken = newAccessToken
        refreshToken = newRefreshToken
        setAccesTokenToLS(newAccessToken)
        setRefreshTokenToLS(newRefreshToken)

        return newAccessToken
      }

      throw new Error('Failed to refresh token')
    } catch (error) {
      clearLS()
      throw error
    }
  }

  return instance
}

const http = createHttp()

export default http
