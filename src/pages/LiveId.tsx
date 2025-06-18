import { Forward, Gem, HeartPlus, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import avatar from '~/assets/4sand.avif'

const LiveId = () => {
  return (
    <div className='max-w-[600px] mx-auto w-full bg-black min-h-screen relative'>
      <div className='absolute top-2 left-2 w-max z-10 flex items-center justify-between gap-2'>
        <img src={avatar} alt='' className='size-10 rounded-full object-cover' />
        <div>
          <p className='text-white text-sm'>John Doe</p>
          <p className='text-gray-300 text-xs'>1 người đang theo dõi</p>
        </div>
        <button className=' rounded-full bg-white  p-2 text-orange-500'>
          <HeartPlus className='size-4 text-orange-500' />
        </button>
      </div>
      <div className='absolute top-3 right-2 w-max z-10 flex items-center justify-between gap-2'>
        <div className='relative'>
          <img src={avatar} alt='' className='size-9 rounded-full object-cover' />
          <div className='absolute bottom-0 right-1/2  translate-x-1/2  bg-yellow-500 py-0.5 px-1 rounded flex items-center justify-center'>
            <p className='text-white text-[9px]'>1000</p>
          </div>
        </div>
        <div className='relative'>
          <img src={avatar} alt='' className='size-9 rounded-full object-cover' />
          <div className='absolute bottom-0 right-1/2  translate-x-1/2  bg-yellow-500 py-0.5 px-1 rounded flex items-center justify-center'>
            <p className='text-white text-[9px]'>1000</p>
          </div>
        </div>
        <ListUser></ListUser>
        <Link to={'/'} className='text-white text-sm'>
          <button>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6 text-white'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>
          </button>
        </Link>
      </div>
      {/* <div>
        <iframe
          className='w-full h-screen'
          src='https://www.youtube.com/embed/ZPwKGr6BVFw'
          title='Tạo video AI từ Veo 3 dễ lắm ‣ Thế Giới Di Động'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
        ></iframe>
      </div> */}
      <div className='absolute bottom-16 left-0 w-full max-h-[300px] overflow-y-scroll  scrollbar-hidden  p-2 space-y-3'>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className='flex items-center gap-2 mt-auto '>
            <img className='size-10 rounded-full object-cover' src={avatar} alt='' />
            <div>
              <div className='text-sm font-medium flex items-center gap-2'>
                <div className='text-white bg-blue-500 rounded-md px-1 py-0.5 flex items-center gap-1 text-xs'>
                  <Gem className='size-3' />
                  23
                </div>
                <p className='text-gray-300'>John Doe</p>
              </div>
              <p className='text-white text-sm'>John Doe</p>
            </div>
          </div>
        ))}
      </div>
      <div className='absolute bottom-0 left-0 w-full h-max flex items-center justify-center p-3 gap-x-3'>
        <form action='' className='w-full'>
          <input
            type='text'
            className='w-full outline-none h-10 text-sm  !bg-white/10 rounded-xl p-2  text-white'
            placeholder='Nhập...'
          />
          <button type='submit' className='hidden'>
            Gửi
          </button>
        </form>
        <button className='bg-white/10 rounded-xl p-2 text-white'>
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
              d='M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
            />
          </svg>
        </button>
        <button className='bg-white/10 rounded-xl p-2 text-white'>
          <Forward className='size-6 text-white' />
        </button>
      </div>
    </div>
  )
}
const ListUser = () => {
  const panelRef = useRef<HTMLDivElement>(null)

  const [show, setShow] = useState(false)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShow(false)
      }
    }

    if (show) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [show])
  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className='flex items-center gap-1 cursor-pointer bg-white/40 rounded-xl px-2 py-1'
      >
        <User className='size-3 text-white' />
        <p className='text-white text-sm'>8</p>
      </div>
      <div
        ref={panelRef}
        className={`fixed z-10 max-w-[600px] flex flex-col justify-end left-1/2 -translate-x-1/2 w-full h-[calc(100vh/2)] bg-white  p-2 ${show ? '-bottom-0' : '-bottom-full'
          } transition-all duration-300`}
      >
        <p className='text-center font-medium absolute top-2 left-1/2 -translate-x-1/2 w-full'>
          Dánh sách người xem hàng đầu
        </p>
        <div className='overflow-y-scroll scrollbar-hidden h-[calc(100%-40px)]'>
          <div className='flex flex-col gap-2 '>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className='flex items-center justify-between '>
                <div className='flex items-center gap-4'>
                  <p
                    className={`text-sm font-medium ${index === 0 || index === 1 || index === 2 ? 'text-[#fe47be]' : 'text-gray-500'
                      }`}
                  >
                    {index + 1}
                  </p>

                  <img src={avatar} alt='' className='size-10 rounded-full object-cover' />
                  <div>
                    <p className=' text-sm'>John Doe</p>
                    <div className='flex items-center gap-2'>
                      {(index === 0 || index === 1 || index === 2) && (
                        <div className='text-white bg-[#fe47be] rounded-md w-max px-1 py-0.5 flex items-center gap-1 text-xs'>
                          Hạng {index + 1}
                        </div>
                      )}
                      <div className='text-white bg-blue-500 rounded-md w-max px-1 py-0.5 flex items-center gap-1 text-xs'>
                        <Gem className='size-3' />
                        23
                      </div>
                    </div>
                  </div>
                </div>
                <p className='text-gray-500 text-sm'>2000</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
export default LiveId
