import {  useEffect, useState } from 'react';
import {  ShoppingBag, ChevronRight } from 'lucide-react';
import { useGetCartQuery } from '@/store/user/userCartsliceApi';
import CartItemActions from '@/hooks/cartItemActions';
import CartWrapperContent from '@/components/shopping/cartWrapperContent';
import PaymentComponent from '@/components/shopping/checkout/paymentComponent';
import DeliveryComponent from '@/components/shopping/checkout/deliveryComponent';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCreatePaymentIntentMutation } from '@/store/user/paymentSliceAPI';
import { toast } from 'react-toastify';
import { useGetShippingFeeQuery } from '@/store/user/shippingFeeApi';

const ShoppingCheckout = () => {
  const {data:cartItems} = useGetCartQuery();
  const items = cartItems?.data?.items || [];

  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  

  const [selectedPayment, setSelectedPayment] = useState('card');
  const {handleProductRemoving,handleQuantityUpdate} = CartItemActions()
  const [deliveryData, setDeliveryData] = useState(null);
  const [shippingFee,setShippingFee] = useState(0);
  const stripe = useStripe();
  const elements = useElements();

  const { data: shippingData } = useGetShippingFeeQuery(deliveryData?.address.city, {
  skip: !deliveryData?.address.city, 
  });

  const subtotal = items.reduce((acc, item) => {
    const price =
      item.productId.salePrice && item.productId.salePrice < item.productId.price
        ? item.productId.salePrice
        : item.productId.price;
    return acc + price * item.quantity;
  }, 0);

  const totalAmount = subtotal + shippingFee;


  const handleAddressChange = (addressData) => {
    setDeliveryData(addressData);
    console.log('Address Data:', addressData);
  };

  const createOrderData = async() =>{

    if(!deliveryData || !selectedPayment){
      toast.error('Please fill necessary fields..');
      return;
    }
    if(items.length < 1){
      toast.error('Please add items to checkout');
      return;
    }

    const orderData = {
                        items: items.map(item => ({
                            productId: item._id,
                            name: item.name,
                            quantity: item.quantity,
                            price: item.salePrice > 0 ? item.salePrice :item.price,
                            image: item.image,
                            variant: item.category || null
                        })),
                        shippingAddress: {
                            fullName: deliveryData.fullName,
                            addressLine1: deliveryData.addressLine1,
                            addressLine2: deliveryData.addressLine2 || '',
                            city: deliveryData.city,
                            state: deliveryData.state,
                            postalCode: deliveryData.postalCode,
                            country: deliveryData.country,
                            phone: deliveryData.phone
                        },
                        paymentMethod:selectedPayment,
                        subtotal,
                        shippingFee,
                        totalAmount,
      };

      return orderData;


  }

  const handlePlaceOrder = async() =>{
    if(selectedPayment === 'cod'){
      console.log('cod');
    }

    if(selectedPayment === 'card'){

        if (!stripe || !elements) {
          console.log("Stripe not loaded yet");
          return;
        }
        
        try {
          const {data} = await createPaymentIntent({amount:totalAmount}).unwrap();
          const clientSecret = data.clientSecret;

          const cardElement = elements.getElement(CardElement);
          const{paymentIntent,error} = await stripe.confirmCardPayment(clientSecret,{
            payment_method:{card:cardElement}
          });

          if(error){
            toast.error(error.message);
            return;
          }

          if(paymentIntent.status === "succeeded"){
            console.log('success')
          }


        } catch (error) {
          toast.error('Payment Failed..Please Try Again!');
          console.log(error.message);
        }

    }

  }

  useEffect(() => {
  if (shippingData) {
    setShippingFee(shippingData.data.baseFee);
  }
}, [shippingData]);

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
            <DeliveryComponent onAddressChange={handleAddressChange}/>

            {/* Payment Methods */}
            <PaymentComponent selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment} />
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
                  <span className="font-medium text-gray-900">Rs. {shippingFee.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs.{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                disabled={selectedPayment === 'card' && !stripe}
                onClick={handlePlaceOrder}
              >
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