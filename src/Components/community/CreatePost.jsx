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
      <div className="glass-card rounded-2xl p-6 text-center border border-blue-500/20">
        <p className="text-slate-400 text-sm">
          <a
            href="/login"
            className="text-blue-400 hover:underline font-semibold transition-colors"
          >
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

      showToast.success("Post created successfully! ✨");

      onPost?.(post);

      setTitle("");
      setContent("");
      setFocused(false);
      setErrors({});
    } catch (err) {
      console.error("❌ Create post failed:", err);

      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create post";

      showToast.error(errorMsg);

      setErrors({
        submit: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const authorInitial = (
    user?.fullName ||
    user?.name ||
    user?.email ||
    "?"
  )[0].toUpperCase();

  const titleLength = title.length;
  const contentLength = content.length;

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all duration-300 border ${
        focused
          ? "border-blue-500/40 shadow-lg shadow-blue-500/10"
          : "border-white/10"
      }`}
    >
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
          {authorInitial}
        </div>

        <div className="flex-1 space-y-4">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  title: "",
                }));
              }}
              onFocus={() => setFocused(true)}
              placeholder="Post title…"
              maxLength={MAX_TITLE}
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all ${
                errors.title
                  ? "border-red-500/50 focus:border-red-500/70"
                  : "border-white/10 focus:border-blue-500/50"
              }`}
            />

            <div className="flex justify-between items-center mt-2">
              {errors.title && (
                <span className="text-red-400 text-xs flex items-center gap-1">
                  <FaExclamationTriangle size={12} />
                  {errors.title}
                </span>
              )}

              <span
                className={`text-xs ml-auto ${
                  titleLength > MAX_TITLE * 0.9
                    ? "text-amber-400"
                    : "text-slate-500"
                }`}
              >
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
                setErrors((prev) => ({
                  ...prev,
                  content: "",
                }));
              }}
              onFocus={() => setFocused(true)}
              placeholder="Share your experience, ask a question, or start a discussion…"
              rows={focused || content ? 4 : 2}
              maxLength={MAX_CONTENT}
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none resize-none transition-all ${
                errors.content
                  ? "border-red-500/50 focus:border-red-500/70"
                  : "border-white/10 focus:border-blue-500/50"
              }`}
            />

            <div className="flex justify-between items-center mt-2">
              {errors.content && (
                <span className="text-red-400 text-xs flex items-center gap-1">
                  <FaExclamationTriangle size={12} />
                  {errors.content}
                </span>
              )}

              <span
                className={`text-xs ml-auto ${
                  contentLength > MAX_CONTENT * 0.9
                    ? "text-amber-400"
                    : "text-slate-500"
                }`}
              >
                {contentLength}/{MAX_CONTENT}
              </span>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex gap-3">
              <FaExclamationTriangle
                className="text-red-400 flex-shrink-0 mt-0.5"
                size={16}
              />
              <p className="text-red-300 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          {(focused || content) && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                disabled={
                  !title.trim() ||
                  !content.trim() ||
                  submitting ||
                  hasErrors
                }
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6C8FD9] to-[#f29706] text-white text-sm font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Posting…</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={14} />
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