import { Link, useLocation } from "react-router-dom"
import Container from "~/components/Container"
import Section from "~/components/Section"

const PolicyDetail = () => {
  const location = useLocation()

  const title = location.state?.title

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
          <p className='text-[13px]'>
            {title}
          </p>

        </div>
      </Container>
      <Section>
        <h1 className="uppercase text-[24px] md:text-[30px] font-bold text-[#222222] text-center"> {title}</h1>
        <div className="text-center text-gray-500 text-lg font-medium">
          30-01-2024
        </div>
        <div className="mt-4 pb-[50px] border-b">
          content
        </div>
        <div className='flex items-center gap-x-4 pt-3 justify-between'>
          <button className=' px-5 py-2 rounded-full uppercase font-semibold flex items-center gap-x-2 '>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>

            Bài Trước
          </button>
          <Link to='/chinh-sach-va-quy-dinh' className=' px-5 py-2 rounded-full uppercase font-semibold flex items-center gap-x-2 '>
            QUAY LẠI TRANG CHÍNH SÁCH VÀ QUY ĐỊNH
          </Link>
          <button className=' px-5 py-2 rounded-full uppercase font-semibold flex items-center gap-x-2 '>
            Bài Sau
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 rotate-180">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>


          </button>
        </div>
      </Section>
    </div>
  )
}

export default PolicyDetail