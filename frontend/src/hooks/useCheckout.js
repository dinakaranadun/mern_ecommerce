import { useState, useCallback } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useGetCartQuery } from '@/store/user/userCartsliceApi';
import { useGetShippingFeeQuery } from '@/store/user/shippingFeeApi';
import CheckoutActions from '@/hooks/checkoutActions';

export const useCheckout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: cartItems } = useGetCartQuery();
  const items = cartItems?.data?.items || [];

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [deliveryData, setDeliveryData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  const { data: shippingData } = useGetShippingFeeQuery(
    deliveryData?.address?.city,
    { skip: !deliveryData?.address?.city }
  );

  const shippingFee = shippingData?.data?.baseFee || 0;

  // Calculate subtotal
  const subtotal = items.reduce((acc, item) => {
    const price = item.productId.salePrice && 
                  item.productId.salePrice < item.productId.price
      ? item.productId.salePrice
      : item.productId.price;
    return acc + price * item.quantity;
  }, 0);

  const totalAmount = subtotal + shippingFee;

  const { handleCODOrder, handleCardOrder } = CheckoutActions({
    items,
    deliveryData,
    selectedPayment,
    subtotal,
    shippingFee,
    totalAmount,
    setProcessingStage,
    stripe,
    elements,
  });

  const validateOrder = useCallback(() => {
    if (!deliveryData) {
      toast.error('Please provide delivery address');
      return false;
    }

    if (!deliveryData.address.name || deliveryData.address.name.trim() === '') {
      toast.error('Please provide recipient name');
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
  }, [deliveryData, selectedPayment, items.length, stripe, elements]);

  const handlePlaceOrder = useCallback(async () => {
    if (!validateOrder() || isProcessing) return;

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
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  }, [validateOrder, isProcessing, selectedPayment, handleCODOrder, handleCardOrder]);

  return {
    // State
    items,
    selectedPayment,
    deliveryData,
    isProcessing,
    processingStage,
    shippingFee,
    subtotal,
    totalAmount,
    // Actions
    setSelectedPayment,
    setDeliveryData,
    handlePlaceOrder,
  };
};