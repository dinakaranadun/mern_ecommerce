import { Eye, Trash2, Edit3, Loader2 } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge, PaymentBadge } from '@/components/admin/dashboard/dashboardComp';

const STATUS_OPTIONS = [
  'pending', 
  'confirmed', 
  'processing', 
  'shipped', 
  'delivered', 
  'cancelled'
];

const OrdersTable = ({ 
  orders, 
  editingStatus, 
  setEditingStatus,
  updatingOrderId,
  onStatusUpdate, 
  onDelete, 
  onViewDetails,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl">
      <div className="overflow-auto min-h-100">
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
            {orders.length > 0 ? (
              orders.map((order) => {
                const isUpdating = updatingOrderId === order._id;
                
                return (
                  <tr key={order._id} className="border-t border-neutral-200 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-semibold text-black">#{order.orderNumber}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-black capitalize">
                          {order.shippingAddress.fullName || 'N/A'}
                        </p>
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
                          className="flex items-center gap-1 cursor-pointer"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                              <span className="text-sm text-neutral-600">Updating...</span>
                            </div>
                          ) : (
                            <>
                              <StatusBadge status={order.orderStatus} />
                              <Edit3 className="w-3 h-3 text-neutral-600" />
                            </>
                          )}
                        </button>
                        {editingStatus === order._id && !isUpdating && (
                          <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl z-10 py-2 min-w-[140px]">
                            {STATUS_OPTIONS.map(status => (
                              <button
                                key={status}
                                onClick={() => onStatusUpdate(order._id, status)}
                                disabled={status === order.orderStatus}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 capitalize text-black transition-colors ${
                                  status === order.orderStatus ? 'bg-neutral-100 font-semibold cursor-not-allowed' : ''
                                }`}
                              >
                                {status}
                                {status === order.orderStatus && (
                                  <span className="ml-2 text-xs text-neutral-500">(current)</span>
                                )}
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
                          onClick={() => onViewDetails(order)}
                          className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-200 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(order._id)}
                          className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-200 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan='8' className="py-8 px-6 text-center text-neutral-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
    </div>
  );
};

export default OrdersTable;