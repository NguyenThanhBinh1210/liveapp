import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import bannerhome1 from '~/assets/banner1.png'
import bannerhome2 from '~/assets/banner2.png'
import bannerhome3 from '~/assets/banner3.png'
import dexuat from '~/assets/dexuat.webp'
import { useState } from 'react'
import { Eye, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getLive } from '~/apis/live.api'
import { useQuery } from 'react-query'
const Home = () => {
  const { t } = useTranslation()
  const images = [bannerhome1, bannerhome2, bannerhome3]
  const livestreams = [
    {
      name: 'Streamer A',
      level: 5,
      views: 1200,
      thumbnail: bannerhome1
    },
    {
      name: 'Streamer B',
      level: 3,
      views: 980,
      thumbnail: bannerhome2
    },
    {
      name: 'Streamer C',
      level: 7,
      views: 4500,
      thumbnail: bannerhome3
    },
    {
      name: 'Streamer D',
      level: 2,
      views: 300,
      thumbnail: bannerhome1
    },
    {
      name: 'Streamer A',
      level: 5,
      views: 1200,
      thumbnail: bannerhome1
    },
    {
      name: 'Streamer B',
      level: 3,
      views: 980,
      thumbnail: bannerhome2
    },
    {
      name: 'Streamer C',
      level: 7,
      views: 4500,
      thumbnail: bannerhome3
    },
    {
      name: 'Streamer D',
      level: 2,
      views: 300,
      thumbnail: bannerhome1
    }
  ]
  interface LiveStream {
    _id: string
    streamerId: {
      _id: string
      name: string
      avatar: string
    },
    title: string
    thumbnailUrl: string
    startedAt: string
    viewersCount: number
  }

  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([])
  useQuery({
    queryKey: ['livestreams'],
    queryFn: () => getLive({ page: 1, limit: 10 }),
    onSuccess: (data) => {
      setLiveStreams(data.data.data.streams)
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const [liked, setLiked] = useState<boolean[]>(Array(livestreams.length).fill(false))

  const toggleLike = (index: number) => {
    const newLiked = [...liked]
    newLiked[index] = !newLiked[index]
    setLiked(newLiked)
  }


  return (
    <div className=' '>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        grabCursor={true}
        slidesPerView={1}
        className='w-full h-full'
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`slide-${index}`}
              className='w-full aspect-video  object-cover select-none'
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <section className='max-w-[600px] mx-auto grid grid-cols-2 gap-4 p-2'>
        <p className=' text-black dark:text-white col-span-2 text-xl font-bold flex items-center gap-2'>
          <img src={dexuat} alt='dexuat' className='w-7 h-7' />
          {t('recommended_for_you')}
        </p>
        {liveStreams.slice(0, 4).map((item, idx) => (
          <Link
            to={`/live/${item._id}`}
            key={idx}
            className='rounded-2xl overflow-hidden shadow  hover:scale-[102%] cursor-pointer transition-all relative'
          >
            <img src={item.thumbnailUrl || bannerhome1} alt={item.title} className='w-full aspect-video object-cover' />
            <div className='p-3 absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent'>
              <h3 className='text-base font-semibold text-white mb-1'>{item.title}</h3>
              <p className='text-sm  mb-1 bg-[#fe47be] w-max text-white px-2 rounded-md'>{item.streamerId.name}</p>
              <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-300'>
                <div className='flex items-center gap-1 text-white'>
                  <Eye className='w-4 h-4 stroke-white' />
                  <span>{item.viewersCount}</span>
                </div>
                <button
                  onClick={() => toggleLike(idx)}
                  className='p-1 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                >
                  <Heart className={`w-5 h-5  ${liked[idx] ? 'fill-red-500 stroke-red-500' : 'stroke-white'}`} />
                </button>
              </div>
            </div>
          </Link>
        ))}
        <p className=' text-black dark:text-white col-span-2 text-xl font-bold flex items-center gap-2'>{t('popular')}</p>
        {livestreams.map((item, idx) => (
          <Link
            to={`/live/${item.name}`}
            key={idx}
            className='rounded-2xl overflow-hidden shadow hover:scale-[102%] cursor-pointer transition-all relative'
          >
            <img src={item.thumbnail} alt={item.name} className='w-full aspect-video object-cover' />
            <div className='p-3 absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent'>
              <h3 className='text-base font-semibold text-white mb-1'>{item.name}</h3>
              <p className='text-sm  mb-1 bg-[#fe47be] w-max text-white px-2 rounded-md'>{item.level}</p>
              <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-300'>
                <div className='flex items-center gap-1 text-white'>
                  <Eye className='w-4 h-4 stroke-white' />
                  <span>{item.views}</span>
                </div>
                <button
                  onClick={() => toggleLike(idx)}
                  className='p-1 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                >
                  <Heart className={`w-5 h-5  ${liked[idx] ? 'fill-red-500 stroke-red-500' : 'stroke-white'}`} />
                </button>
              </div>
            </div>
          </Link>
        ))}
        <div className='col-span-2 mb-20'>
          <button className='bg-[#fe47be] text-white px-4 py-2 rounded-xl font-medium max-w-[300px] mx-auto block'>
            {t('view_more')}
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
