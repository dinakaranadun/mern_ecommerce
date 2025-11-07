import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import CartWrapperContent from './cartWrapperContent'
import { useGetCartQuery, useRemoveProductMutation, useUpdateCartMutation } from '@/store/user/userCartsliceApi'
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import CartItemActions from '@/hooks/cartItemActions'

const CartWrapper = ({setOpenCartSheet}) => {
  const {handleProductRemoving,handleQuantityUpdate} = CartItemActions()
  const { data:cartItems, isLoading:fetchingCartItems, isError:errorFetchingCartItems, refetch } = useGetCartQuery();
  const [{isLoading:isProductRemoving}] = useRemoveProductMutation();

  const navigate = useNavigate();

  const items = cartItems?.data?.items || [];

  const total = items.reduce((acc, item) => {
    const price =
      item.productId.salePrice && item.productId.salePrice < item.productId.price
        ? item.productId.salePrice
        : item.productId.price;
    return acc + price * item.quantity;
  }, 0);

  const handleRetry = () => {
    refetch();
  };

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-full p-0">
      <SheetHeader className="border-b px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
        <SheetTitle className="text-lg sm:text-xl font-semibold">Your Cart</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-2 sm:py-4">
        {fetchingCartItems ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : errorFetchingCartItems ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-sm font-medium text-gray-900">Failed to load cart</p>
            <p className="text-xs text-gray-500 text-center">Please try again later</p>
            <Button 
              onClick={handleRetry}
              variant="outline"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <ShoppingCart className="w-12 h-12 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <CartWrapperContent key={item?._id} item={item} onDelete={handleProductRemoving} onQuantityUpdate={handleQuantityUpdate} removingItemId={isProductRemoving}/>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Total and Checkout */}
      {!fetchingCartItems && !errorFetchingCartItems && items.length > 0 && (
        <div className="border-t px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 bg-white">
          <div className="flex items-center justify-between mb-3 sm:mb-4 p-2">
            <span className="text-sm sm:text-base font-semibold text-gray-900">Total</span>
            <span className="text-base sm:text-base font-bold text-gray-900 ">Rs.{total}</span>
          </div>
          
          <Button 
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium bg-black hover:bg-gray-800 cursor-pointer"
            onClick={()=>{navigate('/shop/checkout'),setOpenCartSheet(false)}}
          >
            Checkout
          </Button>
        </div>
      )}
    </SheetContent>
  );
};

export default CartWrapper;