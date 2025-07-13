import React, { useState, useEffect, useRef } from 'react'
import {
  LiveKitRoom,
  GridLayout,
  FocusLayout,
  useParticipants,
  RoomAudioRenderer,
  ParticipantTile,
  useTracks
} from '@livekit/components-react'
import { Room, RoomEvent, Track as LKTrack, RemoteTrack, RemoteParticipant } from 'livekit-client'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { liveKitApi } from '~/apis/live.api'
import { currentConfig } from '~/config'

interface LiveKitRoomProps {
  roomId: string
  token: string
  isHost: boolean
  onDisconnect?: () => void
  onParticipantChange?: (count: number) => void
}

// Activity Feed Types
interface ActivityItem {
  type: 'join' | 'leave' | 'comment' | 'gift' | 'welcome'
  data: {
    username?: string
    message?: string
    giftName?: string
  }
  timestamp: Date
  timeString: string
}

// LiveKit WebSocket URL from centralized config
const wsUrl = currentConfig.LIVEKIT_URL

// Activity Feed Component
const ActivityFeed: React.FC<{ activities: ActivityItem[], viewerCount: number }> = ({ activities, viewerCount }) => {
  const { t } = useTranslation()
  const activityListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activityListRef.current) {
      activityListRef.current.scrollTop = 0
    }
  }, [activities])

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'join': return '👋'
      case 'leave': return '🚪'
      case 'comment': return '💬'
      case 'gift': return '🎁'
      case 'welcome': return '🎉'
      default: return '📱'
    }
  }

  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h3>🎬 {t('live_activity')}</h3>
        <div className="viewer-count-display">
          👥 <span>{viewerCount}</span> {t('viewers')}
        </div>
      </div>
      <div className="activity-list" ref={activityListRef}>
        {activities.map((activity, index) => (
          <div key={index} className={`activity-item ${activity.type}`}>
            <div className="activity-icon">{getActivityIcon(activity.type)}</div>
            <div className="activity-content">
              <div className="activity-text">
                {activity.type === 'join' && (
                  <><span className="username">{activity.data.username}</span> {t('joined_stream')}</>
                )}
                {activity.type === 'leave' && (
                  <><span className="username">{activity.data.username}</span> {t('left_stream')}</>
                )}
                {activity.type === 'comment' && (
                  <><span className="username">{activity.data.username}</span><br/>{activity.data.message}</>
                )}
                {activity.type === 'gift' && (
                  <><span className="username">{activity.data.username}</span> {t('sent_gift')} <span className="gift-name">{activity.data.giftName}</span></>
                )}
                {activity.type === 'welcome' && (
                  <>{activity.data.message}</>
                )}
              </div>
              <div className="activity-time">{activity.timeString}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Enhanced Room Component with HTML file logic
const LiveKitRoomComponent: React.FC<LiveKitRoomProps> = ({ 
  roomId, 
  token, 
  isHost, 
  onDisconnect,
  onParticipantChange 
}) => {
  const { t } = useTranslation()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [, setStreamStartTime] = useState<Date | null>(null)
  const [streamTimer, setStreamTimer] = useState('00:00:00')
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [showUnmuteButton, setShowUnmuteButton] = useState(false)
  const [performanceMonitor, setPerformanceMonitor] = useState<NodeJS.Timeout | null>(null)
  const roomRef = useRef<Room | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Add activity helper
  const addActivity = (type: ActivityItem['type'], data: ActivityItem['data']) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('vi-VN', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })

    const activity: ActivityItem = {
      type,
      data,
      timestamp: now,
      timeString
    }

    setActivities(prev => {
      const newActivities = [activity, ...prev]
      return newActivities.slice(0, 50) // Max 50 items
    })
  }

  // Timer functions from HTML
  const startTimer = () => {
    const startTime = new Date()
    setStreamStartTime(startTime)
    
    const updateTimer = () => {
      const now = new Date()
      const diff = now.getTime() - startTime.getTime()
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      
      setStreamTimer(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }
    
    timerRef.current = setInterval(updateTimer, 1000)
    updateTimer()
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setStreamTimer('00:00:00')
  }

  // Performance monitoring from HTML
  const startPerformanceMonitoring = (room: Room) => {
    if (performanceMonitor) return

    const monitor = setInterval(() => {
      if (!room?.localParticipant) return

      // Fix: Use correct property access for tracks
      const videoTracks = Array.from(room.localParticipant.trackPublications.values())
        .filter(pub => pub.track && pub.track.kind === 'video')

      videoTracks.forEach(async (publication) => {
        if (publication.track) {
          try {
            const stats = await publication.track.getRTCStatsReport()
            
            stats?.forEach((report: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
              if (report.type === 'outbound-rtp' && report.mediaType === 'video') {
                const packetLossRate = report.packetsLost / (report.packetsSent || 1)
                
                if (packetLossRate > 0.05) { // 5% packet loss
                  console.warn('📊 High packet loss detected:', packetLossRate)
                  addActivity('welcome', {
                    message: t('network_unstable_optimizing')
                  })
                }
              }
            })
          } catch (error) {
            console.error('Performance monitoring error:', error)
          }
        }
      })
    }, 10000) // Check every 10 seconds

    setPerformanceMonitor(monitor)
  }

  const stopPerformanceMonitoring = () => {
    if (performanceMonitor) {
      clearInterval(performanceMonitor)
      setPerformanceMonitor(null)
    }
  }

  // Handle room events
  const handleRoomEvents = (room: Room) => {
    roomRef.current = room

    room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      console.log('👤 Participant connected:', participant.identity)
      addActivity('join', {
        username: participant.identity || 'Anonymous Viewer'
      })
      
      setTimeout(() => {
        const participantCount = room.remoteParticipants.size
        onParticipantChange?.(participantCount)
      }, 200)
    })

    room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      console.log('👋 Participant disconnected:', participant.identity)
      addActivity('leave', {
        username: participant.identity || 'Anonymous Viewer'
      })
      
      setTimeout(() => {
        const participantCount = room.remoteParticipants.size
        onParticipantChange?.(participantCount)
      }, 200)
    })

    room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _publication, participant: RemoteParticipant) => {
      console.log('📺 Track subscribed:', track.kind, 'from', participant.identity)
      
      if (track.kind === 'audio') {
        const audioElement = track.attach()
        audioElement.autoplay = true
        audioElement.style.display = 'none'
        
        const playPromise = audioElement.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.warn('🔇 Audio autoplay prevented, showing unmute button')
            setShowUnmuteButton(true)
          })
        }
        
        document.body.appendChild(audioElement)
      }
    })

    room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, _publication, participant: RemoteParticipant) => {
      console.log('❌ Track unsubscribed:', track.kind, 'from', participant.identity)
      track.detach().forEach(element => {
        element.remove()
      })
    })

    room.on(RoomEvent.Connected, () => {
      console.log('✅ Connected to room')
      if (isHost) {
        startTimer()
        startPerformanceMonitoring(room)
        addActivity('welcome', {
          message: t('stream_started_welcome')
        })
      }
    })

    room.on(RoomEvent.Disconnected, () => {
      console.log('❌ Disconnected from room')
      stopTimer()
      stopPerformanceMonitoring()
      onDisconnect?.()
    })
  }

  // Handle disconnect with API calls from HTML
  const handleDisconnect = async () => {
    try {
      console.log('🚪 Disconnecting from room:', roomId)
      
      // Call stop API like in HTML files
      if (isHost) {
        await liveKitApi.stopDemo(roomId)
        console.log('✅ Stop demo API called')
      } else {
        await liveKitApi.stopStream(roomId)
        console.log('✅ Stop stream API called')
      }
      
      stopTimer()
      stopPerformanceMonitoring()
      
      // Disconnect from room
      if (roomRef.current) {
        await roomRef.current.disconnect()
        roomRef.current = null
      }
      
      onDisconnect?.()
    } catch (error) {
      console.error('❌ Disconnect error:', error)
      onDisconnect?.()
    }
  }

  // Unmute audio handler
  const handleUnmuteAudio = () => {
    const audioElements = document.querySelectorAll('audio')
    audioElements.forEach(audio => {
      if (audio.paused) {
        audio.play().catch(console.error)
      }
    })
    setShowUnmuteButton(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      stopPerformanceMonitoring()
    }
  }, [])

  return (
    <LiveKitRoom
      video={cameraEnabled}
      audio={micEnabled}
      token={token}
      serverUrl={wsUrl}
      data-lk-theme="default"
      style={{ height: '100vh' }}
      onConnected={() => {
        const room = roomRef.current
        if (room) {
          handleRoomEvents(room)
        }
      }}
      onDisconnected={handleDisconnect}
    >
      <div className="lk-video-conference">
        {isHost ? (
          <HostView 
            activities={activities}
            streamTimer={streamTimer}
            cameraEnabled={cameraEnabled}
            micEnabled={micEnabled}
            onCameraToggle={() => setCameraEnabled(!cameraEnabled)}
            onMicToggle={() => setMicEnabled(!micEnabled)}
            onDisconnect={handleDisconnect}
            roomId={roomId}
          />
        ) : (
          <ViewerView 
            showUnmuteButton={showUnmuteButton}
            onUnmuteAudio={handleUnmuteAudio}
            onDisconnect={handleDisconnect}
          />
        )}
      </div>
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}

// Host View Component - Fix GridLayout usage
const HostView: React.FC<{
  activities: ActivityItem[]
  streamTimer: string
  cameraEnabled: boolean
  micEnabled: boolean
  onCameraToggle: () => void
  onMicToggle: () => void
  onDisconnect: () => void
  roomId: string
}> = ({ 
  activities, 
  streamTimer, 
  cameraEnabled, 
  micEnabled, 
  onCameraToggle, 
  onMicToggle, 
  onDisconnect,
  roomId 
}) => {
  const { t } = useTranslation()
  const participants = useParticipants()
  const viewerCount = participants.length - 1 // Exclude host

  // Get tracks for GridLayout
  const tracks = useTracks([
    { source: LKTrack.Source.Camera, withPlaceholder: true },
    { source: LKTrack.Source.ScreenShare, withPlaceholder: false },
  ])

  // Generate viewer link
  const viewerUrl = `${window.location.origin}/viewer.html?room=${roomId}`

  const copyViewerLink = () => {
    navigator.clipboard.writeText(viewerUrl).then(() => {
      toast.success(t('link_copied'))
    })
  }

  return (
    <div className="host-view">
      {/* Split screen layout like HTML */}
      <div className="video-container">
        <div className="video-half local-video">
          <GridLayout tracks={tracks}>
            <ParticipantTile />
          </GridLayout>
        </div>
        <div className="video-half remote-video">
          <ActivityFeed activities={activities} viewerCount={viewerCount} />
        </div>
      </div>

      {/* Status overlay */}
      <div className="status-overlay">
        <h3>📡 {t('stream_status')}</h3>
        <div className="status-badge status-streaming">
          {t('streaming')}
        </div>
        <div className="timer">⏰ {streamTimer}</div>
      </div>

      {/* Stream info */}
      <div className="stream-info-popup">
        <h3>📊 {t('stream_info')}</h3>
        <div>👥 {t('viewers')}: {viewerCount}</div>
      </div>

      {/* Controls */}
      <div className="controls-popup">
        <div className="control-buttons">
          <button 
            className={`btn-toggle ${!cameraEnabled ? 'disabled' : ''}`}
            onClick={onCameraToggle}
          >
            📹 {t('camera')} {!cameraEnabled && '(Off)'}
          </button>
          <button 
            className={`btn-toggle ${!micEnabled ? 'disabled' : ''}`}
            onClick={onMicToggle}
          >
            🎤 {t('microphone')} {!micEnabled && '(Off)'}
          </button>
          <button className="btn-stop" onClick={onDisconnect}>
            🚪 {t('disconnect')}
          </button>
        </div>
      </div>

      {/* Viewer link */}
      <div className="viewer-link-popup">
        <h3>🔗 {t('viewer_link')}</h3>
        <div className="viewer-link">{viewerUrl}</div>
        <button className="btn-copy" onClick={copyViewerLink}>
          📋 {t('copy_link')}
        </button>
      </div>
    </div>
  )
}

// Viewer View Component
const ViewerView: React.FC<{
  showUnmuteButton: boolean
  onUnmuteAudio: () => void
  onDisconnect: () => void
}> = ({ showUnmuteButton, onUnmuteAudio, onDisconnect }) => {
  const { t } = useTranslation()

  return (
    <div className="viewer-view">
      <FocusLayout />
      
      {/* Unmute button for autoplay issues */}
      {showUnmuteButton && (
        <div className="unmute-overlay">
          <button className="btn-unmute" onClick={onUnmuteAudio}>
            🔊 {t('unmute_audio')}
          </button>
        </div>
      )}

      {/* Viewer controls */}
      <div className="viewer-controls">
        <button className="btn-disconnect" onClick={onDisconnect}>
          🚪 {t('leave_stream')}
        </button>
      </div>
    </div>
  )
}

export default LiveKitRoomComponent 