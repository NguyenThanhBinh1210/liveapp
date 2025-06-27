/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { loginAccount, registerAccount } from '~/apis/auth.api'
import { AppContext } from '~/contexts/app.context'

interface LoginBodyType {
  email: string
  password: string
}
const Login = () => {
  const { t } = useTranslation()
  return (
    <div className=' flex flex-col items-center justify-center h-screen'>
      <svg
        width='70'
        data-e2e=''
        height='70'
        viewBox='0 0 72 72'
        fill='rgba(0, 0, 0, 0.35)'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M16.6276 20.2241C16.6276 30.8074 25.2394 39.4192 35.8227 39.4192C46.4059 39.4192 55.0178 30.8074 55.0178 20.2241C55.0178 9.64086 46.4059 1.02899 35.8227 1.02899C25.2394 1.02899 16.6276 9.64086 16.6276 20.2241ZM19.7405 20.2244C19.7405 11.3583 26.9568 4.14202 35.8229 4.14202C44.689 4.14202 51.9053 11.3583 51.9053 20.2244C51.9053 29.0905 44.689 36.3068 35.8229 36.3068C26.9568 36.3068 19.7405 29.0905 19.7405 20.2244Z'
        ></path>
        <path d='M6.69813 70.9717C6.56844 70.9717 6.43874 70.9562 6.30904 70.9199C5.47898 70.7072 4.97576 69.8563 5.19365 69.0263C8.79922 55.045 21.3954 45.2762 35.8228 45.2762C50.2503 45.2762 62.8465 55.0398 66.4572 69.0211C66.6699 69.8512 66.1719 70.702 65.3366 70.9147C64.5014 71.1326 63.6558 70.6293 63.4379 69.7941C60.1851 57.1876 48.8288 48.3837 35.8176 48.3837C22.8117 48.3837 11.4554 57.1876 8.19743 69.7941C8.02104 70.5048 7.39331 70.9717 6.69813 70.9717Z'></path>
      </svg>
      <p className='text-sm pb-6 pt-8 dark:text-white'>{t('login')}</p>
      <LoginForm />
    </div>
  )
}

const LoginForm = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ email, password })
  }
  const navigate = useNavigate()
  const { setProfile, setIsAuthenticated } = useContext(AppContext)

  const mutation = useMutation({
    mutationFn: (body: LoginBodyType) => loginAccount(body),
    onSuccess: (data) => {
      const newUser = data.data.user
      setProfile(newUser)
      toast.success(t('login_success'))
      setTimeout(() => {
        navigate('/')
        setIsAuthenticated(true)
      }, 1000)
    },
    onError: () => {
      toast.error(t('login_failed'))
    }
  })
  return (
    <>
      <button onClick={() => setIsOpen(true)} className='bg-[#fe2c55] text-white px-4 py-2 rounded w-[180px]'>
        {t('login')}
      </button>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
          setEmail('')
          setPassword('')
        }}
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[51] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] relative dark:bg-[#212121] h-screen mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
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
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>{t('login')}</h2>
          </div>
          <div className='px-6'>
            <div className='flex flex-col items-center justify-center border-b border-gray-200 pb-2 dark:border-gray-800'>
              <p className='text-xs  text-gray-500 mb-1.5 dark:text-gray-300'>{t('login_by_email')}</p>
            </div>
            <form onSubmit={handleLogin} className=' mt-2 '>
              <div className='py-1 border-b mb-2'>
                <input type='text' placeholder='Email' className='w-full  rounded-md p-2  dark:text-white text' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className='py-1 border-b mb-2'>
                <input
                  type='password'
                  placeholder={t('password')}
                  className='w-full  rounded-md p-2  dark:text-white text'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                disabled={!email || !password}
                className='bg-[#fe2c55] text-white px-4 py-3 rounded w-full mt-6 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                type='submit'
              >
                {t('login')}
              </button>
            </form>
          </div>
          <div className='bg-[#16182308]  absolute bottom-0 left-0 right-0 p-4 py-5 text-center text-sm'>
            {t('user_not_have_account')} <RegisterForm />
          </div>
        </div>
      </div>
    </>
  )
}

interface RegisterBodyType {
  name: string
  email: string
  password: string
}
const RegisterForm = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setProfile } = useContext(AppContext)
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ name, email, password })
  }
  const mutation = useMutation({
    mutationFn: (body: RegisterBodyType) => registerAccount(body),
    onSuccess: (data) => {
      const newUser = data.data.user
      setProfile(newUser)
      navigate('/')
    },
    onError: (data: any) => {
      console.log(data.response.data.errMessage)
    }
  })
  return (
    <>
      <button onClick={() => setIsOpen(true)} className='text-[#fe2c55] font-medium text-[15px]'>
        {t('register')}
      </button>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
          setName('')
          setEmail('')
          setPassword('')
        }}
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[51] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] relative dark:bg-[#212121] h-screen mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
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
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>{t('register')}</h2>
          </div>
          <div className='px-6'>
            <div className='flex flex-col items-center justify-center border-b border-gray-200 pb-2 dark:border-gray-800'>
              <p className='text-xs  text-gray-500 mb-1.5 dark:text-gray-300'>{t('register_by_email')}</p>
            </div>
            <form onSubmit={handleRegister} className=' mt-2 '>
              <div className='py-1 border-b mb-2'>
                <input type='text' placeholder='Tên' className='w-full  rounded-md p-2  dark:text-white text' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className='py-1 border-b mb-2'>
                <input type='text' placeholder='Email' className='w-full  rounded-md p-2  dark:text-white text' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className='py-1 border-b mb-2'>
                <input
                  type='password'
                  placeholder={t('password')}
                  className='w-full  rounded-md p-2  dark:text-white text'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                disabled={!name || !email || !password}
                type='submit'
                className='bg-[#fe2c55] text-white px-4 py-3 rounded w-full mt-6 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
              >
                {t('register')}
              </button>
            </form>
          </div>
          <div className='bg-[#16182308]  absolute bottom-0 left-0 right-0 p-4 py-5 text-center text-sm'>
            {t('user_have_account')} <Link to='/login' className='text-[#fe2c55] text-[15px] font-medium'>{t('login')}</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
