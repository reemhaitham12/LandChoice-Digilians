import axios from 'axios';

const BASE = 'https://back-end-pro.vercel.app';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('landchoice_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const getError = (err) =>
  err.response?.data?.error ||
  err.response?.data?.message ||
  err.message ||
  'Something went wrong';

// ─── ID NORMALIZATION ──────────────────────────────────────────────────────

export const normalizeId = (id) => {
  if (!id) return null;
  if (typeof id === 'string' && id.includes('@')) return id.toLowerCase().trim();
  if (typeof id === 'string') return id.toLowerCase().trim();
  if (typeof id === 'object') {
    const extracted = id._id || id.id;
    return extracted ? normalizeId(extracted) : null;
  }
  if (typeof id === 'number') return id.toString();
  return null;
};

export const idsMatch = (id1, id2) => {
  const n1 = normalizeId(id1);
  const n2 = normalizeId(id2);
  if (!n1 || !n2) return false;
  if (n1 === n2) return true;
  const storedUser = JSON.parse(localStorage.getItem('landchoice_user') || '{}');
  const currentUserId = normalizeId(storedUser.user_id || storedUser.id || storedUser._id);
  if ((n1.includes('@') && n2 === currentUserId) || (n2.includes('@') && n1 === currentUserId)) return true;
  return false;
};

// ─── NORMALISATION ─────────────────────────────────────────────────────────

const normaliseAuthor = (author) => {
  if (!author) return { id: null, name: 'Anonymous', avatar: null, role: 'Member', email: '' };
  if (typeof author === 'string') return { id: author, name: 'Anonymous', avatar: null, role: 'Member', email: '' };
  return {
    id: author._id || author.id,
    name: author.name || 'Anonymous',
    email: author.email || '',
    avatar: author.avatar || null,
    role: author.role || 'Member',
  };
};

const normalisePost = (p) => {
  const rawLikes = Array.isArray(p.likes) ? p.likes : [];
  const processedLikedBy = rawLikes.map(l => {
    if (!l) return '';
    if (typeof l === 'string') return l;
    if (typeof l === 'object') {
      const userRef = l.user || l.userId || l.author;
      if (userRef) {
        if (typeof userRef === 'string') return userRef;
        if (typeof userRef === 'object') return normalizeId(userRef._id || userRef.id) || '';
      }
      return normalizeId(l._id || l.id) || '';
    }
    return '';
  }).filter(Boolean);

  return {
    id: p._id || p.id,
    title: p.title || '',
    content: p.content || '',
    author: normaliseAuthor(p.author),
    image: p.image || null,
    likedBy: processedLikedBy,
    likes: p.likesCount ?? (Array.isArray(p.likes) ? p.likes.length : 0),
    comments: p.commentsCount ?? (Array.isArray(p.comments) ? p.comments.length : 0),
    createdAt: p.createdAt || new Date().toISOString(),
  };
};

const normaliseComment = (c) => {
  let authorId = null, authorName = 'Anonymous', authorEmail = '', authorAvatar = null;

  if (typeof c.user === 'string') {
    authorId = c.user;
  } else if (typeof c.author === 'string') {
    authorId = c.author;
  } else if (c.user && typeof c.user === 'object') {
    authorId = c.user._id || c.user.id;
    authorName = c.user.name || 'Anonymous';
    authorEmail = c.user.email || '';
    authorAvatar = c.user.avatar || null;
  } else if (c.author && typeof c.author === 'object') {
    authorId = c.author._id || c.author.id;
    authorName = c.author.name || 'Anonymous';
    authorEmail = c.author.email || '';
    authorAvatar = c.author.avatar || null;
  }

  return {
    id: c._id || c.id,
    content: c.text || c.content || '',
    author: { id: authorId, name: authorName, email: authorEmail, avatar: authorAvatar },
    createdAt: c.createdAt || new Date().toISOString(),
    editedAt: c.editedAt || null,
  };
};

// ─── POSTS ─────────────────────────────────────────────────────────────────

export const fetchPosts = async () => {
  try {
    const { data } = await api.get('/posts');
    const all = (data.posts || []).map(normalisePost);
    const unique = all.filter((post, index, self) =>
      index === self.findIndex(p => idsMatch(p.id, post.id))
    );
    return { posts: unique, total: unique.length, hasMore: false };
  } catch (err) {
    throw new Error(getError(err));
  }
};

export const createPost = async (title, content) => {
  try {
    const { data } = await api.post('/posts/add-post', { title: title.trim(), content: content.trim() });
    const storedUser = JSON.parse(localStorage.getItem('landchoice_user') || '{}');
    const raw = data.post || data;
    return normalisePost({ ...raw, author: raw.author?.name ? raw.author : storedUser });
  } catch (err) {
    throw new Error(getError(err));
  }
};

export const editPost = async (postId, title, content) => {
  try {
    if (!postId) throw new Error('Post ID is required');
    const { data } = await api.put(
      '/posts/Update-post',
      { title: title.trim(), content: content.trim() },
      { params: { id: postId } }
    );
    return normalisePost(data.post || data);
  } catch (err) {
    throw new Error(getError(err));
  }
};

export const deletePost = async (postId) => {
  try {
    if (!postId) throw new Error('Post ID is required');
    const { data } = await api.delete('/posts/delete-post', { params: { id: postId } });
    return data;
  } catch (err) {
    throw new Error(getError(err));
  }
};

// ─── LIKES ─────────────────────────────────────────────────────────────────

export const toggleLike = async (postId, currentlyLiked) => {
  try {
    if (currentlyLiked) {
      const { data } = await api.delete('/posts/delete-like', { params: { id: postId } });
      return { likes: data?.likesCount ?? data?.likes ?? 0, liked: false };
    } else {
      const { data } = await api.post('/posts/add-like', {}, { params: { id: postId } });
      return { likes: data?.likesCount ?? data?.likes ?? 0, liked: true };
    }
  } catch (err) {
    if (err.response?.status === 400 && !currentlyLiked) return { likes: 0, liked: true };
    throw new Error(getError(err));
  }
};

// ─── COMMENTS ──────────────────────────────────────────────────────────────

export const fetchComments = async (postId) => {
  try {
    const { data } = await api.get('/posts/get-post-by-id', { params: { id: postId } });
    return (data.post?.comments || []).map(normaliseComment);
  } catch { return []; }
};

export const addComment = async (postId, content) => {
  try {
    const { data } = await api.post('/posts/add-comment', { text: content.trim() }, { params: { id: postId } });
    const rawComment = data.comment || data;
    const storedUser = JSON.parse(localStorage.getItem('landchoice_user') || '{}');
    const localUser = {
      _id: storedUser._id || storedUser.id,
      name: storedUser.name || storedUser.fullName || 'Anonymous',
      email: storedUser.email || '',
      avatar: storedUser.avatar || null,
    };
    if (typeof rawComment.user === 'string' || !rawComment.user) rawComment.user = localUser;
    if (typeof rawComment.author === 'string' || !rawComment.author) rawComment.author = localUser;
    return normaliseComment(rawComment);
  } catch (err) {
    throw new Error(getError(err));
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    if (!postId || !commentId) throw new Error('Post ID and Comment ID are required');
    const { data } = await api.delete('/posts/delete-comment', { params: { id: postId, commentId } });
    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to delete comment'
    );
  }
};

export const editComment = async (postId, commentId, content) => {
  if (!postId || !commentId) throw new Error('Post ID and Comment ID are required');
  if (!content?.trim()) throw new Error('Comment content is required');
  return { id: commentId, content: content.trim(), editedAt: new Date().toISOString() };
};

// ─── USER PROFILE ──────────────────────────────────────────────────────────

export const fetchUserProfile = async (userId) => {
  try {
    const { data } = await api.get('/posts/user-posts', { params: { userId } });
    const posts = (data.posts || []).map(normalisePost);
    return {
      id: userId,
      posts,
      totalLikes: posts.reduce((s, p) => s + (p.likes || 0), 0),
      totalComments: posts.reduce((s, p) => s + (p.comments || 0), 0),
    };
  } catch (err) {
    throw new Error(getError(err));
  }
};

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────

export const fetchNotifications = async () => [];
export const markNotificationsRead = async () => {};

// ─── ADS ───────────────────────────────────────────────────────────────────

const normaliseAd = (a) => {
  const impressions = a.views ?? 0;
  const clicks = a.clicks ?? 0;
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0.0';
  return {
    id: a._id || a.id,
    title: a.title || '',
    description: a.description || '',
    companyName: a.companyName || '',
    link: a.linkUrl || '#',
    cta: a.companyName ? `Visit ${a.companyName}` : 'Learn More',
    image: a.image || null,
    status: a.isActive ? 'active' : 'paused',
    impressions, clicks, ctr,
    startDate: a.startDate || null,
    endDate: a.endDate || null,
    position: a.position ?? 0,
  };
};

export const fetchAds = async () => {
  try {
    const { data } = await api.get('/ads');
    return (data.ads || []).map(normaliseAd);
  } catch { return []; }
};

export const fetchAllAds = async () => {
  try {
    const { data } = await api.get('/ads/admin/all');
    return (data.ads || []).map(normaliseAd);
  } catch (err) { throw new Error(getError(err)); }
};

export const getAdAnalytics = async () => {
  try {
    const { data } = await api.get('/ads/admin/all');
    const ads = (data.ads || []).map(normaliseAd);
    const totals = {
      totalImpressions: ads.reduce((s, a) => s + a.impressions, 0),
      totalClicks: ads.reduce((s, a) => s + a.clicks, 0),
      avgCtr: ads.length
        ? (ads.reduce((s, a) => s + parseFloat(a.ctr), 0) / ads.length).toFixed(1)
        : '0.0',
    };
    return { ads, totals };
  } catch (err) { throw new Error(getError(err)); }
};

export const createAd = async (ad) => {
  try {
    const { data } = await api.post('/ads/admin/add-advertisement', {
      title: ad.title,
      description: ad.description,
      companyName: ad.companyName || '',
      linkUrl: ad.link || '#',
      startDate: ad.startDate || new Date().toISOString(),
      endDate: ad.endDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      position: ad.position ?? 0,
    });
    return normaliseAd(data.ad || data);
  } catch (err) { throw new Error(getError(err)); }
};

export const updateAd = async (adId, updates) => {
  try {
    const body = {};
    if (updates.title) body.title = updates.title;
    if (updates.description) body.description = updates.description;
    if (updates.link) body.linkUrl = updates.link;
    if (updates.companyName) body.companyName = updates.companyName;
    if (updates.startDate) body.startDate = updates.startDate;
    if (updates.endDate) body.endDate = updates.endDate;
    if (updates.position !== undefined) body.position = updates.position;
    const { data } = await api.put('/ads/admin/update-advertisement', body, { params: { id: adId } });
    return normaliseAd(data.ad || data);
  } catch (err) { throw new Error(getError(err)); }
};

export const toggleAdStatus = async (adId) => {
  try {
    const { data } = await api.patch('/ads/admin/toggle', null, { params: { id: adId } });
    return data;
  } catch (err) { throw new Error(getError(err)); }
};

export const deleteAd = async (adId) => {
  try {
    const { data } = await api.delete('/ads/admin/delete-advertisement', { params: { id: adId } });
    return data;
  } catch (err) { throw new Error(getError(err)); }
};

export const trackAdClick = (adId) => {
  fetch(`${BASE}/ads/click?id=${adId}`).catch(() => {});
};

export const trackAdImpression = () => {};