import { useCreateOrderMutation, useUpdateOrderStatusMutation } from '@/store/user/orderSliceApi';
import { useCreatePaymentIntentMutation } from '@/store/user/paymentSliceAPI';
import { useClearCartMutation } from '@/store/user/userCartsliceApi';
import { CardNumberElement } from "@stripe/react-stripe-js";
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const CheckoutActions = ({
  items,
  deliveryData,
  selectedPayment,
  subtotal,
  shippingFee,
  totalAmount,
  setProcessingStage,
  stripe,
  elements
}) => {
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [addOrder] = useCreateOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [clearCart] = useClearCartMutation();
  const navigate = useNavigate();

  // Validate card  before processing
  const validateCardDetails = async () => {
    if (!stripe || !elements) {
      toast.error('Payment system is not ready. Please wait.');
      return false;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) {
      toast.error('Card details not found. Please refresh and try again.');
      return false;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
        billing_details: {
          name: deliveryData.address.name,
          phone: deliveryData.address.phone,
          address: {
            line1: deliveryData.address.line1,
            line2: deliveryData.address.line2,
            city: deliveryData.address.city,
            postal_code: deliveryData.address.zipCode,
          }
        }
      });

      if (error) {
        //  error messages based on error type
        if (error.code === 'incomplete_number') {
          toast.error('Please enter a complete card number');
        } else if (error.code === 'incomplete_expiry') {
          toast.error('Please enter a valid expiry date');
        } else if (error.code === 'incomplete_cvc') {
          toast.error('Please enter a valid CVC');
        } else if (error.code === 'invalid_number') {
          toast.error('Invalid card number');
        } else if (error.code === 'invalid_expiry_year_past') {
          toast.error('Card has expired');
        } else {
          toast.error(error.message || 'Invalid card details');
        }
        return false;
      }

      return paymentMethod;
    } catch (error) {
      console.error('Card validation error:', error);
      toast.error('Failed to validate card details');
      return false;
    }
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
        name: deliveryData.address.name,
        fullName: deliveryData.address.name,
        addressLine1: deliveryData.address.line1,
        addressLine2: deliveryData.address.line2 || '',
        city: deliveryData.address.city,
        state: deliveryData.address.state,
        postalCode: deliveryData.address.zipCode,
        country: deliveryData.address.country,
        phone: deliveryData.address.phone
      },
      paymentMethod: selectedPayment,
      subtotal,
      shippingFee,
      totalAmount
    };
  };

  const handleCardPayment = async (order, paymentMethod) => {
    if (!stripe || !elements) {
      throw new Error('Payment system not ready');
    }

    try {
      setProcessingStage('Processing payment...');

      // Create payment intent
      const response = await createPaymentIntent({
        amount: totalAmount,
        orderId: order._id,
        currency: 'lkr'
      }).unwrap();

      const clientSecret = response.clientSecret;

      // Confirm card payment using the validated payment method
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id
        }
      );

      if (error) {
        throw new Error(error.message || 'Payment failed');
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
      await clearCart().unwrap();

      toast.success('Order placed successfully!');
      navigate(`/shop/order-success/${order.data._id}`);
    } catch (error) {
      console.error('COD order error:', error);
      toast.error('Failed to place order. Please try again.');
      throw error;
    }
  };

  const handleCardOrder = async () => {
    let orderId = null;

    try {
      // CRITICAL: Validate card details BEFORE creating order
      setProcessingStage('Validating card details...');
      const paymentMethod = await validateCardDetails();
      
      if (!paymentMethod) {
        // Validation failed, error message already shown
        return;
      }

      // Only create order after card validation succeeds
      setProcessingStage('Creating your order...');
      const orderData = createOrderData();
      const order = await addOrder({
        ...orderData,
        paymentStatus: 'pending',
        orderStatus: 'pending'
      }).unwrap();

      orderId = order.data._id;

      // Process payment with validated payment method
      const paymentIntent = await handleCardPayment(order.data, paymentMethod);

      if (paymentIntent.status === 'succeeded') {
        setProcessingStage('Confirming your order...');
        await updateOrderStatus({
          id: orderId,
          paymentStatus: 'completed',
          transactionId: paymentIntent.id,
          orderStatus: 'confirmed'
        }).unwrap();

        setProcessingStage('Clearing cart...');
        const res = await clearCart().unwrap();
        if (res.success) {
          console.log('Cart cleared');
        }

        toast.success('Payment successful! Order confirmed.');
        navigate(`/shop/order-success/${orderId}`);

      } else if (paymentIntent.status === 'requires_action') {
        // Handle 3D Secure or other authentication
        setProcessingStage('Additional authentication required...');
        
        const { error: confirmError } = await stripe.handleCardAction(
          paymentIntent.client_secret
        );

        if (confirmError) {
          throw new Error(confirmError.message);
        }

        // Re-check payment status after authentication
        toast.info('Please complete the authentication');
        
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

  return { handleCODOrder, handleCardOrder };
};

export default CheckoutActions;