import useRouteElements from './routes/useRouteElements'
const App = () => {
  const routeElements = useRouteElements()
  return (
    <div className='h-screen'>
      {routeElements}
    </div>
  )
}

export default App
