import { useEffect, useState } from 'react'
import logo from '~/assets/n_ic_logo.9f6f20911258714f7de0.webp'
import DarkModeToggle from '../DarkMode'
const Header = () => {
  return (
    <header className='fixed top-0 left-1/2 w-full -translate-x-1/2  z-50 bg-[#12121271] dark:bg-black transition-all duration-300 max-w-[600px]  '>
      <div className='flex items-center justify-between px-4 py-2'>
        <div className='flex items-center gap-2'>

          <img src={logo} alt='logo' className='w-[84px]' />
        </div>
        <div className='flex gap-2'>
          <DarkModeToggle />
          <SearchButton />
        </div>
      </div>
    </header>
  )
}
// const ButtonMenu = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden'
//     } else {
//       document.body.style.overflow = 'auto'
//     }
//   }, [isOpen])
//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className='w-8 h-8 text-white flex items-center justify-center '
//       >
//         {!isOpen ? (
//           <svg
//             xmlns='http://www.w3.org/2000/svg'
//             fill='none'
//             viewBox='0 0 24 24'
//             strokeWidth={1.5}
//             stroke='currentColor'
//             className='size-6'
//           >
//             <path
//               strokeLinecap='round'
//               strokeLinejoin='round'
//               d='M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5'
//             />
//           </svg>
//         ) : (
//           <svg
//             xmlns='http://www.w3.org/2000/svg'
//             fill='none'
//             viewBox='0 0 24 24'
//             strokeWidth={1.5}
//             stroke='currentColor'
//             className='size-6'
//           >
//             <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
//           </svg>
//         )}
//       </button>
//       <div
//         className={`fixed overflow-y-scroll scrollbar-hidden w-full bottom-0  border-t h-[calc(100vh-64px)] bg-white z-50   transition-all duration-500 ${isOpen ? '-right-0' : '-right-full opacity-0 pointer-events-none'
//           }`}
//       >
//         <Link to={'/'} className='text-[#013879] font-medium text-lg py-6 px-[16px] w-full block border-b '>
//           Giới Thiệu
//         </Link>
//         <div>
//           <div className='cursor-pointer text-[#013879] font-medium text-lg py-6 px-[16px] w-full  border-b flex items-center gap-x-2'>
//             Du Lịch Nước Ngoài{' '}
//             <svg
//               xmlns='http://www.w3.org/2000/svg'
//               fill='none'
//               viewBox='0 0 24 24'
//               strokeWidth={2}
//               stroke='currentColor'
//               className='size-4'
//             >
//               <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
//             </svg>
//           </div>
//         </div>
//         <Link to={'/'} className='text-[#013879] font-medium text-lg py-6 px-[16px] w-full block border-b '>
//           Tour Khách Đoàn
//         </Link>
//         <Accordion>
//           <Link to=''>Ngân Hàng</Link>
//           <Link to=''>Tài Chính</Link>
//           <Link to=''>Thương mại</Link>
//         </Accordion>
//         <Accordion>
//           <Link to=''>Ngân Hàng</Link>
//           <Link to=''>Tài Chính</Link>
//           <Link to=''>Thương mại</Link>
//         </Accordion>
//         <Accordion>
//           <Link to=''>Ngân Hàng</Link>
//           <Link to=''>Tài Chính</Link>
//           <Link to=''>Thương mại</Link>
//         </Accordion>
//         <Accordion>
//           <Link to=''>Ngân Hàng</Link>
//           <Link to=''>Tài Chính</Link>
//           <Link to=''>Thương mại</Link>
//         </Accordion>
//         <Accordion>
//           <Link to=''>Ngân Hàng</Link>
//           <Link to=''>Tài Chính</Link>
//           <Link to=''>Thương mại</Link>
//         </Accordion>
//         <Link to={'/'} className='text-[#013879] font-medium text-lg py-6 px-[16px] w-full block border-b '>
//           Tin Tức
//         </Link>
//         <Link to={'/'} className='text-[#013879] font-medium text-lg py-6 px-[16px] w-full block border-b '>
//           Chính Sách & Quy Định
//         </Link>
//         <Link to={'/'} className='text-[#013879] font-medium text-lg py-6 px-[16px] w-full block border-b '>
//           Liên Hệ
//         </Link>
//         <Link to={'/tuyen-dung'} className='text-[#013879] font-medium text-lg py-6 px-[16px] w-full block border-b '>
//           Tuyển Dụng
//         </Link>
//       </div>
//     </>
//   )
// }
const SearchButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-6 text-white'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
          />
        </svg>
      </button>
      <div
        className={`fixed  left-0 w-full -translate-y-2 h-screen bg-white dark:bg-[#212121]  z-50 px-4 py-2 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className='max-w-[1060px] mx-auto'>
          <div className='relative flex items-center border-b-2 border-black dark:border-white '>
            <button onClick={() => setIsOpen(!isOpen)} className='text-black dark:text-white'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18' />
              </svg>
            </button>

            <input
              type='text'
              className='w-full    text-black dark:text-white  px-2 h-[46px] rounded-[10px]  pr-4'
              placeholder='Tìm kiếm'
            />

          </div>
        </div>
      </div>
    </>
  )
}
// const Accordion = ({ children }: { children: React.ReactNode }) => {
//   const [isOpen, setIsOpen] = useState(false)
//   return (
//     <div className='border-b'>
//       <div
//         onClick={() => setIsOpen(!isOpen)}
//         className='cursor-pointer text-[#013879] font-medium text-lg py-6 px-[16px] w-full   flex items-center gap-x-2'
//       >
//         Đối Tác{' '}
//         <svg
//           xmlns='http://www.w3.org/2000/svg'
//           fill='none'
//           viewBox='0 0 24 24'
//           strokeWidth={2}
//           stroke='currentColor'
//           className={`size-4 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
//         >
//           <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
//         </svg>
//       </div>
//       <div
//         className={`px-[16px] space-y-2 flex flex-col  text-[#222222]  ${isOpen ? 'max-h-[1000px] pb-3' : 'max-h-0 pb-0'
//           } transition-max-height duration-500 overflow-hidden`}
//       >
//         {children}
//       </div>
//     </div>
//   )
// }
export default Header
