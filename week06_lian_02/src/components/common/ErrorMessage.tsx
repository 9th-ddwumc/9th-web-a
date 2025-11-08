interface ErrorMessageProps {
  onRetry: () => void;
}

const ErrorMessage = ({ onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <p className="text-white p-4">Error!</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
      >
        다시 시도
      </button>
    </div>
  );
};

export default ErrorMessage;