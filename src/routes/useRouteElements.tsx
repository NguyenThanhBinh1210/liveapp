import { useRoutes } from 'react-router-dom'
import NotFound from '~/pages/NotFound'
import HomeLayout from '~/layouts/HomeLayout'
import Home from '~/pages/Home'

import Message from '~/pages/Message'
import Profile from '~/pages/Profile'
import LiveId from '~/pages/LiveId'

const useRouteElements = () => {
  const routeElements = useRoutes([

    {
      path: '/',
      index: true,
      element: (
        <HomeLayout>
          <Home />
        </HomeLayout>
      )
    },
    {
      path: '/message',
      element: (
        <HomeLayout>
          <Message />
        </HomeLayout>
      )
    },
    {
      path: '/profile',
      element: (
        <HomeLayout>
          <Profile />
        </HomeLayout>
      )
    },
    {
      path: '/live/:id',
      element: (
        <LiveId />
      )
    },
    {
      path: '/*',
      element: (
        <HomeLayout>
          <NotFound />
        </HomeLayout>
      )
    }
  ])

  return routeElements
}
export default useRouteElements
