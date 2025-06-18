import { Link } from 'react-router-dom'
import Container from '~/components/Container'
import Section from '~/components/Section'
import news1 from '~/assets/6170305031849493246 (1).jpg'


const Policy = () => {
  return (
    <div>
      <Container>
        <div className=' items-center gap-1 mt-[52px]  hidden md:flex'>
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
          <Link to='/chinh-sach-va-quy-dinh' className='text-[13px]'>
            Chính sách và quy định
          </Link>
        </div>
      </Container>
      <Section>
        <div>
          <p className=' font-bold text-[28px] md:text-[40px] text-[#013879] md:pr-10'>Chính Sách & Quy Định
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-10'>
            {Array.from({ length: 6 }).map((_, index) => (
              <PolicyItem key={index} index={index} />
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}

const PolicyItem = ({ index }: { index: number }) => {
  return (
    <Link
      to={`/chinh-sach-va-quy-dinh/chinh-sach-bao-mat-thong-tin-khach-hang`}
      state={{ title: 'CHÍNH SÁCH BẢO MẬT THÔNG TIN KHÁCH HÀNG' }}
    >
      <div className='cursor-pointer' key={index} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        <div className='overflow-hidden '>
          <img
            src={news1}
            alt='news1'
            className='w-full  h-full aspect-[9/6] object-cover hover:scale-110 transition-all duration-300'
          />
        </div>
        <div className='p-4'>
          <p className='text-[#8B8B8B] font-medium text-[13px] mb-1'>28-02-2025</p>
          <p className='line-clamp-2 font-medium mb-1'>
            CẦU CỔNG VÀNG – TUYỆT TÁC KIẾN TRÚC VƯỢT THỜI GIAN TẠI SAN FRANCISCO
          </p>
          <p className='line-clamp-3 text-sm text-[#222222]'>
            Cầu Cổng Vàng, biểu tượng nổi tiếng thế giới thuộc thành phố San Francisco với thiết kế độc đáo
            nổi bật với gam màu đỏ cam đầy rực rỡ. Ngoài ra, đây còn là biểu tượng của sự phát triển và tinh
            thần đổi mới. Dù là trong ánh bình minh, giữa làn sương mờ hay khi hoàng hôn buông xuống, Cầu
            Cổng Vàng ...
          </p>
        </div>
      </div>
    </Link>
  )
}
export default Policy