import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { fetchComments, addComment, deleteComment, editComment } from '../../Services/communityService';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from '../../utils/dateUtils';

// Normalize IDs to comparable format
const normalizeId = (id) => {
  if (!id) return null;
  if (typeof id === 'string') return id.toLowerCase().trim();
  if (typeof id === 'object' && (id._id || id.id)) {
    return (id._id || id.id).toString().toLowerCase().trim();
  }
  return null;
};

// Compare two IDs safely
const idsMatch = (id1, id2) => {
  const norm1 = normalizeId(id1);
  const norm2 = normalizeId(id2);
  if (!norm1 || !norm2) return false;
  return norm1 === norm2;
};

export default function CommentSection({ postId, postAuthorId, onCountChange }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [localCommentCount, setLocalCommentCount] = useState(0);
  
  const userId = normalizeId(user?.id || user?._id || user?.userId || user?.email);
  const normalizedPostAuthorId = normalizeId(postAuthorId);

  useEffect(() => {
    fetchComments(postId).then(data => {
      const commentsList = data || [];
      setComments(commentsList);
      setLocalCommentCount(commentsList.length);
      onCountChange?.(commentsList.length);
      setLoading(false);
    });
  }, [postId, onCountChange]);

  const handleAdd = async () => {
    if (!input.trim() || !user) return;
    setSubmitting(true);
    try {
      const c = await addComment(postId, input.trim());
      setComments(prev => [...prev, c]);
      const newCount = localCommentCount + 1;
      setLocalCommentCount(newCount);
      onCountChange?.(newCount);
      setInput('');
    } catch (err) {
      console.error('Add comment failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    setDeletingId(commentId);
    try {
      if (!user) return;
      
      await deleteComment(postId, commentId);
      const updatedComments = comments.filter(c => normalizeId(c.id) !== normalizeId(commentId));
      setComments(updatedComments);
      const newCount = Math.max(0, localCommentCount - 1);
      setLocalCommentCount(newCount);
      onCountChange?.(newCount);
    } catch (err) {
      console.error('Delete comment failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = async (commentId) => {
    const text = editText.trim();
    if (!text) return;
    
    try {
      const updated = await editComment(postId, commentId, text);
      setComments(prev => prev.map(c => 
        normalizeId(c.id) === normalizeId(commentId)
          ? { ...c, content: text, editedAt: updated?.editedAt } 
          : c
      ));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Edit comment failed:', err);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      {/* COMMENTS LIST */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded animate-pulse w-1/4" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-slate-400 text-xs text-center py-3">No comments yet. Start the conversation!</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.map(c => {
            const commentAuthorId = normalizeId(c.author?.id);
            const commentAuthorEmail = c.author?.email?.toLowerCase().trim();
            const userEmail = user?.email?.toLowerCase().trim();
            
            const isCommentOwner = userId && idsMatch(userId, commentAuthorId);
            const isCommentOwnerByEmail = commentAuthorEmail && userEmail && commentAuthorEmail === userEmail;
            const isPostOwner = userId && idsMatch(userId, normalizedPostAuthorId);
            
            const canEdit = isCommentOwner || isCommentOwnerByEmail;
            const canDelete = isCommentOwner || isCommentOwnerByEmail || isPostOwner;
            
            return (
              <div key={normalizeId(c.id)} className="flex gap-3 group hover:bg-white/3 p-2 rounded-lg transition-all">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                  {c.author?.avatar
                    ? <img src={c.author.avatar} alt="" className="w-full h-full object-cover" />
                    : (c.author?.name?.[0] || '?').toUpperCase()
                  }
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  {editingId === normalizeId(c.id) ? (
                    // EDIT MODE
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Edit comment…"
                        className="w-full bg-white/5 border border-blue-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-400 resize-none"
                        rows="2"
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }} 
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-all"
                          title="Cancel"
                        >
                          <FaTimes size={12} />
                        </button>
                        <button 
                          onClick={() => handleEdit(c.id)} 
                          className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition-all"
                          title="Save"
                        >
                          <FaCheck size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // VIEW MODE
                    <div>
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <p className="text-white text-xs font-semibold">{c.author?.name || 'Anonymous'}</p>
                        <p className="text-slate-400 text-xs whitespace-nowrap">{formatDistanceToNow(c.createdAt)}</p>
                      </div>

                      <p className="text-slate-200 text-xs leading-relaxed break-words mb-2">{c.content}</p>

                      {c.editedAt && <p className="text-slate-500 text-xs italic mb-2">edited</p>}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canEdit && (
                          <button 
                            onClick={() => { 
                              setEditingId(normalizeId(c.id)); 
                              setEditText(c.content); 
                            }} 
                            className="px-2 py-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded text-xs font-medium transition-all flex items-center gap-1"
                            title="Edit"
                          >
                            <FaEdit size={10} /> Edit
                          </button>
                        )}
                        
                        {canDelete && (
                          <button 
                            onClick={() => handleDelete(c.id)} 
                            disabled={deletingId === normalizeId(c.id)}
                            className="px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded text-xs font-medium transition-all flex items-center gap-1 disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === normalizeId(c.id) ? (
                              <>⏳ Deleting</>
                            ) : (
                              <><FaTrash size={10} /> Delete</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD COMMENT FORM */}
      <div className="border-t border-white/10 pt-4">
        {user ? (
          <div className="flex gap-3">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
              {(user?.fullName || user?.name || user?.email || '?')[0].toUpperCase()}
            </div>

            {/* Input Area */}
            <div className="flex-1 space-y-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleAdd()}
                placeholder="Share your thoughts…"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all resize-none"
                rows="2"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAdd}
                  disabled={!input.trim() || submitting}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-semibold"
                >
                  {submitting ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-xs text-center py-2">
            <a href="/login" className="text-blue-400 hover:underline font-semibold">Sign in</a> to comment
          </p>
        )}
      </div>
    </div>
  );
}
