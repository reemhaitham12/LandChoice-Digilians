import { useState, useEffect, useCallback, useRef } from 'react';
import { FaUsers, FaShieldAlt, FaGlobe, FaExclamationTriangle } from 'react-icons/fa';
import { fetchPosts, fetchAds } from '../Services/communityService';
import { useAuth } from '../context/AuthContext';
import CommunityProvider from '../context/CommunityContext';
import PostCard from '../Components/community/PostCard';
import CreatePost from '../Components/community/CreatePost';
import UserProfileModal from '../Components/community/UserProfileModal';
import NotificationBell from '../Components/community/NotificationBell';



// COMBINED STATS + ADS SIDEBAR
function CombinedSidebar({ posts, ads }) {
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.comments || 0), 0);
  const avgEngagement = totalPosts > 0 ? Math.round((totalLikes + totalComments) / totalPosts) : 0;

  return (
    <div className="sticky top-32 space-y-4">
      {/* STATS SECTION */}
      <div className="px-2">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
          Community Stats
        </h2>
      </div>

     

      {/* ADS SECTION */}
      <div className="px-2 mt-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
          Featured Ads
        </h2>
      </div>

      {/* AD CARDS */}
      <div className="space-y-3">
        {ads.length > 0 ? (
          ads.slice(0, 3).map((ad) => (
            <div key={ad.id || ad._id} className="rounded-lg overflow-hidden bg-gradient-to-br from-white/8 to-white/3 border border-amber-500/30 backdrop-blur-sm hover:border-amber-500/50 transition-all">
              {/* Ad Image */}
              {ad.image && (
                <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative">
                  <img 
                    src={ad.image} 
                    alt={ad.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-1 left-1 text-xs font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                    SPONSORED
                  </span>
                </div>
              )}

              {/* Ad Content */}
              <div className="p-3 space-y-2">
                <h3 className="text-white font-bold text-xs line-clamp-1">
                  {ad.title}
                </h3>
                {ad.description && (
                  <p className="text-slate-400 text-xs line-clamp-1">
                    {ad.description}
                  </p>
                )}
                <button
                  onClick={() => {
                    if (ad.link && ad.link !== '#') {
                      window.open(ad.link, '_blank');
                    }
                  }}
                  className="w-full py-1.5 rounded text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:shadow-lg transition-all"
                >
                  Learn More →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg p-3 bg-white/5 border border-white/10 text-center">
            <p className="text-slate-500 text-xs">No ads available</p>
          </div>
        )}
      </div>

      {/* GUIDELINES */}
      <div className="rounded-lg p-4 bg-gradient-to-br from-white/5 to-white/2 border border-white/10 backdrop-blur-sm mt-6">
        <h3 className="text-sm font-bold text-white mb-3">Community Guidelines</h3>
        <ul className="space-y-1">
          {[
            'Be respectful',
            'Share verified info',
            'No spam',
            'Keep it private',
            'Flag issues',
          ].map((guideline, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
              <span className="text-blue-400 mt-0.5">✓</span>
              <span>{guideline}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CommunityInner() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAdAdmin, setShowAdAdmin] = useState(false);
  const observerRef = useRef();
  const sentinelRef = useRef();

  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.isAdmin;

  // LOAD POSTS
  const loadPosts = useCallback(async (p = 1) => {
    if (p === 1) { 
      setLoading(true); 
      setError(null); 
    } else {
      setLoadingMore(true);
    }
    
    try {
      const data = await fetchPosts(p, 8);
      if (p === 1) setPosts(data.posts || []);
      else setPosts(prev => [...prev, ...(data.posts || [])]);
      setHasMore(data.hasMore ?? false);
      setPage(p);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      console.error('Load posts failed:', err);
    } finally {
      if (p === 1) setLoading(false);
      else setLoadingMore(false);
    }
  }, []);

  // LOAD ADS
  const loadAds = useCallback(async () => {
    try {
      const data = await fetchAds();
      setAds(data || []);
    } catch (err) {
      console.error('Load ads failed:', err);
      setAds([]);
    }
  }, []);

  useEffect(() => {
    loadPosts(1);
    loadAds();
  }, [loadPosts, loadAds]);

  // INFINITE SCROLL
  useEffect(() => {
    if (!sentinelRef.current) return;
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
        loadPosts(page + 1);
      }
    }, { threshold: 0.5 });
    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading, page, loadPosts]);

  // HANDLERS
  const handleNewPost = (postOrWrapper) => {
    const post = postOrWrapper?.post || postOrWrapper;
    setPosts(prev => [post, ...prev]);
  };

  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId && p._id !== postId));
  };

  const handleEditPost = (updatedPost) => {
    setPosts(prev => prev.map(p => 
      (p.id === updatedPost.id || p._id === updatedPost._id) ? updatedPost : p
    ));
  };

  // RENDER: 2-COLUMN (Posts | Ads)
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] via-[#0F172A] to-[#0B1220] pt-20">
      {/* HEADER */}
      <div className="sticky top-20 z-40 bg-gradient-to-b from-[#0B1220]/95 to-[#0F172A]/80 backdrop-blur-md border-b border-white/5 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C8FD9] to-[#f29706] flex items-center justify-center shadow-lg">
                <FaUsers className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Community</h1>
                <p className="text-slate-400 text-xs">Posts • Ads</p>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: Posts Center | Stats+Ads Right */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CENTER (2 COLS): POSTS ONLY */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Create Post */}
              <CreatePost onPost={handleNewPost} />

              {/* Guest */}
              {!user && (
                <div className="rounded-xl p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 backdrop-blur-sm">
                  <p className="text-slate-300 text-sm text-center">
                    <a href="/login" className="text-blue-400 hover:underline font-semibold">Sign in</a> to participate
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-xl p-6 bg-red-500/5 border border-red-500/20 text-center">
                  <FaExclamationTriangle className="text-red-400 text-2xl mx-auto mb-2" />
                  <p className="text-red-400 text-sm">Failed to load posts</p>
                  <button
                    onClick={() => loadPosts(1)}
                    className="mt-3 px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Loading */}
              {loading && !error && (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-lg p-5 bg-white/5 border border-white/5 animate-pulse h-32" />
                  ))}
                </div>
              )}

              {/* Empty */}
              {!loading && !error && posts.length === 0 && (
                <div className="rounded-xl p-12 bg-white/5 border border-white/5 text-center">
                  <p className="text-slate-400">Be the first to post 🎉</p>
                </div>
              )}

              {/* POSTS FEED */}
              {!loading && !error && posts.length > 0 && (
                <>
                  {posts.map(post => (
                    <PostCard
                      key={post.id || post._id}
                      post={post}
                      onDelete={handleDeletePost}
                      onEdit={handleEditPost}
                      onUserClick={setSelectedUser}
                    />
                  ))}

                  <div ref={sentinelRef} className="h-4" />

                  {loadingMore && (
                    <div className="flex justify-center py-6">
                      <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  )}

                  {!hasMore && (
                    <p className="text-slate-600 text-xs text-center py-6">✨ All posts loaded</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT (1 COL): STATS + ADS COMBINED */}
          <div className="hidden lg:block">
            <CombinedSidebar posts={posts} ads={ads} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedUser && (
        <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
      {showAdAdmin && (
        <AdManagementDashboard onClose={() => setShowAdAdmin(false)} />
      )}
    </div>
  );
}

export default function Community() {
  return (
    <CommunityProvider>
      <CommunityInner />
    </CommunityProvider>
  );
}
