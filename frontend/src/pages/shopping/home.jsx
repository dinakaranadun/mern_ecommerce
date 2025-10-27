import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Footer from '@/components/common/footer';
import { Link } from 'react-router';
import { useGetProductsWithFilterQuery } from '@/store/user/userProductSliceApi';
import FeaturedSection from '@/components/shopping/featuredSectionHome';
import BrandSection from '@/components/shopping/brandSectionHome';
import CategoriesSection from '@/components/shopping/categoriesSectionhome';

const slides = [
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1600&h=900&fit=crop'
];


const ShoppingHome = () => {

  const { data: featuredProducts, isLoading, isError } = useGetProductsWithFilterQuery({
      featured: true
  });

  const [current, setCurrent] = useState(0);


 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => ((prev + 1) % slides.length));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      {/* Hero Banner */}
      <div className='relative w-full h-screen overflow-hidden'>
        {slides.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
              index === current ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Hero */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">New Collections</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Style Meets Comfort
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Discover the latest trends in fashion with our curated collection
            </p>
            <Link to='/shop/listing' className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
              Shop Now
            </Link>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                index === current ? "bg-white w-8" : "bg-white/50 w-2"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Shop by Category */}
      <CategoriesSection/>

      {/* Shop by Brand */}
      <BrandSection/>

      {/* Featured products */}
      <FeaturedSection featuredProducts={featuredProducts} isLoading={isLoading} isError={isError}/>

      <Footer/>
    </div>
  );
};

export default ShoppingHome;