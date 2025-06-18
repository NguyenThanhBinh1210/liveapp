import { Link } from 'react-router-dom'

const ChangeLanguage = () => {
  return (
    <div className='py-[22px] relative  text-[#013879] font-medium cursor-pointer group flex items-center gap-x-1'>
      <svg xmlns='http://www.w3.org/2000/svg' width='30' height='20' viewBox='0 0 30 20' fill='none'>
        <g clip-path='url(#clip0_2_14630)'>
          <rect width='29' height='20' transform='translate(0.356323)' fill='white' />
          <path
            d='M0.356323 0V6.61782V6.76437V13.2356V13.3822V20H29.3563V13.3822V13.2356V6.76437V6.61782V0H0.356323Z'
            fill='#BE1700'
          />
          <path
            d='M14.9997 4L16.6615 8.57278L22 8.58363L17.688 11.4206L19.3257 16L14.9997 13.1805L10.6736 16L12.312 11.4206L8 8.58363L13.3385 8.57278L14.9997 4Z'
            fill='#F1CC30'
          />
        </g>
        <defs>
          <clipPath id='clip0_2_14630'>
            <rect width='29' height='20' fill='white' transform='translate(0.356323)' />
          </clipPath>
        </defs>
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='size-4 group-hover:rotate-180 transition-all duration-300'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
      </svg>
      <div
        style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
        className='px-5 font-normal text-[#222222] rounded pt-5 pb-3 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible top-full  group-hover:top-[calc(100%-20px)] left-1/2 -translate-x-1/2 absolute bg-white'
      >
        <Link to={'/'} className='w-[149px] mb-3  flex items-center gap-x-2 '>
          <svg xmlns='http://www.w3.org/2000/svg' width='29' height='20' viewBox='0 0 29 20' fill='none'>
            <g clip-path='url(#clip0_823_26143)'>
              <rect width='29' height='20' fill='white' />
              <path d='M33.3363 0.00183105H-4.34613V19.9676H33.3363V0.00183105Z' fill='white' />
              <path
                d='M33.3391 7.99086H16.747V0.00305176H12.2178V7.99086H-4.33044V11.9827H12.2178V19.9672H16.747V11.9827H33.3391V7.99086Z'
                fill='#CE1124'
              />
              <path d='M-4.34576 2.32666V6.6739H3.87325L-4.34576 2.32666Z' fill='#00247D' />
              <path
                d='M0.18864 0.000976562L0.0681763 0.00650037L10.7254 5.67298V0.000976562H0.18864Z'
                fill='#00247D'
              />
              <path d='M8.30237 6.64621L-4.34576 0.00183105V1.56793L5.28851 6.64621H8.30237Z' fill='#CE1124' />
              <path d='M20.6976 13.3212L33.346 19.9655V18.3995L23.7117 13.3212H20.6976Z' fill='#CE1124' />
              <path d='M-4.34576 17.6743V13.327H3.87325L-4.34576 17.6743Z' fill='#00247D' />
              <path d='M0.18864 20L0.0681763 19.9945L10.7254 14.328V20H0.18864Z' fill='#00247D' />
              <path
                d='M8.23782 13.3208L-4.3374 19.9621L-1.39645 19.965L10.7376 13.5909V13.3208H8.23782Z'
                fill='#CE1124'
              />
              <path d='M33.3461 2.32568V6.67273H25.1271L33.3461 2.32568Z' fill='#00247D' />
              <path d='M28.8117 0L28.9322 0.00552381L18.2749 5.672V0H28.8117Z' fill='#00247D' />
              <path
                d='M33.334 0.00934575L30.5052 0.00915527L18.2857 6.42821V6.65335H20.8709L33.334 0.00934575Z'
                fill='#CE1124'
              />
              <path d='M33.3461 17.6726V13.3256H25.1271L33.3461 17.6726Z' fill='#00247D' />
              <path d='M28.8117 19.9984L28.9322 19.9929L18.2749 14.3264V19.9984H28.8117Z' fill='#00247D' />
            </g>
            <defs>
              <clipPath id='clip0_823_26143'>
                <rect width='29' height='20' fill='white' />
              </clipPath>
            </defs>
          </svg>
          English
        </Link>
        <Link to={'/'} className='w-[149px] mb-3 flex items-center gap-x-2 '>
          <svg xmlns='http://www.w3.org/2000/svg' width='29' height='20' viewBox='0 0 29 20' fill='none'>
            <g clip-path='url(#clip0_1_1631)'>
              <rect width='29' height='20' fill='white' />
              <path
                d='M0 0V6.61782V6.76437V13.2356V13.3822V20H9.66667V13.3822V13.2356V6.76437V6.61782V0H0Z'
                fill='#00209A'
              />
              <path
                d='M9.66699 0V6.61782V6.76437V13.2356V13.3822V20H19.3337V13.3822V13.2356V6.76437V6.61782V0H9.66699Z'
                fill='white'
              />
              <path
                d='M19.333 0V6.61782V6.76437V13.2356V13.3822V20H28.9997V13.3822V13.2356V6.76437V6.61782V0H19.333Z'
                fill='#FF0017'
              />
              <path
                d='M0.1 6.61782V0.1H28.9V6.61782V6.76437V13.2356V13.3822V19.9H0.1V13.3822V13.2356V6.76437V6.61782Z'
                stroke='black'
                stroke-width='0.2'
              />
            </g>
            <defs>
              <clipPath id='clip0_1_1631'>
                <rect width='29' height='20' fill='white' />
              </clipPath>
            </defs>
          </svg>
          Français
        </Link>
        <Link to={'/'} className='w-[149px] mb-3 flex items-center gap-x-2 '>
          <svg xmlns='http://www.w3.org/2000/svg' width='29' height='20' viewBox='0 0 29 20' fill='none'>
            <g clip-path='url(#clip0_823_24241)'>
              <rect width='29' height='20' fill='white' />
              <path
                d='M0 0V6.61782V6.76437V13.2356V13.3822V20H29V13.3822V13.2356V6.76437V6.61782V0H0Z'
                fill='#BE1700'
              />
              <path
                d='M5.45488 3.57068L6.16008 5.74073L8.42403 5.74563L6.59536 7.09262L7.29003 9.26594L5.45488 7.92795L3.61972 9.26594L4.3152 7.09262L2.48572 5.74563L4.75048 5.74073L5.45488 3.57068Z'
                fill='#F1CC30'
              />
              <path
                d='M11.3211 2.5L11.2789 3.21273L11.9363 3.47754L11.2514 3.65654L11.2052 4.36927L10.8242 3.76689L10.1384 3.94343L10.5883 3.39254L10.2098 2.78852L10.8688 3.04926L11.3211 2.5Z'
                fill='#F1CC30'
              />
              <path
                d='M13.8411 4.997L13.5007 5.62309L13.983 6.14537L13.2875 6.01215L12.9438 6.6366L12.8546 5.92796L12.16 5.79146L12.8003 5.48741L12.7144 4.77795L13.1991 5.2986L13.8411 4.997Z'
                fill='#F1CC30'
              />
              <path
                d='M13.0727 8.02429L13.2915 8.70351L14 8.70678L13.4269 9.12607L13.6433 9.8061L13.0702 9.38681L12.4955 9.80447L12.7136 9.12526L12.1429 8.70269H12.8514L13.0727 8.02429Z'
                fill='#F1CC30'
              />
              <path
                d='M11.3243 10.3031L11.2886 11.0158L11.9493 11.2733L11.2651 11.4596L11.227 12.1724L10.8396 11.5749L10.1555 11.758L10.5997 11.2022L10.2154 10.6022L10.8769 10.8564L11.3243 10.3031Z'
                fill='#F1CC30'
              />
            </g>
            <defs>
              <clipPath id='clip0_823_24241'>
                <rect width='29' height='20' fill='white' />
              </clipPath>
            </defs>
          </svg>
          简体中文
        </Link>
      </div>
    </div>
  )
}

export default ChangeLanguage