import { useState, useEffect } from 'react';
import { Search, Eye, Trash2, RefreshCw, ChevronLeft, ChevronRight, Download, X, Package, Truck, CheckCircle, Clock, CreditCard, MapPin, User, Mail, Phone, Calendar, Edit3, PackageOpen } from 'lucide-react';
import { useGetAllOrdersQuery } from '@/store/admin/order/orderSliceApi';

const AdminOrders = () => {
  const { data: allOrders, isLoading, refetch } = useGetAllOrdersQuery();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (allOrders?.data) {
      setOrders(allOrders.data.orders || []);
      setTotalPages(allOrders.data.totalPages || 1);
      setCurrentPage(allOrders.data.currentPage || 1);
    }
    setLoading(isLoading);
  }, [allOrders, isLoading]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
    const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    setEditingStatus(null);
  };

  const handleDelete = (orderId) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(o => o._id !== orderId));
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-lg text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white text-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Orders Management</h1>
            <p className="text-neutral-600 mt-1">Manage and track all customer orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white border border-black rounded-xl hover:bg-neutral-900 transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 bg-black text-white hover:bg-neutral-900 disabled:opacity-50 rounded-xl transition-colors">
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <QuickStat label="Total Orders" value={stats.total} color='blue' icon={<PackageOpen />} />
        <QuickStat label="Pending" value={stats.pending} color='violet' icon={<Clock />} />
        <QuickStat label="Processing" value={stats.processing} color='cyan' icon={<Package />} />
        <QuickStat label="Shipped" value={stats.shipped} color='violet' icon={<Truck />} />
        <QuickStat label="Delivered" value={stats.delivered} color='emerald' icon={<CheckCircle />} />
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-neutral-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-black"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-black"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-black">Order</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-black">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-black">Items</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-black">Total</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-black">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-black">Payment</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-black">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t border-neutral-200 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-semibold text-black">#{order.orderNumber}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-black capitalize">{order.shippingAddress.fullName || 'N/A'}</p>
                        <p className="text-xs text-neutral-600">{order.userId.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-neutral-700">{order.items.length} item(s)</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-black">Rs {order.totalAmount}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative">
                        <button
                          onClick={() => setEditingStatus(editingStatus === order._id ? null : order._id)}
                          className="flex items-center gap-1"
                        >
                          <StatusBadge status={order.orderStatus} />
                          <Edit3 className="w-3 h-3 text-neutral-600" />
                        </button>
                        {editingStatus === order._id && (
                          <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl z-10 py-2 min-w-[140px]">
                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                              <button
                                key={s}
                                onClick={() => handleStatusUpdate(order._id, s)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 capitalize text-black"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <PaymentBadge status={order.paymentStatus} />
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-200 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-200 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 px-6 text-center text-neutral-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            Showing <span className="font-medium text-black">{filteredOrders.length}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-neutral-200 rounded-lg hover:bg-neutral-300 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-black text-white'
                    : 'bg-neutral-200 hover:bg-neutral-300 text-black'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-neutral-200 rounded-lg hover:bg-neutral-300 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-black">Order Details</h2>
                <p className="text-neutral-600 font-medium">#{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Row */}
              <div className="flex flex-wrap gap-3 px-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 rounded-xl">
                  <Package className="w-5 h-5 text-neutral-600" />
                  <div>
                    <p className="text-xs text-neutral-600 capitalize font-semibold">Order Status: <span className='font-extrabold'>{selectedOrder.orderStatus}</span></p>
                    
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 rounded-xl">
                  <CreditCard className="w-5 h-5 text-neutral-600" />
                  <div>
                    <p className="text-xs text-neutral-600 capitalize font-semibold">Payment: <span className='font-extrabold'>{selectedOrder.paymentStatus}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-neutral-600" />
                  <div>
                    <p className="text-xs text-neutral-600">Order Date: <span className='font-extrabold'>{new Date(selectedOrder.createdAt).toLocaleString()}</span></p>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-100 rounded-xl">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-black">
                    <User className="w-4 h-4 text-neutral-600" /> Customer Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-black capitalize"><User className="w-4 h-4 text-neutral-600" /> {selectedOrder.shippingAddress.fullName || 'N/A'}</p>
                    <p className="flex items-center gap-2 text-black"><Mail className="w-4 h-4 text-neutral-600" /> {selectedOrder.userId.email || 'N/A'}</p>
                    <p className="flex items-center gap-2 text-black"><Phone className="w-4 h-4 text-neutral-600" /> {selectedOrder.shippingAddress.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="p-4 bg-neutral-100 rounded-xl">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-black">
                    <MapPin className="w-4 h-4 text-neutral-600" /> Shipping Address
                  </h4>
                  <div className="text-sm text-black">
                    <p className='capitalize'>{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state || selectedOrder.shippingAddress.postalCode} </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 bg-neutral-100 rounded-xl">
                <h4 className="font-semibold mb-3 text-black">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-300 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-300 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-neutral-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-black">{item.name || 'Product'}</p>
                          <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-black">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-neutral-100 rounded-xl">
                <h4 className="font-semibold mb-3 text-black">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-black"><span className="text-neutral-600">Subtotal</span><span>Rs. {selectedOrder.subtotal}</span></div>
                  <div className="flex justify-between text-black"><span className="text-neutral-600">Shipping</span><span>Rs. {selectedOrder.shippingFee}</span></div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between text-black"><span className="text-neutral-600">Tax</span><span>Rs. {selectedOrder.tax}</span></div>
                  )}
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-black"><span className="text-neutral-600">Discount</span><span>-Rs. {selectedOrder.discount}</span></div>
                  )}
                  <div className="flex justify-between text-black"><span className="text-neutral-600">Payment Method</span><span className="uppercase">{selectedOrder.paymentMethod}</span></div>
                  {selectedOrder.trackingNumber && (
                    <div className="flex justify-between text-black"><span className="text-neutral-600">Tracking</span><span className="text-neutral-700">{selectedOrder.trackingNumber}</span></div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-neutral-300 text-lg font-bold text-black">
                    <span>Total</span>
                    <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QuickStat = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400',
    amber: 'bg-amber-500/10 text-amber-400',
    violet: 'bg-violet-500/10 text-violet-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
  };
  
  return (
    <div className={`${colors[color]} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${colors[color]}`}>{icon}</div>
        <p className="text-xs font-semibold">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-500/50 text-amber-900 border-amber-500',
    confirmed: 'bg-blue-500/50 text-blue-900 border-blue-500',
    processing: 'bg-violet-500/50 text-violet-900 border-violet-500',
    shipped: 'bg-cyan-500/50 text-cyan-900 border-cyan-500',
    delivered: 'bg-emerald-500/50 text-emerald-900 border-emerald-500',
    cancelled: 'bg-red-500/50 text-red-900 border-red-500',
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]} capitalize`}>{status}</span>;
};

const PaymentBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-500/50 text-amber-800 border-amber-800',
    completed: 'bg-emerald-500/50 text-emerald-800 border-emerald-800',
    failed: 'bg-red-500/50 text-red-800 border-red-800',
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]} capitalize`}>{status}</span>;
};

export default AdminOrders;