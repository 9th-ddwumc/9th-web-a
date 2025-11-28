export const LoadingSpinner = () => {
    return (
        <div className="size-12 animate-spin rounded-full border-4 border-t-transparent border-black" role="status">
            <span className="sr-only">로딩 중...</span>
        </div>
    );
};