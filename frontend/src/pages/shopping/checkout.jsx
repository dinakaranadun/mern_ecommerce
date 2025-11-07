import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
// import { useCreatePaymentIntentMutation } from "@/store/paymentApi";
import { useEffect, useState } from 'react';
import { CreditCard, Truck, MapPin, ShoppingBag, ChevronRight, Plus, Minus } from 'lucide-react';
import { useGetCartQuery } from '@/store/user/userCartsliceApi';
import { useGetAddressQuery } from '@/store/user/userAccountSlice';
import CartItemActions from '@/hooks/cartItemActions';
import CartWrapperContent from '@/components/shopping/cartWrapperContent';


const intialState = {
  fullName: '',
    line1: '',
    line2:'',
    city: '',
    zipCode: '',
    phone: ''
}

const ShoppingCheckout = () => {
  const {data:cartItems} = useGetCartQuery();
  const {data:addresses} = useGetAddressQuery();
  const items = cartItems?.data?.items || [];

  const stripe = useStripe();
  const elements = useElements();
  // const [createPaymentIntent] = useCreatePaymentIntentMutation();


  const [selectedAddress, setSelectedAddress] = useState();
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [newAddress, setNewAddress] = useState(intialState);
  const {handleProductRemoving,handleQuantityUpdate} = CartItemActions()

  const subtotal = items.reduce((acc, item) => {
    const price =
      item.productId.salePrice && item.productId.salePrice < item.productId.price
        ? item.productId.salePrice
        : item.productId.price;
    return acc + price * item.quantity;
  }, 0);

  const shipping = 9.99;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!selectedAddress && !showNewAddress) {
      const defaultAddress = addresses?.data?.find(a => a.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      }
    }
  }, [addresses]);

  const handleNewAddressChange = (field, value) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUseNewAddress = () => {
    setSelectedAddress(null);
    setShowNewAddress(true);
  };

  const handleSelectExistingAddress = (addressId) => {
    setSelectedAddress(addressId);
    setShowNewAddress(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cart Items */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="text-gray-900" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
              </div>
              
              <div className="space-y-4">
                {items.map(item => (
                  <CartWrapperContent key={item?._id} item={item} onDelete={handleProductRemoving} onQuantityUpdate={handleQuantityUpdate} />
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="text-gray-900" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
              </div>
              
              <div className="space-y-3">
               {addresses?.data?.map(addr => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAddress === addr._id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddress === addr._id}
                    onChange={() => handleSelectExistingAddress(addr._id)}
                    className="mt-1 accent-gray-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={16} className="text-gray-600" />
                      <span className="font-semibold text-gray-900 capitalize">{addr.type}</span>
                    </div>
                    <p className="text-sm text-gray-700 capitalize ">{addr.line1}</p>
                    <p className="text-sm text-gray-700 capitalize">{addr.line2}</p>
                    <p className="text-sm text-gray-600 capitalize">{addr.city}</p>
                  </div>
                </label>
              ))}

                {showNewAddress ? (
                  <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAddress === 'new'
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center gap-4 mb-3">
                      <input
                        type="radio"
                        name="address"
                        value="new"
                        checked={selectedAddress === 'new'}
                        onChange={handleUseNewAddress}
                        className="accent-gray-900"
                      />
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-600" />
                        <span className="font-semibold text-gray-900">New Address</span>
                      </div>
                    </div>
                    <div className="ml-8 space-y-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newAddress.fullName}
                        onChange={(e) => handleNewAddressChange('fullName', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
                      />
                      <input
                        type="text"
                        placeholder="line 1"
                        value={newAddress.line1}
                        onChange={(e) => handleNewAddressChange('line1', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
                      />
                      <input
                        type="text"
                        placeholder="line2 (optional)"
                        value={newAddress.line2}
                        onChange={(e) => handleNewAddressChange('line2', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
                      />
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => handleNewAddressChange('city', e.target.value)}
                          className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
                        />
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={newAddress.zipCode}
                          onChange={(e) => handleNewAddressChange('zipCode', e.target.value)}
                          className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newAddress.phone}
                        onChange={(e) => handleNewAddressChange('phone', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </label>
                ) : (
                  <button
                    onClick={handleUseNewAddress}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all text-gray-600 hover:text-gray-900 font-medium"
                  >
                    <Plus size={20} />
                    Use Different Address
                  </button>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-gray-900" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPayment === 'card' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={selectedPayment === 'card'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="accent-gray-900"
                  />
                  <CreditCard size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-900">Credit / Debit Card</span>
                </label>
                {selectedPayment === 'card' && (
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Details
                    </label>

                    <div>
                      <label className="text-sm text-gray-600">Card Number</label>
                      <div className="p-3 bg-white rounded-lg border border-gray-300">
                        <CardNumberElement options={{ style: { base: { fontSize: "16px" } } }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-600">Expiry</label>
                        <div className="p-3 bg-white rounded-lg border border-gray-300">
                          <CardExpiryElement options={{ style: { base: { fontSize: "16px" } } }} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">CVC</label>
                        <div className="p-3 bg-white rounded-lg border border-gray-300">
                          <CardCvcElement options={{ style: { base: { fontSize: "16px" } } }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPayment === 'cod' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={selectedPayment === 'cod'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="accent-gray-900"
                  />
                  <span className="font-medium text-gray-900">Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>

          {/*  Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">Rs. {shipping.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs.{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group">
                Place Order
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;