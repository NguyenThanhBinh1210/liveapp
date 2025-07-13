import http from '~/utils/http'

export const loginAccount = (body: { email: string; password: string }) => {
  return http.post('/auth/login', body)
}

export const registerAccount = (body: { name: string; email: string; password: string }) => {
  return http.post('/auth/register', body)
}

export const getProfile = () => {
  return http.get('/user/me')
}

export const updateProfile = (body: { name?: string; avatar?: string }) => {
  return http.put('/user/update-profile', body)
}

export const changePassword = (body: { oldPassword: string; newPassword: string }) => {
  return http.put('/user/change-password', body)
}

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const response = await http.post<{
    accessToken: string
    refreshToken: string
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }>('/auth/register', data)
  return response.data
}
