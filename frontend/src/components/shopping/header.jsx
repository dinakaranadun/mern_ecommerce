import { List, LogOutIcon, Menu, Rocket, ShoppingCart, UserCog } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { logout, selectIsAuthenticated, selectUser } from '@/store/auth-slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { shoppingViewHeaderMenuItems } from '@/config';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useLogoutMutation } from '@/store/auth-slice/authSliceAPI';
import { toast } from 'react-toastify';
import CartWrapper from './cartWrapper';
import { useState } from 'react';


function MenuItems() {
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-4 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <NavLink
          key={menuItem.id}
          to={menuItem.path}
          className={({ isActive }) =>
            `relative text-sm font-medium px-5 py-2.5 rounded-xl border transition-all duration-300
            ${
              isActive
                ? "bg-black text-white border-black shadow-sm scale-105"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:text-black hover:shadow-md hover:scale-105"
            }`
          }
        >
          {menuItem.label}
        </NavLink>
      ))}
    </nav>
  );
}

function HeaderRightContent({ openCartSheet, setOpenCartSheet }){

  const user = useSelector(selectUser);
  const navigate = useNavigate();
  
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

  return <div className='flex lg:items-center lg:flex-row flex-col gap-4 '>
    <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
      <Button variant='outline' size='icon' className='hover:cursor-pointer' onClick={()=>setOpenCartSheet(true)} > 
       <ShoppingCart className='w-6 h-6'/>
        <span className='sr-only'>Cart</span>
      </Button>
      <CartWrapper setOpenCartSheet={setOpenCartSheet}/>
    </Sheet>
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Avatar className='bg-black hover:cursor-pointer'>
          <AvatarFallback className='bg-black text-white font-extrabold'>{user?.userName?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' >
        <DropdownMenuItem onClick={()=>navigate('/shop/account')} className='hover:cursor-pointer'>
          <UserCog className='mr-2 w-4 h-4'/>
          My Account
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
         <DropdownMenuItem onClick={()=>navigate('/shop/order')}>
          <List className='mr-2 w-4 h-4'/>
          My Orders
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
         <DropdownMenuItem onClick={handleLogout} className='hover:cursor-pointer'>
          <LogOutIcon className='mr-2 w-4 h-4'/>
          LogOut
        </DropdownMenuItem>
        

      </DropdownMenuContent>
    </DropdownMenu>
  </div>
}

const ShoppingHeader = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      <div className='flex h-16 items-center justify-between px-4 md:px-6'>
        <Link to='/shop/home' className='flex items-center space-x-2'>
            <Rocket className='w-6 h-6'/>
            <span className='font-bold'>EasyCom</span>
        </Link>
        
        <div className='flex gap-3 lg:hidden'>
          <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
            <Button variant='outline' size='icon' className='hover:cursor-pointer' onClick={()=>setOpenCartSheet(true)} > 
              <ShoppingCart className='w-6 h-6'/>
              <span className='sr-only'>Cart</span>
              <CartWrapper setOpenCartSheet={setOpenCartSheet}/>
            </Button>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon'>
                <Menu className='h-6 w-6'/>
                <span className='sr-only'>Toggle Header Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-full max-w-xs p-6'>
              <MenuItems/>
            </SheetContent>
          </Sheet>
        </div>

        <div className='hidden lg:block'>
          <MenuItems/>
        </div>
        {
          isAuthenticated ? <div className='hidden lg:block'>
            <HeaderRightContent  openCartSheet={openCartSheet} setOpenCartSheet={setOpenCartSheet} />
          </div> : null
        }
      </div>
    </header>
  )
}

export default ShoppingHeader;