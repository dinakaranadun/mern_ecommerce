import { TrendingUp } from 'lucide-react'

const categories = [
  { 
    id: "men", 
    label: "Men's Collection", 
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=600&fit=crop',
    accent: 'from-blue-600 to-indigo-600'
  },
  { 
    id: "women", 
    label: "Women's Collection", 
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=600&fit=crop',
    accent: 'from-pink-600 to-rose-600'
  },
  { 
    id: "kids", 
    label: "Kids & Teens", 
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=600&fit=crop',
    accent: 'from-green-600 to-emerald-600'
  },
  { 
    id: "accessories", 
    label: "Accessories", 
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&h=600&fit=crop',
    accent: 'from-purple-600 to-violet-600'
  },
];


const CategoriesSection = () => {
  return (
    <section className='py-20 px-4 bg-gradient-to-b from-white to-gray-50'>
        <div className='container mx-auto max-w-7xl'>
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 tracking-wider uppercase">
              <TrendingUp className="w-4 h-4" />
              <span>Explore Collections</span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900'>
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find your perfect style across our diverse range of collections
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {categories.map((item) => (
              <div
                key={item.id}
                className='group relative h-96 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl'
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.label}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.accent} opacity-60 group-hover:opacity-40 transition-opacity duration-500`}></div>
                </div>
                
                <div className='absolute inset-0 flex flex-col justify-end p-8'>
                  <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    <h3 className='text-3xl font-bold text-white mb-2'>
                      {item.label}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 font-medium">
                      <span className="text-sm">Explore Now</span>
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default CategoriesSection