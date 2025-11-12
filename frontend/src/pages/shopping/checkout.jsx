import { useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { useGetCartQuery } from '@/store/user/userCartsliceApi';
import CartItemActions from '@/hooks/cartItemActions';
import CartWrapperContent from '@/components/shopping/cartWrapperContent';
import PaymentComponent from '@/components/shopping/checkout/paymentComponent';
import DeliveryComponent from '@/components/shopping/checkout/deliveryComponent';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCreatePaymentIntentMutation } from '@/store/user/paymentSliceAPI';
import { toast } from 'react-toastify';
import { useGetShippingFeeQuery } from '@/store/user/shippingFeeApi';
import { 
  useCreateOrderMutation, 
  useUpdateOrderStatusMutation 
} from '@/store/user/orderSliceApi';
import { useNavigate } from 'react-router';

const ShoppingCheckout = () => {
  const navigate = useNavigate();
  const { data: cartItems, refetch: refetchCart } = useGetCartQuery();
  const items = cartItems?.data?.items || [];

  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [addOrder] = useCreateOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  // const [clearCart] = useClearCartMutation();

  const [selectedPayment, setSelectedPayment] = useState('card');
  const { handleProductRemoving, handleQuantityUpdate } = CartItemActions();
  const [deliveryData, setDeliveryData] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  
  const stripe = useStripe();
  const elements = useElements();

  const { data: shippingData } = useGetShippingFeeQuery(
    deliveryData?.address?.city,
    { skip: !deliveryData?.address?.city }
  );

  // Calculate totals
  const subtotal = items.reduce((acc, item) => {
    const price =
      item.productId.salePrice && item.productId.salePrice < item.productId.price
        ? item.productId.salePrice
        : item.productId.price;
    return acc + price * item.quantity;
  }, 0);

  const totalAmount = subtotal + shippingFee;

  // Update shipping fee when data changes
  useEffect(() => {
    if (shippingData?.data?.baseFee) {
      setShippingFee(shippingData.data.baseFee);
    }
  }, [shippingData]);

  const handleAddressChange = (addressData) => {
    setDeliveryData(addressData);
  };

  const validateOrder = () => {
    if (!deliveryData) {
      toast.error('Please provide delivery address');
      return false;
    }

    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return false;
    }

    if (items.length < 1) {
      toast.error('Your cart is empty');
      return false;
    }

    if (selectedPayment === 'card' && (!stripe || !elements)) {
      toast.error('Payment system is loading. Please wait.');
      return false;
    }

    return true;
  };

  // Create order data
  const createOrderData = () => {
    return {
      items: items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.salePrice > 0 
          ? item.productId.salePrice 
          : item.productId.price,
        image: item.productId.image,
        variant: item.productId.category || null
      })),
      shippingAddress: {
        fullName: deliveryData.fullName,
        addressLine1: deliveryData.address.line1,
        addressLine2: deliveryData.address.line2 || '',
        city: deliveryData.address.city,
        state: deliveryData.address.state,
        postalCode: deliveryData.address.postalCode,
        country: deliveryData.address.country,
        phone: deliveryData.phone
      },
      paymentMethod: selectedPayment,
      subtotal,
      shippingFee,
      totalAmount
    };
  };

  // Handle card payment
  const handleCardPayment = async (order) => {
    try {
      setProcessingStage('Processing payment...');

      // Create payment intent
      const { data } = await createPaymentIntent({
        amount: totalAmount,
        orderId: order._id,
        currency: 'lkr'
      }).unwrap();

      const clientSecret = data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      // Confirm card payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: deliveryData.fullName,
              email: deliveryData.email,
              phone: deliveryData.phone,
              address: {
                line1: deliveryData.address.line1,
                line2: deliveryData.address.line2,
                city: deliveryData.address.city,
                state: deliveryData.address.state,
                postal_code: deliveryData.address.postalCode,
                country: deliveryData.address.country
              }
            }
          }
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  };

  // Handle COD order
  const handleCODOrder = async () => {
    try {
      setProcessingStage('Creating your order...');

      const orderData = createOrderData();
      const order = await addOrder({
        ...orderData,
        paymentStatus: 'pending', 
        orderStatus: 'confirmed'
      }).unwrap();

      setProcessingStage('Clearing cart...');
      await refetchCart();

      toast.success('Order placed successfully!');
      navigate(`/order-success/${order.data._id}`);
    } catch (error) {
      console.error('COD order error:', error);
      toast.error('Failed to place order. Please try again.');
      throw error;
    }
  };

  const handleCardOrder = async () => {
    let orderId = null;

    try {
      setProcessingStage('Creating your order...');
      const orderData = createOrderData();
      const order = await addOrder({
        ...orderData,
        paymentStatus: 'pending',
        orderStatus: 'pending'
      }).unwrap();

      orderId = order.data._id;

      const paymentIntent = await handleCardPayment(order.data);

      if (paymentIntent.status === 'succeeded') {
        setProcessingStage('Confirming your order...');

        await updateOrderStatus({
          id: orderId,
          paymentStatus: 'completed',
          transactionId: paymentIntent.id,
          orderStatus: 'confirmed'
        }).unwrap();

        setProcessingStage('Clearing cart...');
        await refetchCart();

        toast.success('Payment successful! Order confirmed.');
        navigate(`/order-success/${orderId}`);
      } else if (paymentIntent.status === 'requires_action') {
        toast.info('Additional authentication required');
      } else {
        throw new Error('Payment incomplete');
      }
    } catch (error) {
      console.error('Card order error:', error);

      // Update order status to failed if order was created
      if (orderId) {
        try {
          await updateOrderStatus({
            id: orderId,
            paymentStatus: 'failed',
            orderStatus: 'cancelled',
            failureReason: error.message || 'Payment processing failed'
          }).unwrap();
        } catch (updateError) {
          console.error('Failed to update order status:', updateError);
        }
      }

      toast.error(error.message || 'Payment failed. Please try again.');
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateOrder()) {
      return;
    }

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setProcessingStage('Preparing your order...');

    try {
      if (selectedPayment === 'cod') {
        await handleCODOrder();
      } else if (selectedPayment === 'card') {
        await handleCardOrder();
      }
    } catch (error) {
      console.error('Order placement error:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-gray-900 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Your Order
            </h3>
            <p className="text-gray-600">{processingStage}</p>
            <p className="text-sm text-gray-500 mt-4">
              Please do not close this window
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="text-gray-900" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Items ({items.length})
                </h2>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
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

            {/* Delivery Address */}
            <DeliveryComponent onAddressChange={handleAddressChange} />

            {/* Payment Methods */}
            <PaymentComponent
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal </span>
                  <span className="font-medium text-gray-900">
                    Rs. {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shippingFee > 0 ? `Rs. ${shippingFee.toFixed(2)}` : 'Calculated at delivery'}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs. {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                className={`w-full font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group ${
                  isProcessing || items.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 hover:bg-gray-800 cursor-pointer'
                } text-white`}
                disabled={isProcessing || items.length === 0}
                onClick={handlePlaceOrder}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              {/* Security badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-3">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;