import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router';



const brands = [
  { id: "nike", label: "Nike", accent: 'bg-gradient-to-br from-orange-500 to-red-600' },
  { id: "adidas", label: "Adidas", accent: 'bg-gradient-to-br from-gray-800 to-black' },
  { id: "puma", label: "Puma", accent: 'bg-gradient-to-br from-amber-500 to-orange-600' },
  { id: "levi", label: "Levi's", accent: 'bg-gradient-to-br from-blue-700 to-indigo-800' },
];

const BrandSection = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brandId)=>{
    navigate(`/shop/listing?brand=${brandId}`);
  }

  return (
    <section className='py-20 px-4 bg-black text-white'>
        <div className='container mx-auto max-w-7xl'>
          <div className="text-center mb-16 space-y-4">
            <h2 className='text-4xl md:text-5xl font-bold'>
              Featured Brands
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Premium quality from the world's leading fashion brands
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {brands.map((item) => (
              <div
                key={item.id}
                className='group relative h-72 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105'
                onClick={()=>handleBrandClick(item.id)}
              >
                <div className={`absolute inset-0 ${item.accent}`}></div>
                
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }}></div>
                </div>

                <div className='relative h-full flex flex-col items-center justify-center p-8 group-hover:transform group-hover:scale-110 transition-transform duration-500'>
                  <div className="text-center space-y-4 ">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center m-5 group-hover:bg-white/30 transition-colors duration-300">
                      <ShoppingBag className="w-10 h-10 text-white " />
                    </div>
                    <h3 className='text-4xl font-bold text-white tracking-tight'>
                      {item.label}
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm text-white/90 font-medium">Shop Collection →</span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-white/10 blur-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default BrandSection;