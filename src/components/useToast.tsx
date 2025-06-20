import { useState } from 'react'
import Toast from './Toast'

export function useToast() {
  const [toast, setToast] = useState<{
    message: string
    type?: 'success' | 'error' | 'info'
  } | null>(null)

  const showToast = (message: string, type?: 'success' | 'error' | 'info') => {
    setToast({ message, type })
  }

  const ToastContainer = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
  ) : null

  return { showToast, ToastContainer }
}
