import { Star } from 'lucide-react';

const Rating = ({ item, setSelectedItem }) => {
  const userReview = item.productId.userReview; 
  return (
    <div className="pt-3 border-t border-gray-200">
      {userReview ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= userReview.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              Your rating
            </span>
          </div>
          {userReview.comment && (
            <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
              {userReview.comment}
            </p>
          )}
          <button
            onClick={() => setSelectedItem(item)}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Edit Review
          </button>
        </div>
      ) : (
        <button
          onClick={() => setSelectedItem(item)}
          className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
        >
          <Star className="w-4 h-4" />
          Rate this product
        </button>
      )}
    </div>
  );
};

export default Rating;
