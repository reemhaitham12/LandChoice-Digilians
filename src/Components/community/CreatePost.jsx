// ============================================================
// FILE 2: CreatePost.jsx
// ============================================================

import { useState } from "react";
import { FaPaperPlane, FaExclamationTriangle } from "react-icons/fa";
import { createPost } from "../../Services/communityService";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/Toast-Service";

const MAX_TITLE = 200;
const MAX_CONTENT = 5000;

export default function CreatePost({ onPost }) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);
  const [errors, setErrors] = useState({});

  if (!user) {
    return (
      <div className="rounded-2xl p-6 text-center bg-slate-800/30 border border-white/5">
        <p className="text-slate-400 text-sm">
          <a href="/login" className="text-blue-400 hover:underline font-semibold">
            Sign in
          </a>{" "}
          to share your experience
        </p>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > MAX_TITLE) {
      newErrors.title = `Title too long (max ${MAX_TITLE})`;
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length > MAX_CONTENT) {
      newErrors.content = `Content too long (max ${MAX_CONTENT})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    try {
      const post = await createPost(title.trim(), content.trim());
      showToast.success("Post created successfully!");
      onPost?.(post);
      setTitle("");
      setContent("");
      setFocused(false);
      setErrors({});
    } catch (err) {
      console.error("Create post failed:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to create post";
      showToast.error(errorMsg);
      setErrors({ submit: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const authorInitial = (user?.fullName || user?.name || user?.email || "?")[0].toUpperCase();

  const titleLength = title.length;
  const contentLength = content.length;
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className={`rounded-2xl p-5 transition-all duration-300 border bg-slate-800/30 ${focused ? "border-blue-500/40" : "border-white/5"}`}>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {authorInitial}
        </div>

        <div className="flex-1 space-y-3">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
              }}
              onFocus={() => setFocused(true)}
              placeholder="Post title…"
              maxLength={MAX_TITLE}
              className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all ${
                errors.title ? "border-red-500/50" : "border-white/10 focus:border-blue-500/50"
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.title && <span className="text-red-400 text-xs">{errors.title}</span>}
              <span className={`text-xs ml-auto ${titleLength > MAX_TITLE * 0.9 ? "text-amber-400" : "text-slate-500"}`}>
                {titleLength}/{MAX_TITLE}
              </span>
            </div>
          </div>

          {/* Content Input */}
          <div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setErrors((prev) => ({ ...prev, content: "" }));
              }}
              onFocus={() => setFocused(true)}
              placeholder="Share your experience, ask a question, or start a discussion…"
              rows={focused || content ? 4 : 2}
              maxLength={MAX_CONTENT}
              className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none resize-none transition-all ${
                errors.content ? "border-red-500/50" : "border-white/10 focus:border-blue-500/50"
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.content && <span className="text-red-400 text-xs">{errors.content}</span>}
              <span className={`text-xs ml-auto ${contentLength > MAX_CONTENT * 0.9 ? "text-amber-400" : "text-slate-500"}`}>
                {contentLength}/{MAX_CONTENT}
              </span>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 flex gap-2">
              <FaExclamationTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={14} />
              <p className="text-red-300 text-xs">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          {(focused || content) && (
            <div className="flex justify-end pt-1">
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || !content.trim() || submitting || hasErrors}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Posting…</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={12} />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}