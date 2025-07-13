import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { 
  MessageCircle, 
  Users, 
  Gift, 
  Bell, 
  Wifi, 
  WifiOff,
  Send,
  UserPlus,
  UserMinus
} from 'lucide-react'
import { 
  useSocketStatus, 
  useSocketMessages, 
  useSocketNotifications, 
  useSocketRoom,
  useSocketGifts 
} from '~/hooks/useSocket'

interface SocketDemoProps {
  roomId?: string
  showChat?: boolean
  showNotifications?: boolean
  showUsers?: boolean
  showGifts?: boolean
}

const SocketDemo: React.FC<SocketDemoProps> = ({
  roomId = 'demo-room',
  showChat = true,
  showNotifications = true,
  showUsers = true,
  showGifts = false
}) => {
  const { t } = useTranslation()
  
  // Use specialized hooks
  const { isConnected, connectionStatus, currentRoom } = useSocketStatus()
  const { messages, sendMessage, messageCount } = useSocketMessages()
  const { notifications, unreadCount, markAllAsRead } = useSocketNotifications()
  const { users, joinRoom, leaveRoom, userCount } = useSocketRoom()
  const { sendGift } = useSocketGifts()
  
  // Local state
  const [message, setMessage] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  
  // Auto-join room on mount
  useEffect(() => {
    if (isConnected && roomId && !currentRoom) {
      handleJoinRoom()
    }
  }, [isConnected, roomId, currentRoom])
  
  // Handle room actions
  const handleJoinRoom = async () => {
    const success = await joinRoom(roomId)
    if (success) {
      setIsJoined(true)
      toast.success(t('Joined room successfully'))
    }
  }
  
  const handleLeaveRoom = async () => {
    const success = await leaveRoom()
    if (success) {
      setIsJoined(false)
      toast.success(t('Left room successfully'))
    }
  }
  
  // Handle message sending
  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    const success = await sendMessage(message)
    if (success) {
      setMessage('')
    }
  }
  
  // Handle gift sending (example)
  const handleSendGift = async () => {
    if (!currentRoom) return
    
    const giftData = {
      roomId: currentRoom,
      senderId: 'current-user',
      senderName: 'Current User',
      receiverId: 'demo-user',
      receiverName: 'Demo User',
      giftId: 'heart',
      giftName: 'Heart',
      giftType: 'emoji',
      giftValue: 10,
      quantity: 1,
      message: 'Here is a gift for you!',
      animation: 'hearts'
    }
    
    const success = await sendGift(giftData)
    if (success) {
      toast.success(t('Gift sent successfully!'))
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {isConnected ? t('Connected') : t('Disconnected')}
            </span>
          </div>
          
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {connectionStatus}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {showUsers && (
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {userCount}
              </span>
            </div>
          )}
          
          {showChat && (
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {messageCount}
              </span>
            </div>
          )}
          
          {showNotifications && unreadCount > 0 && (
            <div className="flex items-center space-x-1">
              <Bell className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Room Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('Room')}: {currentRoom || 'None'}
          </span>
          
          {currentRoom && (
            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 px-2 py-1 rounded-full">
              {t('Joined')}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {!isJoined ? (
            <button
              onClick={handleJoinRoom}
              disabled={!isConnected}
              className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('Join')}</span>
            </button>
          ) : (
            <button
              onClick={handleLeaveRoom}
              className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm"
            >
              <UserMinus className="w-4 h-4" />
              <span>{t('Leave')}</span>
            </button>
          )}
          
          {showGifts && currentRoom && (
            <button
              onClick={handleSendGift}
              className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 text-sm"
            >
              <Gift className="w-4 h-4" />
              <span>{t('Gift')}</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Chat Section */}
      {showChat && (
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('Chat')}
            </h4>
          </div>
          
          {/* Messages */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-32 overflow-y-auto mb-3">
            {messages.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('No messages yet')}
              </p>
            ) : (
              <div className="space-y-2">
                {messages.slice(-5).map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {msg.username}:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      {msg.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('Enter message...')}
              disabled={!isConnected || !currentRoom}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!isConnected || !currentRoom || !message.trim()}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Users Section */}
      {showUsers && users.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="w-4 h-4 text-green-600" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('Users')} ({userCount})
            </h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <div
                key={user.userId}
                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1"
              >
                <div className={`w-2 h-2 rounded-full ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm text-gray-900 dark:text-white">
                  {user.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Notifications Section */}
      {showNotifications && notifications.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-yellow-600" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {t('Notifications')}
              </h4>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {t('Mark All Read')}
              </button>
            )}
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`text-sm p-2 rounded-lg ${
                  notification.isRead 
                    ? 'bg-gray-100 dark:bg-gray-700' 
                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </span>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SocketDemo 