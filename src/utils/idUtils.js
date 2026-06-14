/**
 * ID Normalization Utilities
 * 
 * Handles comparison of IDs in different formats:
 * - String IDs: "user-123"
 * - MongoDB ObjectIDs: ObjectId("507f1f77bcf86cd799439011")
 * - Nested objects: { _id: "...", id: "..." }
 * - Email-based IDs: "user@example.com"
 * 
 * Usage:
 * const userId = normalizeId(user?.id || user?._id);
 * const authorId = normalizeId(post.author?.id);
 * if (idsMatch(userId, authorId)) { /* they're the same user */ 


/**
 * Extract and normalize an ID from any format
 * @param {string | object} id - The ID to normalize
 * @returns {string | null} - Normalized ID or null
 */
export const normalizeId = (id) => {
  if (!id) return null;
  
  // Already a string - normalize it
  if (typeof id === 'string') {
    return id.toLowerCase().trim();
  }
  
  // Object with _id or id property
  if (typeof id === 'object') {
    const extracted = id._id || id.id;
    if (!extracted) return null;
    
    // Recursively normalize if it's also an object
    if (typeof extracted === 'string') {
      return extracted.toLowerCase().trim();
    }
    if (typeof extracted === 'object') {
      return normalizeId(extracted);
    }
    
    // Fallback: convert to string and normalize
    return extracted.toString().toLowerCase().trim();
  }
  
  // Fallback for other types (numbers, etc)
  return id.toString().toLowerCase().trim();
};

/**
 * Check if two IDs match (handles different formats)
 * @param {string | object} id1 - First ID
 * @param {string | object} id2 - Second ID
 * @returns {boolean} - True if they match
 */
export const idsMatch = (id1, id2) => {
  const norm1 = normalizeId(id1);
  const norm2 = normalizeId(id2);
  
  // Both must be present and equal
  return !!(norm1 && norm2 && norm1 === norm2);
};

/**
 * Extract ID from user object (handles various user formats)
 * @param {object} user - User object from auth context
 * @returns {string | null} - User ID
 */
export const extractUserId = (user) => {
  if (!user) return null;
  
  // Try multiple sources
  return normalizeId(user.id || user._id || user.userId || user.email);
};

/**
 * Extract ID from author/creator object
 * @param {string | object} author - Author data
 * @returns {string | null} - Author ID
 */
export const extractAuthorId = (author) => {
  if (!author) return null;
  
  // String ID
  if (typeof author === 'string') {
    return normalizeId(author);
  }
  
  // Object with ID fields
  if (typeof author === 'object') {
    return normalizeId(author._id || author.id || author.userId || author.email);
  }
  
  return null;
};

/**
 * Check if user is owner of a post/comment
 * @param {string | object} userId - Current user's ID
 * @param {string | object} authorId - Content author's ID
 * @returns {boolean} - True if user is the author
 */
export const isContentOwner = (userId, authorId) => {
  return idsMatch(userId, authorId);
};

/**
 * Safely compare two objects using their IDs
 * Useful for checking if two user/author objects are the same person
 * @param {object} obj1 - First object (with id or _id)
 * @param {object} obj2 - Second object (with id or _id)
 * @returns {boolean} - True if both objects represent the same entity
 */
export const isSameEntity = (obj1, obj2) => {
  const id1 = extractAuthorId(obj1);
  const id2 = extractAuthorId(obj2);
  return idsMatch(id1, id2);
};

/**
 * Get all ID variations from an object for logging/debugging
 * @param {object} obj - Object that might contain IDs
 * @returns {object} - Object with various ID formats
 */
export const debugIds = (obj) => {
  if (!obj) return { raw: null, variations: {} };
  
  return {
    raw: obj,
    normalized: normalizeId(obj),
    variations: {
      id: obj.id || null,
      _id: obj._id || null,
      userId: obj.userId || null,
      email: obj.email || null,
      authorId: obj.authorId || null,
    },
  };
};

/**
 * Compare two IDs with detailed logging (for debugging)
 * @param {string} id1Label - Label for first ID
 * @param {string | object} id1 - First ID
 * @param {string} id2Label - Label for second ID
 * @param {string | object} id2 - Second ID
 * @returns {boolean} - True if they match
 */
export const idsMatchDebug = (id1Label, id1, id2Label, id2) => {
  const norm1 = normalizeId(id1);
  const norm2 = normalizeId(id2);
  const match = idsMatch(norm1, norm2);
  
  console.log(`🔍 ID Comparison: ${id1Label} === ${id2Label}`, {
    [id1Label]: { raw: id1, normalized: norm1 },
    [id2Label]: { raw: id2, normalized: norm2 },
    match,
  });
  
  return match;
};

/**
 * Build a permission object for content (post or comment)
 * @param {string | object} currentUserId - Current logged-in user's ID
 * @param {string | object} contentAuthorId - Content author's ID
 * @param {string | object} postAuthorId - Post author's ID (optional, for comments)
 * @returns {object} - Permission flags
 */
export const buildContentPermissions = (currentUserId, contentAuthorId, postAuthorId = null) => {
  const userId = extractUserId({ id: currentUserId });
  const authorId = extractAuthorId(contentAuthorId);
  const postOwnerIds = postAuthorId ? extractAuthorId(postAuthorId) : null;
  
  const isOwner = idsMatch(userId, authorId);
  const isPostOwner = postOwnerIds ? idsMatch(userId, postOwnerIds) : false;
  
  return {
    userId,
    authorId,
    postOwnerIds,
    isOwner,           // User is content author
    isPostOwner,       // User is post author
    canEdit: isOwner,  // Can edit own content
    canDelete: isOwner || isPostOwner,  // Can delete own or as post owner
    permissions: {
      edit: isOwner ? 'own' : null,
      delete: isOwner ? 'own' : isPostOwner ? 'asPostOwner' : null,
    },
  };
};

export default {
  normalizeId,
  idsMatch,
  extractUserId,
  extractAuthorId,
  isContentOwner,
  isSameEntity,
  debugIds,
  idsMatchDebug,
  buildContentPermissions,
};
