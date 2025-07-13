import { useSocket as useSocketContext } from '~/contexts/socket.context'

// Re-export the hook for easier import
export const useSocket = useSocketContext

// Additional utilities for socket management
export const useSocketStatus = () => {
  const socket = useSocketContext()
  
  return {
    isConnected: socket.isConnected,
    connectionStatus: socket.connectionStatus,
    currentRoom: socket.currentRoom,
    healthStatus: socket.getHealthStatus(),
    connectionInfo: socket.getConnectionInfo()
  }
}

export const useSocketMessages = () => {
  const socket = useSocketContext()
  
  return {
    messages: socket.messages,
    sendMessage: socket.sendMessage,
    sendImageMessage: socket.sendImageMessage,
    clearMessages: socket.clearMessages,
    messageCount: socket.messages.length
  }
}

export const useSocketNotifications = () => {
  const socket = useSocketContext()
  
  return {
    notifications: socket.notifications,
    unreadCount: socket.unreadCount,
    markAsRead: socket.markNotificationAsRead,
    markAllAsRead: socket.markAllNotificationsAsRead,
    clearNotifications: socket.clearNotifications
  }
}

export const useSocketRoom = () => {
  const socket = useSocketContext()
  
  return {
    currentRoom: socket.currentRoom,
    users: socket.users,
    joinRoom: socket.joinRoom,
    leaveRoom: socket.leaveRoom,
    userCount: socket.users.length
  }
}

export const useSocketGifts = () => {
  const socket = useSocketContext()
  
  return {
    sendGift: socket.sendGift
  }
}

export const useSocketAdmin = () => {
  const socket = useSocketContext()
  
  return {
    chatWithAdmin: socket.chatWithAdmin
  }
}

export default useSocketContext 