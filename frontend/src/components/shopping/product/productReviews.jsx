import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, ThumbsUp } from 'lucide-react';

const ProductReviews = ({ reviews }) => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold text-gray-900'>Customer Reviews</h2>
        <span className='text-sm text-gray-600'>{reviews.length} reviews</span>
      </div>

      <ScrollArea className='h-[300px] pr-4'>
        <div className='space-y-4'>
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const ReviewCard = ({ review }) => {
    
  const getInitials = (name) => {
    return name.slice(0, 1).toUpperCase();
  };

  const getRandomGradient = (name) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-green-500 to-emerald-500',
      'from-indigo-500 to-purple-500',
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className='bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300 group'>
      <div className='flex items-start gap-4'>
        <Avatar className={`w-12 h-12 bg-gradient-to-br ${getRandomGradient(review.user.userName)} border-2 border-white shadow-lg`}>
          <AvatarFallback className='bg-transparent text-white font-bold text-sm'>
            {getInitials(review.user.userName)}
          </AvatarFallback>
        </Avatar>

        <div className='flex-1 space-y-3'>
          {/* Header */}
          <div className='flex items-start justify-between gap-2'>
            <div>
              <h3 className='font-semibold text-gray-900 capitalize'>
                {review.user.userName}
              </h3>
              <div className='flex items-center gap-1 mt-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Rating Badge */}
            <div className='px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-bold'>
              {review.rating}.0
            </div>
          </div>

          {/* Comment */}
          <p className='text-gray-600 text-sm leading-relaxed'>
            {review.comment}
          </p>

          {/* Action Footer */}
          <div className='flex items-center gap-4 pt-2'>
            <button className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors group-hover:scale-105 transition-transform'>
              <ThumbsUp className='h-3.5 w-3.5' />
              <span>Helpful</span>
            </button>
            <span className='text-xs text-gray-400'>
              {new Date(review.updatedAt || Date.now()).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;