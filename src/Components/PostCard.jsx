import { useState } from "react";
import { FaHeart, FaComment, FaUser, FaTrash, FaSpinner, FaPaperPlane } from "react-icons/fa";

const PostCard = ({ post, currentUser, onDelete, onLike, onComment, onDeleteComment }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const actualCommentsCount = post.comments?.length || post.commentsCount || 0;
  const actualLikesCount = post.likes?.length || post.likesCount || 0;

  const getAuthorName = () => {
    if (post.author?.name) return post.author.name;
    if (post.author?.email) return post.author.email.split('@')[0];
    if (typeof post.author === 'string') {
      const myId = currentUser?._id || currentUser?.id;
      if (myId && post.author === myId) {
        return currentUser?.name || currentUser?.email?.split('@')[0] || "You";
      }
      return "User";
    }
    if (post.user?.name) return post.user.name;
    if (post.user?.email) return post.user.email.split('@')[0];
    if (isOwner) return currentUser?.name || currentUser?.email?.split('@')[0] || "You";
    return "User";
  };

  const getAuthorEmail = () => {
    if (post.author?.email) return post.author.email;
    if (post.user?.email) return post.user.email;
    return "";
  };

  const getAuthorAvatar = () => {
    if (post.author?.profileImage) return post.author.profileImage;
    if (post.user?.profileImage) return post.user.profileImage;
    return null;
  };

  const isOwner = 
    currentUser?._id === post.author || 
    currentUser?.id === post.author ||
    currentUser?._id === post.author?._id || 
    currentUser?.id === post.author?.id ||
    currentUser?.email === post.author?.email;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(post._id, liked);
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    setIsLiking(false);
  };

  const handleDeleteClick = () => {
    onDelete(post._id);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsCommenting(true);
    await onComment(post._id, commentText.trim());
    setCommentText("");
    setIsCommenting(false);
  };

  const handleDeleteCommentClick = async (commentId) => {
    setDeletingCommentId(commentId);
    await onDeleteComment(post._id, commentId);
    setDeletingCommentId(null);
  };

  const canDeleteComment = (comment) => {
    const commentUserId = comment.user?._id || comment.user?.id;
    const myId = currentUser?._id || currentUser?.id;
    
    if (commentUserId && commentUserId === myId) return true;
    if (isOwner) return true;
    
    return false;
  };

  const formatDate = (date) => {
    if (!date) return "Just now";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getCommentAuthorName = (comment) => {
    if (comment.user?.name) return comment.user.name;
    if (comment.user?.email) return comment.user.email.split('@')[0];
    if (comment.name) return comment.name;
    if (currentUser && comment.user?._id === currentUser._id) {
      return currentUser.name || currentUser.email?.split('@')[0] || "You";
    }
    return "User";
  };

  const authorName = getAuthorName();
  const authorEmail = getAuthorEmail();
  const authorAvatar = getAuthorAvatar();

  return (
    <article className="bg-[#081226] border border-white/[0.08] rounded-[28px] p-6 hover:border-white/20 transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.04)]">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10 flex items-center justify-center bg-[#0B1730]">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
          ) : (
            <FaUser className="text-[#3B82F6] text-lg" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-semibold text-sm">{authorName}</h3>
            <span className="text-[#64748B] text-xs">·</span>
            <span className="text-[#64748B] text-xs">{formatDate(post.createdAt)}</span>
          </div>
          {authorEmail && (
            <p className="text-[#94A3B8] text-xs mt-0.5">{authorEmail}</p>
          )}
        </div>
        {isOwner && (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="text-[#64748B] hover:text-red-400 transition-colors p-1"
          >
            {isDeleting ? <FaSpinner className="animate-spin" size={14} /> : <FaTrash size={14} />}
          </button>
        )}
      </div>

      <h4 className="text-white font-semibold text-base sm:text-lg mb-2 leading-snug">
        {post.title}
      </h4>

      <p className="text-[#94A3B8] text-sm leading-relaxed mb-5 whitespace-pre-line">
        {post.content}
      </p>

      <div className="border-t border-white/10 mb-4"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-2 text-sm transition-all duration-300 ${liked ? "text-pink-400" : "text-[#64748B] hover:text-pink-400"}`}
          >
            <FaHeart size={16} className={liked ? "fill-current" : ""} />
            <span>{actualLikesCount} Likes</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] text-sm transition-all duration-300"
          >
            <FaComment size={16} />
            <span>{actualCommentsCount} Comments</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10">
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {post.comments.map((comment, index) => {
                const commentId = comment._id || comment.id;
                const isDeletingThis = deletingCommentId === commentId;
                
                return (
                  <div key={commentId || index} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10 flex items-center justify-center bg-[#0B1730]">
                      <FaUser className="text-[#3B82F6] text-xs" />
                    </div>
                    <div className="flex-1 bg-[#0B1730] rounded-xl px-4 py-2 relative">
                      <div className="flex items-center justify-between">
                        <p className="text-white text-xs font-medium">
                          {getCommentAuthorName(comment)}
                        </p>
                        {canDeleteComment(comment) && (
                          <button
                            onClick={() => handleDeleteCommentClick(commentId)}
                            disabled={isDeletingThis}
                            className="text-[#64748B] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            {isDeletingThis ? (
                              <FaSpinner className="animate-spin" size={10} />
                            ) : (
                              <FaTrash size={10} />
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-[#94A3B8] text-sm mt-0.5">{comment.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="flex items-center gap-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-[#0B1730] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] transition-all duration-300"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isCommenting}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white hover:brightness-110 transition-all duration-300 disabled:opacity-40"
            >
              {isCommenting ? <FaSpinner className="animate-spin" size={14} /> : <FaPaperPlane size={14} />}
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default PostCard;