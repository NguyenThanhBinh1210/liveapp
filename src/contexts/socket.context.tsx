import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { getAccessTokenFromLS, getProfileFromLS } from '~/utils/auth'
import { currentConfig } from '~/config'

// Types
interface SocketUser {
  userId: string
  username: string
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}

interface ChatMessage {
  id: string
  roomId: string
  userId: string
  username: string
  message: string
  messageType: 'text' | 'image' | 'system'
  timestamp: string
  imageUrl?: string
}

interface Gift {
  id: string
  roomId: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  giftId: string
  giftName: string
  giftType: string
  giftValue: number
  quantity: number
  message?: string
  animation?: string
  timestamp: string
}

interface SystemNotification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success' | 'system'
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  timestamp: string
}

interface SocketContextType {
  // Connection state
  socket: Socket | null
  isConnected: boolean
  currentRoom: string | null
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  
  // Users and messages
  users: SocketUser[]
  messages: ChatMessage[]
  notifications: SystemNotification[]
  unreadCount: number
  
  // Actions
  joinRoom: (roomId: string, userData?: Record<string, unknown>) => Promise<boolean>
  leaveRoom: (roomId?: string) => Promise<boolean>
  sendMessage: (message: string, roomId?: string) => Promise<boolean>
  sendImageMessage: (imageUrl: string, roomId?: string) => Promise<boolean>
  sendGift: (giftData: Omit<Gift, 'id' | 'timestamp'>) => Promise<boolean>
  chatWithAdmin: (message: string, supportType?: string) => Promise<boolean>
  
  // Utilities
  clearMessages: () => void
  clearNotifications: () => void
  markNotificationAsRead: (notificationId: string) => void
  markAllNotificationsAsRead: () => void
  
  // Health and debug
  getHealthStatus: () => Record<string, unknown>
  getConnectionInfo: () => Record<string, unknown>
  reconnect: () => void
  disconnect: () => void
}

// Socket configuration using centralized config
const config = {
  url: currentConfig.SOCKET_URL,
  apiUrl: currentConfig.API_URL,
  livekitUrl: currentConfig.LIVEKIT_URL
}

// Security utilities
class SecurityUtils {
  static validateMessage(message: string): { valid: boolean; reason?: string } {
    if (!message || typeof message !== 'string') {
      return { valid: false, reason: 'Invalid message format' }
    }

    if (message.length === 0) {
      return { valid: false, reason: 'Message cannot be empty' }
    }

    if (message.length > 500) {
      return { valid: false, reason: 'Message too long (max 500 characters)' }
    }

    // Check for malicious content
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi
    ]

    for (const pattern of maliciousPatterns) {
      if (pattern.test(message)) {
        return { valid: false, reason: 'Message contains forbidden content' }
      }
    }

    return { valid: true }
  }

  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return ''
    }

    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
  }

  static validateRoomId(roomId: string): boolean {
    if (!roomId || typeof roomId !== 'string') {
      return false
    }

    const roomIdPattern = /^[a-zA-Z0-9_]{1,50}$/
    return roomIdPattern.test(roomId)
  }
}

// Rate limiting
class RateLimiter {
  private lastMessageTime = 0
  private messageCooldown = 1000 // 1 second
  private messageTimestamps: number[] = []
  private maxMessagesPerMinute = 30

  canSendMessage(): { allowed: boolean; reason?: string } {
    const now = Date.now()
    
    // Check cooldown
    if (now - this.lastMessageTime < this.messageCooldown) {
      return { allowed: false, reason: 'Message cooldown active' }
    }

    // Check rate limit
    const oneMinuteAgo = now - 60000
    this.messageTimestamps = this.messageTimestamps.filter(timestamp => timestamp > oneMinuteAgo)
    
    if (this.messageTimestamps.length >= this.maxMessagesPerMinute) {
      return { allowed: false, reason: 'Rate limit exceeded' }
    }

    return { allowed: true }
  }

  recordMessage(): void {
    const now = Date.now()
    this.lastMessageTime = now
    this.messageTimestamps.push(now)
  }
}

// Context
const SocketContext = createContext<SocketContextType | null>(null)

// Provider
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation()
  
  // State
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [users, setUsers] = useState<SocketUser[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [notifications, setNotifications] = useState<SystemNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Refs
  const rateLimiter = useRef(new RateLimiter())
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5
  const pingInterval = useRef<NodeJS.Timeout | null>(null)
  
  // Get user info
  const getUserInfo = useCallback(() => {
    const profile = getProfileFromLS()
    const token = getAccessTokenFromLS()
    
    return {
      userId: profile?.id || '',
      username: profile?.username || profile?.email || 'Anonymous',
      accessToken: token
    }
  }, [])

  // Initialize socket
  const initializeSocket = useCallback(() => {
    const userInfo = getUserInfo()
    
    if (!userInfo.accessToken) {
      console.warn('⚠️ No access token available')
      return
    }

    console.log('🔌 Initializing socket connection...')
    setConnectionStatus('connecting')

    const newSocket = io(config.url, {
      path: '/socket',
      transports: ['websocket'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: maxReconnectAttempts,
      auth: {
        token: userInfo.accessToken,
        userId: userInfo.userId
      }
    })

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected')
      setIsConnected(true)
      setConnectionStatus('connected')
      reconnectAttempts.current = 0
      
      // Authenticate
      newSocket.emit('authenticate', {
        token: userInfo.accessToken,
        userId: userInfo.userId,
        timestamp: new Date().toISOString()
      })
      
      toast.success(t('Connected to server'))
    })

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
      setIsConnected(false)
      setConnectionStatus('disconnected')
      setCurrentRoom(null)
      stopPing()
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        toast.error(t('Disconnected from server'))
      }
    })

    newSocket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error)
      setConnectionStatus('error')
      toast.error(t('Connection failed'))
    })

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts')
      toast.success(t('Reconnected to server'))
    })

    newSocket.on('reconnect_error', (error) => {
      console.error('🔴 Reconnection error:', error)
      reconnectAttempts.current++
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        setConnectionStatus('error')
        toast.error(t('Failed to reconnect'))
      }
    })

    // Authentication events
    newSocket.on('authSuccess', (data) => {
      console.log('✅ Authentication successful:', data)
      toast.success(t('Authentication successful'))
    })

    newSocket.on('authFailed', (data) => {
      console.error('❌ Authentication failed:', data)
      toast.error(t('Authentication failed'))
      setConnectionStatus('error')
    })

    newSocket.on('tokenExpired', () => {
      console.warn('⏰ Token expired')
      toast.error(t('Session expired, please login again'))
      // Redirect to login or refresh token
    })

    // Room events
    newSocket.on('joinedRoom', (response) => {
      console.log('🏠 Joined room:', response)
      setCurrentRoom(response.data.roomId)
      startPing(response.data.roomId)
      toast.success(t('Joined room successfully'))
    })

    newSocket.on('joinRoomError', (error) => {
      console.error('❌ Failed to join room:', error)
      toast.error(t('Failed to join room'))
    })

    newSocket.on('userJoined', (data) => {
      console.log('👤 User joined:', data)
      setUsers(prev => {
        const existing = prev.find(u => u.userId === data.userId)
        if (existing) {
          return prev.map(u => u.userId === data.userId ? { ...u, ...data, isOnline: true } : u)
        }
        return [...prev, { ...data, isOnline: true }]
      })
    })

    newSocket.on('userLeft', (data) => {
      console.log('👋 User left:', data)
      setUsers(prev => prev.map(u => 
        u.userId === data.userId 
          ? { ...u, isOnline: false, lastSeen: new Date().toISOString() }
          : u
      ))
    })

    // Message events
    newSocket.on('newMessage', (data) => {
      console.log('💬 New message:', data)
      const message: ChatMessage = {
        id: data.id || Date.now().toString(),
        roomId: data.roomId,
        userId: data.userId,
        username: data.username,
        message: data.message,
        messageType: data.messageType || 'text',
        timestamp: data.timestamp,
        imageUrl: data.imageUrl
      }
      
      setMessages(prev => [...prev, message].slice(-100)) // Keep last 100 messages
    })

    newSocket.on('messageSent', (response) => {
      console.log('✅ Message sent:', response)
    })

    newSocket.on('sendMessageError', (error) => {
      console.error('❌ Send message error:', error)
      toast.error(t('Failed to send message'))
    })

    // Gift events
    newSocket.on('newGift', (data) => {
      console.log('🎁 New gift:', data)
      toast.success(t('New gift received!'))
      
      // Add gift as system message
      const giftMessage: ChatMessage = {
        id: Date.now().toString(),
        roomId: data.roomId,
        userId: 'system',
        username: 'System',
        message: `${data.senderName} sent ${data.giftName} to ${data.receiverName}`,
        messageType: 'system',
        timestamp: data.timestamp
      }
      
      setMessages(prev => [...prev, giftMessage].slice(-100))
    })

    newSocket.on('giftSent', (response) => {
      console.log('✅ Gift sent:', response)
      toast.success(t('Gift sent successfully!'))
    })

    newSocket.on('sendGiftError', (error) => {
      console.error('❌ Send gift error:', error)
      toast.error(t('Failed to send gift'))
    })

    // Notification events
    newSocket.on('notification', (data) => {
      console.log('🔔 New notification:', data)
      const notification: SystemNotification = {
        id: data.id || Date.now().toString(),
        type: data.type || 'info',
        title: data.title || 'Notification',
        message: data.message || '',
        data: data.data || {},
        isRead: false,
        timestamp: data.timestamp || new Date().toISOString()
      }
      
      setNotifications(prev => [notification, ...prev].slice(0, 50)) // Keep last 50 notifications
      setUnreadCount(prev => prev + 1)
      
      // Show toast for important notifications
      if (data.type === 'error') {
        toast.error(data.message)
      } else if (data.type === 'warning') {
        toast.error(data.message)
      } else if (data.type === 'success') {
        toast.success(data.message)
      }
    })

    newSocket.on('systemNotification', (data) => {
      console.log('📢 System notification:', data)
      const notification: SystemNotification = {
        ...data,
        type: 'system',
        isRead: false,
        timestamp: data.timestamp || new Date().toISOString()
      }
      
      setNotifications(prev => [notification, ...prev].slice(0, 50))
      setUnreadCount(prev => prev + 1)
    })

    // Ping/Pong events
    newSocket.on('viewerPong', (response) => {
      console.log('🏓 Pong received:', response)
    })

    newSocket.on('viewerPingError', (error) => {
      console.error('❌ Ping error:', error)
    })

    // Backend events (from Redis)
    newSocket.on('chatMessageFromBackend', (data) => {
      console.log('📨 Message from backend:', data)
      // Handle backend messages
    })

    newSocket.on('giftFromBackend', (data) => {
      console.log('🎁 Gift from backend:', data)
      // Handle backend gifts
    })

    setSocket(newSocket)
  }, [getUserInfo, t])

  // Start ping
  const startPing = useCallback((roomId: string) => {
    if (pingInterval.current) {
      clearInterval(pingInterval.current)
    }

    pingInterval.current = setInterval(() => {
      if (socket && isConnected && roomId) {
        const userInfo = getUserInfo()
        socket.emit('viewerPing', {
          roomId,
          userId: userInfo.userId,
          username: userInfo.username,
          timestamp: new Date().toISOString()
        })
      }
    }, 30000) // 30 seconds
  }, [socket, isConnected, getUserInfo])

  // Stop ping
  const stopPing = useCallback(() => {
    if (pingInterval.current) {
      clearInterval(pingInterval.current)
      pingInterval.current = null
    }
  }, [])

  // Actions
  const joinRoom = useCallback(async (roomId: string, userData: Record<string, unknown> = {}): Promise<boolean> => {
    if (!socket || !isConnected) {
      toast.error(t('Not connected to server'))
      return false
    }

    if (!SecurityUtils.validateRoomId(roomId)) {
      toast.error(t('Invalid room ID'))
      return false
    }

    try {
      const userInfo = getUserInfo()
      const joinData = {
        roomId,
        userId: userInfo.userId,
        username: userInfo.username,
        ...userData
      }

      console.log('🚪 Joining room:', roomId)
      socket.emit('joinRoom', joinData)
      return true
    } catch (error) {
      console.error('❌ Join room error:', error)
      toast.error(t('Failed to join room'))
      return false
    }
  }, [socket, isConnected, getUserInfo, t])

  const leaveRoom = useCallback(async (roomId: string = currentRoom || ''): Promise<boolean> => {
    if (!socket || !roomId) {
      return false
    }

    try {
      console.log('🚪 Leaving room:', roomId)
      socket.emit('leaveRoom', { roomId })
      setCurrentRoom(null)
      stopPing()
      return true
    } catch (error) {
      console.error('❌ Leave room error:', error)
      return false
    }
  }, [socket, currentRoom, stopPing])

  const sendMessage = useCallback(async (message: string, roomId: string = currentRoom || ''): Promise<boolean> => {
    if (!socket || !isConnected || !roomId) {
      toast.error(t('Cannot send message'))
      return false
    }

    // Rate limiting
    const rateLimitCheck = rateLimiter.current.canSendMessage()
    if (!rateLimitCheck.allowed) {
      toast.error(t(rateLimitCheck.reason || 'Rate limit exceeded'))
      return false
    }

    // Validate message
    const validation = SecurityUtils.validateMessage(message)
    if (!validation.valid) {
      toast.error(t(validation.reason || 'Invalid message'))
      return false
    }

    try {
      const userInfo = getUserInfo()
      const messageData = {
        roomId,
        userId: userInfo.userId,
        username: userInfo.username,
        message: SecurityUtils.sanitizeInput(message),
        timestamp: new Date().toISOString()
      }

      socket.emit('sendMessage', messageData)
      rateLimiter.current.recordMessage()
      return true
    } catch (error) {
      console.error('❌ Send message error:', error)
      toast.error(t('Failed to send message'))
      return false
    }
  }, [socket, isConnected, currentRoom, getUserInfo, t])

  const sendImageMessage = useCallback(async (imageUrl: string, roomId: string = currentRoom || ''): Promise<boolean> => {
    if (!socket || !isConnected || !roomId) {
      toast.error(t('Cannot send image'))
      return false
    }

    try {
      const userInfo = getUserInfo()
      const imageData = {
        roomId,
        userId: userInfo.userId,
        username: userInfo.username,
        imageUrl,
        messageType: 'image',
        timestamp: new Date().toISOString()
      }

      socket.emit('sendImageMessage', imageData)
      return true
    } catch (error) {
      console.error('❌ Send image error:', error)
      toast.error(t('Failed to send image'))
      return false
    }
  }, [socket, isConnected, currentRoom, getUserInfo, t])

  const sendGift = useCallback(async (giftData: Omit<Gift, 'id' | 'timestamp'>): Promise<boolean> => {
    if (!socket || !isConnected || !currentRoom) {
      toast.error(t('Cannot send gift'))
      return false
    }

    try {
      const userInfo = getUserInfo()
      const giftMessage = {
        ...giftData,
        roomId: currentRoom,
        senderId: userInfo.userId,
        senderName: userInfo.username,
        timestamp: new Date().toISOString()
      }

      socket.emit('sendGift', giftMessage)
      return true
    } catch (error) {
      console.error('❌ Send gift error:', error)
      toast.error(t('Failed to send gift'))
      return false
    }
  }, [socket, isConnected, currentRoom, getUserInfo, t])

  const chatWithAdmin = useCallback(async (message: string, supportType: string = 'general'): Promise<boolean> => {
    if (!socket || !isConnected) {
      toast.error(t('Cannot chat with admin'))
      return false
    }

    try {
      const userInfo = getUserInfo()
      const adminChatData = {
        userId: userInfo.userId,
        username: userInfo.username,
        message: SecurityUtils.sanitizeInput(message),
        supportType,
        timestamp: new Date().toISOString()
      }

      socket.emit('chatWithAdmin', adminChatData)
      return true
    } catch (error) {
      console.error('❌ Chat with admin error:', error)
      toast.error(t('Failed to chat with admin'))
      return false
    }
  }, [socket, isConnected, getUserInfo, t])

  // Utilities
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }, [])

  const getHealthStatus = useCallback(() => {
    return {
      socket: isConnected,
      connectionStatus,
      currentRoom,
      usersCount: users.length,
      messagesCount: messages.length,
      notificationsCount: notifications.length,
      unreadCount
    }
  }, [isConnected, connectionStatus, currentRoom, users.length, messages.length, notifications.length, unreadCount])

  const getConnectionInfo = useCallback(() => {
    return {
      url: config.url,
      isConnected,
      connectionStatus,
      currentRoom,
      reconnectAttempts: reconnectAttempts.current,
      maxReconnectAttempts
    }
  }, [isConnected, connectionStatus, currentRoom])

  const reconnect = useCallback(() => {
    if (socket) {
      socket.connect()
    } else {
      initializeSocket()
    }
  }, [socket, initializeSocket])

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect()
    }
    stopPing()
    setSocket(null)
    setIsConnected(false)
    setConnectionStatus('disconnected')
    setCurrentRoom(null)
    setUsers([])
  }, [socket, stopPing])

  // Initialize on mount
  useEffect(() => {
    const userInfo = getUserInfo()
    if (userInfo.accessToken) {
      initializeSocket()
    }

    return () => {
      disconnect()
    }
  }, [getUserInfo, initializeSocket, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPing()
      if (socket) {
        socket.disconnect()
      }
    }
  }, [socket, stopPing])

  const value: SocketContextType = {
    // Connection state
    socket,
    isConnected,
    currentRoom,
    connectionStatus,
    
    // Data
    users,
    messages,
    notifications,
    unreadCount,
    
    // Actions
    joinRoom,
    leaveRoom,
    sendMessage,
    sendImageMessage,
    sendGift,
    chatWithAdmin,
    
    // Utilities
    clearMessages,
    clearNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    
    // Health and debug
    getHealthStatus,
    getConnectionInfo,
    reconnect,
    disconnect
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

// Hook
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export default SocketContext 