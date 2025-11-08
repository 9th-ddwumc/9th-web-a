import type { LpComment } from "../../types/lpComment";

interface CommentItemProps {
  comment: LpComment;  // Comment -> LpComment
}

function CommentItem({ comment }: CommentItemProps) {
    return (
    <div className='flex gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700'>
      <div className='w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0 overflow-hidden'>
        {comment.author?.avatar ? (
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className='w-full h-full rounded-full object-cover'
          />
        ) : (
          <span className='text-white font-bold text-lg'>
            {comment.author?.name?.charAt(0) ?? "?"}
          </span>
        )}
      </div>

      <div className='flex-1'>
        <p className='text-xs text-pink-400 font-semibold mb-1'>
          {comment.author?.name ?? "Unknown"} (ID: {comment.id})
        </p>
        <p className='text-white text-base'>{comment.content}</p>
        <p className='text-right text-xs text-gray-400 mt-2'>
          {new Date(comment.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default CommentItem;