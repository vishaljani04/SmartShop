const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizes[size]} border-3 border-dark-200 border-t-primary-600 rounded-full animate-spin`}></div>
      {text && <p className="mt-3 text-sm text-dark-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
