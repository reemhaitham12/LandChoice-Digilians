import { useState, useEffect, useCallback } from 'react';
import { fetchPosts, fetchAds } from '../Services/communityService';
import { useAuth } from '../context/AuthContext';
import CommunityProvider from '../context/CommunityContext';
import PostCard from '../Components/community/PostCard';
import CreatePost from '../Components/community/CreatePost';
import UserProfileModal from '../Components/community/UserProfileModal';

// ============================================================
// TOGGLE SWITCH COMPONENT
// ============================================================
function ToggleSwitch({ activeTab, onTabChange }) {
  return (
    <div className="flex justify-center w-full mb-6">
      <div className="relative flex bg-white/5 border border-white/10 rounded-full p-1 w-auto min-w-[260px]">
        <div
          className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300 ease-out ${
            activeTab === 'posts' ? 'left-1' : 'left-1/2'
          }`}
        />
        <button
          onClick={() => onTabChange('posts')}
          className={`relative z-10 flex-1 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            activeTab === 'posts' ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => onTabChange('ads')}
          className={`relative z-10 flex-1 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            activeTab === 'ads' ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Ads
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ADS SECTION COMPONENT
// ============================================================
function AdsSection({ ads }) {
  if (!ads || ads.length === 0) {
    return (
      <div className="rounded-xl p-8 bg-white/5 border border-white/10 text-center">
        <p className="text-slate-500 text-sm">No advertisements available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ads.map((ad) => (
        <div
          key={ad.id || ad._id}
          className="rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/3 border border-white/10 hover:border-white/20 transition-all duration-300"
        >
          {ad.image && (
            <div className="h-32 overflow-hidden relative">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute top-2 left-2 text-xs font-medium text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                Sponsored
              </span>
            </div>
          )}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium text-sm line-clamp-1">{ad.title}</h3>
                <p className="text-slate-400 text-xs mt-1">{ad.companyName || 'Company'}</p>
              </div>
              {!ad.image && (
                <span className="text-xs font-medium text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                  Sponsored
                </span>
              )}
            </div>
            {ad.description && (
              <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{ad.description}</p>
            )}
            <button
              onClick={() => {
                if (ad.link && ad.link !== '#') window.open(ad.link, '_blank', 'noopener,noreferrer');
              }}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium hover:opacity-90 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// GUIDELINES SECTION COMPONENT
// ============================================================
function GuidelinesSection() {
  const guidelines = [
    'Be respectful to all community members',
    'Share verified information only',
    'No spam or self-promotion',
    'Keep personal information private',
    'Report inappropriate content to admins',
  ];

  return (
    <div className="sticky top-32 rounded-xl p-5 bg-white/5 border border-white/10">
      <h3 className="text-base font-semibold text-white mb-4">Community Guidelines</h3>
      <ul className="space-y-3">
        {guidelines.map((guideline, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>{guideline}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// MAIN COMMUNITY COMPONENT
// ============================================================
function CommunityInner() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ جيب كل البوستات دفعة واحدة - مفيش pagination
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPosts();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      console.error('Load posts failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAds = useCallback(async () => {
    try {
      const data = await fetchAds();
      setAds(data || []);
    } catch (err) {
      console.error('Load ads failed:', err);
      setAds([]);
    }
  }, []);

  // ✅ call واحد بس عند الـ mount
  useEffect(() => {
    loadPosts();
    loadAds();
  }, [loadPosts, loadAds]);

  // ✅ إضافة البوست الجديد في الأول بدون تكرار
  const handleNewPost = (postOrWrapper) => {
    const post = postOrWrapper?.post || postOrWrapper;
    setPosts(prev => {
      const existingIds = new Set(prev.map(p => p.id || p._id));
      if (existingIds.has(post.id || post._id)) return prev;
      return [post, ...prev];
    });
  };

  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId && p._id !== postId));
  };

const handleEditPost = async (updatedPost) => {
  try {
    const data = await fetchPosts();
    setPosts(data.posts || []);
  } catch (err) {
    console.error('Failed to refresh posts:', err);
  }
};

  const renderPostsContent = () => (
    <div className="space-y-4">
      <CreatePost onPost={handleNewPost} />

      {!user && (
        <div className="rounded-xl p-4 bg-white/5 border border-white/10 text-center">
          <p className="text-slate-300 text-sm">
            <a href="/login" className="text-blue-400 hover:underline font-medium">Sign in</a> to join the conversation
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl p-6 bg-red-500/5 border border-red-500/20 text-center">
          <p className="text-red-400 text-sm">Failed to load posts</p>
          <button
            onClick={loadPosts}
            className="mt-3 px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {loading && !error && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl p-5 bg-white/5 border border-white/5 animate-pulse h-32" />
          ))}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="rounded-xl p-12 bg-white/5 border border-white/5 text-center">
          <p className="text-slate-400">No posts yet. Be the first to share!</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard
              key={post.id || post._id}
              post={post}
              onDelete={handleDeletePost}
              onEdit={handleEditPost}
              onUserClick={setSelectedUser}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderAdsContent = () => (
    <div className="space-y-4">
      <div className="rounded-xl p-4 bg-white/5 border border-white/10">
        <p className="text-slate-400 text-sm text-center">Sponsored advertisements from trusted partners</p>
      </div>
      <AdsSection ads={ads} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] via-[#0F172A] to-[#0B1220] pt-20">
      {/* Header */}
      <div className="sticky top-20 z-40 bg-gradient-to-b from-[#0B1220]/95 to-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Community</h1>
            <p className="text-slate-400 text-sm mt-1">Share experiences and connect with fellow digital nomads</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToggleSwitch activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'posts' ? renderPostsContent() : renderAdsContent()}
          </div>
          <div className="hidden lg:block">
            <GuidelinesSection />
          </div>
        </div>
      </div>

      {selectedUser && (
        <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
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