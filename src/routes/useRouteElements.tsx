import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import NotFound from '~/pages/NotFound'
import HomeLayout from '~/layouts/HomeLayout'
import Home from '~/pages/Home'

import Message from '~/pages/Message'
import Profile from '~/pages/Profile'
import Gifts from '~/pages/Gifts'
import Wallet from '~/pages/Wallet'
import Settings from '~/pages/Settings'
import LiveId from '~/pages/LiveId'
import { useContext } from 'react'
import { AppContext } from '~/contexts/app.context'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import Stream from '~/pages/Stream'

const useRouteElements = () => {
  function ProtecedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return isAuthenticated ? <Outlet /> : <Navigate to='login' />
  }
  function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
  }
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: 'login',
          element: (
            <HomeLayout>
              <Login />
            </HomeLayout>
          )
        },
        {
          path: 'register',
          element: (
            <HomeLayout>
              <Register />
            </HomeLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtecedRoute />,
      children: [
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
        }
        ,
        {
          path: '/stream',
          element: (
            <Stream />
          )
        },
        {
          path: '/gifts',
          element: (
            <HomeLayout>
              <Gifts />
            </HomeLayout>
          )
        },
        {
          path: '/wallet',
          element: (
            <HomeLayout>
              <Wallet />
            </HomeLayout>
          )
        },
        {
          path: '/settings',
          element: (
            <HomeLayout>
              <Settings />
            </HomeLayout>
          )
        }
        ,

      ]
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
