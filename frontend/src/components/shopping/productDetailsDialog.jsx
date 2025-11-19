import { X, ShoppingCart, Sparkles, Star, Package, ShieldCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetProductDetailsQuery } from '@/store/user/userProductSliceApi';
import Loader from '../common/loader';
import ProductReviews from './product/productReviews';

const ProductDetailsDialog = ({ open, setOpen, productId, setProductId, handleAddToCart }) => {
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

  // Calculate average rating
  const averageRating = product?.data?.reviews?.length > 0
    ? (product.data.reviews.reduce((sum, r) => sum + r.rating, 0) / product.data.reviews.length).toFixed(1)
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        key={productId} 
        className='p-0 gap-0 max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[1200px] max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-0 rounded-3xl bg-white shadow-2xl'
      >
        {/* Close Button */}
        <button
          onClick={() => {setOpen(false); setProductId(null)}}
          className='absolute right-4 top-4 z-50 rounded-full bg-gray-900 text-white p-2.5 shadow-lg hover:bg-gray-800 transition-all hover:scale-110 hover:rotate-90 duration-300'
        >
          <X className='h-5 w-5' />
        </button>

        <ScrollArea className='h-full max-h-[95vh] sm:max-h-[90vh]'>
          {showLoading ? (
            <Loader/>
          ) : isError ? (
            <div className='flex items-center justify-center py-24 px-6'>
              <div className='text-center max-w-md'>
                <div className='mx-auto mb-6 h-20 w-20 rounded-full bg-red-50 flex items-center justify-center'>
                  <svg className='h-10 w-10 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </div>
                <p className='text-xl font-bold text-gray-900 mb-2'>Oops! Something went wrong</p>
                <p className='text-gray-600 mb-6'>We couldn't load this product. Please try again.</p>
                <Button onClick={() => setOpen(false)} className='bg-gray-900 hover:bg-gray-800'>Close</Button>
              </div>
            </div>
          ) : product ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-0'>
              <div className='relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12 flex items-center justify-center min-h-[400px] lg:min-h-[700px]'>
                {discount && (
                  <div className='absolute top-8 left-8 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2.5 rounded-full shadow-xl transform -rotate-6 animate-pulse'>
                    <span className='text-sm font-bold flex items-center gap-2'>
                      <Sparkles className='h-4 w-4' />
                      {discount}% OFF
                    </span>
                  </div>
                )}

                {product.data.totalStock > 0 && (
                  <div className='absolute top-8 right-8 z-10 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg'>
                    <span className='text-xs font-semibold'>In Stock</span>
                  </div>
                )}

                <div className='relative w-full max-w-lg'>
                  <div className='absolute inset-0 rounded-3xl blur-3xl opacity-20 animate-pulse'></div>
                  <div className='relative overflow-hidden rounded-3xl shadow-2xl bg-white p-6'>
                    <img
                      src={product.data.image}
                      alt={product.data.name}
                      className="w-full aspect-square object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className='flex flex-col p-8 lg:p-12 bg-white'>
                <div className='flex-1 space-y-8'>
                  {/* Category Badge */}
                  {product.data.category && (
                    <div className='inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full w-fit'>
                      <Package className='h-4 w-4 text-gray-600' />
                      <span className='text-sm font-medium text-gray-700 capitalize'>{product.data.category}</span>
                    </div>
                  )}

                  {/* Title & Rating */}
                  <div className='space-y-4'>
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight'>
                      {product.data.name}
                    </h1>
                    
                    {product.data.reviews?.length > 0 && (
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(product.data.rating)
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className='text-sm font-semibold text-gray-900'>{averageRating}</span>
                        <span className='text-sm text-gray-500'>({product.data.reviews.length} reviews)</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className='space-y-3'>
                    <h2 className='text-sm font-bold text-gray-900 uppercase tracking-wider'>About This Product</h2>
                    <p className='text-gray-600 text-base leading-relaxed'>
                      {product.data.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200'>
                    <div className='flex items-end gap-4 mb-3'>
                      <div className='flex items-baseline gap-2'>
                        <span className='text-4xl font-bold text-gray-900'>
                          { product.data.salePrice > 0 ? 'Rs '+product.data.salePrice: product.data.price}
                        </span>
                      </div>
                      {product.data.price > product.data.salePrice && product.data.salePrice > 0 && (
                        <>
                          <span className='text-2xl text-gray-400 line-through'>
                            Rs. {product.data.price.toLocaleString()}
                          </span>
                          {discount && (
                            <span className='text-sm font-bold text-green-600 bg-green-100 px-3 py-1.5 rounded-full'>
                              Save {discount}%
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <TrendingUp className='h-4 w-4' />
                      <span>Best price in the market</span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100'>
                      <ShieldCheck className='h-6 w-6 text-blue-600' />
                      <div>
                        <p className='text-sm font-semibold text-gray-900'>Secure Payment</p>
                        <p className='text-xs text-gray-600'>100% Protected</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100'>
                      <Package className='h-6 w-6 text-green-600' />
                      <div>
                        <p className='text-sm font-semibold text-gray-900'>Fast Delivery</p>
                        <p className='text-xs text-gray-600'>Within 3-5 days</p>
                      </div>
                    </div>
                  </div>

                  {/* Reviews */}
                  {product.data.reviews?.length > 0 && (
                    <ProductReviews reviews={product.data.reviews} />
                  )}
                </div>

                {/* Action Button */}
                <div className='mt-8 pt-6 border-t border-gray-200 space-y-4'>
                  <Button 
                    onClick={() => handleAddToCart(productId)}
                    className='w-full h-16 text-lg font-bold bg-gray-900 hover:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group'
                  >
                    <ShoppingCart className='mr-2 h-6 w-6 group-hover:scale-110 transition-transform' />
                    Add to Cart
                  </Button>
                  <div className='flex items-center justify-center gap-2 text-sm text-gray-600'>
                    <Sparkles className='h-4 w-4' />
                    <span>Free shipping on orders over Rs. 5,000</span>
                  </div>
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
