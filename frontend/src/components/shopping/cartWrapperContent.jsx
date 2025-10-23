import { Plus, Minus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';
import { Spinner } from "../ui/shadcn-io/spinner";

const CartWrapperContent = ({ item, onQuantityUpdate, onDelete }) => {
  const product = item?.productId;
  const [quantity, setQuantity] = useState(item?.quantity);
  const [debounceQuantity] = useDebounce(quantity, 1000);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(item._id);
    } catch (error) {
      setIsDeleting(false);
    } 
  };

  useEffect(() => {
    if (debounceQuantity !== item?.quantity) {
      onQuantityUpdate(item._id, debounceQuantity);
    }
  }, [debounceQuantity]);

  return (
    <div className="group relative flex items-start gap-4 bg-background border-2 border-gray-100 rounded-2xl py-6 px-4 hover:bg-gray-50 transition-colors duration-200 max-h-48">
      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product?.image}
            alt={product?.name}
            className="w-full h-full object-cover"
          />
        </div>
        {product?.salePrice > 0 && product?.salePrice && product?.salePrice < product?.price && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {Math.round(
              ((product.price - product.salePrice) / product.price) * 100
            )}% OFF
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 mb-1 truncate">
              {product?.name}
            </h3>
            
            <div className="flex items-baseline gap-2">
              {product?.salePrice && product?.salePrice < product?.price ? (
                <>
                  <span className="text-sm font-semibold text-gray-900">
                    Rs. {product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-gray-900">
                  Rs. {product?.price?.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Delete Button */}
          {isDeleting ? (
            <div className="flex-shrink-0 p-2">
              <Spinner />
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={isDeleting}
            className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus size={14} className="text-gray-700" />
          </button>

          <span className="text-sm font-medium text-gray-900 min-w-[32px] text-center">
            {quantity}
          </span>

          <button
            onClick={handleIncrease}
            disabled={isDeleting}
            className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus size={14} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartWrapperContent;