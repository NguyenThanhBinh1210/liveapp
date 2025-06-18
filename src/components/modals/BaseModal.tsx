interface Props {
  onClose: () => void
  isOpen: boolean
  children?: React.ReactNode
  size?: 'xs' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}
const BaseModal = ({ isOpen = true, onClose, children, size = 'md' }: Props) => {
  return (
    <div
      onClick={onClose}
      className={` 
      ${isOpen ? 'bg-opacity-15 visible' : ' bg-opacity-0 invisible'} 
      transition-all duration-300 px-3 md:px-0 flex items-center justify-center bg-black w-full in h-full fixed z-10  top-0 left-0`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={` bg-white  transition-all duration-300 w-full  rounded-md
          ${isOpen ? ' opacity-100 visible' : 'opacity-0 invisible'}
          ${size === 'md' && 'max-w-md'} 
          ${size === 'xs' && 'max-w-xs'} 
          ${size === 'lg' && 'max-w-lg'} 
          ${size === 'xl' && 'max-w-xl'} 
          ${size === '2xl' && 'max-w-2xl'} 
          ${size === '3xl' && 'max-w-3xl'}`}
      >
        {children}
      </div>
    </div>
  )
}

export default BaseModal
