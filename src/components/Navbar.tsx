import MobileSidebar from './MobileSidebar'
import UserIcon from '@/components/UserIcon'

const Navbar = () => {

  return (
    <div className='flex items-center p-4'>
        <MobileSidebar />
        <div className='w-full flex justify-end'>
          <UserIcon />
        </div>
    </div>
  )
}

export default Navbar