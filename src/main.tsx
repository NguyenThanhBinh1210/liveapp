import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.scss'
// import 'animate.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './contexts/app.context'
import { SocketProvider } from './contexts/socket.context'
import React from 'react'
import './i18n'
import { Toaster } from 'react-hot-toast'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <SocketProvider>
            <App />
            <Toaster />
          </SocketProvider>
        </AppProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
