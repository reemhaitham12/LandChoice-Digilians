import { useState, useEffect } from 'react';
import { FaTimes, FaHeart, FaComment, FaUserCircle } from 'react-icons/fa';
import { fetchUserProfile } from '../../Services/communityService';
import { formatDistanceToNow } from '../../utils/dateUtils';

export default function UserProfileModal({ user: profileUser, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileUser?.id) return;
    fetchUserProfile(profileUser.id).then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, [profileUser?.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-24 bg-gradient-to-r from-[#6C8FD9]/40 to-[#f29706]/40 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Avatar */}
        <div className="px-6 pb-4 relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 border-4 border-slate-900 flex items-center justify-center text-white text-2xl font-bold -mt-8">
            {profileUser?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <h2 className="text-white font-bold text-lg mt-2">{profileUser?.name || 'User'}</h2>
          <p className="text-slate-400 text-sm">{profileUser?.role || 'Community Member'}</p>

          {profile && (
            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <p className="text-white font-bold text-lg">{profile.posts?.length || 0}</p>
                <p className="text-slate-500 text-xs">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">{profile.totalLikes || 0}</p>
                <p className="text-slate-500 text-xs">Likes</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">{profile.totalComments || 0}</p>
                <p className="text-slate-500 text-xs">Comments</p>
              </div>
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="flex-1 overflow-y-auto border-t border-white/10">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : !profile || !profile.posts?.length ? (
            <div className="p-6 text-center text-slate-500 text-sm">No posts yet.</div>
          ) : (
            <div className="p-4 space-y-3">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider px-1">Recent Posts</h3>
              {profile.posts.map(post => (
                <div key={post.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-slate-200 text-sm line-clamp-3 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-slate-500 text-xs">{formatDistanceToNow(post.createdAt)}</span>
                    <span className="flex items-center gap-1 text-slate-500 text-xs"><FaHeart size={10} className="text-red-400" /> {post.likes}</span>
                    <span className="flex items-center gap-1 text-slate-500 text-xs"><FaComment size={10} className="text-blue-400" /> {post.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
