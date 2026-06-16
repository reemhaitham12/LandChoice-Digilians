import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaEllipsisH, FaEdit } from 'react-icons/fa';
import { formatDistanceToNow } from '../../utils/dateUtils';
import CommentSection from './CommentSection';
import { toggleLike, deletePost, editPost } from '../../Services/communityService';
import { useAuth } from '../../context/AuthContext';

export default function PostCard({ post, onDelete, onEdit, onUserClick }) {
  const { user } = useAuth();

  // Safe author extraction
  const author = post?.author || {};
  const authorName = author?.name || 'Anonymous';
  const authorRole = author?.role || 'Member';
  const authorId = author?.id || author?._id;
  const authorEmail = author?.email;

  // Current user info
  const currentUserEmail = user?.email || JSON.parse(localStorage.getItem('landchoice_user') || '{}')?.email;
  const isOwner = currentUserEmail && authorEmail && currentUserEmail.toLowerCase() === authorEmail.toLowerCase();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || '');
  const [editContent, setEditContent] = useState(post.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [isDeletingAnimation, setIsDeletingAnimation] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formattedDate = post.createdAt ? formatDistanceToNow(post.createdAt) : 'recently';

  useEffect(() => {
    if (user?.id && post?.likedBy) {
      const userLiked = post.likedBy.some(id => id === user.id);
      setLiked(userLiked);
    }
  }, [user, post]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (msg, type = 'error') => setToast({ msg, type });

  const handleLike = async () => {
    if (!user) {
      showToast('Please log in to like posts', 'info');
      return;
    }
    const prev = liked;
    setLiked(!prev);
    setLikeCount(c => prev ? Math.max(0, c - 1) : c + 1);
    try {
      const res = await toggleLike(post.id, prev);
      setLikeCount(res.likes);
      setLiked(res.liked);
    } catch (err) {
      setLiked(prev);
      setLikeCount(c => prev ? c + 1 : Math.max(0, c - 1));
      showToast(err.message || 'Failed to update like');
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteDialog(false);
    setShowMenu(false);
    setIsDeletingAnimation(true);
    setDeleting(true);
    
    try {
      await deletePost(post.id);
      setIsDeletingAnimation(false);
      showToast('Post deleted successfully', 'success');
      
      setTimeout(() => {
        onDelete?.(post.id);
      }, 1500);
    } catch (err) {
      setIsDeletingAnimation(false);
      setDeleting(false);
      showToast(`Delete failed: ${err.message}`);
    }
  };

  const handleEdit = async () => {
    const title = editTitle.trim();
    const content = editContent.trim();
    if (!title) { showToast('Please enter a title'); return; }
    if (!content) { showToast('Please enter content'); return; }
    if (isSaving) return;
    setIsSaving(true);
    try {
      const updatedPost = await editPost(post.id, title, content);
      const mergedPost = {
        ...updatedPost,
        author: updatedPost.author?.name ? updatedPost.author : post.author,
      };
      onEdit?.({ ...updatedPost, author: post.author });
      setIsEditing(false);
      showToast('Post updated successfully', 'success');
    } catch (err) {
      showToast(`Edit failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (deleting && !isDeletingAnimation) return null;

  const toastBg = toast?.type === 'success' 
    ? 'bg-emerald-500' 
    : toast?.type === 'info' 
      ? 'bg-blue-500' 
      : 'bg-rose-500';

  return (
    <>
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-800/95 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform animate-slideUp">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <FaTrash className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">Delete Post?</h3>
              <p className="text-slate-400 text-sm mb-6">
                This action cannot be undone. This will permanently delete your post and remove it from the community.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`rounded-xl overflow-hidden bg-gradient-to-br from-white/8 to-white/3 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300 hover:shadow-lg relative group ${
        isDeletingAnimation ? 'opacity-0 scale-95 transition-all duration-500' : ''
      }`}>
        
        {/* Toast Notification */}
        {toast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm">
            <div className={`px-4 py-3 rounded-lg text-sm font-medium text-white ${toastBg} shadow-xl flex items-center justify-between`}>
              <span>{toast.msg}</span>
              <button 
                onClick={() => setToast(null)}
                className="ml-3 text-white/70 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <button
              onClick={() => onUserClick?.({ id: authorId, name: authorName, email: authorEmail })}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-1"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                {(authorName[0] || 'U').toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">{authorName}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{authorRole}</span>
                  <span>•</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </button>

            {isOwner && (
              <div className="relative">
                <button onClick={() => setShowMenu(m => !m)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white">
                  <FaEllipsisH size={14} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-10 bg-slate-800/95 border border-white/10 rounded-lg shadow-xl z-10 py-1 min-w-[120px] backdrop-blur-sm">
                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-blue-400 hover:bg-blue-500/10 text-xs">
                      <FaEdit size={11} /> Edit
                    </button>
                    <button onClick={() => { setShowDeleteDialog(true); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 text-xs">
                      <FaTrash size={11} /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-2">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                placeholder="Title"
                autoFocus
              />
              <textarea
                rows={4}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none outline-none focus:border-blue-500"
                placeholder="What's on your mind?"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm">Cancel</button>
                <button onClick={handleEdit} disabled={!editTitle.trim() || !editContent.trim() || isSaving} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {post.title && <h3 className="text-white font-semibold text-base">{post.title}</h3>}
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="px-4 py-2 flex items-center gap-4 border-t border-white/5">
            <button onClick={handleLike} disabled={!user} className={`flex items-center gap-1.5 ${liked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {liked ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
              <span className="text-xs">{likeCount}</span>
            </button>
            <button onClick={() => setShowComments(s => !s)} className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400">
              <FaComment size={12} />
              <span className="text-xs">{commentCount}</span>
            </button>
          </div>
        )}

        {/* Comments */}
        {showComments && !isEditing && (
          <div className="border-t border-white/5 bg-white/2 p-3">
            <CommentSection postId={post.id} postAuthorId={authorId} onCountChange={setCommentCount} />
          </div>
        )}
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}