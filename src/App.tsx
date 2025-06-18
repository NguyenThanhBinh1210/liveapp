import { useEffect } from 'react'
import useRouteElements from './routes/useRouteElements'

const App = () => {
  useEffect(() => {
    const pathname = window.location.pathname
    if (pathname === '/booking') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }, [])
  const routeElements = useRouteElements()
  return (
    <div>
      {routeElements}
    </div>
  )
}

export default App
