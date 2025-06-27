import http from '~/utils/http'

export const getWallet = () => {
  return http.get('/wallet/balance')
}

export const getWalletTransaction = (params: { page?: number; limit?: number; type?: string; status?: string }) => {
  return http.get('/wallet/transactions', { params })
}

export const recharge = (body: { amount: number; note: string }) => {
  return http.post('/wallet/topup', body)
}

export const withdraw = (body: { amount: number; note: string }) => {
  return http.post('/wallet/withdraw', body)
}
