// Production configuration
export const CONFIG = {
  API_URL: 'https://apilive.loltips.net/api/v1',
  SOCKET_URL: 'https://apisocket.loltips.net',
  LIVEKIT_URL: 'wss://wslive.loltips.net',
  
  // Development URLs (for reference)
  DEV: {
    API_URL: 'http://localhost:3000/api/v1',
    SOCKET_URL: 'http://localhost:4001',
    LIVEKIT_URL: 'ws://localhost:7880'
  }
}

// Environment detection
export const isDevelopment = import.meta.env.DEV && import.meta.env.MODE === 'development'

// Export current config
export const currentConfig = CONFIG // Always use production

export default CONFIG 