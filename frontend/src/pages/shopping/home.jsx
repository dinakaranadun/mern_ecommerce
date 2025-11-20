import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Footer from '@/components/common/footer';
import { Link } from 'react-router';
import { useGetProductsWithFilterQuery } from '@/store/user/userProductSliceApi';
import FeaturedSection from '@/components/shopping/featuredSectionHome';
import BrandSection from '@/components/shopping/brandSectionHome';
import CategoriesSection from '@/components/shopping/categoriesSectionhome';

const PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"%3E%3Crect fill="%23333" width="1200" height="675"/%3E%3C/svg%3E';

const slides = [
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=675&fit=crop&q=60&auto=format',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=675&fit=crop&q=60&auto=format',
  'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&h=675&fit=crop&q=60&auto=format'
];

const ShoppingHome = () => {
  const { data: featuredProducts, isLoading, isError } = useGetProductsWithFilterQuery({
    featured: true
  });

  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState({ 0: false });

  // Aggressively preload first image only
  useEffect(() => {
    const img = new Image();
    img.src = slides[0];
    img.onload = () => {
      setLoadedImages(prev => ({ ...prev, 0: true }));
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      slides.forEach((slide, idx) => {
        if (idx > 0) {
          const img = new Image();
          img.src = slide;
          img.onload = () => {
            setLoadedImages(prev => ({ ...prev, [idx]: true }));
          };
        }
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => ((prev + 1) % slides.length));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = (idx) => {
    setLoadedImages(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <div className='relative w-full bg-gray-900 overflow-hidden' style={{ aspectRatio: '16/9' }}>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900'></div>
        
        {/* Images */}
        {slides.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Slide ${index + 1}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding='async'
            fetchPriority={index === 0 ? 'high' : 'low'}
            onLoad={() => handleImageLoad(index)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
            sizes='100vw'
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
        
        {/* Hero  */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4 py-6">
          <div className="space-y-4 md:space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 will-change-transform">
              <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span className="text-white text-sm font-medium">New Collections</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight will-change-transform">
              Style Meets Comfort
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto will-change-transform">
              Discover the latest trends in fashion with our curated collection
            </p>
            <Link to='/shop/listing' className="inline-block bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-gray-100 active:scale-95 transition-all shadow-xl will-change-transform">
              Shop Now
            </Link>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 md:bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 will-change-transform ${
                index === current ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current}
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