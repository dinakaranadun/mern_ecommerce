import { useState, useMemo } from 'react';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Truck, 
  Home,
  XCircle,
  Search,
  Filter,
  Eye,
  ChevronRight,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { useGetOrdersQuery, useGetOrderStatQuery } from '@/store/user/orderSliceApi';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';


const Orders = () => {
  const navigate = useNavigate();
  const { data: orderStatsData, isLoading: isLoadingStats } = useGetOrderStatQuery();
  const { data: allOrdersData, isLoading: isLoadingOrders } = useGetOrdersQuery();
  
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = orderStatsData?.data;
 
  
  const isLoading = isLoadingStats || isLoadingOrders;
  
  const orders = useMemo(() => {
    return allOrdersData?.data?.orders || [];
    }, [allOrdersData?.data?.orders]);

  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    return orders.filter(order => {
      const matchesStatus = selectedStatus === 'all' || order.orderStatus === selectedStatus;
      const matchesSearch = order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            order.items?.some(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [orders, selectedStatus, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<ShoppingBag className="w-6 h-6" />}
              title="Total Orders"
              value={stats.totalOrders || 0}
              color="blue"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Total Spent"
              value={`Rs. ${(stats.totalSpent || 0).toLocaleString()}`}
              color="green"
            />
            <StatCard
              icon={<Truck className="w-6 h-6" />}
              title="In Transit"
              value={stats.shipped || 0}
              color="purple"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Delivered"
              value={stats.delivered || 0}
              color="gray"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {stats ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatusBadge label="Pending" count={stats.pending || 0} color="yellow" />
              <StatusBadge label="Confirmed" count={stats.confirmed || 0} color="blue" />
              <StatusBadge label="Processing" count={stats.processing || 0} color="purple" />
              <StatusBadge label="Shipped" count={stats.shipped || 0} color="indigo" />
              <StatusBadge label="Delivered" count={stats.delivered || 0} color="green" />
              <StatusBadge label="Cancelled" count={stats.cancelled || 0} color="red" />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[180px]"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {!orders || orders.length === 0 ? (
          <EmptyState searchQuery={searchQuery} selectedStatus={selectedStatus} />
        ) : filteredOrders.length === 0 ? (
          <EmptyState searchQuery={searchQuery} selectedStatus={selectedStatus} isFiltered />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-20" />
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ label, count, color }) => {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    red: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]} text-center`}>
      <p className="text-2xl font-bold mb-1">{count}</p>
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
};

const EmptyState = ({ searchQuery, selectedStatus, isFiltered = false }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      {isFiltered ? 'No orders found' : 'No orders yet'}
    </h3>
    <p className="text-gray-600">
      {searchQuery || selectedStatus !== 'all' 
        ? 'Try adjusting your filters' 
        : 'Start shopping to see your orders here'}
    </p>
  </div>
);

const OrderCard = ({ order, navigate }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: { icon: <Clock className="w-4 h-4" />, label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      confirmed: { icon: <CheckCircle className="w-4 h-4" />, label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      processing: { icon: <Package className="w-4 h-4" />, label: 'Processing', color: 'bg-purple-100 text-purple-700 border-purple-200' },
      shipped: { icon: <Truck className="w-4 h-4" />, label: 'Shipped', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      delivered: { icon: <Home className="w-4 h-4" />, label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200' },
      cancelled: { icon: <XCircle className="w-4 h-4" />, label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(order?.orderStatus);
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'N/A';

  const firstItem = order?.items?.[0];
  const itemsCount = order?.items?.length || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {firstItem && (
            <div className="hidden sm:block">
              <img
                src={firstItem.image}
                alt={firstItem.name}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64?text=Product';
                }}
              />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">Order #{order?.orderNumber || 'N/A'}</h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>
            <p className="text-sm text-gray-600">{orderDate}</p>
            <p className="text-sm text-gray-500 mt-1">
              {itemsCount} item{itemsCount > 1 ? 's' : ''} • {order?.paymentMethod === 'card' ? 'Card Payment' : 'COD'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">
              Rs. {order?.totalAmount?.toFixed(2) || '0.00'}
            </p>
          </div>
          <Button 
            onClick={() => navigate(`/shop/order/${order._id}/details`)}
            variant='outline'
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Order Items */}
      {itemsCount > 1 && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Items in this order:</p>
          <div className="flex flex-wrap gap-2">
            {order.items.slice(0, 3).map((item, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {item.name} x{item.quantity}
              </span>
            ))}
            {itemsCount > 3 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                +{itemsCount - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;