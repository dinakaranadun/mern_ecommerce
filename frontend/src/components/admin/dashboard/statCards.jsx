import useAnalyticsData from "@/hooks/adminDashboardData"
import { StatCard } from "./dashboardComp"
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

const StatCards = () => {

 const{stats} = useAnalyticsData();
  
 return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                title="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                icon={<ShoppingCart className="w-6 h-6" />}
                gradient="from-blue-500 to-blue-600"
              />
              <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                icon={<DollarSign className="w-6 h-6" />}
                gradient="from-green-500 to-green-600"
                subtitle={`Completed: $${stats.completedRevenue.toLocaleString()}`}
              />
              <StatCard
                title="Avg Order Value"
                value={`$${stats.averageOrderValue.toLocaleString()}`}
                icon={<TrendingUp className="w-6 h-6" />}
                gradient="from-purple-500 to-purple-600"
              />
              <StatCard
                title="Completed Payments"
                value={stats.completedPayments.toLocaleString()}
                icon={<Package className="w-6 h-6" />}
                gradient="from-cyan-500 to-cyan-600"
                subtitle={`of ${stats.totalOrders} orders`}
              />
    </div>
  )
}

export default StatCards
