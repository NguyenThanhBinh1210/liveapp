# LiveKit Integration Setup Guide - API Chuẩn Hóa

## 📋 Tổng quan

Dự án đã được tích hợp với LiveKit để cung cấp tính năng livestream real-time với chất lượng cao. Tài liệu này mô tả cách sử dụng API đã được chuẩn hóa theo `prompt.txt`.

## 🚀 Tính năng đã chuẩn hóa

### ✅ API Endpoints đã chuẩn hóa:

#### 1. **Tạo Livestream (Streamer)**
```http
POST /stream
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Gaming Stream - Playing Valorant",
  "description": "Chơi game Valorant cùng với bạn bè!",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "category": "gaming",
  "tags": ["valorant", "fps", "competitive"]
}
```

**Response (201)**:
```json
{
  "message": "Stream created successfully",
  "stream": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Gaming Stream - Playing Valorant",
    "status": "live",
    "roomId": "room_507f1f77bcf86cd799439011"
  },
  "streamerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "wsUrl": "wss://wslive.loltips.net"
}
```

#### 2. **Lấy Token Viewer**
```http
POST /stream/viewer-token
Content-Type: application/json
Authorization: Bearer {token}

{
  "streamId": "507f1f77bcf86cd799439011",
  "identity": "viewer_john_doe_1234567890"
}
```

**Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "wsUrl": "wss://wslive.loltips.net",
  "roomId": "room_507f1f77bcf86cd799439011",
  "identity": "viewer_john_doe_1234567890",
  "expiresAt": "2023-12-01T11:00:00.000Z"
}
```

#### 3. **Kết thúc Livestream**
```http
PATCH /stream/{streamId}/stop
Authorization: Bearer {token}

{
  "reason": "manual_disconnect",
  "timestamp": "2023-12-01T12:00:00.000Z"
}
```

#### 4. **Lấy danh sách streams**
```http
GET /stream?page=1&limit=10&status=live
```

#### 5. **Lấy chi tiết stream**
```http
GET /stream/{streamId}
```

### ✅ Client API Functions đã chuẩn hóa:

#### **Stream.tsx (Streamer)**
```typescript
import { 
  createLive, 
  stopLive, 
  updateLive, 
  validateStreamData, 
  generateStreamerIdentity 
} from '~/apis/live.api'

// Tạo stream
const handleStartStream = async () => {
  const validation = validateStreamData(streamSetup)
  if (!validation.isValid) {
    validation.errors.forEach(error => toast.error(error))
    return
  }

  const identity = generateStreamerIdentity()
  createStreamMutation.mutate(streamSetup)
}

// Dừng stream
const handleStopStream = async () => {
  if (!streamId) return
  stopStreamMutation.mutate(streamId)
}

// Cập nhật thông tin stream
const handleUpdateStreamInfo = async () => {
  if (!streamId) return
  const updateData = {
    title: streamSetup.title,
    description: streamSetup.description,
    thumbnailUrl: streamSetup.thumbnailUrl
  }
  updateStreamMutation.mutate({ streamId, data: updateData })
}
```

#### **LiveId.tsx (Viewer)**
```typescript
import { 
  getLiveById, 
  getViewerToken, 
  generateViewerIdentity 
} from '~/apis/live.api'

// Kết nối tới stream
const connectToStream = () => {
  if (!id) return
  
  const identity = generateViewerIdentity()
  getTokenMutation.mutate({ streamId: id, identity })
}

// Lấy thông tin stream
const { data: liveData } = useQuery(
  ['live', id],
  () => getLiveById(id!),
  {
    enabled: !!id,
    refetchInterval: 30000 // Refresh mỗi 30s
  }
)
```

## 🔧 Validation & Error Handling

### **Data Validation**
```typescript
import { validateStreamData } from '~/apis/live.api'

const validation = validateStreamData({
  title: "My Stream",
  description: "Stream description",
  thumbnailUrl: "https://example.com/thumb.jpg"
})

if (!validation.isValid) {
  validation.errors.forEach(error => {
    console.error('Validation error:', error)
  })
}
```

### **Error Handling**
```typescript
const createStreamMutation = useMutation({
  mutationFn: (data: StreamSetupData) => createLive(data),
  onSuccess: (response) => {
    // Handle success
  },
  onError: (error: unknown) => {
    let errorMessage = t('failed_to_start_stream')
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as ErrorWithResponse
      if (axiosError.response?.status === 401) {
        errorMessage = t('please_login_to_stream')
      } else if (axiosError.response?.status === 403) {
        errorMessage = t('no_permission_to_stream')
      }
    }
    
    toast.error(errorMessage)
  }
})
```

## 🎨 UI Components đã chuẩn hóa

### **Stream Setup Form**
- ✅ Validation real-time
- ✅ Character counters
- ✅ Category selection
- ✅ Tags input
- ✅ Thumbnail upload
- ✅ Error display
- ✅ Loading states

### **Stream Info Bar**
- ✅ Live indicator
- ✅ Stream duration
- ✅ Viewer count
- ✅ Control buttons
- ✅ Update info button

### **Viewer Interface**
- ✅ Stream preview
- ✅ Connection states
- ✅ Error handling
- ✅ Retry functionality
- ✅ Stream ended state

## 🌐 Internationalization

### **Translation Keys Added**
```json
{
  "create_live_stream": "Tạo phiên livestream",
  "stream_title": "Tiêu đề stream",
  "validation_errors": "Lỗi xác thực",
  "stream_started_successfully": "Stream đã bắt đầu thành công",
  "failed_to_start_stream": "Không thể bắt đầu stream",
  "stream_ended_successfully": "Stream đã kết thúc thành công",
  "stream_recovered": "Stream đã được khôi phục",
  // ... và nhiều keys khác
}
```

## 🔄 Stream Recovery

### **Auto Recovery từ localStorage**
```typescript
useEffect(() => {
  const savedStream = localStorage.getItem('currentStream')
  if (savedStream && !isStreaming) {
    try {
      const streamData = JSON.parse(savedStream)
      const duration = Math.floor((Date.now() - new Date(streamData.startedAt).getTime()) / 1000)
      
      // Nếu stream còn trong vòng 24h, cho phép recovery
      if (duration < 24 * 60 * 60) {
        setStreamId(streamData.streamId)
        setRoomId(streamData.roomId)
        setToken(streamData.token)
        setIsStreaming(true)
        toast.success(t('stream_recovered'))
      }
    } catch (error) {
      localStorage.removeItem('currentStream')
    }
  }
}, [isStreaming, t])
```

## 📱 Mobile Optimization

### **Responsive Design**
- ✅ Mobile-first approach
- ✅ Touch-friendly controls
- ✅ Optimized video resolution (640x360@15fps)
- ✅ Adaptive bitrate (1000-2500 kbps)
- ✅ Battery optimization

### **Browser Support**
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)

## 🚀 Performance Optimizations

### **Client-side**
- ✅ React Query caching
- ✅ Debounced validation
- ✅ Lazy loading components
- ✅ Memoized calculations
- ✅ Optimized re-renders

### **Network**
- ✅ Connection retry logic
- ✅ Adaptive quality
- ✅ Bandwidth monitoring
- ✅ Fallback mechanisms

## 🔐 Security Features

### **Authentication**
- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Token refresh mechanism
- ✅ Secure token storage

### **Data Validation**
- ✅ Client-side validation
- ✅ Server-side validation
- ✅ Input sanitization
- ✅ File type validation

## 📊 Monitoring & Analytics

### **Stream Metrics**
- ✅ Viewer count tracking
- ✅ Stream duration
- ✅ Connection quality
- ✅ Error logging

### **User Experience**
- ✅ Loading states
- ✅ Error messages
- ✅ Success notifications
- ✅ Progress indicators

## 🛠️ Development Tools

### **Debugging**
```typescript
// Enable debug mode
console.log('🎬 Starting stream with data:', streamSetup)
console.log('✅ Stream created successfully:', response.data)
console.log('❌ Failed to create stream:', error)
```

### **Testing**
```typescript
// Test stream creation
const testStreamData = {
  title: "Test Stream",
  description: "Test description",
  thumbnailUrl: "https://example.com/test.jpg",
  category: "general",
  tags: ["test"]
}

const validation = validateStreamData(testStreamData)
console.log('Validation result:', validation)
```

## 📚 Best Practices

### **Code Organization**
- ✅ Separated API functions
- ✅ Type definitions
- ✅ Error handling
- ✅ Utility functions
- ✅ Consistent naming

### **User Experience**
- ✅ Clear error messages
- ✅ Loading indicators
- ✅ Success feedback
- ✅ Graceful degradation
- ✅ Accessibility support

### **Performance**
- ✅ Efficient re-renders
- ✅ Memory management
- ✅ Network optimization
- ✅ Caching strategies
- ✅ Bundle optimization

## 🔄 Migration Guide

### **Từ API cũ sang API mới**

#### **Trước:**
```typescript
// Old API
const createRoomMutation = useMutation({
  mutationFn: liveKitApi.createRoom,
  // ...
})
```

#### **Sau:**
```typescript
// New standardized API
const createStreamMutation = useMutation({
  mutationFn: (data: StreamSetupData) => createLive(data),
  // ...
})
```

### **Cập nhật Components**
1. Import functions mới từ `~/apis/live.api`
2. Sử dụng validation functions
3. Cập nhật error handling
4. Thêm translation keys
5. Test functionality

## 🎯 Roadmap

### **Phase 1: Completed ✅**
- [x] API standardization
- [x] Error handling
- [x] Validation
- [x] UI improvements
- [x] Internationalization

### **Phase 2: In Progress 🚧**
- [ ] Advanced analytics
- [ ] Stream recording
- [ ] Multi-quality streaming
- [ ] Chat integration
- [ ] Gift system integration

### **Phase 3: Planned 📋**
- [ ] Mobile app support
- [ ] Advanced moderation
- [ ] Stream scheduling
- [ ] Monetization features
- [ ] Advanced analytics dashboard

---

## 💡 Tips & Tricks

### **Debug Stream Issues**
```typescript
// Check connection status
console.log('Connection state:', currentRoom?.state)

// Monitor participant count
currentRoom?.on('participantConnected', (participant) => {
  console.log('👥 Participant joined:', participant.identity)
})

// Track stream performance
const startTime = Date.now()
setInterval(() => {
  console.log('⏱️ Stream duration:', Date.now() - startTime)
}, 60000)
```

### **Optimize for Mobile**
```typescript
// Mobile-specific settings
const mobileSettings = {
  video: { 
    width: { ideal: 640, max: 854 }, 
    height: { ideal: 360, max: 480 }, 
    frameRate: { ideal: 15, max: 20 } 
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
}
```

### **Handle Connection Issues**
```typescript
// Retry logic
const retryConnection = async (maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await connectToStream()
      return
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

---

**Lưu ý**: Tài liệu này sẽ được cập nhật thường xuyên khi có thêm tính năng mới hoặc cải tiến. 