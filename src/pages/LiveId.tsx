/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Forward, Gem, HeartPlus, User } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
// import avatar from '~/assets/4sand.avif'
// import fingerHeart from '~/assets/Finger Heart.webp'
// import rosa from '~/assets/Rosa.webp'
// import heartSignal from '~/assets/Heart Signal.webp'
// import dripBrewing from '~/assets/Drip Brewing.webp'
// import { Recharge } from './Profile'
// import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { getLiveByRoomId } from '~/apis/live.api'


const LiveId = () => {
  const { id } = useParams()
  // const { t } = useTranslation()
  const [live, setLive] = useState<any>(null)
  console.log(live?.viewerUrl)
  useQuery({
    queryKey: ['live', id],
    queryFn: () => getLiveByRoomId(id || ''),
    enabled: !!id,
    onSuccess: (data) => {
      setLive(data.data.data)
    }
  })
  return (
    <div className='max-w-[600px] mx-auto w-full bg-black min-h-screen relative'>
      {/* <div className='absolute top-2 left-2 w-max z-10 flex items-center justify-between gap-2'>
        <img src={avatar} alt='' className='size-10 rounded-full object-cover' />
        <div>
          <p className='text-white text-sm'>John Doe</p>
          <p className='text-gray-300 text-xs'>1 {t('member_following')}</p>
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
      </div> */}
      <div className='w-full h-screen'>
        <iframe
          src={live?.viewerUrl}
          title="Livestream Viewer"
          className="w-full h-full "
          allowFullScreen
        />
      </div>
      {/* <div className='absolute bottom-16 left-0 w-full max-h-[300px] overflow-y-scroll  scrollbar-hidden  p-2 space-y-3'>
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
            placeholder={t('enter')}
          />
          <button type='submit' className='hidden'>
            {t('send')}
          </button>
        </form>
        <SendGift></SendGift>
        <button className='bg-white/10 rounded-xl p-2 text-white'>
          <Forward className='size-6 text-white' />
        </button>
      </div> */}
    </div>
  )
}
// const ListUser = () => {
//   const panelRef = useRef<HTMLDivElement>(null)
//   const { t } = useTranslation()
//   const [show, setShow] = useState(false)
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
//         setShow(false)
//       }
//     }

//     if (show) {
//       document.addEventListener('mousedown', handleClickOutside)
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [show])
//   return (
//     <>
//       <div
//         onClick={() => setShow(!show)}
//         className='flex items-center gap-1 cursor-pointer bg-white/40 rounded-xl px-2 py-1'
//       >
//         <User className='size-3 text-white' />
//         <p className='text-white text-sm'>8</p>
//       </div>
//       <div
//         ref={panelRef}
//         className={`fixed z-10 max-w-[600px] flex flex-col justify-end left-1/2 -translate-x-1/2 w-full h-[calc(100vh/2)] bg-white  p-2 ${show ? '-bottom-0' : '-bottom-full'
//           } transition-all duration-300`}
//       >
//         <p className='text-center font-medium absolute top-2 left-1/2 -translate-x-1/2 w-full'>
//           {t('list_of_top_viewers')}
//         </p>
//         <div className='overflow-y-scroll scrollbar-hidden h-[calc(100%-40px)]'>
//           <div className='flex flex-col gap-2 '>
//             {Array.from({ length: 10 }).map((_, index) => (
//               <div key={index} className='flex items-center justify-between '>
//                 <div className='flex items-center gap-4'>
//                   <p
//                     className={`text-sm font-medium ${index === 0 || index === 1 || index === 2 ? 'text-[#fe47be]' : 'text-gray-500'
//                       }`}
//                   >
//                     {index + 1}
//                   </p>

//                   <img src={avatar} alt='' className='size-10 rounded-full object-cover' />
//                   <div>
//                     <p className=' text-sm'>John Doe</p>
//                     <div className='flex items-center gap-2'>
//                       {(index === 0 || index === 1 || index === 2) && (
//                         <div className='text-white bg-[#fe47be] rounded-md w-max px-1 py-0.5 flex items-center gap-1 text-xs'>
//                           {t('rank')} {index + 1}
//                         </div>
//                       )}
//                       <div className='text-white bg-blue-500 rounded-md w-max px-1 py-0.5 flex items-center gap-1 text-xs'>
//                         <Gem className='size-3' />
//                         23
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <p className='text-gray-500 text-sm'>2000</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// const SendGift = () => {
//   const { t } = useTranslation()
//   const giftList = [
//     {
//       id: 1,
//       name: 'Hot',
//       items: [
//         {
//           id: 1,
//           name: 'Finger Heart',
//           image: fingerHeart,
//           price: 1000
//         },
//         {
//           id: 2,
//           name: 'Rosa',
//           image: rosa,
//           price: 1000
//         },
//         {
//           id: 3,
//           name: 'Heart Signal',
//           image: heartSignal,
//           price: 1000
//         },
//         {
//           id: 4,
//           name: 'Finger Heart',
//           image: fingerHeart,
//           price: 1000
//         },
//         {
//           id: 5,
//           name: 'Rosa',
//           image: rosa,
//           price: 1000
//         },
//         {
//           id: 6,
//           name: 'Heart Signal',
//           image: heartSignal,
//           price: 1000
//         },
//         {
//           id: 7,
//           name: 'Finger Heart',
//           image: fingerHeart,
//           price: 1000
//         },
//         {
//           id: 8,
//           name: 'Rosa',
//           image: rosa,
//           price: 1000
//         },
//         {
//           id: 9,
//           name: 'Heart Signal',
//           image: heartSignal,
//           price: 1000
//         },
//         {
//           id: 10,
//           name: 'Finger Heart',
//           image: fingerHeart,
//           price: 1000
//         },
//         {
//           id: 11,
//           name: 'Rosa',
//           image: rosa,
//           price: 1000
//         },
//         {
//           id: 12,
//           name: 'Heart Signal',
//           image: heartSignal,
//           price: 1000
//         },
//         {
//           id: 13,
//           name: 'Finger Heart',
//           image: fingerHeart,
//           price: 1000
//         },
//         {
//           id: 14,
//           name: 'Rosa',
//           image: rosa,
//           price: 1000
//         },
//         {
//           id: 15,
//           name: 'Heart Signal',
//           image: heartSignal,
//           price: 1000
//         },
//         {
//           id: 16,
//           name: 'Rosa',
//           image: rosa,
//           price: 1000
//         },
//         {
//           id: 17,
//           name: 'Heart Signal',
//           image: heartSignal,
//           price: 1000
//         },
//         {
//           id: 18,
//           name: 'Rosa',
//           image: rosa,
//           price: 1000
//         },
//         {
//           id: 19,
//           name: 'Heart Signal',
//           image: heartSignal,
//           price: 1000
//         }
//       ]
//     },
//     {
//       id: 2,
//       name: t('classic'),
//       items: [
//         {
//           id: 1,
//           name: 'Finger Heart',
//           image: fingerHeart,
//           price: 1000
//         },
//         {
//           id: 2,
//           name: 'Rosa',
//           image: rosa,
//           price: 1000
//         },
//         {
//           id: 3,
//           name: 'Heart Signal',
//           image: heartSignal,
//           price: 1000
//         },
//         {
//           id: 4,
//           name: 'Drip Brewing',
//           image: dripBrewing,
//           price: 1000
//         }
//       ]
//     },
//     {
//       id: 3,
//       name: t('noble'),
//       items: [
//         {
//           id: 1,
//           name: 'Finger Heart',
//           image: fingerHeart,
//           price: 1000
//         },
//         {
//           id: 2,
//           name: 'Rosa',
//           image: rosa,
//           price: 1000
//         },
//         {
//           id: 3,
//           name: 'Heart Signal',
//           image: heartSignal,
//           price: 1000
//         },
//         {
//           id: 4,
//           name: 'Drip Brewing',
//           image: dripBrewing,
//           price: 1000
//         }
//       ]
//     }
//   ]
//   const panelRef = useRef<HTMLDivElement>(null)

//   const [show, setShow] = useState(false)
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
//         setShow(false)
//       }
//     }

//     if (show) {
//       document.addEventListener('mousedown', handleClickOutside)
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [show])

//   const [activeTab, setActiveTab] = useState(giftList[0]?.id)

//   const activeGift = giftList.find((group) => group.id === activeTab)
//   const [choosenGift, setChoosenGift] = useState<any>()

//   // animate only
//   const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null)

//   return (
//     <>
//       <button onClick={() => setShow(!show)} className='bg-white/10 rounded-xl p-2 text-white'>
//         <svg
//           xmlns='http://www.w3.org/2000/svg'
//           fill='none'
//           viewBox='0 0 24 24'
//           strokeWidth={1.5}
//           stroke='currentColor'
//           className='size-6'
//         >
//           <path
//             strokeLinecap='round'
//             strokeLinejoin='round'
//             d='M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
//           />
//         </svg>
//       </button>
//       <div
//         ref={panelRef}
//         className={`fixed z-10 max-w-[600px] flex flex-col justify-end left-1/2 -translate-x-1/2 w-full h-[calc(100vh/2)] bg-[#2d2d2d]  p-2 ${show ? '-bottom-0' : '-bottom-full'
//           } transition-all duration-300`}
//       >
//         <p className='text-center font-medium absolute top-2 left-1/2 -translate-x-1/2 w-full text-white'>{t('choose_gift')}</p>
//         <div className='overflow-y-scroll scrollbar-hidden h-[calc(100%-40px)]'>
//           <div className='flex flex-col h-full'>
//             {/* Tabs header */}

//             {/* Tabs content */}
//             <div className='overflow-y-scroll  h-[calc(100%-40px)] px-2 pt-2'>
//               {activeGift && (
//                 <div className='grid grid-cols-4 gap-4'>
//                   {activeGift.items.map((item) => (
//                     <div
//                       onClick={() => {
//                         setChoosenGift(item)
//                         if (choosenGift?.id !== item.id) {
//                           setSelectedGiftId(item.id)
//                           setTimeout(() => setSelectedGiftId(null), 150)
//                         }
//                       }}
//                       key={`${activeGift.id}-${item.id}`}
//                       className={`flex flex-col items-center py-1 h-[91px] cursor-pointer rounded-md ${choosenGift?.id === item.id
//                         ? ' bg-gradient-to-b from-[#252525] to-transparent  transition-all duration-300'
//                         : ''
//                         } ${selectedGiftId === item.id ? 'scale-110' : ''
//                         }`}
//                     >
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className={`size-10 rounded-full object-cover mb-1 ${choosenGift?.id === item.id ? 'scale-125 -translate-y-2' : ''
//                           } transition-all duration-300`}
//                       />
//                       {choosenGift?.id !== item.id && (
//                         <p className='text-xs text-white text-center mb-0.5'>{item.name}</p>
//                       )}
//                       <p className='text-[10px] text-gray-300 text-center flex items-center gap-1'>
//                         <svg
//                           className='tiktok-alwu5 e1nmbihp16'
//                           width='1em'
//                           data-e2e=''
//                           height='1em'
//                           viewBox='0 0 48 48'
//                           fill='none'
//                           xmlns='http://www.w3.org/2000/svg'
//                         >
//                           <circle cx='24' cy='24' r='22' fill='#FFEC9B'></circle>
//                           <circle cx='24' cy='24' r='17' fill='#FACE15'></circle>
//                           <path
//                             fill-rule='evenodd'
//                             clip-rule='evenodd'
//                             d='M40.9347 25.5C40.9779 25.0058 41 24.5055 41 24C41 14.6112 33.3888 7 24 7C14.6112 7 7 14.6112 7 24C7 24.5055 7.02206 25.0058 7.06527 25.5C7.82466 16.8137 15.1166 10 24 10C32.8834 10 40.1753 16.8137 40.9347 25.5Z'
//                             fill='#FABC15'
//                           ></path>
//                           <path
//                             d='M33 19C30.2041 19 27.9375 16.7614 27.9375 14H24.5625V27.6111C24.5625 29.2986 23.1774 30.6667 21.4688 30.6667C19.7601 30.6667 18.375 29.2986 18.375 27.6111C18.375 25.9236 19.7601 24.5556 21.4688 24.5556C21.722 24.5556 21.9659 24.5853 22.1981 24.6406C22.2365 24.6497 22.2747 24.6596 22.3125 24.6701V21.2763C22.0358 21.2406 21.7541 21.2222 21.4688 21.2222C17.8962 21.2222 15 24.0826 15 27.6111C15 31.1396 17.8962 34 21.4688 34C25.0413 34 27.9375 31.1396 27.9375 27.6111V20.6673C29.3477 21.7134 31.1005 22.3333 33 22.3333V19Z'
//                             fill='#FEF5CD'
//                           ></path>
//                         </svg>
//                         {item.price}
//                       </p>
//                       {choosenGift?.id === item.id && (
//                         <div className='text-xs text-white bg-[#ff3b5c] mt-1 text-center w-full py-0.5 text-[10px] rounded-b-md'>
//                           {t('send')}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className='flex gap-2 overflow-x-auto scrollbar-hidden justify-between pr-3'>
//               <div className='flex gap-2 overflow-x-auto scrollbar-hidden '>
//                 {giftList.map((tab) => (
//                   <button
//                     key={tab.id + tab.name} // tránh trùng key do id bị lặp
//                     className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${tab.id === activeTab ? 'text-white' : 'text-gray-400 hover:text-white'
//                       }`}
//                     onClick={() => setActiveTab(tab.id)}
//                   >
//                     {tab.name}
//                   </button>
//                 ))}
//               </div>
//               <div className='flex items-center gap-2'>
//                 <Recharge className='bg-white/10 rounded-md p-2 py-1 text-sm text-white flex items-center gap-1'>
//                   <svg
//                     className='tiktok-alwu5 e1nmbihp16'
//                     width='1em'
//                     data-e2e=''
//                     height='1em'
//                     viewBox='0 0 48 48'
//                     fill='none'
//                     xmlns='http://www.w3.org/2000/svg'
//                   >
//                     <circle cx='24' cy='24' r='22' fill='#FFEC9B'></circle>
//                     <circle cx='24' cy='24' r='17' fill='#FACE15'></circle>
//                     <path
//                       fill-rule='evenodd'
//                       clip-rule='evenodd'
//                       d='M40.9347 25.5C40.9779 25.0058 41 24.5055 41 24C41 14.6112 33.3888 7 24 7C14.6112 7 7 14.6112 7 24C7 24.5055 7.02206 25.0058 7.06527 25.5C7.82466 16.8137 15.1166 10 24 10C32.8834 10 40.1753 16.8137 40.9347 25.5Z'
//                       fill='#FABC15'
//                     ></path>
//                     <path
//                       d='M33 19C30.2041 19 27.9375 16.7614 27.9375 14H24.5625V27.6111C24.5625 29.2986 23.1774 30.6667 21.4688 30.6667C19.7601 30.6667 18.375 29.2986 18.375 27.6111C18.375 25.9236 19.7601 24.5556 21.4688 24.5556C21.722 24.5556 21.9659 24.5853 22.1981 24.6406C22.2365 24.6497 22.2747 24.6596 22.3125 24.6701V21.2763C22.0358 21.2406 21.7541 21.2222 21.4688 21.2222C17.8962 21.2222 15 24.0826 15 27.6111C15 31.1396 17.8962 34 21.4688 34C25.0413 34 27.9375 31.1396 27.9375 27.6111V20.6673C29.3477 21.7134 31.1005 22.3333 33 22.3333V19Z'
//                       fill='#FEF5CD'
//                     ></path>
//                   </svg>
//                   5.500
//                   <svg
//                     xmlns='http://www.w3.org/2000/svg'
//                     fill='none'
//                     viewBox='0 0 24 24'
//                     strokeWidth={1.5}
//                     stroke='currentColor'
//                     className='size-3'
//                   >
//                     <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
//                   </svg>
//                 </Recharge>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
export default LiveId
