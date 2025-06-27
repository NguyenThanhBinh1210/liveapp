import { useLocation } from 'react-router-dom'
import Footer from '~/components/layouts/Footer'
import Header from '~/components/layouts/Header'
import { LayoutPropsInterface } from '~/types/base.type'

const HomeLayout = ({ children }: LayoutPropsInterface) => {
  const path = useLocation().pathname
  return (
    <div className='max-w-[600px] mx-auto w-full'>
      {path === '/message' || path === '/profile' || path === '/login' ? <></> : <Header></Header>}
      <div className='dark:bg-[#212121] transition-all duration-300 min-h-screen'>{children}</div>
      <Footer />
    </div>
  )
}

export default HomeLayout
