import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fetchPosts, fetchAds } from '../Services/communityService';
import { useAuth } from '../context/AuthContext';
import CommunityProvider from '../context/CommunityContext';
import PostCard from '../Components/community/PostCard';
import CreatePost from '../Components/community/CreatePost';

// SIMPLE TAB COMPONENT

function CommunityTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-6 border-b border-white/10 pb-3 mb-6">
      <button
        onClick={() => onTabChange('posts')}
        className={`text-sm font-medium transition-colors relative ${
          activeTab === 'posts'
            ? 'text-blue-400'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        Posts
        {activeTab === 'posts' && (
          <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
        )}
      </button>
      <button
        onClick={() => onTabChange('ads')}
        className={`text-sm font-medium transition-colors relative ${
          activeTab === 'ads'
            ? 'text-blue-400'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        Advertisements
        {activeTab === 'ads' && (
          <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
        )}
      </button>
    </div>
  );
}

// HEADER

function CommunityHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Community
      </h1>
      <p className="text-slate-400 text-sm">
        Share experiences and connect with fellow digital nomads
      </p>
    </div>
  );
}

// ADS SECTION

function AdsSection({ ads }) {
  if (!ads || ads.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
        <p className="text-slate-500 text-sm">No advertisements available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ads.map((ad) => (
        <div
          key={ad.id || ad._id}
          className="bg-slate-800/30 rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all"
        >
          {ad.image && (
            <div className="h-32 overflow-hidden rounded-lg mb-3">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
          <p className="text-slate-500 text-xs uppercase mb-1">
            {ad.companyName || 'Company'}
          </p>
          <h3 className="text-white font-medium text-sm mb-2 line-clamp-1">
            {ad.title}
          </h3>
          {ad.description && (
            <p className="text-slate-400 text-xs line-clamp-2 mb-3">
              {ad.description}
            </p>
          )}
          <button
            onClick={() => {
              if (ad.link && ad.link !== '#') {
                window.open(ad.link, '_blank');
              }
            }}
            className="w-full py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-medium hover:bg-blue-600/30 transition-all"
          >
            Learn More →
          </button>
        </div>
      ))}
    </div>
  );
}

// GUIDELINES SECTION - Clean sidebar

function GuidelinesSection() {
  const guidelines = [
    'Be respectful to all members',
    'Share verified information only',
    'No spam or self-promotion',
    'Keep personal information private',
    'Report inappropriate content',
  ];

  return (
    <div className="sticky top-32">
      <div className="bg-slate-800/30 rounded-xl border border-white/10 p-4">
        <h3 className="text-white font-medium text-sm mb-3">Community Guidelines</h3>
        <ul className="space-y-2">
          {guidelines.map((guideline, idx) => (
            <li key={idx} className="flex items-start gap-2 text-slate-400 text-xs">
              <span className="text-blue-400">•</span>
              <span>{guideline}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


// MAIN COMPONENT

function CommunityInner() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPosts();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
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

  useEffect(() => {
    loadPosts();
    loadAds();
  }, [loadPosts, loadAds]);

  const handleNewPost = (postOrWrapper) => {
    const post = postOrWrapper?.post || postOrWrapper;
    setPosts(prev => [post, ...prev]);
  };

  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId && p._id !== postId));
  };

  const handleEditPost = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to refresh posts:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <CommunityHeader />

        {/* Tabs */}
        <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'posts' ? (
              <div className="space-y-5">
                <CreatePost onPost={handleNewPost} />

                {!user && (
                  <div className="text-center py-6 bg-slate-800/30 rounded-xl border border-white/5">
                    <p className="text-slate-400 text-sm">
                      <a href="/login" className="text-blue-400 hover:underline">Sign in</a> to join the conversation
                    </p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-6 bg-red-500/5 rounded-xl border border-red-500/20">
                    <p className="text-red-400 text-sm">Failed to load posts</p>
                    <button onClick={loadPosts} className="mt-2 text-slate-400 text-sm hover:text-white">Try Again</button>
                  </div>
                )}

                {loading && !error && (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-28 bg-slate-800/30 rounded-xl animate-pulse" />
                    ))}
                  </div>
                )}

                {!loading && !error && posts.length === 0 && (
                  <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
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
            ) : (
              <AdsSection ads={ads} />
            )}
          </div>

          {/* Right Sidebar - Guidelines */}
          <div className="hidden lg:block">
            <GuidelinesSection />
          </div>
        </div>
      </div>
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