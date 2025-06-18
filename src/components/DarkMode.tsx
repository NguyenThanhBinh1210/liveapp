import { useEffect, useState } from 'react'

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Đọc dark mode từ localStorage
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const enabled = storedTheme === 'dark' || (!storedTheme && prefersDark)
    setIsDark(enabled)
    if (enabled) document.documentElement.classList.add('dark')
  }, [])

  const toggleDarkMode = () => {
    const newTheme = isDark ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', !isDark)
    setIsDark(!isDark)
  }

  return (
    <button onClick={toggleDarkMode} className='p-2 rounded-lg transition-all   '>
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}

export default DarkModeToggle
