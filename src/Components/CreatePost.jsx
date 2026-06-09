import { useState } from "react";
import { FaPen } from "react-icons/fa";

const CreatePost = ({ onSubmit }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({ content: content.trim() });
    setContent("");
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-5 sm:p-6">
      <form onSubmit={handleSubmit} className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/20">
          <img
            src="https://i.pravatar.cc/150?u=alex"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex items-center gap-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share your digital nomad experience..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
          >
            <FaPen size={14} />
            <span className="hidden sm:inline">Write Post</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;