// components/LoadingError.tsx

interface LoadingProps {
  message?: string;
}

export const Loading = ({ message = "로딩 중..." }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
};

interface ErrorDisplayProps {
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorDisplay = ({ 
  message = "에러가 발생했습니다.", 
  error,
  onRetry,
  retryText = "다시 시도"
}: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
      <p className="text-red-500 text-lg">{message}</p>
      {error && (
        <p className="text-gray-400 text-sm">
          {error instanceof Error ? error.message : '알 수 없는 오류'}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  message?: string;
  onAction?: () => void;
  actionText?: string;
}

export const EmptyState = ({ 
  message = "데이터가 없습니다.",
  onAction,
  actionText = "홈으로 돌아가기"
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
      <p className="text-gray-400 text-lg">{message}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};