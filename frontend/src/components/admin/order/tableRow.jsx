import { Eye, Trash2, Edit3 } from 'lucide-react';
import { StatusBadge, PaymentBadge } from '@/components/admin/dashboard/dashboardComp';
import StatusDropdown from './statusDropdown';

const OrderTableRow = ({ 
  order, 
  editingStatus, 
  setEditingStatus, 
  onStatusUpdate, 
  onDelete, 
  onViewDetails 
}) => {
  return (
    <tr className="border-t border-neutral-200 hover:bg-neutral-50 transition-colors">
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
          >
            <StatusBadge status={order.orderStatus} />
            <Edit3 className="w-3 h-3 text-neutral-600" />
          </button>
          {editingStatus === order._id && (
            <StatusDropdown
              orderId={order._id}
              onStatusUpdate={onStatusUpdate}
            />
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
};

export default OrderTableRow;