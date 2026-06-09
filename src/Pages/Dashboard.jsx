import { useAuth } from "../context/AuthContext";
import Sidebar from "../Components/Sidebar";
import PostCard from "../Components/PostCard";
import EmptyState from "../Components/EmptyState";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal";
import { useState, useRef, useEffect } from "react";
import { FaPen, FaSpinner, FaTimes } from "react-icons/fa";

const Dashboard = () => {
  const { user, fetchAllPosts, createPost, deletePost, likePost, unlikePost, addComment, deleteComment } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    setIsLoading(true);
    setError("");
    
    const result = await fetchAllPosts();
    
    setIsLoading(false);
    
    if (result.success) {
      const postsData = result.data.posts || [];
      
      const myId = user?._id || user?.id;
      const myEmail = user?.email;
      
      const myPosts = postsData.filter(p => {
        const authorId = p.author?._id || p.author?.id || p.author;
        const authorEmail = p.author?.email || p.user?.email;
        
        if (myId && (authorId === myId || authorId === myId.toString())) return true;
        if (myEmail && authorEmail === myEmail) return true;
        
        return false;
      });
      
      setPosts(myPosts);
    } else {
      setError(result.error);
    }
  };

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    setIsSubmitting(true);
    setError("");
    
    const result = await createPost(formData.title.trim(), formData.content.trim());
    
    if (result.success) {
      const newPost = result.data.post || result.data;
      const postWithAuthor = {
        ...newPost,
        author: newPost.author || {
          _id: user?._id || user?.id,
          name: user?.name || user?.email?.split('@')[0],
          email: user?.email,
        },
        comments: [],
        commentsCount: 0,
        likes: [],
        likesCount: 0,
      };
      
      setPosts(prev => [postWithAuthor, ...prev]);
      setFormData({ title: "", content: "" });
      setShowForm(false);
    } else {
      setError(result.error);
    }
    
    setIsSubmitting(false);
  };

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    const result = await deletePost(postToDelete);
    if (result.success) {
      setPosts(posts.filter((p) => p._id !== postToDelete));
    } else {
      setError(result.error);
    }
    setPostToDelete(null);
  };

  const handleLike = async (postId, isLiked) => {
    const result = isLiked ? await unlikePost(postId) : await likePost(postId);
    if (result.success) {
      setPosts(posts.map((p) => {
        if (p._id !== postId) return p;
        const newLikesCount = isLiked 
          ? Math.max(0, (p.likesCount || 1) - 1)
          : (p.likesCount || 0) + 1;
        return { ...p, likesCount: newLikesCount };
      }));
    }
  };

  const handleAddComment = async (postId, text) => {
    const result = await addComment(postId, text);
    if (result.success) {
      const newComment = result.data.comment;
      
      setPosts(posts.map((p) => {
        if (p._id !== postId) return p;
        
        const updatedComments = [...(p.comments || []), newComment];
        
        return {
          ...p,
          comments: updatedComments,
          commentsCount: updatedComments.length
        };
      }));
    } else {
      setError(result.error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const result = await deleteComment(postId, commentId);
    if (result.success) {
      setPosts(posts.map((p) => {
        if (p._id !== postId) return p;
        
        const updatedComments = (p.comments || []).filter(c => 
          (c._id || c.id) !== commentId
        );
        
        return {
          ...p,
          comments: updatedComments,
          commentsCount: updatedComments.length
        };
      }));
    } else {
      setError(result.error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ title: "", content: "" });
    setError("");
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen pt-20">
      <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="lg:w-[300px] flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Posts</h1>
            <p className="text-[#94A3B8] text-sm sm:text-base">
              Welcome back, {displayName}! Manage and publish your stories.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="bg-[#081226] border border-white/[0.08] rounded-[28px] p-6 mb-8 shadow-[0_0_40px_rgba(59,130,246,0.04)]">
            {!showForm ? (
              <button
                onClick={() => { setShowForm(true); setTimeout(() => titleRef.current?.focus(), 100); }}
                className="w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10 flex items-center justify-center bg-[#0B1730]">
                    <span className="text-[#3B82F6] text-lg font-bold">
                      {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="flex-1 text-[#64748B] text-sm bg-[#0B1730] border border-white/10 rounded-2xl px-4 py-3">
                    What's on your mind? Share your experience...
                  </span>
                </div>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold text-sm">Create a New Post</h3>
                  <button onClick={handleCancel} className="text-[#64748B] hover:text-white transition-colors">
                    <FaTimes size={18} />
                  </button>
                </div>
                <input
                  ref={titleRef}
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Post Title"
                  className="w-full bg-[#0B1730] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] transition-all duration-300"
                />
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your post content here..."
                  rows={4}
                  className="w-full bg-[#0B1730] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] transition-all duration-300 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handlePublish}
                    disabled={!formData.title.trim() || !formData.content.trim() || isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white text-sm font-medium hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" size={14} />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FaPen size={14} />
                        Publish Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-[#3B82F6] text-2xl" />
            </div>
          )}

          {!isLoading && posts.length === 0 ? (
            <EmptyState onCreateClick={() => { setShowForm(true); setTimeout(() => titleRef.current?.focus(), 100); }} />
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  currentUser={user}
                  onDelete={handleDeleteClick}
                  onLike={handleLike}
                  onComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPostToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Dashboard;