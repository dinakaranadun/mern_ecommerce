import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Download, Package, Truck, CheckCircle, Clock, PackageOpen, ChevronDown } from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusAdminMutation } from '@/store/admin/order/orderSliceApi';
import OrderDetailDialog from '@/components/admin/order/orderDetail';
import Filter from '@/components/admin/order/filter';
import { QuickStat } from '@/components/admin/order/badges';
import OrdersTable from '@/components/admin/order/table';
import { useOrderFilters } from '@/hooks/useAdminOrderFilter';
import { toast } from 'react-toastify';
import { useExportOrders } from '@/hooks/exportOrders';
import Pagination from '@/components/common/pagination';

const AdminOrders = () => {
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Fetch orders with pagination
  const { data: allOrders, isLoading, refetch } = useGetAllOrdersQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [updateOrderStatus] = useUpdateOrderStatusAdminMutation();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const { showExportMenu, setShowExportMenu, exporting, exportToCSV, exportToJSON } = useExportOrders();

  useEffect(() => {
    if (allOrders?.data) {
      setOrders(allOrders.data.orders || []);
    }
  }, [allOrders]);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    filteredOrders
  } = useOrderFilters(orders);

  // Calculate stats from ALL orders (not just filtered)
  const stats = useMemo(() => ({
    total: allOrders?.data?.pagination?.total || 0,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
  }), [orders, allOrders?.data?.pagination?.total]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setEditingStatus(null);
    
    try {
      const res = await updateOrderStatus({ 
        orderId: orderId, 
        orderStatus: newStatus 
      }).unwrap();
      
      if (res.success) {
        setOrders(orders.map(o => 
          o._id === orderId ? { ...o, orderStatus: newStatus } : o
        ));
        toast.success('Order Status Updated Successfully');
      }
    } catch (error) {
      const msg = error?.data?.message || error?.error || 'Updating Order Status Failed';
      toast.error(msg);
      console.log(error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDelete = (orderId) => {
    if (confirm('Are you sure you want to delete this order?')) {
      return;
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  if (isLoading && !orders.length) {
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
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={exporting || filteredOrders.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white border border-black rounded-xl hover:bg-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => exportToCSV(filteredOrders)}
                  disabled={exporting}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-100 transition-colors border-b border-neutral-200 disabled:opacity-50"
                >
                  <span className="text-sm font-medium">Export as CSV</span>
                </button>
                <button
                  onClick={() => exportToJSON(filteredOrders)}
                  disabled={exporting}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                >
                  <span className="text-sm font-medium">Export as JSON</span>
                </button>
              </div>
            )}
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 bg-black text-white hover:bg-neutral-900 disabled:opacity-50 rounded-xl transition-colors"
            >
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
      <Filter 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        paymentFilter={paymentFilter} 
        setPaymentFilter={setPaymentFilter} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter}
      />

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        editingStatus={editingStatus}
        setEditingStatus={setEditingStatus}
        updatingOrderId={updatingOrderId}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
        onViewDetails={setSelectedOrder}
      />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalItems={allOrders?.data?.pagination?.total || 0}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPageOptions={[12, 24, 36, 48]}
        className="border-t pt-4 mt-6"
      />

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog 
          selectedOrder={selectedOrder} 
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </div>
  );
};

export default AdminOrders;