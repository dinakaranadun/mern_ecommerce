import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CardProduct from './productCard';
import ProductSkeleton from '../common/skeltons/admin';
import CartItemActions from '@/hooks/cartItemActions';
import { useState } from 'react';


const FeaturedSection = ({featuredProducts,isLoading,isError}) => {

    const [addingToCartMap, setAddingToCartMap] = useState({}); 
    const { addItemToCart } = CartItemActions();
    
    
    const handleAddToCart = async (productId) => {
        setAddingToCartMap(prev => ({ ...prev, [productId]: true }));
    
        try {
          await addItemToCart(productId);
        } catch (error) {
          if (error?.status === "FETCH_ERROR" || error?.error?.includes("Failed to fetch")) {
            toast.error("Sorry..Something Went Wrong");
          } else {
            toast.error(error?.data?.message || error.error || "Something went wrong");
          }
        } finally {
          setAddingToCartMap(prev => ({ ...prev, [productId]: false }));
        }
      };

  return (
    <section className='py-20 px-4 bg-gradient-to-b from-white to-gray-50'>
        <div className='container mx-auto max-w-7xl'>
            <div className="text-center mb-16 space-y-4">
            <h2 className='text-4xl md:text-5xl font-bold'>
                Featured Products
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Shop the favorites everyone's talking about! Our best-selling products are trending for a reason
            </p>
            </div>

            {isLoading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
            ) : isError || !featuredProducts?.data?.data.length ? (
            <div className="text-center text-2xl font-bold py-12">
                No Products Found
            </div>
            ) : (
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
                }}
                className="pb-12"
            >
                {featuredProducts.data.data.map((item) => (
                <SwiperSlide key={item._id}>
                    <CardProduct item={item} handleAddToCart={handleAddToCart} isAddingToCart={addingToCartMap[item._id]} />
                </SwiperSlide>
                ))}
            </Swiper>
            )}
        </div>
    </section>
  )
}

export default FeaturedSection;