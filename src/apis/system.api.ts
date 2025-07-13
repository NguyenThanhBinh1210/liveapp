import http from '~/utils/http'

// Types
export interface SystemConfig {
  status: string
  data: {
    maintenanceMode: boolean
    allowRegistration: boolean
    maxFileSize: number
    supportedImageTypes: string[]
    supportedVideoTypes: string[]
    apiVersion: string
    environment: string
    domains: {
      frontendUrl: string
      apiDomain: string
      socketDomain: string
      livekitWsUrl: string
    }
  }
}

export interface SystemHealth {
  status: string
  timestamp: string
  services: {
    database: string
    redis: string
    livekit: string
  }
  uptime: number
}

// API Functions

// 1. Lấy cấu hình hệ thống
export const getSystemConfig = async (): Promise<SystemConfig> => {
  const response = await http.get<SystemConfig>('/system/config')
  return response.data
}

// 2. Kiểm tra trạng thái hệ thống
export const getSystemHealth = async (): Promise<SystemHealth> => {
  const response = await http.get<SystemHealth>('/system/health')
  return response.data
}

// Utility functions
export const getServiceStatusColor = (status: string): string => {
  switch (status) {
    case 'connected': return 'text-green-600'
    case 'disconnected': return 'text-red-600'
    case 'connecting': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

export const getEnvironmentColor = (environment: string): string => {
  switch (environment) {
    case 'production': return 'bg-green-100 text-green-800'
    case 'development': return 'bg-yellow-100 text-yellow-800'
    case 'staging': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
} 