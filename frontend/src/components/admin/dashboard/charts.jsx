import useAnalyticsData from "@/hooks/adminDashboardData"
import {BarChart,PieChart, Bar, CartesianGrid, Cell, Legend, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const OrderStatusChart = () => {
  
  const{chartData} = useAnalyticsData();  

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-8">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">Order Status</h3>
              <p className="text-xs sm:text-sm text-slate-600">Current pipeline distribution</p>
            </div>
            <div className="w-full h-[280px] sm:h-[320px]">
              {chartData.orderStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.orderStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {chartData.orderStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} 
                      formatter={(value) => [value, 'Orders']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  No order data available
                </div>
              )}
            </div>
          </div>
  )
};

const PaymentStatusChart = () => {
  const{chartData} = useAnalyticsData();  

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-8">
        <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">Payment Status</h3>
              <p className="text-xs sm:text-sm text-slate-600">Transaction overview</p>
            </div>
            <div className="w-full h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.paymentStatus} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} 
                    formatter={(value) => [value, 'Orders']}
                  />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                    {chartData.paymentStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
        </div>
    </div>
  )
}
export{PaymentStatusChart,OrderStatusChart}
