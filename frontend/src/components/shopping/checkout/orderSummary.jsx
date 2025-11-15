import { CheckCircle, ChevronRight, Loader2 } from 'lucide-react';

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between text-gray-700">
    <span>{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const PlaceOrderButton = ({ isProcessing, itemCount, onClick }) => {
  const isDisabled = isProcessing || itemCount === 0;

  return (
    <button
      className={`w-full font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group ${
        isDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gray-900 hover:bg-gray-800 cursor-pointer'
      } text-white`}
      disabled={isDisabled}
      onClick={onClick}
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
  );
};

const SecurityBadge = () => (
  <div className="mt-6 pt-6 border-t border-gray-200">
    <div className="flex items-center justify-center gap-2 text-green-600 mb-3">
      <CheckCircle size={16} />
      <span className="text-sm font-medium">Secure Checkout</span>
    </div>
    <p className="text-xs text-gray-500 text-center">
      By placing your order, you agree to our Terms of Service and Privacy Policy
    </p>
  </div>
);

const OrderSummary = ({
  subtotal,
  shippingFee,
  totalAmount,
  isProcessing,
  itemCount,
  onPlaceOrder,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Order Summary
      </h2>

      <div className="space-y-3 mb-6">
        <SummaryRow label="Subtotal" value={`Rs. ${subtotal.toFixed(2)}`} />
        <SummaryRow 
          label="Shipping" 
          value={shippingFee > 0 ? `Rs. ${shippingFee.toFixed(2)}` : 'Calculated at delivery'} 
        />

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>Rs. {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <PlaceOrderButton
        isProcessing={isProcessing}
        itemCount={itemCount}
        onClick={onPlaceOrder}
      />

      <SecurityBadge />
    </div>
  );
};

export default OrderSummary;