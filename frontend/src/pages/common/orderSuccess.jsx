import { useEffect, useState } from 'react';
import { CheckCircle, Package, Truck, MapPin, Calendar, CreditCard, ArrowRight, Download, Home } from 'lucide-react';


const mockOrderData = {
  orderId: "ORD-2024-12345",
  orderNumber: "12345",
  date: "November 15, 2024",
  estimatedDelivery: "November 18-20, 2024",
  status: "confirmed",
  paymentMethod: "Credit Card",
  paymentStatus: "paid",
  total: 15750.00,
  subtotal: 14500.00,
  shipping: 1250.00,
  items: [
    {
      id: 1,
      name: "Wireless Headphones Pro",
      quantity: 1,
      price: 8500.00,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Smart Watch Series 5",
      quantity: 1,
      price: 6000.00,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
    }
  ],
  shippingAddress: {
    name: "John Doe",
    line1: "123 Main Street",
    line2: "Apt 4B",
    city: "Colombo",
    postalCode: "00100",
    phone: "+94 77 123 4567"
  }
};

const OrderSuccess = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [order] = useState(mockOrderData);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
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
        {/* Success Header */}
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
            Order #{order.orderNumber} • {order.date}
          </p>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
          
          <div className="relative">
            {/* Timeline line */}
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
                description={`Estimated delivery: ${order.estimatedDelivery}`}
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
              <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
              <p className="text-sm pt-2">{order.shippingAddress.phone}</p>
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
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Paid
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Transaction ID</span>
                <span className="font-mono text-sm text-gray-900">TXN-{order.orderNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h3>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
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
              <span className="font-medium text-gray-900">Rs. {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">Rs. {order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>Rs. {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <button className="flex-1 bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group">
            <Download size={20} />
            Download Invoice
          </button>
          <button className="flex-1 bg-white text-gray-900 font-semibold py-4 px-6 rounded-xl border-2 border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group">
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