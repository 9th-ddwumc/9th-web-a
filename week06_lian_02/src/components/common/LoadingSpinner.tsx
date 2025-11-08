const LoadingSpinner = () => {
  return (
    <div className="p-8 flex items-center justify-center mt-40">
      <div className="w-16 h-16 border-4 border-gray-700 border-t-pink-600 rounded-full animate-spin" />
    </div>
  );
};

export default LoadingSpinner;