import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

const typeMap = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500'
}

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(() => onClose(), 3000)
    return () => clearTimeout(timeout)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-md text-white text-sm animate-slide-in ${typeMap[type]}`}
    >
      {message}
    </div>
  )
}
