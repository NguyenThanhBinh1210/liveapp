/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import avatar from '~/assets/4sand.avif'
import { CustomAudioPlayer } from '~/components/CustomAudioPlayer'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const Message = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div>
      <div className='p-2 flex items-center gap-x-2  mb-2 justify-between sticky top-0 bg-white dark:bg-black'>
        <button
          onClick={() => navigate('/')}
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
        <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>{t('message_box')}</h2>
        <button className='p-2 rounded-full dark:text-white hover:bg-gray-200 dark:hover:bg-black/30 transition-all duration-300'>
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
              d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
            />
          </svg>
        </button>
      </div>
      <div className='p-2 space-y-3 pb-20'>
        <Followers />
        <Notification />

        {Array.from({ length: 20 }).map((_, index) => (
          <ChatBox key={index} />
        ))}
      </div>
    </div>
  )
}

const Followers = () => {
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
      <div onClick={() => setIsOpen(true)} className='flex items-center justify-between cursor-pointer'>
        <div className='flex items-center gap-2'>
          <div className='bg-blue-400 rounded-full w-12 h-12 flex items-center justify-center text-white flex-shrink-0'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
              <path d='M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z' />
            </svg>
          </div>
          <div className=''>
            <p className='text-sm font-medium dark:text-white'>{t('new_followers')}</p>
            <p className='text-xs text-gray-700 dark:text-gray-300'>
              <strong>Mochi</strong> {t('requested_follow')}
            </p>
          </div>
        </div>
        <button className='p-2'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'>
            <path
              fillRule='evenodd'
              d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[51] !mt-0 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] dark:bg-[#212121] h-screen mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className='p-2 flex items-center gap-x-2  mb-2  bg-white dark:bg-black'>
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
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>
              {t('new_followers')}
            </h2>
          </div>
          <div className='p-2 px-4 space-y-3  overflow-y-auto h-[calc(100vh-60px)] pb-4'>
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className='flex items-center justify-between cursor-pointer'>
                <div className='flex items-center gap-2'>
                  <img src={avatar} alt='' className='w-12 h-12 rounded-full flex-shrink-0' />
                  <div className=''>
                    <p className='text-sm font-medium dark:text-white dark:font-normal'>Vô thượng sát thần</p>
                    <p className='text-xs text-gray-700 dark:text-[#838383]'>{t('requested_follow')}</p>
                  </div>
                </div>
                <button className='w-20  bg-[#f85671] rounded-full h-max text-xs font-medium py-1 text-white'>
                  {t('accept')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
const Notification = () => {
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
      <div onClick={() => setIsOpen(true)} className='flex items-center justify-between cursor-pointer'>
        <div className='flex items-center gap-2'>
          <div className='bg-[#f85671] rounded-full w-12 h-12 flex items-center justify-center text-white flex-shrink-0'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
              <path
                fillRule='evenodd'
                d='M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className=''>
            <p className='text-sm font-medium dark:text-white'> {t('system_notification')}</p>
            <p className='text-xs text-gray-700 dark:text-gray-300'>
              {t('trading_assistant')}: {t('deposit')}
            </p>
          </div>
        </div>
        <button className='p-2'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'>
            <path
              fillRule='evenodd'
              d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[51] !mt-0 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] dark:bg-black h-screen mx-auto bg-[#f8f8f8] transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className='p-2 flex items-center gap-x-2  mb-2  bg-[#f8f8f8] dark:bg-black'>
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
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>
              {t('system_notification')}
            </h2>
          </div>
          <div className='p-2 px-4 space-y-3  overflow-y-auto h-[calc(100vh-60px)] pb-4 dark:bg-black'>
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className='flex  justify-between flex-col cursor-pointer px-2 bg-white dark:bg-[#212121]  rounded'
              >
                <p className='text-sm font dark:text-white border-b py-2 border-[#f8f8f8] dark:border-black/20'>
                  {' '}
                  {t('trading_assistant')}
                </p>
                <div className='py-2 space-y-2'>
                  <p className='text-xs text-black dark:text-gray-300 font-medium'>{t('deposit')}</p>
                  <p className='text-xs text-[#3a3a3a] dark:text-gray-300  '>Bạn đã nạp 1000$ vào tài khoản của bạn</p>
                </div>
                <p className='text-xs font dark:text-white border-t py-3 justify-between border-[#f8f8f8] dark:border-black/20 flex items-center '>
                  {' '}
                  Xem thêm
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'>
                    <path
                      fillRule='evenodd'
                      d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                      clipRule='evenodd'
                    />
                  </svg>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const ChatBox = () => {

  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])
  const [inputValue, setInputValue] = useState('')

  const initialMessages = [
    { id: 1, type: 'text', text: 'Chào bạn!', sender: 'other' },
    { id: 2, type: 'image', url: avatar, sender: 'me' },
    { id: 3, type: 'text', text: 'Mèo cưng quá!', sender: 'other' },
    { id: 4, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', sender: 'me' },
    { id: 5, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', sender: 'other' },
    { id: 6, type: 'audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', sender: 'me' },
    { id: 7, type: 'text', text: 'Mèo cưng ghê', sender: 'me' },
    { id: 8, type: 'text', text: 'Mèo cưng ghê', sender: 'me' },
    { id: 9, type: 'text', text: 'Mèo cưng ghê', sender: 'me' },
    { id: 10, type: 'text', text: 'Mèo cưng ghê', sender: 'me' },
    { id: 11, type: 'text', text: 'Mèo cưng ghê nhưng mà mèo cưng lắm hahs', sender: 'me' }
  ]
  const [messages, setMessages] = useState<any>(initialMessages)

  const handleSendMessage = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    const newMessage = {
      id: Date.now(), // hoặc uuid
      type: 'text',
      text: trimmed,
      sender: 'me'
    }

    setMessages((prev: any) => [...prev, newMessage])
    setInputValue('')

    // optional: scroll to bottom
    setTimeout(() => {
      const container = document.getElementById('chat-container')
      container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
    }, 100)
  }
  const chatRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth' // hoặc 'auto' nếu không muốn animation
      })
    }
  }, [messages])
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'auto'
      })
    }
  }, [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const imageUrl = reader.result as string
      const newMsg: any = {
        id: Date.now(),
        type: 'image',
        url: imageUrl,
        sender: 'me'
      }
      setMessages((prev: any) => [...prev, newMsg])
    }
    reader.readAsDataURL(file)
  }
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const imageUrl = reader.result as string
      const newMsg = {
        id: Date.now(),
        type: 'image',
        url: imageUrl,
        sender: 'me'
      }
      setMessages((prev: any) => [...prev, newMsg])
    }

    reader.readAsDataURL(file)
  }
  return (
    <>
      <div onClick={() => setIsOpen(true)} className='flex items-center justify-between cursor-pointer'>
        <div className='flex items-center gap-2'>
          <img src={avatar} alt='' className='w-12 h-12 rounded-full flex-shrink-0' />
          <div className=''>
            <p className='text-sm font-medium dark:text-white dark:font-normal'>Vô thượng sát thần</p>
            <p className='text-xs text-gray-700 dark:text-[#838383]'>giá đó hơn lb 300k thôi</p>
          </div>
        </div>
        <button className='w-6  bg-[#f85699] rounded-full h-max text-[9px] text-white'>13</button>
      </div>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[51] !mt-0 transition-all duration-75 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] dark:bg-[#212121] h-screen mx-auto bg-[#f1f1f1] transition-all duration-75 ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className='p-2 flex items-center gap-x  m sticky top-0 border-b dark:border-black/20'>
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
            <div className='flex items-center justify-between cursor-pointer'>
              <div className='flex items-center gap-2'>
                <img src={avatar} alt='' className='size-10 rounded-full flex-shrink-0' />
                <div className=''>
                  <p className='text-sm font-medium dark:text-white dark:font-normal'>Vô thượng sát thần</p>
                  <p className='text-xs text-gray-700 dark:text-[#838383]'>{t('online')}</p>
                </div>
              </div>
            </div>
          </div>
          <div ref={chatRef} className='pt-2 px-4 flex flex-col  space-y-3 pb-14 overflow-y-auto h-[calc(100vh-60px)]'>
            {messages.map((msg: any) => (
              <div key={msg.id} className={`flex mt-auto ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-xl ${msg.type === 'text' ? 'p-2' : ''} text-sm ${msg.sender === 'me'
                    ? 'bg-[#1590c0] text-white rounded-br-none'
                    : 'bg-white dark:bg-[#333333] text-black dark:text-white rounded-bl-none'
                    }`}
                >
                  {/* Text Message */}
                  {msg.type === 'text' && <p>{msg.text}</p>}

                  {/* Image */}
                  {msg.type === 'image' && (
                    <img
                      src={msg.url}
                      alt='image'
                      className={`w-40 h-40 object-cover rounded-lg ${msg.sender === 'me' ? 'rounded-br-none' : 'rounded-bl-none'
                        }`}
                    />
                  )}

                  {/* Video */}
                  {msg.type === 'video' && (
                    <video
                      src={msg.url}
                      controls
                      className={`w-52 h-40 rounded-lg ${msg.sender === 'me' ? 'rounded-br-none' : 'rounded-bl-none'
                        } object-cover`}
                    />
                  )}

                  {/* Audio */}
                  {msg.type === 'audio' && <CustomAudioPlayer url={msg.url} sender={msg.sender} />}
                </div>
              </div>
            ))}
          </div>
          <div className='p-2 absolute bottom-0 left-0 right-0 bg-[#f1f1f1] dark:bg-[#212121]'>
            <div
              id='chat-container'
              className='flex items-center gap-1 bg-white dark:bg-[#333333] rounded-full px-1 py-0.5'
            >
              <input
                type='file'
                id='file-input'
                accept='image/*'
                onChange={handleImageUpload}
                className='hidden'
                ref={fileInputRef}
              />
              {/* <label htmlFor='file-input'>
                <button className='bg-blue-300 text-white size-8 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-5'>
                    <path d='M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z' />
                    <path
                      fillRule='evenodd'
                      d='M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>

              </label> */}
              <label
                htmlFor='file-input-camera'
                className={` bg-blue-300 text-white size-8 rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-5'>
                  <path d='M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z' />
                  <path
                    fillRule='evenodd'
                    d='M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
                    clipRule='evenodd'
                  />
                </svg>
              </label>
              <input
                type='file'
                id='file-input-camera'
                accept='image/*'
                capture='environment' // 👈 Mở camera sau (dùng "user" nếu muốn camera trước)
                className='hidden'
                onChange={handleCameraCapture}
              />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                type='text'
                placeholder={t('enter_message')}
                className='w-full rounded-full p-2 text-sm dark:text-white'
              />
              <div className='flex gap-1 pr-2'>
                <button className=' text-black dark:text-white size-8 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z'
                    />
                  </svg>
                </button>

                <label
                  htmlFor='file-input'
                  className={` text-black dark:text-white w-8 h-8 rounded-full flex items-center transition-all duration-300 justify-center flex-shrink-0 ${inputValue ? 'w-0' : '!w-8'
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
                      d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                    />
                  </svg>
                </label>

                <button
                  onClick={handleSendMessage}
                  className={`bg-[#f85671] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${inputValue ? 'w-8' : '!w-0'
                    }`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-4 translate-x-[1px] -translate-y-0.5 -rotate-45'
                  >
                    <path d='M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z' />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Message
