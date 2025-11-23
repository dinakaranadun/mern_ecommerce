
const StatCard = ({ title, value, icon, gradient, subtitle }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className={`bg-gradient-to-br ${gradient} p-3 sm:p-4 rounded-lg sm:rounded-xl text-white shadow-lg flex-shrink-0`}>
        {icon}
      </div>
    </div>
    <h3 className="text-slate-600 text-xs sm:text-sm font-medium mb-1">{title}</h3>
    <p className="text-xl sm:text-3xl font-bold text-slate-900 truncate">{value}</p>
    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
  </div>
);

const QuickStatCard = ({ title, value, total, icon, color }) => {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    cyan: 'from-cyan-500 to-cyan-600',
    green: 'from-green-500 to-green-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl sm:text-3xl">{icon}</span>
        <span className={`bg-gradient-to-br ${colorClasses[color]} text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-lg font-bold shadow-lg`}>
          {value}
        </span>
      </div>
      <h4 className="text-slate-900 font-semibold text-sm mb-2">{title}</h4>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div className={`bg-gradient-to-r ${colorClasses[color]} h-full rounded-full transition-all`} style={{ width: `${percentage}%` }} />
        </div>
        <span className="text-xs sm:text-sm font-semibold text-slate-600 whitespace-nowrap">{percentage}%</span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    processing: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
    shipped: { bg: 'bg-cyan-100', text: 'text-cyan-700', dot: 'bg-cyan-500' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
  };
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`${config.bg} ${config.text} px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold capitalize inline-flex items-center gap-1.5 flex-shrink-0 `}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }) => {
  const paymentConfig = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    payed: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    failed: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
  };
  const config = paymentConfig[status] || paymentConfig.pending;

  return (
    <span className={`${config.bg} ${config.text} px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold capitalize inline-flex items-center gap-1.5 flex-shrink-0`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status === 'payed' ? 'Paid' : status}
    </span>
  );
};


export{StatCard,QuickStatCard,StatusBadge,PaymentBadge}