import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Star, ShoppingCart,Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "../ui/shadcn-io/spinner"
import { useState } from "react"

const CardProduct = ({
  item, 
  handleGetProductdetails, 
  handleAddToCart, 
  isAddingToCart
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const hasDiscount = item.salePrice > 0 && item.salePrice && item.salePrice < item.price;

  const discountPercent = hasDiscount 
    ? Math.round(((item.price - item.salePrice) / item.price) * 100)
    : null;

  return (
    <div 
      className="w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="w-full  border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white rounded-2xl">
        <CardContent className="p-0">
          <div 
            className={`relative aspect-square bg-gray-50 overflow-hidden ${handleGetProductdetails ? 'cursor-pointer' : ''}`}
            onClick={() => handleGetProductdetails?.(item?._id)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
              <Badge className="bg-white/95 backdrop-blur-sm hover:bg-white text-black font-semibold px-3 py-1.5 text-xs shadow-md border border-gray-200">
                {item.brand}
              </Badge>
              
              {hasDiscount && (
                <Badge className="bg-black hover:bg-gray-900 text-white font-bold px-3 py-1.5 text-xs shadow-md border-0 animate-pulse">
                  -{discountPercent}%
                </Badge>
              )}
            </div>

            {/* Quick Action Buttons  */}
            {handleGetProductdetails && (
              <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-500 ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}>
                <button 
                  className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-md border border-gray-200 transition-all duration-300 hover:scale-110 hover:border-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGetProductdetails(item?._id);
                  }}
                >
                  <Eye className="w-5 h-5 text-gray-700 hover:text-black transition-colors" />
                </button>
              </div>
            )}

            {/* Stock Status */}
            {item.stock === 0 && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                <Badge className="bg-black text-white font-bold px-6 py-2 text-sm">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                {item.category}
              </span>
            </div>

            <h3 
              className={`font-bold text-base text-black line-clamp-2 leading-tight ${handleGetProductdetails ? 'cursor-pointer hover:text-gray-700' : ''} transition-colors min-h-[2.5rem]`}
              onClick={() => handleGetProductdetails?.(item?._id)}
            >
              {item.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= item.rating
                        ? 'fill-amber-300 text-yellow-400' 
                        : 'fill-gray-300 text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-black font-medium">{item.rating}</span>
              <span className="text-xs text-gray-400">({item.numReviews})</span>
            </div>

            {/* Price Section */}
            <div className="flex items-center justify-between min-h-16 pt-2 border-t border-gray-200">
              <div className="flex flex-col">
                {hasDiscount ? (
                  <>
                    <span className="text-xs text-gray-400 line-through">
                      Rs. {item.price.toLocaleString()}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-black">
                        Rs. {item.salePrice.toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-black">
                    Rs. {item.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* cart button */}
              {handleAddToCart && (
                isAddingToCart ? (
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                    <Spinner />
                  </div>
                ) : (
                  <Button 
                    size="icon"
                    className="w-12 h-12 rounded-xl bg-black hover:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border-0 hover:cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item._id);
                    }}
                    disabled={item.totalStock === 0}
                  >
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}

export default CardProduct;