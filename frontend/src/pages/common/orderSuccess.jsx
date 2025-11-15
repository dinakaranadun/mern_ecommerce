import { useEffect, useState } from 'react';
import { CheckCircle, Package, Truck, MapPin, CreditCard, ArrowRight, Download, Home, Loader2 } from 'lucide-react';
import { useGetOrderQuery } from '@/store/user/orderSliceApi';
import { useParams, useNavigate } from 'react-router';
import useInvoiceDownload from '@/hooks/orderInvoice';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const { data: orderData, isLoading, isError } = useGetOrderQuery(id);
  const order = orderData?.data;
  const {downloadAsPDF,isGenerating} = useInvoiceDownload();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find this order. Please check your order number.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const handleContinueShopping = () => {
    navigate('/shop/listing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][Math.floor(Math.random() * 4)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-scale-in">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Order Confirmed! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase
          </p>
          <p className="text-gray-500">
            Order #{order.orderNumber} • {new Date(order.createdAt || order.confirmedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-gray-300" />
            
            <div className="space-y-8">
              <TimelineStep
                icon={<CheckCircle className="w-5 h-5" />}
                title="Order Confirmed"
                description="Your order has been received and confirmed"
                status="completed"
              />
              <TimelineStep
                icon={<Package className="w-5 h-5" />}
                title="Processing"
                description="We're preparing your items for shipment"
                status="current"
              />
              <TimelineStep
                icon={<Truck className="w-5 h-5" />}
                title="Shipped"
                description="Your order will be on its way soon"
                status="pending"
              />
              <TimelineStep
                icon={<Home className="w-5 h-5" />}
                title="Delivered"
                description="You will receive your order within 7 working days"
                status="pending"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
            </div>
            <div className="text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingAddress?.fullName || order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.addressLine1 || order.shippingAddress?.line1}</p>
              {(order.shippingAddress?.addressLine2 || order.shippingAddress?.line2) && (
                <p>{order.shippingAddress?.addressLine2 || order.shippingAddress?.line2}</p>
              )}
              <p>{order.shippingAddress?.city} {order.shippingAddress?.postalCode}</p>
              <p className="text-sm pt-2">{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Payment Method</span>
                <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'completed' || order.paymentMethod === 'card'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentMethod === 'card' ? 'Paid' : 'Cash on Delivery'}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Order ID</span>
                <span className="font-mono text-sm text-gray-900">{order.orderNumber}</span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between text-gray-600">
                  <span>Transaction ID</span>
                  <span className="font-mono text-xs text-gray-900 break-all">{order.transactionId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h3>
          
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={item._id || index} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80?text=Product';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">Rs. {item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">Rs. {order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">Rs. {order.shippingFee?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>Rs. {order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={() => downloadAsPDF(order)}
            disabled={isGenerating}
            className="flex-1 bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center hover:cursor-pointer gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isGenerating ? (
                <>
                <Loader2 className="animate-spin" size={20} />
                Generating...
                </>
            ) : (
                <>
                <Download size={20} />
                Download Invoice
                </>
            )}
            </button>
          <button
            onClick={handleContinueShopping}
            className="flex-1 bg-white text-gray-900 font-semibold py-4 px-6 rounded-xl border-2 border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            Continue Shopping
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-gray-600 mb-2">
            Need help with your order?
          </p>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Contact Customer Support
          </a>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slide-up {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float linear forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out backwards;
        }
      `}</style>
    </div>
  );
};

const TimelineStep = ({ icon, title, description, status }) => {
  const statusStyles = {
    completed: 'bg-green-500 text-white',
    current: 'bg-blue-500 text-white animate-pulse',
    pending: 'bg-gray-200 text-gray-400'
  };

  return (
    <div className="relative flex gap-4 pl-12">
      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${statusStyles[status]} shadow-lg`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default OrderSuccess;