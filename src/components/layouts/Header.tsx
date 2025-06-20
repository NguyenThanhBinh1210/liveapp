import { useEffect, useState } from 'react'
import logo from '~/assets/n_ic_logo.9f6f20911258714f7de0.webp'
import DarkModeToggle from '../DarkMode'
import { useTranslation } from 'react-i18next'
const Header = () => {
  // bg-[#12121271]
  return (
    <header className='fixed top-0 left-1/2 w-full -translate-x-1/2  bg-transparent z-50  dark:bg-black transition-all duration-300 max-w-[600px]  '>
      <div className='flex items-center justify-between px-4 py-2'>
        <div className='flex items-center gap-2'>
          <img src={logo} alt='logo' className='w-[84px]' />
        </div>
        <div className='flex gap-2 items-center'>
          <LanguageSwitcher />

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
  const { t } = useTranslation()
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
        className={`fixed  left-0 w-full  h-screen top-0  bg-white dark:bg-[#212121]  z-50 px-4 py-2 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
              placeholder={t('search')}
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

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const USFlag = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 48" width={size} height={size}>
      <rect width="64" height="48" fill="#b22234" />
      <g fill="#fff">
        <rect y="4" width="64" height="4" />
        <rect y="12" width="64" height="4" />
        <rect y="20" width="64" height="4" />
        <rect y="28" width="64" height="4" />
        <rect y="36" width="64" height="4" />
        <rect y="44" width="64" height="4" />
      </g>
      <rect width="25.6" height="19.2" fill="#3c3b6e" />
      <g fill="#fff">
        {/* simplified stars */}
        {[...Array(5)].map((_, row) =>
          [...Array(row % 2 === 0 ? 6 : 5)].map((_, col) => {
            const x = 2 + col * 4.4 + (row % 2 === 0 ? 0 : 2.2)
            const y = 2 + row * 3.2
            return <circle key={`${row}-${col}`} cx={x} cy={y} r={0.6} />
          })
        )}
      </g>
    </svg>
  )

  const languages = [
    {
      code: 'vi', label: 'Tiếng Việt', icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 480"
        width="24"
        height="24"
      >
        <rect width="640" height="480" fill="#da251d" />
        <polygon
          fill="#ff0"
          points="320,120 
                347,220 
                450,220 
                368,280 
                395,380 
                320,320 
                245,380 
                272,280 
                190,220 
                293,220"
        />
      </svg>
    },
    { code: 'en', label: 'English', icon: <USFlag /> }
  ]

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2   text-white px-1 py-1 rounded- text-sm"
      >
        {currentLang.icon}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white text-black rounded-md shadow-lg z-50 dark:bg-black dark:text-white">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm rounded-md dark:text-white dark:bg-black dark:hover:bg-[#333333]"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Header
