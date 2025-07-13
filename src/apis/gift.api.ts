import http from '~/utils/http'

// Types
export interface Gift {
  _id: string
  name: string
  description: string
  iconUrl: string
  price: number
  category: 'reward' | 'premium'
  status: 'active' | 'inactive'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  maxClaimsPerUser: number
  sortOrder: number
  canSendInLive: boolean
  totalClaimed: number
  totalSent: number
  totalRevenue: number
  createdAt: string
  updatedAt: string
}

export interface GiftTransaction {
  _id: string
  gift: {
    _id: string
    name: string
    iconUrl: string
  }
  receiver?: {
    _id: string
    name: string
  }
  sender?: {
    _id: string
    name: string
  }
  quantity: number
  totalAmount: number
  message?: string
  createdAt: string
}

export interface GiftResponse {
  gifts: Gift[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface GiftHistoryResponse {
  transactions: GiftTransaction[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ClaimGiftResponse {
  message: string
  gift: {
    _id: string
    name: string
    description: string
    price: number
    category: string
  }
  transaction: {
    _id: string
    type: 'claim'
    status: 'completed'
    quantity: number
    totalAmount: number
  }
}

export interface SendGiftResponse {
  message: string
  gift: {
    _id: string
    name: string
    price: number
  }
  transaction: {
    _id: string
    type: 'send'
    status: 'completed'
    quantity: number
    totalAmount: number
  }
  walletTransaction: {
    _id: string
    type: 'GIFT'
    amount: number
    description: string
  }
}

// Query parameters
export interface GiftQueryParams {
  page?: number
  limit?: number
  category?: 'reward' | 'premium'
  status?: 'active' | 'inactive'
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface GiftHistoryParams {
  page?: number
  limit?: number
}

export interface SendGiftData {
  giftId: string
  receiverId: string
  streamId?: string
  quantity: number
  message?: string
}

// API Functions

// 1. Lấy tất cả quà tặng
export const getAllGifts = async (params: GiftQueryParams = {}): Promise<GiftResponse> => {
  const queryString = new URLSearchParams()
  
  if (params.page) queryString.append('page', params.page.toString())
  if (params.limit) queryString.append('limit', params.limit.toString())
  if (params.category) queryString.append('category', params.category)
  if (params.status) queryString.append('status', params.status)
  if (params.rarity) queryString.append('rarity', params.rarity)
  
  const response = await http.get<GiftResponse>(`/gifts?${queryString.toString()}`)
  return response.data
}

// 2. Lấy quà tặng miễn phí
export const getRewardGifts = async (params: GiftHistoryParams = {}): Promise<GiftResponse> => {
  const queryString = new URLSearchParams()
  
  if (params.page) queryString.append('page', params.page.toString())
  if (params.limit) queryString.append('limit', params.limit.toString())
  
  const response = await http.get<GiftResponse>(`/gifts/rewards?${queryString.toString()}`)
  return response.data
}

// 3. Lấy quà tặng trả phí
export const getPremiumGifts = async (params: GiftHistoryParams = {}): Promise<GiftResponse> => {
  const queryString = new URLSearchParams()
  
  if (params.page) queryString.append('page', params.page.toString())
  if (params.limit) queryString.append('limit', params.limit.toString())
  
  const response = await http.get<GiftResponse>(`/gifts/premium?${queryString.toString()}`)
  return response.data
}

// 4. Lấy chi tiết quà tặng
export const getGiftById = async (id: string): Promise<Gift> => {
  const response = await http.get<Gift>(`/gifts/${id}`)
  return response.data
}

// 5. Nhận quà miễn phí
export const claimGift = async (giftId: string): Promise<ClaimGiftResponse> => {
  const response = await http.post<ClaimGiftResponse>('/gifts/claim', { giftId })
  return response.data
}

// 6. Gửi quà trả phí
export const sendGift = async (data: SendGiftData): Promise<SendGiftResponse> => {
  const response = await http.post<SendGiftResponse>('/gifts/send', data)
  return response.data
}

// 7. Lịch sử quà đã gửi
export const getSentGiftsHistory = async (params: GiftHistoryParams = {}): Promise<GiftHistoryResponse> => {
  const queryString = new URLSearchParams()
  
  if (params.page) queryString.append('page', params.page.toString())
  if (params.limit) queryString.append('limit', params.limit.toString())
  
  const response = await http.get<GiftHistoryResponse>(`/gifts/history/sent?${queryString.toString()}`)
  return response.data
}

// 8. Lịch sử quà đã nhận
export const getReceivedGiftsHistory = async (params: GiftHistoryParams = {}): Promise<GiftHistoryResponse> => {
  const queryString = new URLSearchParams()
  
  if (params.page) queryString.append('page', params.page.toString())
  if (params.limit) queryString.append('limit', params.limit.toString())
  
  const response = await http.get<GiftHistoryResponse>(`/gifts/history/received?${queryString.toString()}`)
  return response.data
}

// Utility functions
export const validateGiftData = (data: SendGiftData): string[] => {
  const errors: string[] = []
  
  if (!data.giftId) errors.push('Gift ID is required')
  if (!data.receiverId) errors.push('Receiver ID is required')
  if (!data.quantity || data.quantity < 1) errors.push('Quantity must be at least 1')
  if (data.quantity > 100) errors.push('Quantity cannot exceed 100')
  if (data.message && data.message.length > 200) errors.push('Message cannot exceed 200 characters')
  
  return errors
}

export const formatGiftPrice = (price: number): string => {
  if (price === 0) return 'Free'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

export const getGiftRarityColor = (rarity: Gift['rarity']): string => {
  switch (rarity) {
    case 'common': return 'text-gray-500'
    case 'rare': return 'text-blue-500'
    case 'epic': return 'text-purple-500'
    case 'legendary': return 'text-yellow-500'
    default: return 'text-gray-500'
  }
}

export const getGiftRarityBadge = (rarity: Gift['rarity']): string => {
  switch (rarity) {
    case 'common': return 'bg-gray-100 text-gray-800'
    case 'rare': return 'bg-blue-100 text-blue-800'
    case 'epic': return 'bg-purple-100 text-purple-800'
    case 'legendary': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
