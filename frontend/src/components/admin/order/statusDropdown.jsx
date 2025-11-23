const STATUS_OPTIONS = [
  'pending', 
  'confirmed', 
  'processing', 
  'shipped', 
  'delivered', 
  'cancelled'
];

const StatusDropdown = ({ orderId, onStatusUpdate }) => {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl z-10 py-2 min-w-[140px]">
      {STATUS_OPTIONS.map(status => (
        <button
          key={status}
          onClick={() => onStatusUpdate(orderId, status)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 capitalize text-black"
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default StatusDropdown;