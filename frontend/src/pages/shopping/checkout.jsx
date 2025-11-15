
import CartItemsList from '@/components/shopping/checkout/CartItemsList';
import DeliveryComponent from '@/components/shopping/checkout/deliveryComponent';
import OrderSummary from '@/components/shopping/checkout/orderSummary';
import PaymentComponent from '@/components/shopping/checkout/paymentComponent';
import ProcessingOverlay from '@/components/shopping/checkout/ProcessingOverlay';
import { useCheckout } from '@/hooks/useCheckout';

const ShoppingCheckout = () => {
  const {
    items,
    selectedPayment,
    deliveryData,
    isProcessing,
    processingStage,
    shippingFee,
    subtotal,
    totalAmount,
    setSelectedPayment,
    setDeliveryData,
    handlePlaceOrder,
  } = useCheckout();

  return (
    <div className="min-h-screen bg-gray-50">
      <ProcessingOverlay isVisible={isProcessing} stage={processingStage} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CartItemsList items={items} />
            <DeliveryComponent onAddressChange={setDeliveryData} />
            <PaymentComponent
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
              totalAmount={totalAmount}
              isProcessing={isProcessing}
              itemCount={items.length}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;