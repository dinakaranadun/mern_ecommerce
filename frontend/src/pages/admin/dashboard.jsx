import { useState } from 'react';
import {  RefreshCw, ChevronDown } from 'lucide-react';
import { useGetOrderAnlyticsQuery } from '@/store/admin/order/orderSliceApi';
import { PaymentBadge, QuickStatCard, StatCard, StatusBadge } from '@/components/admin/dashboard/dashboardComp';
import useAnalyticsData from '@/hooks/adminDashboardData';
import StatCards from '@/components/admin/dashboard/statCards';
import { OrderStatusChart, PaymentStatusChart } from '@/components/admin/dashboard/charts';

const Dashboard = () => {
  const { isLoading, refetch } = useGetOrderAnlyticsQuery();
  const [expandedRows, setExpandedRows] = useState({});

  const { stats,  recentOrders } = useAnalyticsData();
  

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-lg text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getDisplayName = (user) => {
    if (!user) return 'Unknown';
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'Unknown';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 truncate">Analytics Dashboard</h1>
              <p className="text-sm sm:text-base text-slate-600">Complete overview of your store performance</p>
            </div>
            <button 
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/50 whitespace-nowrap text-sm sm:text-base cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 flex-shrink-0" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats Cards */}
        <StatCards/>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Order Status */}
          <OrderStatusChart/>
          {/* Payment Status */}
          <PaymentStatusChart/>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <QuickStatCard title="Orders in Progress" value={stats.processing} total={stats.totalOrders} icon="⚙️" color="purple" />
          <QuickStatCard title="Ready to Ship" value={stats.confirmed} total={stats.totalOrders} icon="📦" color="blue" />
          <QuickStatCard title="Currently Shipped" value={stats.shipped} total={stats.totalOrders} icon="🚚" color="cyan" />
          <QuickStatCard title="Successfully Delivered" value={stats.delivered} total={stats.totalOrders} icon="✅" color="green" />
          <QuickStatCard title="Pending Orders" value={stats.pending} total={stats.totalOrders} icon="⏳" color="amber" />
          <QuickStatCard title="Cancelled Orders" value={stats.cancelled} total={stats.totalOrders} icon="❌" color="red" />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">Recent Orders</h3>
            <p className="text-xs sm:text-sm text-slate-600">Latest {recentOrders.length} customer orders</p>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No orders yet</div>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 sm:px-6 font-semibold text-slate-700">Order ID</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-semibold text-slate-700">Customer</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-semibold text-slate-700 hidden md:table-cell">Email</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-semibold text-slate-700">Amount</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-semibold text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-semibold text-slate-700 hidden lg:table-cell">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={order._id} className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="py-3 px-4 sm:px-6">
                          <span className="text-xs font-mono font-semibold text-blue-600">
                            {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
                          </span>
                        </td>
                        <td className="py-3 px-4 sm:px-6">
                          <span className="text-sm font-medium text-slate-900">{getDisplayName(order.userId)}</span>
                        </td>
                        <td className="py-3 px-4 sm:px-6 hidden md:table-cell">
                          <span className="text-sm text-slate-600">{order.userId?.email || '-'}</span>
                        </td>
                        <td className="py-3 px-4 sm:px-6">
                          <span className="text-sm font-bold text-slate-900">${order.totalAmount?.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4 sm:px-6">
                          <StatusBadge status={order.orderStatus} />
                        </td>
                        <td className="py-3 px-4 sm:px-6 hidden lg:table-cell">
                          <PaymentBadge status={order.paymentStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-slate-200">
                {recentOrders.map((order) => (
                  <div key={order._id} className="p-4">
                    <button onClick={() => toggleRowExpand(order._id)} className="w-full flex items-center justify-between mb-2 hover:opacity-70">
                      <span className="font-semibold text-slate-900 text-sm">
                        {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedRows[order._id] ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-600">{getDisplayName(order.userId)}</span>
                      <span className="font-bold text-sm text-slate-900">${order.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <StatusBadge status={order.orderStatus} />
                      <PaymentBadge status={order.paymentStatus} />
                    </div>
                    {expandedRows[order._id] && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs">
                        <div><span className="text-slate-600">Email:</span> <span className="text-slate-900 font-medium">{order.userId?.email || '-'}</span></div>
                        <div><span className="text-slate-600">Date:</span> <span className="text-slate-900 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></div>
                        <div><span className="text-slate-600">Items:</span> <span className="text-slate-900 font-medium">{order.items?.length || 0} item(s)</span></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;