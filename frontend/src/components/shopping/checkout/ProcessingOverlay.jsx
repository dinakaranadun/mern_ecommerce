import { Loader2 } from 'lucide-react';

 const ProcessingOverlay = ({ isVisible, stage }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl border border-gray-200">
        <Loader2 className="w-16 h-16 animate-spin text-gray-900 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Processing Your Order
        </h3>
        <p className="text-gray-600">{stage}</p>
        <p className="text-sm text-gray-500 mt-4">
          Please do not close this window
        </p>
      </div>
    </div>
  );
};

export default ProcessingOverlay;