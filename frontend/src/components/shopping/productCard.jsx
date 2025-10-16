import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const CardProduct = ({item}) => {
  const hasDiscount = item.salePrice > 0 && item.salePrice && item.salePrice < item.price  ;
  const discountPercent = hasDiscount 
    ? Math.round(((item.price - item.salePrice) / item.price) * 100)
    : null;

  return (
    <div className="w-full  flex  justify-between hover:scale-103 cursor-pointer transition-transform duration-300 ease-in-out ">
      <Card className="w-64">
        <CardContent className="p-3">
          <div className="relative aspect-square rounded-md bg-gray-100 mb-2 overflow-hidden">
              <div className="flex justify-between">
                <div className="absolute top-2 left-2 z-10 space-y-1">
                  <div>
                    <Badge className="bg-gray-700 hover:bg-gray-900 text-white font-bold px-2 py-1 text-xs shadow-lg opacity-80 hover:opacity-100">
                    {item.brand}
                  </Badge>
                  </div>
                </div>
             {hasDiscount && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 text-xs shadow-lg">
                    Save {discountPercent}%
                  </Badge>
                </div>
              
              
            )}
            </div>
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <CardTitle className="text-sm mb-1">{item.name}</CardTitle>
          <CardDescription className="text-xs mb-2 line-clamp-2">
            {item.description}
          </CardDescription>
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                />
              ))}
              <Star className="h-3 w-3 text-gray-300" />
            </div>
            <span className="text-xs text-muted-foreground">(4.0)</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-xs text-muted-foreground line-through">
                    Rs. {item.price}
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    Rs. {item.salePrice}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold">Rs. {item.price}</span>
              )}
            </div>
            <Button size="sm" className="text-xs px-2 py-1 h-7 cursor-pointer">
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CardProduct;