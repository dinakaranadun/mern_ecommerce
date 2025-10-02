import { Menu,LogOut } from 'lucide-react';
import { Button } from '../ui/button';

const AdminHeader = ({setOpen}) => {
  return (
    <header className='flex items-center justify-between px-4 py-3 bg-background border-b'>
      <Button className='lg:hidden sm:block' onClick={()=>setOpen(true)}>
        <Menu />
        <span className='sr-only'>Menu</span>
      </Button>
      <div className='flex flex-1 justify-end'>
        <Button variant='destructive' className='inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow hover:cursor-pointer'>
          <LogOut/>
          <span>SignOut</span>
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader;