import useRouteElements from './routes/useRouteElements'
const App = () => {
  const routeElements = useRouteElements()
  return (
    <div>
      {routeElements}

    </div>
  )
}

export default App
