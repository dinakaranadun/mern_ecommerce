import { 
  MapPin, 
  Loader2,
  ArrowLeft,
  Clock,
  XCircle,
  Calendar,
  Phone,
  
} from 'lucide-react';
import { useGetOrderQuery } from '@/store/user/orderSliceApi';
import { useParams, useNavigate } from 'react-router';
import ContactSupport from '@/components/shopping/order/contactSupport';
import InvoiceDownload from '@/components/shopping/order/invoiceDownload';
import OrderTimeline from '@/components/shopping/order/orderTimeline';
import { useState } from 'react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: orderData, isLoading, isError } = useGetOrderQuery(id);

  const order = orderData?.data;

  const [statusConfig, setStatusConfig] = useState(null);
  const [orderDate, setOrderDate] = useState(null);

  const handleTimelineData = (data) => {
    if (!data) return;
    setStatusConfig(data.statusConfig);
    setOrderDate(data.orderDate);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find this order. Please check your order number.</p>
          <button
            onClick={() => navigate('/shop/order')}
            className="bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-all hover:cursor-pointer"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <button
            onClick={() => navigate('/shop/order')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Orders</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Order #{order.orderNumber}
              </h1>

              {statusConfig && orderDate && (
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{orderDate}</span>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </div>
              )}
            </div>

            <InvoiceDownload order={order} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Status Card - safe fallback */}
            <div className={`rounded-2xl border p-6 ${statusConfig?.color || "bg-gray-100"}`}>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl">
                  {statusConfig?.icon || <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {statusConfig?.label || "Status"}
                  </h3>
                  <p className="text-sm opacity-90">
                    {statusConfig?.description || "Updating order status..."}
                  </p>

                  {order.orderStatus === "shipped" && (
                    <p className="text-sm mt-2 font-medium">
                      Estimated delivery: 3–7 business days
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <OrderTimeline order={order} onDataReady={handleTimelineData} />

            {/* ITEMS */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Items ({order.items?.length || 0})
              </h2>

              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80?text=Product";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      {item.variant && (
                        <p className="text-xs text-gray-400 mt-1">{item.variant}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        Rs. {item.price?.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Rs. {(item.price * item.quantity).toFixed(2)} total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    Rs. {order.subtotal?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    Rs. {order.shippingFee?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>Rs. {order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus === "completed" ? "Paid" : "Pending"}
                    </span>
                  </div>

                  {order.transactionId && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-xs text-gray-900 text-right break-all max-w-[140px]">
                        {order.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-900" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Shipping Address
                </h3>
              </div>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress?.fullName || order.shippingAddress?.name}
                </p>
                <p>{order.shippingAddress?.addressLine1 || order.shippingAddress?.line1}</p>

                {(order.shippingAddress?.addressLine2 ||
                  order.shippingAddress?.line2) && (
                  <p>{order.shippingAddress?.addressLine2 || order.shippingAddress?.line2}</p>
                )}

                <p>
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state || ""}{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country || "Sri Lanka"}</p>

                {order.shippingAddress?.phone && (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200 mt-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{order.shippingAddress.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Help */}
            <ContactSupport />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
