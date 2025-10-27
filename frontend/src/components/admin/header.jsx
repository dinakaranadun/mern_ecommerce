import { Menu,LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useLogoutMutation } from '@/store/auth-slice/authSliceAPI';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/auth-slice/authSlice';
import { toast } from 'react-toastify';

const AdminHeader = ({setOpen}) => {
  const [logOut] = useLogoutMutation();
  const dispath = useDispatch();

  const handleLogout = async(e)=>{
    e.preventDefault();

    try {

      const res = await logOut().unwrap();
      if(res.success){
        dispath(logout());
      }
      
      
    } catch (error) {
      if (error?.status === 'FETCH_ERROR' || error?.error?.includes('Failed to fetch')) {
        toast.error('Sorry.. Something went wrong');
      } else {
        toast.error(error?.data?.message || error.error || 'Something went wrong');
      }
    }
  }
  return (
    <header className='flex items-center justify-between px-4 py-3 bg-background border-b'>
      <Button className='lg:hidden sm:block' onClick={()=>setOpen(true)}>
        <Menu />
        <span className='sr-only'>Menu</span>
      </Button>
      <div className='flex flex-1 justify-end'>
        <Button variant='destructive' className='inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow hover:cursor-pointer' onClick={handleLogout}>
          <LogOut/>
          <span>SignOut</span>
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader;