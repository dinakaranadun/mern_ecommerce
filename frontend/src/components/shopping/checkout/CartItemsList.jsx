import { ShoppingBag } from 'lucide-react';
import CartWrapperContent from '@/components/shopping/cartWrapperContent';
import CartItemActions from '@/hooks/cartItemActions';

const EmptyCart = () => (
  <div className="text-center py-8">
    <p className="text-gray-500">Your cart is empty</p>
  </div>
);

const CartItemsList = ({ items }) => {
  const { handleProductRemoving, handleQuantityUpdate } = CartItemActions();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="text-gray-900" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">
          Order Items ({items.length})
        </h2>
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <CartWrapperContent
              key={item._id}
              item={item}
              onDelete={handleProductRemoving}
              onQuantityUpdate={handleQuantityUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CartItemsList;