import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppContext } from '~/contexts/app.context'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { changePassword, getProfile, updateProfile } from '~/apis/auth.api'
import toast from 'react-hot-toast'
import { getWallet, getWalletTransaction, recharge, withdraw } from '~/apis/wallet.api'
const Profile = () => {
  const { t } = useTranslation()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),

    onError: (error) => {
      console.log(error)
    }
  })
  return (
    <div className='pt-4'>
      <div className='flex justify-between items-center mb-3 px-4'>
        <button></button>
        <Menu />
      </div>
      <div className='flex items-center justify-center'>
        <div className='flex flex-col items-center justify-center '>
          {profile?.data.data.avatar ? (
            <img src={profile?.data.data.avatar} alt='avatar' className='w-[96px] h-[96px] rounded-full object-cover' />
          ) : (
            <div className='w-[96px] h-[96px] rounded-full object-cover mb-3 flex items-center justify-center bg-gray-100 dark:bg-black/30'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='1'
                stroke-linecap='round'
                stroke-linejoin='round'
                className='lucide lucide-user-round-icon lucide-user-round size-10 dark:text-white'
              >
                <circle cx='12' cy='8' r='5' />
                <path d='M20 21a8 8 0 0 0-16 0' />
              </svg>
            </div>
          )}
          <p className='text-lg font-bold dark:text-white'>{profile?.data.data.name}</p>
          <p className='text-xs  text-gray-400 mb-1.5'>#254</p>
          <div className='flex items-center gap-2 text-xs'>
            <p className='bg-[#fe47be] rounded-md text-white px-2 py-0.5'>Lv1</p>
            <p className='bg-[#fe9f47] rounded-md text-white px-2 py-0.5'>{t('member')}</p>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-4 max-w-[400px] mx-auto mt-4'>
        <div className='col-span-1 flex flex-col items-center '>
          <p className='text-lg font-bold dark:text-white'>1</p>
          <p className=' text-xs text-gray-400'>{t('followed')}</p>
        </div>
        <div className='col-span-1 flex flex-col items-center '>
          <p className='text-lg font-bold dark:text-white'>2</p>
          <p className=' text-xs text-gray-400'>{t('followers')}</p>
        </div>
        <div className='col-span-1 flex flex-col items-center '>
          <p className='text-lg font-bold dark:text-white'>3</p>
          <p className=' text-xs text-gray-400'>{t('like')}</p>
        </div>
      </div>
      <div className='mt-4 flex gap-x-2 max-w-[400px] mx-auto'>
        <EditProfile name={profile?.data.data.name} avatar={profile?.data.data.avatar} />
        <Recharge />
      </div>
    </div>
  )
}

const EditProfile = ({ name, avatar }: { name?: string; avatar?: string }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (body: { name?: string; avatar?: string }) => updateProfile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success(t('edit_profile_success'))
    }
  })
  const [nameValue, setNameValue] = useState('')
  const [avatarValue, setAvatarValue] = useState('')
  console.log(avatarValue)
  useEffect(() => {
    setNameValue(name || '')
    setAvatarValue(avatar || '')
  }, [name, avatar])

  const handleEditProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ name: nameValue })
  }
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      const file = files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'dulich')

      const response = await fetch('https://api.cloudinary.com/v1_1/dps8fcvlv/image/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      mutation.mutate({ avatar: data.secure_url })
      setAvatarValue(data.secure_url)
    } catch (error) {
      console.log('Có lỗi khi upload ảnh')
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='bg-gray-100 hover:bg-gray-200 w-[45%]  transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'
      >
        {t('edit_profile')}
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
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>
              {t('edit_profile')}
            </h2>
          </div>
          <div className='flex flex-col items-center justify-center '>
            <div className='relative'>
              {avatarValue ? (
                <img src={avatarValue} alt='avatar' className='w-[96px] h-[96px] rounded-full object-cover mb-3' />
              ) : (
                <div className='w-[96px] h-[96px] rounded-full object-cover mb-3 flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='1'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    className='lucide lucide-user-round-icon lucide-user-round size-10'
                  >
                    <circle cx='12' cy='8' r='5' />
                    <path d='M20 21a8 8 0 0 0-16 0' />
                  </svg>
                </div>
              )}
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
                <input type='file' accept='image/*' id='avatar' className='hidden' onChange={handleImageUpload} />
              </label>
            </div>
            <p className='text-xs  text-gray-500 mb-1.5 dark:text-gray-300'>{t('change_avatar')}</p>
          </div>
          <form onSubmit={handleEditProfile} className='px-4 mt-2'>
            <p className='text-sm font-medium dark:text-white mb-5'>{t('introduce_about_you')}</p>
            <div className='flex items-center justify-between gap-x-2 mb-2'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>{t('name')}</p>
              <input
                value={nameValue}
                type='text'
                onChange={(e) => setNameValue(e.target.value)}
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <button
              disabled={!nameValue || nameValue === name}
              type='submit'
              className='bg-[#fe2c55] text-white px-4 py-3 rounded w-full mt-6 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
            >
              Chỉnh sửa
            </button>
            {/* <div className='flex items-center justify-between gap-x-2 mb-2'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>{t('birthday')}</p>
              <input
                defaultValue={'12/10/2002'}
                type='text'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-2'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>{t('gender')}</p>
              <select className='w-max text-right rounded-md p-2  dark:text-white text-sm'>
                <option value='male' className='text-sm text-black dark:text-black'>
                  {t('male')}
                </option>
                <option value='female' className='text-sm text-black dark:text-black'>
                  {t('female')}
                </option>
              </select>
            </div> */}
          </form>
        </div>
      </div>
    </>
  )
}
const ChangePassword = () => {
  const { reset } = useContext(AppContext)
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const mutation = useMutation({
    mutationFn: (body: { oldPassword: string; newPassword: string }) => changePassword(body),
    onSuccess: () => {
      toast.success(t('change_password_success'))
      setTimeout(() => {
        reset()
      }, 1000)
    }
  })
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleEditProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ oldPassword: password, newPassword: newPassword })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='hover:bg-gray-100 w-full flex items-center gap-3 transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
          className='lucide lucide-lock-keyhole-icon lucide-lock-keyhole dark:text-white size-6'
        >
          <circle cx='12' cy='16' r='1' />
          <rect x='3' y='10' width='18' height='12' rx='2' />
          <path d='M7 10V7a5 5 0 0 1 10 0v3' />
        </svg>
        {t('change_password')}
      </button>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed top-0 left-0 w-full h-full bg-black/50 flex items-end justify-between z-[51] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] w-full dark:bg-[#212121]  h-screen mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
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
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>
              {t('change_password')}
            </h2>
          </div>

          <form onSubmit={handleEditProfile} className='px-4 mt-2'>
            <div className='flex items-center justify-between gap-x-2 mb-2'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>{t('old_password')}</p>
              <input
                value={password}
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-2'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>{t('new_password')}</p>
              <input
                value={newPassword}
                type='password'
                onChange={(e) => setNewPassword(e.target.value)}
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <button
              disabled={!password || !newPassword}
              type='submit'
              className='bg-[#fe2c55] text-white px-4 py-3 rounded w-full mt-6 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
            >
              {t('change_password')}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
const Withdraw = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [note, setNote] = useState('')
  const [balance, setBalance] = useState(0)
  useQuery({
    queryKey: ['balance', 'withdraw'],
    queryFn: () => getWallet(),
    onSuccess: (data) => {
      setBalance(data.data.data.balance)
    }
  })

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (body: { amount: number; note: string }) => withdraw(body),
    onSuccess: () => {
      toast.success(t('withdraw_success'))
      setAmount(0)
      setNote('')
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      queryClient.invalidateQueries({ queryKey: ['balance', 'withdraw'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    },
    onError: () => {
      toast.error(t('withdraw_failed'))
    }
  })
  const handleWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ amount, note })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='hover:bg-gray-100 w-full flex items-center gap-3 transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'
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
        {t('withdraw')}
      </button>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed top-0 left-0 w-full h-full flex items-end justify-between bg-black/50 z-[51] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] w-full dark:bg-[#212121] h-screen mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
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
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>{t('withdraw')}</h2>
          </div>
          <div className='flex flex-col items-center justify-center '>
            <p className='text-xs  text-gray-500 mb-1.5 dark:text-gray-300'>{t('balance_can_withdraw')}</p>
            <p className='text-2xl font-bold dark:text-white mb-5'>{balance}</p>
          </div>
          <form onSubmit={handleWithdraw} className='px-4 mt-2'>
            {/* <p className='text-sm font-medium dark:text-white mb-5'>{t('withdraw_information')}</p> */}
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>{t('amount')}</p>
              <input
                type='text'
                value={amount}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || !isNaN(Number(value))) {
                    setAmount(Number(value))
                  }
                }}
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>{t('note')}</p>
              <input
                type='text'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>

            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <button
                disabled={amount === 0 || !note}
                type='submit'
                className='bg-[#fe2c55] hover:bg-[#fe2c55]/80 transition-all duration-300 text-white px-4 py-3 rounded w-full mt-6 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
              >
                {t('withdraw')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export const Recharge = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [note, setNote] = useState('')
  const mutation = useMutation({
    mutationFn: (body: { amount: number; note: string }) => recharge(body),
    onSuccess: () => {
      toast.success(t('recharge_success'))
      setAmount(0)
      setNote('')
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    },
    onError: () => {
      toast.error(t('recharge_failed'))
    }
  })
  const handleRecharge = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ amount, note })
  }
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${className
          ? className
          : 'bg-gray-100 hover:bg-gray-200 w-[45%] transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'
          }`}
      >
        {children ? children : t('recharge')}
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
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'> {t('recharge')}</h2>
          </div>

          <form onSubmit={handleRecharge} className='px-4 mt-2'>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>{t('amount')}</p>
              <input
                value={amount}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || !isNaN(Number(value))) {
                    setAmount(Number(value))
                  }
                }}
                type='text'
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <p className='text-sm font-medium dark:text-white max-w-[100px] w-full'>{t('note')}</p>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                type='text'
                placeholder={t('recharge_to_account')}
                className='w-full text-right rounded-md p-2  dark:text-white text-sm'
              />
            </div>
            <div className='flex items-center justify-between gap-x-2 mb-1'>
              <button
                disabled={amount === 0 || !note}
                className='bg-[#fe2c55] hover:bg-[#fe2c55]/80 transition-all duration-300 text-white px-4 py-3 rounded w-full mt-6 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                type='submit'
              >
                {t('recharge')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

interface Transaction {
  _id: string
  userId: string
  type: string
  amount: number
  status: string
  description: string
  createdAt: string
  updatedAt: string
  note: string
}

const Balance = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  useQuery({
    queryKey: ['balance'],
    queryFn: () => getWallet(),
    onSuccess: (data) => {
      setBalance(data.data.data.balance)
    }
  })
  useQuery({
    queryKey: ['wallet'],
    queryFn: () => getWalletTransaction({}),
    onSuccess: (data) => {
      setTransactions(data.data.data.transactions)
    }
  })
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className=' hover:bg-gray-100 w-full flex items-center gap-3 transition-all duration-300 text-black font-medium text-sm px-4 py-2 rounded-md'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
          className='lucide lucide-credit-card-icon lucide-credit-card dark:text-white'
        >
          <rect width='20' height='14' x='2' y='5' rx='2' />
          <line x1='2' x2='22' y1='10' y2='10' />
        </svg>{' '}
        {t('manage_balance')}
      </button>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed !top-0 flex items-end justify-between left-0 w-full h-full bg-black/50 z-[51] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[600px] w-full dark:bg-[#212121] h-screen mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
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
            <h2 className='text-lg font-bold dark:text-white absolute left-1/2 -translate-x-1/2'>
              {t('manage_balance')}
            </h2>
          </div>
          <div className=' w-[calc(100%-32px)] rounded-lg p-2 items-center py-4 mx-auto my-4 flex justify-between bg-black/70 '>
            <div className='text-sm font-medium text-white'>
              {t('balance_in_wallet')}
              <p className='text-2xl font-bold text-white'>{balance}</p>
            </div>
            <Recharge />
          </div>
          <div className='grid grid-cols-3 gap-x-4  mx-auto mt-4 '>
            <div className='col-span-1 flex flex-col items-center '>
              <p className='text-lg font-bold dark:text-white'>1123.000</p>
              <p className=' text-xs text-gray-400 text-center'>{t('total_consumption')}</p>
            </div>
            <div className='col-span-1 flex flex-col items-center '>
              <p className='text-lg font-bold dark:text-white'>1123.000</p>
              <p className=' text-xs text-gray-400 text-center'>{t('money_received_from_gifts')}</p>
            </div>
            <div className='col-span-1 flex flex-col items-center '>
              <p className='text-lg font-bold dark:text-white'>1123.000</p>
              <p className=' text-xs text-gray-400 text-center'>{t('direct_broadcast_revenue')}</p>
            </div>
          </div>
          <div className='px-4 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto mt-4'>
            {transactions.map((transaction: Transaction) => (
              <div key={transaction._id} className='bg-gray-50 rounded-lg p-3 mt-4'>
                <div className='flex items-center justify-between gap-x-2 mb-1'>
                  <div className='space-y-1'>
                    <div className={`bg-green-500 text-white px-2 py-1 rounded-md text-xs w-max ${transaction.type === 'TOPUP' ? 'bg-green-500' : transaction.type === 'WITHDRAW' ? 'bg-red-500' : ''}`}>
                      {transaction.type === 'TOPUP' ? t('topup') : transaction.type === 'WITHDRAW' ? t('withdraw') : ''}
                    </div>
                    <p className='text-sm font-medium '>{transaction.description}</p>
                    <p className='text-xs text-gray-400'>{transaction.createdAt}</p>
                  </div>
                  <div className='text-end'>
                    <p
                      className={`text-sm font-medium ${transaction.type === 'TOPUP' ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                      {transaction.type === 'TOPUP' ? '+' : '-'}{transaction.amount}đ
                    </p>
                    <p className='text-xs text-gray-400'>{transaction.status}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className='bg-gray-50 rounded-lg p-3 mt-4'>
              <div className='flex items-center justify-between gap-x-2 mb-1'>
                <div className='space-y-1'>
                  <div className='bg-green-500 text-white px-2 py-1 rounded-md text-xs w-max'>{t('collect')}</div>
                  <p className='text-sm font-medium '>{t('direct_broadcast_revenue')}</p>
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
                  <div className='bg-pink-500 text-white px-2 py-1 rounded-md text-xs w-max'>{t('expense')}</div>
                  <p className='text-sm font-medium '>{t('direct_broadcast_revenue')}</p>
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

const Menu = () => {
  const { t } = useTranslation()
  const { reset } = useContext(AppContext)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const handleLogout = () => {
    reset()
    navigate('/login')
  }
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
          className='lucide lucide-menu-icon lucide-menu dark:text-white'
        >
          <path d='M4 12h16' />
          <path d='M4 18h16' />
          <path d='M4 6h16' />
        </svg>
      </button>
      <div
        onClick={(e) => {
          setIsOpen(false)
          e.stopPropagation()
        }}
        className={`fixed top-0 left-0 flex items-end w-full h-full bg-black/50 z-[51] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-[600px] p-2 rounded-t-lg dark:bg-[#212121] h-1/3 mx-auto bg-white transition-all duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
          <Balance />
          <Withdraw />
          <ChangePassword />
          <button
            onClick={handleLogout}
            className=' w-full flex items-center gap-x-2 hover:bg-gray-100  transition-all duration-300  mx-auto text-black dark:text-white font-medium  text-sm px-4 py-2 rounded-md'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
              className='lucide lucide-arrow-left-to-line-icon lucide-arrow-left-to-line dark:text-white size-6'
            >
              <path d='M3 19V5' />
              <path d='m13 6-6 6 6 6' />
              <path d='M7 12h14' />
            </svg>{' '}
            {t('logout')}
          </button>
        </div>
      </div>
    </>
  )
}
export default Profile
