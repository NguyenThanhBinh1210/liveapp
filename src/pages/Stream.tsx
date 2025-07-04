import { SwitchCamera, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import { getProfile } from '~/apis/auth.api'
import { createLive, stopLive } from '~/apis/live.api'
import { getLiveFromLS, setLiveFromLS } from '~/utils/auth'

/* eslint-disable @typescript-eslint/no-explicit-any */
const Stream = () => {
  const { t } = useTranslation()

  const [live, setLive] = useState<any>(getLiveFromLS())

  const mutationStart = useMutation({
    mutationFn: (body: any) => createLive(body),
    onSuccess: (data) => {
      setLive(data.data.data)
      toast.success(t('start_live_success'))
      setLiveFromLS(data.data.data)
      setTimeout(() => {
        window.open(data.data.data.url, '_blank')
      }, 1000)
    },
    onError: () => {
      toast.error(t('start_live_failed'))
    }
  })
  const [thumbnail, setThumbnail] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')


  const handleStartLive = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title || !description || !thumbnail) {
      toast.error(t('please_fill_all_fields'))
      return
    }
    else {
      console.log(thumbnail)
      console.log(title)
      console.log(description)
      mutationStart.mutate({
        title: title,
        description: description,
        thumbnailUrl: thumbnail,
        chatEnabled: true,
        giftEnabled: true
      })
    }
  }

  const mutationStop = useMutation({
    mutationFn: ({ liveId }: { liveId: string }) => stopLive(liveId),
    onSuccess: () => {
      setLive(null)
      setLiveFromLS(null)
      toast.success(t('stop_live_success'))
    },
    onError: () => {
      toast.error(t('stop_live_failed'))
    }
  })

  const handleStopLive = () => {
    console.log(live._id)
    mutationStop.mutate({ liveId: live._id })
  }
  useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    onSuccess: (data) => {
      setThumbnail(data.data.data.avatar)
    },
    onError: (error) => {
      console.log(error)
    }
  })

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
      setThumbnail(data.secure_url)
    } catch (error) {
      toast.error(t('upload_failed'))
    }
  }
  const [switchCamera, setSwitchCamera] = useState(false);
  const navigate = useNavigate()

  return (
    <div className='max-w-[600px] mx-auto w-full bg-black/10 h-screen relative'>
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: switchCamera ? "environment" : "user"
        }}
      />
      <button onClick={() => navigate('/')} className='absolute top-0 right-0 p-2 text-black z-10'>
        <X />
      </button>
      <div className='absolute top-0 left-0 w-full h-full  flex items-center justify-center'>
        {!live && (
          <form onSubmit={handleStartLive} className='w-full max-w-[350px] mx-auto h-full flex flex-col justify-center pt-20 pb-10'>
            <div className='flex  gap-2 p-2 bg-[#48484866] '>
              <label htmlFor='thumbnail' className='w-[60px] h-[60px] bg-white relative'>
                {thumbnail && <img src={thumbnail} alt='' className='w-full h-full object-cover ' />}
                {!thumbnail && (
                  <UserRound className='w-full h-full object-cover rounded-full stroke-1 text-gray-400 dark:text-gray-600' />
                )}
                <div className='absolute bottom-0 right-0 w-full text-center text-white  pt-0.5 !bg-black/70 text-[10px]'>
                  Thay đổi
                </div>
              </label>
              <input type='file' id='thumbnail' className='hidden' onChange={handleImageUpload} />
              <textarea className=' px-1 py-0.5 text-white flex-1 placeholder:text-white/80  text-xs h-max' placeholder='Thêm tiêu đề' onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className='p-2 bg-[#48484866] mt-2'>
              <textarea className='w-full px-1 py-0.5 text-white flex-1 placeholder:text-white/80  text-xs h-max' placeholder='Thêm mô tả' onChange={(e) => setDescription(e.target.value)} />

            </div>
            <div className='mt-auto w-full flex items-center justify-center '>
              <button
                type='submit'
                className='bg-[#fe2c55] text-white block mx-auto px-4 py-2 rounded-full w-[200px]   hover:bg-[#fe2c55]/80 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
              >
                {t('start_Live')}
              </button>
              <button type='button' className='px-1' onClick={() => setSwitchCamera(!switchCamera)}>
                <SwitchCamera className='w-6 h-6' />
              </button>
            </div>
          </form>
        )}
        {live && (
          <div className='absolute bottom-0 left-0 w-full h-full bg-black/50 flex items-center justify-center gap-4'>
            <button
              onClick={() => window.open(live.url, '_blank')}
              className='bg-[#fe2c55] text-white px-4 py-2 rounded-full  mt-4 hover:bg-[#fe2c55]/80 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
            >
              Đi đến
            </button>
            <button
              onClick={handleStopLive}
              className='bg-[#fe2c55] text-white px-4 py-2 rounded-full  mt-4 hover:bg-[#fe2c55]/80 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
            >
              {t('stop_live')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stream
