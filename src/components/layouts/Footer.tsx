import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
const Footer = () => {
  const path = useLocation().pathname
  const { t } = useTranslation()
  return (
    <footer className='grid grid-cols-4 transition-all duration-300 bg-white dark:bg-black fixed bottom-2 max-w-[550px] w-[calc(100%-32px)] border shadow-lg dark:shadow-2xl dark:border-black rounded-3xl right-0 left-1/2 -translate-x-1/2 z-50'>
      <div className='col-span-1'>
        <Link
          to={'/'}
          className={`text-xs  flex flex-col items-center justify-center py-2 ${path === '/' ? 'text-[#FE47BE] ' : ' dark:text-white'
            }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 24 24'
            version='1.1'
            className='size-6'
          >
            <g
              fill='none'
              fill-rule='evenodd'
              id='页面-1'
              stroke='none'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='1'
            >
              <g id='导航图标' stroke='currentColor' stroke-width='1.5' transform='translate(-102.000000, -15.000000)'>
                <g id='会议' transform='translate(102.000000, 15.000000)'>
                  <g id='编组' transform='translate(2.500000, 5.000000)'>
                    <path
                      d='M0,0.95 C0,0.42532925 0.42532925,0 0.95,0 L14.25,0 C14.774685,0 15.2,0.42532925 15.2,0.95 L15.2,5.225 L19,2.375 L19,13.3 L15.2,10.45 L15.2,14.25 C15.2,14.774685 14.774685,15.2 14.25,15.2 L0.95,15.2 C0.42532925,15.2 0,14.774685 0,14.25 L0,0.95 Z'
                      id='路径'
                    />

                    <line id='路径' x1='2.85' x2='2.85' y1='3.8' y2='5.7' />

                    <line id='路径' x1='5.225' x2='5.225' y1='2.85' y2='6.65' />

                    <line id='路径' x1='7.6' x2='7.6' y1='3.8' y2='5.7' />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          Live
        </Link>
      </div>
      <div className='col-span-1'>
        <Link to={'/'} className='text-xs dark:text-white flex flex-col items-center justify-center py-2 '>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z'
            />
          </svg>
          {t('start')}
        </Link>
      </div>
      <div className='col-span-1'>
        <Link
          to={'/message'}
          className={`text-xs  flex flex-col items-center justify-center py-2 ${path === '/message' ? 'text-[#FE47BE]' : 'dark:text-white'
            }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
            />
          </svg>
          {t('message')}
        </Link>
      </div>
      <div className='col-span-1'>
        <Link
          to={'/profile'}
          className={`text-xs  flex flex-col items-center justify-center py-2 ${path === '/profile' ? 'text-[#FE47BE]' : 'dark:text-white'
            }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
            />
          </svg>
          {t('member')}
        </Link>
      </div>
    </footer>
  )
}

export default Footer
