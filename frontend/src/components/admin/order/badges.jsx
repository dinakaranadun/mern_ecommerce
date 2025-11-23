
const QuickStat = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    violet: 'bg-violet-100 text-violet-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    emerald: 'bg-emerald-100 text-emerald-700',
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



export{QuickStat}