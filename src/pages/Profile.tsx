import { useState } from 'react'
import avatar from '~/assets/4sand.avif'
const Profile = () => {
  return (
    <div className='pt-20'>
      <div className='flex items-center justify-center'>
        <div className='flex flex-col items-center justify-center '>
          <img src={avatar} alt='avatar' className='w-[96px] h-[96px] rounded-full object-cover' />
          <p className='text-lg font-bold dark:text-white'>John Doe</p>
          <p className='text-xs  text-gray-400 mb-1.5'>#254</p>
          <div className='flex items-center gap-2 text-xs'>
            <p className='bg-[#fe47be] rounded-md text-white px-2 py-0.5'>Lv1</p>
            <p className='bg-[#fe9f47] rounded-md text-white px-2 py-0.5'>Thành viên</p>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-4 max-w-[400px] mx-auto mt-4'>
        <div className='col-span-1 flex flex-col items-center '>
          <p className='text-lg font-bold dark:text-white'>1</p>
          <p className=' text-xs text-gray-400'>Đã follow</p>
        </div>
        <div className='col-span-1 flex flex-col items-center '>
          <p className='text-lg font-bold dark:text-white'>2</p>
          <p className=' text-xs text-gray-400'>Followers</p>
        </div>
        <div className='col-span-1 flex flex-col items-center '>
          <p className='text-lg font-bold dark:text-white'>3</p>
          <p className=' text-xs text-gray-400'>Thích</p>
        </div>
      </div>
      <div className='mt-4 flex gap-x-2 max-w-[400px] mx-auto'>
        <EditProfile />
        <Recharge />
        <Balance />
        <Withdraw />
      </div>

      <div className='mt-4 border-t dark:border-black/30 pt-4'>
        <button className='bg-[#fe47be] mt-20 hover:bg-[#fe47be]/80 transition-all duration-300 block mx-auto text-white font-medium w-[200px] text-sm px-4 py-2 rounded-md'>
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

const EditProfile = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='bg-gray-100 hover:bg-gray-200  transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'
      >
        Sửa hồ sơ
      </button>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[51] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] dark:bg-[#212121] h-screen mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className='p-2 flex items-center gap-x-2 relative mb-2'>
            <button
              onClick={() => setIsOpen(false)}
              className='p-2 rounded-full dark:text-white hover:bg-gray-200 dark:hover:bg-black/30 transition-all duration-300'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
              </svg>
            </button>
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>Sửa hồ sơ</h2>
          </div>
          <div className='flex flex-col items-center justify-center '>
            <div className='relative'>
              <img src={avatar} alt='avatar' className='w-[96px] h-[96px] rounded-full object-cover mb-3' />
              <label
                htmlFor='avatar'
                className=' cursor-pointer absolute top-0 right-0 w-[96px] h-[96px] bg-black/50 rounded-full flex items-center justify-center'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-7 text-white cursor-pointer'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z'
                  />
                </svg>
                <input type='file' id='avatar' className='hidden' />
              </label>
            </div>
            <p className='text-xs  text-gray-500 mb-1.5 dark:text-gray-300'>Thay đổi ảnh</p>
          </div>
          <div className='px-4 mt-2'>
            <p className='text-sm font-medium dark:text-white mb-5'>Giới thiệu về bạn</p>
            <div className='flex items-center justify-between gap-x-2 mb-2'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Tên</p>
              <input
                defaultValue={'John Doe'}
                type='text'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-2'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Sinh nhật</p>
              <input
                defaultValue={'12/10/2002'}
                type='text'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-2'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Giới tính</p>
              <select className='w-max text-right rounded-md p-2  dark:text-white text-sm'>
                <option value='male' className='text-sm text-black dark:text-black'>
                  Nam
                </option>
                <option value='female' className='text-sm text-black dark:text-black'>
                  Nữ
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
const Withdraw = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='bg-gray-100 hover:bg-gray-200  transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'
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
            d='M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z'
          />
        </svg>
      </button>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[51] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] dark:bg-[#212121] h-screen mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className='p-2 flex items-center gap-x-2 relative mb-2'>
            <button
              onClick={() => setIsOpen(false)}
              className='p-2 rounded-full dark:text-white hover:bg-gray-200 dark:hover:bg-black/30 transition-all duration-300'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
              </svg>
            </button>
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>Rút tiền</h2>
          </div>
          <div className='flex flex-col items-center justify-center '>
            <p className='text-xs  text-gray-500 mb-1.5 dark:text-gray-300'>Số dư có thể rút</p>
            <p className='text-2xl font-bold dark:text-white mb-5'>100000.000</p>
          </div>
          <div className='px-4 mt-2'>
            <p className='text-sm font-medium dark:text-white mb-5'>Thông tin rút tiền</p>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Tên tài khoản</p>
              <input
                defaultValue={'John Doe'}
                type='text'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Ngân hàng</p>
              <input
                type='text'
                placeholder='Vietcombank'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Số thẻ</p>
              <input
                type='text'
                placeholder='1234567890'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Số tiền rút</p>
              <input
                type='text'
                placeholder='100000000'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <button className='bg-gray-100 hover:bg-gray-200 mx-auto w-[200px] mt-4 transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'>
                Rút tiền
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
const Recharge = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='bg-gray-100 hover:bg-gray-200  transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'
      >
        Nạp tiền
      </button>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[51] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] dark:bg-[#212121] h-screen mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className='p-2 flex items-center gap-x-2 relative mb-2'>
            <button
              onClick={() => setIsOpen(false)}
              className='p-2 rounded-full dark:text-white hover:bg-gray-200 dark:hover:bg-black/30 transition-all duration-300'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
              </svg>
            </button>
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>Nạp tiền</h2>
          </div>
          <div className='flex flex-col items-center justify-center '>
            <p className='text-xs  text-gray-500 mb-1.5 dark:text-gray-300'>Số dư có thể nạp</p>
            <p className='text-2xl font-bold dark:text-white mb-5'>100000.000</p>
          </div>
          <div className='px-4 mt-2'>
            <p className='text-sm font-medium dark:text-white mb-5'>Thông tin rút tiền</p>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Tên tài khoản</p>
              <input
                defaultValue={'John Doe'}
                type='text'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Ngân hàng</p>
              <input
                type='text'
                placeholder='Vietcombank'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Số thẻ</p>
              <input
                type='text'
                placeholder='1234567890'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>Số tiền rút</p>
              <input
                type='text'
                placeholder='100000000'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <button className='bg-gray-100 hover:bg-gray-200 mx-auto w-[200px] mt-4 transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'>
                Rút tiền
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
const Balance = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='bg-gray-100 hover:bg-gray-200  transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'
      >
        Quản lý số dư
      </button>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[51] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] dark:bg-[#212121] h-screen mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className='p-2 flex items-center gap-x-2 relative mb-2'>
            <button
              onClick={() => setIsOpen(false)}
              className='p-2 rounded-full dark:text-white hover:bg-gray-200 dark:hover:bg-black/30 transition-all duration-300'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
              </svg>
            </button>
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>Quản lý số dư</h2>
          </div>
          <div className=' w-[calc(100%-32px)] rounded-lg p-2 items-center py-4 mx-auto my-4 flex justify-between bg-black/70 '>
            <div className='text-sm font-medium text-white'>
              Số tiền trong ví
              <p className='text-2xl font-bold text-white'>100000.000</p>
            </div>
            <Recharge />
          </div>
          <div className='grid grid-cols-3 gap-x-4  mx-auto mt-4 '>
            <div className='col-span-1 flex flex-col items-center '>
              <p className='text-lg font-bold dark:text-white'>1123.000</p>
              <p className=' text-xs text-gray-400 text-center'>Tổng tiêu thụ</p>
            </div>
            <div className='col-span-1 flex flex-col items-center '>
              <p className='text-lg font-bold dark:text-white'>1123.000</p>
              <p className=' text-xs text-gray-400 text-center'>Tiền thu được từ quà tặng</p>
            </div>
            <div className='col-span-1 flex flex-col items-center '>
              <p className='text-lg font-bold dark:text-white'>1123.000</p>
              <p className=' text-xs text-gray-400 text-center'>Doanh thu phát sóng trực tiếp</p>
            </div>
          </div>
          <div className='px-4 space-y-3'>
            <div className='bg-gray-50 rounded-lg p-3 mt-4'>
              <div className='flex items-center justify-between gap-x-2 mb-1'>
                <div className='space-y-1'>
                  <div className='bg-green-500 text-white px-2 py-1 rounded-md text-xs w-max'>Thu thập</div>
                  <p className='text-sm font-medium '>Quà tặng trực tiếp</p>
                  <p className='text-xs text-gray-400'>2025-06-15 18:53:24</p>
                </div>
                <div className='text-end'>
                  <p className='text-sm font-medium text-green-500 '>+100000.000</p>
                  <p className='text-xs text-gray-400'>￥1000450.00</p>
                </div>
              </div>
            </div>
            <div className='bg-gray-50 rounded-lg p-3 mt-4'>
              <div className='flex items-center justify-between gap-x-2 mb-1'>
                <div className='space-y-1'>
                  <div className='bg-green-500 text-white px-2 py-1 rounded-md text-xs w-max'>Thu thập</div>
                  <p className='text-sm font-medium '>Quà tặng trực tiếp</p>
                  <p className='text-xs text-gray-400'>2025-06-15 18:53:24</p>
                </div>
                <div className='text-end'>
                  <p className='text-sm font-medium text-green-500 '>+100000.000</p>
                  <p className='text-xs text-gray-400'>￥1000450.00</p>
                </div>
              </div>
            </div>
            <div className='bg-gray-50 rounded-lg p-3 mt-4'>
              <div className='flex items-center justify-between gap-x-2 mb-1'>
                <div className='space-y-1'>
                  <div className='bg-pink-500 text-white px-2 py-1 rounded-md text-xs w-max'>Chi tiêu</div>
                  <p className='text-sm font-medium '>Quà tặng trực tiếp</p>
                  <p className='text-xs text-gray-400'>2025-06-15 18:53:24</p>
                </div>
                <div className='text-end'>
                  <p className='text-sm font-medium text-pink-500 '>-100000.000</p>
                  <p className='text-xs text-gray-400'>￥1000450.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Profile
