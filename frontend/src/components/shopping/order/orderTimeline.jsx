import { CheckCircle, Clock, Home, Package, Truck, XCircle } from "lucide-react";
import { useEffect } from "react";

const OrderTimeline = ({order,onDataReady}) => {
        const getStatusConfig = (status) => {
        const configs = {
        pending: { 
            icon: <Clock className="w-5 h-5" />, 
            label: 'Pending', 
            color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            description: 'Your order is awaiting confirmation'
        },
        confirmed: { 
            icon: <CheckCircle className="w-5 h-5" />, 
            label: 'Confirmed', 
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            description: 'Your order has been confirmed'
        },
        processing: { 
            icon: <Package className="w-5 h-5" />, 
            label: 'Processing', 
            color: 'bg-purple-100 text-purple-700 border-purple-200',
            description: 'We are preparing your items'
        },
        shipped: { 
            icon: <Truck className="w-5 h-5" />, 
            label: 'Shipped', 
            color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            description: 'Your order is on the way'
        },
        delivered: { 
            icon: <Home className="w-5 h-5" />, 
            label: 'Delivered', 
            color: 'bg-green-100 text-green-700 border-green-200',
            description: 'Your order has been delivered'
        },
        cancelled: { 
            icon: <XCircle className="w-5 h-5" />, 
            label: 'Cancelled', 
            color: 'bg-red-100 text-red-700 border-red-200',
            description: 'This order has been cancelled'
        }
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(order?.orderStatus);
    const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'N/A';

    useEffect(() => {
        if (onDataReady) {
            onDataReady({
                statusConfig,
                orderDate,
            });
        }
    }, [order]);
  return (
     <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Timeline</h2>
                  
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                    
                    <div className="space-y-6">
                      <TimelineStep
                        icon={<CheckCircle className="w-4 h-4" />}
                        title="Order Confirmed"
                        description={orderDate}
                        status={['confirmed', 'processing', 'shipped', 'delivered'].includes(order.orderStatus) ? 'completed' : 'pending'}
                      />
                      <TimelineStep
                        icon={<Package className="w-4 h-4" />}
                        title="Processing"
                        description="Items being prepared"
                        status={['processing', 'shipped', 'delivered'].includes(order.orderStatus) ? 'completed' : 
                                order.orderStatus === 'confirmed' ? 'current' : 'pending'}
                      />
                      <TimelineStep
                        icon={<Truck className="w-4 h-4" />}
                        title="Shipped"
                        description="Out for delivery"
                        status={['shipped', 'delivered'].includes(order.orderStatus) ? 'completed' : 
                                order.orderStatus === 'processing' ? 'current' : 'pending'}
                      />
                      <TimelineStep
                        icon={<Home className="w-4 h-4" />}
                        title="Delivered"
                        description="Order completed"
                        status={order.orderStatus === 'delivered' ? 'completed' : 
                                order.orderStatus === 'shipped' ? 'current' : 'pending'}
                      />
                    </div>
                  </div>
                </div>
  )
}

const TimelineStep = ({ icon, title, description, status }) => {
  const statusStyles = {
    completed: 'bg-green-500 text-white border-green-500',
    current: 'bg-blue-500 text-white border-blue-500 animate-pulse',
    pending: 'bg-white text-gray-400 border-gray-300'
  };

  return (
    <div className="relative flex gap-4 pl-10">
      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${statusStyles[status]} transition-all`}>
        {icon}
      </div>
      <div className="flex-1 pb-2">
        <h4 className={`font-medium mb-0.5 ${status === 'pending' ? 'text-gray-500' : 'text-gray-900'}`}>
          {title}
        </h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default OrderTimeline