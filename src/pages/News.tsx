import { Link, useLocation, useNavigate } from 'react-router-dom'
import news1 from '~/assets/6170305031849493246 (1).jpg'

const News = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const title = location.state?.title
  const type = location.state?.type
  return (
    <div className='px-4 max-w-[1262px] mx-auto pb-[87px]'>
      <div className=' items-center gap-1 mt-[52px] hidden md:flex'>
        <Link to='/'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
            />
          </svg>
        </Link>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
        </svg>
        <Link to='/tin-tuc' className='text-[13px]'>
          Tin Tức Và Sự Kiện
        </Link>
        {location.pathname.includes('tin-tuc') && (
          <>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-4'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
            </svg>
            <p className='text-[13px]'>{location.state?.title}</p>
          </>
        )}
      </div>
      <div>
        {type !== 'detail' && (
          <p className='my-12 font-bold text-[40px] text-[#013879]'>
            {location.pathname.includes('/loai-tin-tuc') && title ? title : 'Tin Tức Và Sự Kiện'}
          </p>
        )}

        <div className={`grid md:grid-cols-4 gap-x-16 ${type === 'detail' ? 'mt-12' : ''}`}>
          <div className='md:col-span-3'>
            {type !== 'detail' && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      navigate('/tin-tuc/mua-hoa-anh-dao-han-quoc-2025', {
                        state: {
                          title: 'NGẤT NGÂY TRƯỚC VẺ ĐẸP ĐẦY MÊ HOẶC CỦA MÙA HOA ANH ĐÀO HÀN QUỐC 2025',
                          type: 'detail'
                        }
                      })
                    }
                    className=''
                  >
                    <div className='pb-9 mb-9 border-b flex gap-5 md:gap-10 flex-col md:flex-row'>
                      <div className='md:w-[259px] h-auto flex-shrink-0 overflow-hidden'>
                        <img
                          src={news1}
                          alt='news1'
                          className='w-full h-full object-cover aspect-[9/7] hover:scale-110 transition-all duration-300'
                        />
                      </div>
                      <div className='w-full'>
                        <div className='flex gap-x-3 items-center'>
                          <Link to='/' className='    text-[#013879] bg-[#C0E7FD] rounded-full px-5 py-0.5 text-[13px]'>
                            Tin tức du lịch{' '}
                          </Link>
                          <p className='text-[#8B8B8B] font-medium text-[13px] '>28-02-2025</p>
                        </div>
                        <p className='line-clamp-2 font-medium my-4'>
                          CẦU CỔNG VÀNG – TUYỆT TÁC KIẾN TRÚC VƯỢT THỜI GIAN TẠI SAN FRANCISCO
                        </p>
                        <p className='text-[#222222] text-sm line-clamp-4'>
                          Cầu Cổng Vàng, biểu tượng nổi tiếng thế giới thuộc thành phố San Francisco với thiết kế độc
                          đáo nổi bật với gam màu đỏ cam đầy rực rỡ. Ngoài ra, đây còn là biểu tượng của sự phát triển
                          và tinh thần đổi mới. Dù là trong ánh bình minh, giữa làn sương mờ hay khi hoàng hôn buông
                          xuống, Cầu Cổng Vàng luôn mang đến vẻ đẹp ngoạn mục, thu hút du khách từ khắp nơi đến chiêm
                          ngưỡng và tìm hiểu. Hãy cùng Lửa Việt Tours bắt đầu bước vào hành trình khám phá vẻ đẹp bất
                          tận và những câu chuyện thú vị đằng s...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {type === 'detail' && (
              <>
                <div className='flex gap-x-3 items-center '>
                  <p className='    text-[#013879] bg-[#C0E7FD] rounded-full px-5 py-0.5 text-[13px]'>
                    Tin tức du lịch{' '}
                  </p>
                  <p className='text-[#8B8B8B] font-medium text-[13px] '>28-02-2025</p>
                </div>
                <p className=' font-bold text-[30px] mt-4'>{location.state?.title}</p>
                <p className='mt-4 text-[#222222] italic'>
                  Cầu Cổng Vàng, biểu tượng nổi tiếng thế giới thuộc thành phố San Francisco với thiết kế độc đáo nổi bật với gam màu đỏ cam đầy rực rỡ. Ngoài ra, đây còn là biểu tượng của sự phát triển và tinh thần đổi mới. Dù là trong ánh bình minh, giữa làn sương mờ hay khi hoàng hôn buông xuống, Cầu Cổng Vàng luôn mang đến vẻ đẹp ngoạn mục, thu hút du khách từ khắp nơi đến chiêm ngưỡng và tìm hiểu. Hãy cùng Lửa Việt Tours bắt đầu bước vào hành trình khám phá vẻ đẹp bất tận và những câu chuyện thú vị đằng sau biểu tượng huyền thoại này ngay sau đây nhé.
                </p>
                <div className='mt-4 py-[50px] border-b'>
                  content
                </div>
                <div className='flex items-center gap-x-4 pt-3 justify-between'>
                  <button className=' px-5 py-2 rounded-full uppercase font-semibold flex items-center gap-x-2 '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>

                    Bài Trước
                  </button>
                  <Link to='/tin-tuc' className=' px-5 py-2 rounded-full uppercase font-semibold flex items-center gap-x-2 '>
                    Danh sách tin tức
                  </Link>
                  <div></div>
                </div>
              </>
            )}
          </div>
          <div className='md:col-span-1'>
            <div>
              <p className='font-bold text-lg pb-5 border-b text-[#013879]'>Chủ Đề</p>
              <div className='flex flex-col '>
                <button
                  onClick={() =>
                    navigate('/loai-tin-tuc/hoat-dong-cong-ty', {
                      state: {
                        title: 'Hoạt động công ty'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group'
                >
                  Hoạt động công ty
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/loai-tin-tuc/nhung-dieu-can-biet', {
                      state: {
                        title: 'Những điều cần biết'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group'
                >
                  Những điều cần biết
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/loai-tin-tuc/cam-nang-du-lich', {
                      state: {
                        title: 'Cẩm nang du lịch'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group '
                >
                  Cẩm nang du lịch
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/loai-tin-tuc/tin-tuc-du-lich', {
                      state: {
                        title: 'Tin tức du lịch'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group'
                >
                  Tin tức du lịch
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/loai-tin-tuc/khuyen-mai', {
                      state: {
                        title: 'Khuyến mãi'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group'
                >
                  Khuyến mãi
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/loai-tin-tuc/esg', {
                      state: {
                        title: 'ESG'
                      }
                    })
                  }
                  className='py-3 flex items-center gap-2 justify-between group'
                >
                  ESG
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className=' mt-5 md:mt-20'>
              <p className='font-bold text-lg pb-5 border-b text-[#013879]'>Dòng Thời Gian</p>
              <div className='flex flex-col '>
                <button
                  onClick={() =>
                    navigate('/tin-tuc/2018', {
                      state: {
                        title: '2018'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group'
                >
                  2018 (231)
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/tin-tuc/2017', {
                      state: {
                        title: '2017'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group'
                >
                  2017 (02)
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/tin-tuc/2019', {
                      state: {
                        title: '2019'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group '
                >
                  2019 (15)
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/tin-tuc/2020', {
                      state: {
                        title: '2020'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group'
                >
                  2020 (04)
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/tin-tuc/2021', {
                      state: {
                        title: '2021'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group'
                >
                  2021 (09)
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/tin-tuc/2022', {
                      state: {
                        title: '2022'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group'
                >
                  2022 (54)
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/tin-tuc/2023', {
                      state: {
                        title: '2023'
                      }
                    })
                  }
                  className='py-3 border-b flex items-center gap-2 justify-between group'
                >
                  2023 (122)
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    navigate('/tin-tuc/2024', {
                      state: {
                        title: '2024'
                      }
                    })
                  }
                  className='py-3  flex items-center gap-2 justify-between group'
                >
                  2024 (131)
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4 group-hover:translate-x-1 transition-all duration-300'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default News
