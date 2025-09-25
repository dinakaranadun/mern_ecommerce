import React from 'react'
import { Outlet } from 'react-router';
import ShoppingHeader from './header';

const ShoppingLayout = () => {
  return (
    <div className='flex flex-1 bg-white overflow-hidden'>
        {/*common header*/}
        <ShoppingHeader/>
        <main className='flex flex-col w-full'>
            <Outlet/>
        </main>

    </div>
  )
}

export default ShoppingLayout;