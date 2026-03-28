import { HiStar, HiOutlineStar } from 'react-icons/hi';

const StarRating = ({ rating, size = 'sm', showCount = false, count = 0 }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          star <= Math.round(rating)
            ? <HiStar key={star} className={`${sizes[size]} text-amber-400`} />
            : <HiOutlineStar key={star} className={`${sizes[size]} text-dark-300`} />
        ))}
      </div>
      {showCount && <span className="text-sm text-dark-400 ml-1">({count})</span>}
    </div>
  );
};

export default StarRating;
