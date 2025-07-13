import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  User, 
  Globe, 
  Moon, 
  Sun, 
  Shield, 
  Info,
  Smartphone,
  Monitor,
  Camera,
  Mic,
  Wifi,
  Database,
  Server,
  Activity,
  MessageCircle,
  Bell,
  Users,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import { getSystemConfig, getSystemHealth } from '~/apis/system.api'
import { useSocket } from '~/contexts/socket.context'

type TabType = 'general' | 'account' | 'streaming' | 'system' | 'socket'

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const socket = useSocket()
  
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  // Socket state
  const [showSocketDetails, setShowSocketDetails] = useState(false)
  const [testRoomId, setTestRoomId] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [autoRefreshHealth, setAutoRefreshHealth] = useState(true)

  // Queries
  const systemConfigQuery = useQuery({
    queryKey: ['system', 'config'],
    queryFn: getSystemConfig,
    enabled: activeTab === 'system'
  })

  const systemHealthQuery = useQuery({
    queryKey: ['system', 'health'],
    queryFn: getSystemHealth,
    enabled: activeTab === 'system',
    refetchInterval: autoRefreshHealth ? 30000 : false // Refresh every 30 seconds
  })

  // Auto-refresh socket health
  useEffect(() => {
    if (activeTab === 'socket' && autoRefreshHealth) {
      const interval = setInterval(() => {
        // Force re-render to update socket health
        setShowSocketDetails(prev => prev)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [activeTab, autoRefreshHealth])

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
    localStorage.setItem('language', language)
    toast.success(t('Language changed successfully'))
  }

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark'
    setIsDarkMode(!isDarkMode)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', !isDarkMode)
    toast.success(t('Theme changed successfully'))
  }

  // Socket actions
  const handleSocketReconnect = () => {
    socket.reconnect()
    toast.success(t('Reconnecting...'))
  }

  const handleSocketDisconnect = () => {
    socket.disconnect()
    toast.success(t('Disconnected from socket'))
  }

  const handleTestJoinRoom = async () => {
    if (!testRoomId.trim()) {
      toast.error(t('Please enter a room ID'))
      return
    }

    const success = await socket.joinRoom(testRoomId.trim())
    if (success) {
      toast.success(t('Joined room successfully'))
      setTestRoomId('')
    }
  }

  const handleTestLeaveRoom = async () => {
    const success = await socket.leaveRoom()
    if (success) {
      toast.success(t('Left room successfully'))
    }
  }

  const handleTestSendMessage = async () => {
    if (!testMessage.trim()) {
      toast.error(t('Please enter a message'))
      return
    }

    const success = await socket.sendMessage(testMessage.trim())
    if (success) {
      toast.success(t('Message sent successfully'))
      setTestMessage('')
    }
  }

  const handleClearMessages = () => {
    socket.clearMessages()
    toast.success(t('Messages cleared'))
  }

  const handleClearNotifications = () => {
    socket.clearNotifications()
    toast.success(t('Notifications cleared'))
  }

  const handleMarkAllNotificationsRead = () => {
    socket.markAllNotificationsAsRead()
    toast.success(t('All notifications marked as read'))
  }

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('Language')}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleLanguageChange('vi')}
            className={`p-3 rounded-lg border-2 transition-all ${
              i18n.language === 'vi'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl mb-1 block">🇻🇳</span>
            <span className="text-sm font-medium">Tiếng Việt</span>
          </button>
          
          <button
            onClick={() => handleLanguageChange('en')}
            className={`p-3 rounded-lg border-2 transition-all ${
              i18n.language === 'en'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl mb-1 block">🇺🇸</span>
            <span className="text-sm font-medium">English</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center space-x-2">
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-blue-600" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('Theme')}
          </h3>
        </div>
        
        <button
          onClick={handleThemeToggle}
          className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {isDarkMode ? (
              <>
                <Moon className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{t('Dark Mode')}</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">{t('Light Mode')}</span>
              </>
            )}
          </div>
          
          <div className={`w-12 h-6 rounded-full transition-colors ${
            isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
              isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
            } mt-0.5`} />
          </div>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Smartphone className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('Device Information')}
          </h3>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('User Agent')}:</span>
            <span className="text-gray-900 dark:text-white font-mono text-xs max-w-xs truncate">
              {navigator.userAgent}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('Screen Resolution')}:</span>
            <span className="text-gray-900 dark:text-white">
              {screen.width} x {screen.height}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('Timezone')}:</span>
            <span className="text-gray-900 dark:text-white">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <User className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('Account Information')}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Username')}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={t('Enter username')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Email')}
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={t('Enter email')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Bio')}
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={t('Tell us about yourself')}
            />
          </div>
          
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            {t('Update Profile')}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('Security')}
          </h3>
        </div>
        
        <div className="space-y-4">
          <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
            {t('Change Password')}
          </button>
          
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            {t('Enable Two-Factor Authentication')}
          </button>
          
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            {t('Delete Account')}
          </button>
        </div>
      </div>
    </div>
  )

  const renderStreamingTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Camera className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('Camera Settings')}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Camera Quality')}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option value="720p">720p (HD)</option>
              <option value="1080p">1080p (Full HD)</option>
              <option value="4k">4K (Ultra HD)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Frame Rate')}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option value="15">15 FPS</option>
              <option value="30">30 FPS</option>
              <option value="60">60 FPS</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Mic className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('Audio Settings')}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Audio Quality')}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="studio">Studio</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Noise Suppression')}
            </label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('Enable noise suppression')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Monitor className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('Stream Settings')}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Stream Title')}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={t('Enter stream title')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Stream Description')}
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={t('Describe your stream')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Stream Category')}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option value="gaming">Gaming</option>
              <option value="music">Music</option>
              <option value="talk">Talk Show</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSocketTab = () => {
    const healthStatus = socket.getHealthStatus()
    const connectionInfo = socket.getConnectionInfo()
    
    // Force production URLs
    const livekitSocketUrl = 'wss://wslive.loltips.net'
    
    return (
      <div className="space-y-6">
        {/* Backend Socket Connection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Wifi className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('Backend Socket Connection')}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                socket.isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={`text-sm font-medium ${
                socket.isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {socket.isConnected ? t('Connected') : t('Disconnected')}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Server className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Backend Socket URL')}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                {String(connectionInfo.url)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Status')}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {String(connectionInfo.connectionStatus)}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSocketReconnect}
              disabled={socket.isConnected}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              {t('Reconnect')}
            </button>
            
            <button
              onClick={handleSocketDisconnect}
              disabled={!socket.isConnected}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <XCircle className="w-4 h-4 inline mr-2" />
              {t('Disconnect')}
            </button>
          </div>
        </div>

        {/* LiveKit Socket Connection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Wifi className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('LiveKit Socket Connection')}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                {t('Managed by LiveKit')}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Server className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('LiveKit Socket URL')}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                {livekitSocketUrl}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Purpose')}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('Real-time video streaming')}
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {t('Note')}
              </span>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              {t('LiveKit socket is automatically managed by the streaming component. No manual configuration needed.')}
            </p>
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('Health Status')}
              </h3>
            </div>
            
            <button
              onClick={() => setAutoRefreshHealth(!autoRefreshHealth)}
              className={`p-2 rounded-lg ${
                autoRefreshHealth 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/20' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefreshHealth ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {String(healthStatus.usersCount)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('Users')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {String(healthStatus.messagesCount)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('Messages')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {String(healthStatus.notificationsCount)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('Notifications')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {String(healthStatus.unreadCount)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('Unread')}
              </div>
            </div>
          </div>
        </div>

        {/* Room Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('Room Management')}
            </h3>
          </div>
          
          {socket.currentRoom && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {t('Currently in room')}: {socket.currentRoom}
                </span>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Room ID')}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={testRoomId}
                  onChange={(e) => setTestRoomId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={t('Enter room ID')}
                />
                <button
                  onClick={handleTestJoinRoom}
                  disabled={!socket.isConnected || !testRoomId.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('Join')}
                </button>
              </div>
            </div>
            
            {socket.currentRoom && (
              <button
                onClick={handleTestLeaveRoom}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('Leave Current Room')}
              </button>
            )}
          </div>
        </div>

        {/* Message Testing */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('Message Testing')}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Test Message')}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={t('Enter test message')}
                  onKeyPress={(e) => e.key === 'Enter' && handleTestSendMessage()}
                />
                <button
                  onClick={handleTestSendMessage}
                  disabled={!socket.isConnected || !socket.currentRoom || !testMessage.trim()}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('Send')}
                </button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleClearMessages}
                className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                {t('Clear Messages')}
              </button>
              
              <button
                onClick={handleClearNotifications}
                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Bell className="w-4 h-4 inline mr-2" />
                {t('Clear Notifications')}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        {socket.messages.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('Recent Messages')} ({socket.messages.length})
                </h3>
              </div>
              
              <button
                onClick={handleClearMessages}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                {t('Clear All')}
              </button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {socket.messages.slice(-10).map((message) => (
                <div
                  key={message.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {message.username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {message.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {socket.notifications.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('Notifications')} ({socket.notifications.length})
                </h3>
                {socket.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {socket.unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {t('Mark All Read')}
                </button>
                <button
                  onClick={handleClearNotifications}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  {t('Clear All')}
                </button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {socket.notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg p-3 ${
                    notification.isRead 
                      ? 'bg-gray-50 dark:bg-gray-700' 
                      : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <button
                      onClick={() => socket.markNotificationAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                    >
                      {t('Mark as read')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connection Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('Connection Details')}
              </h3>
            </div>
            
            <button
              onClick={() => setShowSocketDetails(!showSocketDetails)}
              className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showSocketDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {showSocketDetails && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('Socket ID')}:</span>
                  <p className="font-mono text-xs text-gray-900 dark:text-white">
                    {socket.socket?.id || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('Transport')}:</span>
                  <p className="font-mono text-xs text-gray-900 dark:text-white">
                    {socket.socket?.io.engine.transport.name || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('Connection Info')}:</span>
                <pre className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs overflow-x-auto mt-1">
                  {JSON.stringify(connectionInfo, null, 2)}
                </pre>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('Health Status')}:</span>
                <pre className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs overflow-x-auto mt-1">
                  {JSON.stringify(healthStatus, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Server className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('System Health')}
            </h3>
          </div>
          
          <button
            onClick={() => systemHealthQuery.refetch()}
            disabled={systemHealthQuery.isLoading}
            className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RefreshCw className={`w-5 h-5 ${systemHealthQuery.isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {systemHealthQuery.isLoading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}
        
        {!!systemHealthQuery.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {t('Failed to load system health')}
              </span>
            </div>
          </div>
        )}
        
        {systemHealthQuery.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(systemHealthQuery.data).map(([key, value]) => (
              <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  {typeof value === 'boolean' && (
                    <div className={`w-3 h-3 rounded-full ${
                      value ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  )}
                </div>
                                 <p className="text-sm text-gray-600 dark:text-gray-400">
                   {typeof value === 'boolean' ? (value ? t('Healthy') : t('Unhealthy')) : String(value || 'N/A')}
                 </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('System Configuration')}
            </h3>
          </div>
          
          <button
            onClick={() => systemConfigQuery.refetch()}
            disabled={systemConfigQuery.isLoading}
            className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RefreshCw className={`w-5 h-5 ${systemConfigQuery.isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {systemConfigQuery.isLoading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        )}
        
        {!!systemConfigQuery.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {t('Failed to load system configuration')}
              </span>
            </div>
          </div>
        )}
        
        {systemConfigQuery.data && (
          <div className="space-y-4">
            {Object.entries(systemConfigQuery.data).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                                 <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                   {typeof value === 'object' ? JSON.stringify(value) : String(value || 'N/A')}
                 </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('Application Information')}
          </h3>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('Version')}:</span>
            <span className="text-gray-900 dark:text-white">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('Build Date')}:</span>
            <span className="text-gray-900 dark:text-white">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('Environment')}:</span>
            <span className="text-gray-900 dark:text-white">
              {import.meta.env.MODE}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'general', label: t('General'), icon: SettingsIcon },
    { id: 'account', label: t('Account'), icon: User },
    { id: 'streaming', label: t('Streaming'), icon: Camera },
    { id: 'socket', label: t('Socket & Redis'), icon: Zap },
    { id: 'system', label: t('System'), icon: Server }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('Settings')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('Manage your application preferences and system settings')}
              </p>
            </div>
          </div>
          
          {/* Socket Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              socket.isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {socket.isConnected ? t('Socket Connected') : t('Socket Disconnected')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'account' && renderAccountTab()}
            {activeTab === 'streaming' && renderStreamingTab()}
            {activeTab === 'socket' && renderSocketTab()}
            {activeTab === 'system' && renderSystemTab()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 