import React from 'react'
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet'
import { Separator } from '@radix-ui/react-separator'
import { Button } from '../ui/button'

const CartWrapper = () => {
  return <SheetContent className='sm:max-w-md'>
    <SheetHeader className='border-b-4'>
        <SheetTitle >Your Cart</SheetTitle>
    </SheetHeader>
    <div className='p-8 space-y-4'>

    </div>
    <div className='p-8 space-y-4'>
        <div className='flex justify-between'>
            <span className='font-bold'>Total</span>
            <span className='font-bold'>Rs.1000</span>
        </div>
    </div>
    <div className='p-8'>
        <Button className='w-full mt-5'>CheckOut</Button>
    </div>

  </SheetContent>
}

export default CartWrapper