import React from 'react'
import { Outlet } from 'react-router';
import ShoppingHeader from './header';

const ShoppingLayout = () => {
  return (
    <div className='flex flex-col min-h-screen bg-white'>
        <ShoppingHeader/>
        <main className='flex-1 w-full'>
            <Outlet/>
        </main>
    </div>
  )
}

export default ShoppingLayout;