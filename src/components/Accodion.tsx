import { useState } from 'react'
import Button from './Button'
const Accodion = ({ title }: { title: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='bg-[#F6F8FA]'>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`    cursor-pointer  transition-all duration-300  p-4 md:py-[25px] md:px-[37px] flex items-center justify-between ${isOpen ? 'text-[#013879]' : 'bg-[#013879] text-white hover:bg-[#013879]/80'}`}
      >
        <h2 className='md:text-lg font-bold'>{title}</h2>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-6'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
        </svg>
      </div>
      <div
        className={`px-4 pt-1  md:px-[37px]  space-y-3 md:space-y-6 ${isOpen ? 'max-h-[5000px] pb-4  md:pb-[25px]' : 'max-h-0 py-0'
          } overflow-hidden transition-all ease-in-out duration-700`}
      >
        <div className='flex flex-col gap-y-1 md:flex-row md:items-center text-[15px] md:text-[16px]'>
          <div className='font-bold text-[#013879] md:w-[220px]'>Ngày đăng</div>
          <div className='text-[#222222]'>2025-03-02</div>
        </div>
        <div className='flex flex-col gap-y-1 md:flex-row md:items-center text-[15px] md:text-[16px]'>
          <div className='font-bold text-[#013879] md:w-[220px]'>Cấp bậc</div>
          <div className='text-[#222222]'>Nhân viên</div>
        </div>
        <div className='flex flex-col gap-y-1 md:flex-row md:items-center text-[15px] md:text-[16px]'>
          <div className='font-bold text-[#013879] md:w-[220px]'>Ngành nghề</div>
          <div className='text-[#222222]'>Kinh doanh, Kinh tế, Ngoại ngữ, Du lịch</div>
        </div>
        <div className='flex flex-col gap-y-1 md:flex-row  text-[15px] md:text-[16px]'>
          <div className='font-bold text-[#013879] md:w-[220px]'>Mô tả</div>
          <div className='text-[#222222]'>
            <li>Kinh doanh dịch vụ du lịch – sự kiện.</li>
            <li>Lập kế hoạch và thực hiện doanh số hàng tháng.</li>
            <li>Thiết kế chương trình tour, lập bảng báo giá dịch vụ.</li>
            <li>Đàm phán, thương lượng ký kết hợp đồng với khách hàng.</li>
            <li>Phối hợp với các bộ phận liên quan trong suốt quá trình triển khai tour.</li>
          </div>
        </div>
        <div className='flex flex-col gap-y-1 md:flex-row  text-[15px] md:text-[16px]'>
          <div className='font-bold text-[#013879] md:w-[220px]'>Yêu cầu</div>
          <div className='text-[#222222]'>
            <li>Kinh doanh dịch vụ du lịch – sự kiện.</li>
            <li>Lập kế hoạch và thực hiện doanh số hàng tháng.</li>
            <li>Thiết kế chương trình tour, lập bảng báo giá dịch vụ.</li>
            <li>Đàm phán, thương lượng ký kết hợp đồng với khách hàng.</li>
            <li>Phối hợp với các bộ phận liên quan trong suốt quá trình triển khai tour.</li>
          </div>
        </div>
        <div className='flex flex-col gap-y-1 md:flex-row  text-[15px] md:text-[16px]'>
          <div className='font-bold text-[#013879] md:w-[220px]'>Quyền lợi</div>
          <div className='text-[#222222]'>
            <li>Kinh doanh dịch vụ du lịch – sự kiện.</li>
            <li>Lập kế hoạch và thực hiện doanh số hàng tháng.</li>
            <li>Thiết kế chương trình tour, lập bảng báo giá dịch vụ.</li>
            <li>Đàm phán, thương lượng ký kết hợp đồng với khách hàng.</li>
            <li>Phối hợp với các bộ phận liên quan trong suốt quá trình triển khai tour.</li>
          </div>
        </div>
        <div className='flex flex-col gap-y-1 md:flex-row md:items-center text-[15px] md:text-[16px]'>
          <div className='font-bold text-[#013879] md:w-[220px]'>Thời gian làm việc</div>
          <div className='text-[#222222]'>Thứ hai đến thứ sáu: 08:00 – 17h30.</div>
        </div>
        <Button className='py-4 mx-auto mt-10'>Ứng tuyển ngay</Button>
      </div>
    </div>
  )
}

export default Accodion
