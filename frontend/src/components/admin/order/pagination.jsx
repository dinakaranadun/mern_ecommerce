import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ ordersCount, currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    onPageChange(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    onPageChange(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200">
      <p className="text-sm text-neutral-600">
        Showing <span className="font-medium text-black">{ordersCount}</span> orders
      </p>
      <div className="flex items-center gap-2">
        <button 
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-2 bg-neutral-200 rounded-lg hover:bg-neutral-300 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === i + 1
                ? 'bg-black text-white'
                : 'bg-neutral-200 hover:bg-neutral-300 text-black'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-2 bg-neutral-200 rounded-lg hover:bg-neutral-300 disabled:opacity-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;