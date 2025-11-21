import { useGetOrderAnlyticsQuery } from "@/store/admin/order/orderSliceApi";
import { useMemo } from "react";

function useAnalyticsData() {
    const { data: analyticsData } = useGetOrderAnlyticsQuery();
    

  return useMemo(() => {
    if (!analyticsData?.data?.analytics) {
      return { stats: null, chartData: null, recentOrders: [] };
    }

    const analytics = analyticsData.data.analytics;

    const orderStatusArray = Object.entries(analytics.orderStatus || {})
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: value,
        color: {
          pending: '#f59e0b',
          confirmed: '#3b82f6',
          processing: '#8b5cf6',
          shipped: '#06b6d4',
          delivered: '#22c55e',
          cancelled: '#ef4444'
        }[key] || '#64748b'
      }))
      .filter(item => item.value > 0);

    const paymentStatusArray = Object.entries(analytics.paymentStatus || {})
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: value,
        color: {
          completed: '#22c55e',
          pending: '#f59e0b',
          failed: '#ef4444'
        }[key] || '#64748b'
      }));

    return {
      stats: {
        totalOrders: analytics.totalOrders || 0,
        totalRevenue: analytics.totalRevenue || 0,
        completedRevenue: analytics.completedRevenue || 0,
        averageOrderValue: analytics.averageOrderValue || 0,
        pending: analytics.orderStatus?.pending || 0,
        confirmed: analytics.orderStatus?.confirmed || 0,
        processing: analytics.orderStatus?.processing || 0,
        shipped: analytics.orderStatus?.shipped || 0,
        delivered: analytics.orderStatus?.delivered || 0,
        cancelled: analytics.orderStatus?.cancelled || 0,
        completedPayments: analytics.paymentStatus?.completed || 0
      },
      chartData: {
        orderStatus: orderStatusArray,
        paymentStatus: paymentStatusArray
      },
      recentOrders: analyticsData.data.recentOrders || []
    };
  }, [analyticsData]);
}

export default useAnalyticsData