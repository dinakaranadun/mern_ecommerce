import { X, ShoppingCart, Sparkles, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetProductDetailsQuery } from '@/store/user/userProductSliceApi';
import Loader from '../common/loader';
import { Avatar, AvatarFallback } from '../ui/avatar';

const ProductDetailsDialog = ({ open, setOpen, productId,setProductId,handleAddToCart }) => {
  const { data: product, isLoading, isError } = useGetProductDetailsQuery(productId, { 
    skip: !productId 
  });

  const calculateDiscount = (price, salePrice) => {
    if (!price || !salePrice || price === salePrice) return null;
    return Math.round(((price - salePrice) / price) * 100);
  };

  const discount = product?.data ? calculateDiscount(product.data.price, product.data.salePrice) : null;

  const isProductMismatch = product?.data?._id !== productId && productId !== null;
  const showLoading = isLoading || isProductMismatch;

  return (
    <Dialog   open={open} onOpenChange={setOpen}>
      <DialogContent key={productId} className='p-0 gap-0 max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[1000px] max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50'>
        {/* Close Button */}
        <button
          onClick={() => {setOpen(false),setProductId(null)}}
          className='absolute right-4 top-4 z-50 rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-lg hover:bg-white transition-all hover:scale-110'
        >
          <X className='h-5 w-5' />
        </button>

        <ScrollArea className='h-full max-h-[95vh] sm:max-h-[90vh]'>
          {showLoading ? (
            <Loader/>
          ) : isError ? (
            // Error state
            <div className='flex items-center justify-center py-24 px-6'>
              <div className='text-center max-w-md'>
                <div className='mx-auto mb-6 h-16 w-16 rounded-full bg-red-50 flex items-center justify-center'>
                  <svg className='h-8 w-8 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </div>
                <p className='text-lg font-semibold text-red-600 mb-2'>Unable to Load Product</p>
                <p className='text-gray-600 mb-6'>We encountered an issue loading this product. Please try again.</p>
                <Button onClick={() => setOpen(false)} variant='outline'>Close</Button>
              </div>
            </div>
          ) : product ? (
            // Data loaded successfully
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-0'>
              {/* Image Section */}
              <div className='relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 lg:p-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[600px]'>
                <div className='relative w-full max-w-lg'>
                  {discount && (
                    <div className='absolute -top-4 -right-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg transform rotate-12'>
                      <span className='text-sm font-bold flex items-center gap-1'>
                        <Sparkles className='h-4 w-4' />
                        {discount}% OFF
                      </span>
                    </div>
                  )}
                  <div className='relative overflow-hidden rounded-2xl shadow-2xl bg-white p-4'>
                    <img
                      src={product.data.image}
                      alt={product.data.name}
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className='flex flex-col p-6 sm:p-8 lg:p-12'>
                <div className='flex-1 space-y-6'>
                  {/* Title */}
                  <div>
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2'>
                      {product.data.name}
                    </h1>
                    <div className='h-1 w-20 bg-gradient-to-r from-gray-300 to-gray-700 rounded-full'></div>
                  </div>

                  {/* Description */}
                  <div className='space-y-3'>
                    <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>Description</h2>
                    <p className='text-gray-700 text-base sm:text-lg leading-relaxed'>
                      {product.data.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className='bg-background rounded-xl px-3 py-2 space-y-3 border'>
                    <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>Price</h2>
                    <div className='flex items-end gap-4 flex-wrap'>
                      <div className='flex items-baseline gap-2'>
                        <span className='text-xl sm:text-xl font-bold text-gray-900'>
                          Rs. {product.data.salePrice}
                        </span>
                      </div>
                      {product.data.price !== product.data.salePrice  && (
                        <div className='flex items-center gap-3'>
                          <span className='text-xl sm:text-xl text-gray-400 line-through'>
                            Rs. {product.data.price}
                          </span>
                          {discount && (
                            <span className='text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full'>
                              Save {discount}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2'>Reviews</h2>
                    <ScrollArea className='h-[25vh] pr-5  py-2'>
                      <div className='bg-background rounded-xl  border '>
                        <div className='flex justify-start  gap-2 p-2 space-y-2 items-stretch'>
                          <Avatar className='bg-black w-10 h-10 '>
                            <AvatarFallback className='bg-black text-white font-extrabold'>D</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>
                              <h3 className='text-muted-foreground font-semibold text-sm mb-1'>Dinakara</h3>
                            </div>
                            <div className='flex '>
                              {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className='text-muted-foreground text-sm px-3 py-2 text-justify'>orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                {/* Action Button */}
                <div className='mt-8 pt-6 border-t border-gray-200'>
                  <Button 
                    className='w-full h-14 text-lg font-semibold hover:from-gray-900  hover:shadow-xl   duration-500 ease-in-out cursor-pointer'
                  onClick={()=>handleAddToCart(product?.data?._id)}
                  >
                    <ShoppingCart className='mr-2 h-5 w-5' />
                    Add to Cart
                  </Button>
                  <p className='text-center text-sm text-gray-500 mt-4'>
                    Free shipping on orders over Rs. 5,000
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;