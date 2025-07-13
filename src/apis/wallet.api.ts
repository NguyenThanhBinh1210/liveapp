import http from '~/utils/http'

// Types
export interface WalletBalance {
  balance: number
  currency: string
  lastUpdated: string
}

export interface WalletTransaction {
  _id: string
  type: 'TOPUP' | 'WITHDRAW' | 'GIFT' | 'REWARD' | 'REFERRAL'
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed' | 'cancelled'
  description: string
  note?: string
  adminNote?: string
  bankAccount?: string
  bankName?: string
  accountHolder?: string
  createdAt: string
  updatedAt: string
}

export interface WalletTransactionsResponse {
  transactions: WalletTransaction[]
  pagination: {
    current: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TopupRequest {
  amount: number
  note?: string
}

export interface WithdrawRequest {
  amount: number
  bankAccount: string
  bankName: string
  accountHolder: string
  note?: string
}

export interface TopupResponse {
  message: string
  transaction: {
    _id: string
    type: 'TOPUP'
    amount: number
    status: 'pending'
    description: string
    note?: string
    createdAt: string
  }
}

export interface WithdrawResponse {
  message: string
  transaction: {
    _id: string
    type: 'WITHDRAW'
    amount: number
    status: 'pending'
    description: string
    bankAccount: string
    bankName: string
    accountHolder: string
    createdAt: string
  }
}

export interface TransactionQueryParams {
  page?: number
  limit?: number
  type?: 'TOPUP' | 'WITHDRAW' | 'GIFT' | 'REWARD' | 'REFERRAL'
  status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed' | 'cancelled'
}

// API Functions

// 1. Lấy thông tin ví
export const getWalletBalance = async (): Promise<WalletBalance> => {
  const response = await http.get<WalletBalance>('/wallet/balance')
  return response.data
}

// 2. Yêu cầu nạp tiền
export const requestTopup = async (data: TopupRequest): Promise<TopupResponse> => {
  const response = await http.post<TopupResponse>('/wallet/topup', data)
  return response.data
}

// 3. Yêu cầu rút tiền
export const requestWithdraw = async (data: WithdrawRequest): Promise<WithdrawResponse> => {
  const response = await http.post<WithdrawResponse>('/wallet/withdraw', data)
  return response.data
}

// 4. Lịch sử giao dịch
export const getTransactionHistory = async (params: TransactionQueryParams = {}): Promise<WalletTransactionsResponse> => {
  const queryString = new URLSearchParams()
  
  if (params.page) queryString.append('page', params.page.toString())
  if (params.limit) queryString.append('limit', params.limit.toString())
  if (params.type) queryString.append('type', params.type)
  if (params.status) queryString.append('status', params.status)
  
  const response = await http.get<WalletTransactionsResponse>(`/wallet/transactions?${queryString.toString()}`)
  return response.data
}

// Validation functions
export const validateTopupData = (data: TopupRequest): string[] => {
  const errors: string[] = []
  
  if (!data.amount || data.amount < 10000) {
    errors.push('Amount must be at least 10,000 VND')
  }
  
  if (data.amount > 10000000) {
    errors.push('Amount cannot exceed 10,000,000 VND')
  }
  
  if (data.note && data.note.length > 500) {
    errors.push('Note cannot exceed 500 characters')
  }
  
  return errors
}

export const validateWithdrawData = (data: WithdrawRequest, currentBalance: number): string[] => {
  const errors: string[] = []
  
  if (!data.amount || data.amount < 50000) {
    errors.push('Amount must be at least 50,000 VND')
  }
  
  if (data.amount > currentBalance) {
    errors.push('Amount cannot exceed current balance')
  }
  
  if (!data.bankAccount || data.bankAccount.trim().length === 0) {
    errors.push('Bank account is required')
  }
  
  if (!data.bankName || data.bankName.trim().length === 0) {
    errors.push('Bank name is required')
  }
  
  if (!data.accountHolder || data.accountHolder.trim().length === 0) {
    errors.push('Account holder is required')
  }
  
  if (data.note && data.note.length > 500) {
    errors.push('Note cannot exceed 500 characters')
  }
  
  return errors
}

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

export const getTransactionStatusColor = (status: WalletTransaction['status']): string => {
  switch (status) {
    case 'pending': return 'text-yellow-600 bg-yellow-100'
    case 'approved': return 'text-green-600 bg-green-100'
    case 'completed': return 'text-green-600 bg-green-100'
    case 'rejected': return 'text-red-600 bg-red-100'
    case 'failed': return 'text-red-600 bg-red-100'
    case 'cancelled': return 'text-gray-600 bg-gray-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export const getTransactionTypeIcon = (type: WalletTransaction['type']): string => {
  switch (type) {
    case 'TOPUP': return '↗️'
    case 'WITHDRAW': return '↙️'
    case 'GIFT': return '🎁'
    case 'REWARD': return '🏆'
    case 'REFERRAL': return '👥'
    default: return '💰'
  }
}

export const getTransactionTypeColor = (type: WalletTransaction['type']): string => {
  switch (type) {
    case 'TOPUP': return 'text-green-600'
    case 'WITHDRAW': return 'text-red-600'
    case 'GIFT': return 'text-purple-600'
    case 'REWARD': return 'text-blue-600'
    case 'REFERRAL': return 'text-orange-600'
    default: return 'text-gray-600'
  }
}

export const formatTransactionAmount = (transaction: WalletTransaction): string => {
  const sign = transaction.type === 'TOPUP' || transaction.type === 'REWARD' || transaction.type === 'REFERRAL' ? '+' : '-'
  return `${sign}${formatCurrency(Math.abs(transaction.amount))}`
}
