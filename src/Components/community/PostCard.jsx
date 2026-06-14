import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaEllipsisH, FaEdit, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from '../../utils/dateUtils';
import CommentSection from './CommentSection';
import { toggleLike, deletePost, editPost, normalizeId, idsMatch } from '../../Services/communityService';
import { useAuth } from '../../context/AuthContext';

function AdCard({ ad }) {
  const adId = ad.id || ad._id;
  const handleClick = () => {
    if (ad.link && ad.link !== '#') window.open(ad.link, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-white/8 to-white/3 border border-amber-500/20 backdrop-blur-md hover:border-amber-500/40 transition-all duration-300">
      {ad.image && (
        <img src={ad.image} alt={ad.title} className="w-full h-40 object-cover"
          onError={e => { e.target.style.display = 'none'; }} />
      )}
      <div className="p-5 space-y-3">
        <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-full inline-block">
          Sponsored
        </span>
        <h3 className="text-white font-bold text-sm">{ad.title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed">{ad.description}</p>
        <button onClick={handleClick}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white text-xs font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
          {ad.cta || 'Learn More'}
        </button>
      </div>
    </div>
  );
}

export default function PostCard({ post, onDelete, onEdit, onUserClick, isAd = false, adData = null }) {
  const { user } = useAuth();

  // Derive IDs unconditionally
  const userId = normalizeId(user?.id || user?._id || user?.email);
  const postId = normalizeId(post?.id || post?._id);
  const authorId = normalizeId(post?.author?.id || post?.author?._id || post?.author?.email);

  const isLikedByMe = !isAd && Array.isArray(post?.likedBy)
    ? post.likedBy.some(likeId => idsMatch(likeId, userId))
    : false;

  if (isAd && adData) return <AdCard ad={adData} />;

  return (
    <PostCardInner
      post={post}
      postId={postId}
      authorId={authorId}
      isLikedByMe={isLikedByMe}
      userId={userId}
      user={user}
      onDelete={onDelete}
      onEdit={onEdit}
      onUserClick={onUserClick}
    />
  );
}

function PostCardInner({ post, postId, authorId, isLikedByMe, userId, user, onDelete, onEdit, onUserClick }) {
  const [liked, setLiked] = useState(isLikedByMe);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments || post.commentsCount || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const isOwner = !!(userId && authorId && idsMatch(userId, authorId));

  useEffect(() => {
    setLiked(isLikedByMe);
    setLikeCount(post.likes || 0);
  }, [postId, isLikedByMe, post.likes]);

  useEffect(() => {
    if (isEditing) {
      setEditTitle(post?.title || '');
      setEditContent(post?.content || '');
    }
  }, [isEditing, post?.title, post?.content]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg, type = 'error') => setToast({ msg, type });

  const handleLike = async () => {
    if (!user) { showToast('Please log in to like posts', 'info'); return; }
    if (!postId) { showToast('Invalid post'); return; }

    const prev = liked;
    setLiked(!prev);
    setLikeCount(c => prev ? Math.max(0, c - 1) : c + 1);

    try {
      const res = await toggleLike(postId, prev);
      setLikeCount(res.likes);
      setLiked(res.liked);
    } catch (err) {
      setLiked(prev);
      setLikeCount(c => prev ? c + 1 : Math.max(0, c - 1));
      showToast(err.message || 'Failed to update like');
    }
  };

  const handleDelete = async () => {
    if (!isOwner) { showToast('You can only delete your own posts'); return; }
    if (!confirm('Are you sure you want to delete this post?')) return;
    setShowMenu(false);
    setDeleting(true);
    try {
      await deletePost(postId);
      onDelete?.(postId);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`);
      setDeleting(false);
    }
  };

  const handleEdit = async () => {
    const title = editTitle.trim();
    const content = editContent.trim();
    if (!title) { showToast('Please enter a title'); return; }
    if (!content) { showToast('Please enter content'); return; }
    if (!isOwner) { showToast('You can only edit your own posts'); return; }
    if (isSaving) return;

    setIsSaving(true);
    try {
      const updatedPost = await editPost(postId, title, content);
      onEdit?.(updatedPost);
      setIsEditing(false);
      showToast('Post updated!', 'success');
    } catch (err) {
      showToast(`Edit failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (deleting) return null;

  const toastBg = toast?.type === 'success' ? 'bg-green-500/90' : toast?.type === 'info' ? 'bg-blue-500/90' : 'bg-red-500/90';

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-white/8 to-white/3 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300 hover:shadow-lg relative group">
      {/* Toast */}
      {toast && (
        <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-xs font-medium text-white ${toastBg} shadow-lg`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="p-5 pb-0 border-b border-white/5">
        <div className="flex items-start justify-between gap-3">
          <button onClick={() => onUserClick?.({ id: authorId, ...post.author })}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left flex-1">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden shadow-lg">
              {post.author?.avatar
                ? <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                : (post.author?.name?.[0] || '?').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm leading-tight truncate">{post.author?.name || 'Anonymous'}</p>
              <p className="text-slate-400 text-xs">{post.author?.role || 'Member'} · {formatDistanceToNow(post.createdAt)}</p>
            </div>
          </button>

          {isOwner && (
            <div className="relative">
              <button onClick={() => setShowMenu(m => !m)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <FaEllipsisH size={14} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-10 bg-slate-800/95 border border-white/10 rounded-lg shadow-xl z-10 py-1 min-w-[140px] backdrop-blur-sm">
                  <button onClick={() => { setIsEditing(true); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-blue-400 hover:bg-blue-500/10 text-sm transition-colors">
                    <FaEdit size={12} /> Edit
                  </button>
                  <button onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 text-sm transition-colors">
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {post.title && <p className="text-white font-semibold text-sm">{post.title}</p>}
        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-5">
          <img src={post.image} alt="Post" className="w-full max-h-96 object-cover rounded-lg"
            onError={e => { e.target.style.display = 'none'; }} />
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-4 flex items-center gap-4 border-t border-white/5 text-sm">
        <button onClick={handleLike} disabled={!user}
          className={`flex items-center gap-2 transition-all duration-200 ${liked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <span className={`transition-transform duration-200 ${liked ? 'scale-125' : ''}`}>
            {liked ? <FaHeart /> : <FaRegHeart />}
          </span>
          <span className="font-medium text-xs">{likeCount}</span>
        </button>

        <button onClick={() => setShowComments(s => !s)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
          <FaComment />
          <span className="font-medium text-xs">{commentCount}</span>
        </button>

        
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-white/5 bg-white/2">
          <CommentSection
            postId={postId}
            postAuthorId={authorId}
            onCountChange={setCommentCount}
          />
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-white font-bold text-lg">Edit Post</h3>
            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
              placeholder="Post title…" autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:bg-white/8" />
            <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
              placeholder="Post content…" rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:bg-white/8 resize-none" />
            <div className="flex gap-3">
              <button onClick={() => { setIsEditing(false); setEditTitle(''); setEditContent(''); }}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button onClick={handleEdit} disabled={!editTitle.trim() || !editContent.trim() || isSaving}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg disabled:opacity-40">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
