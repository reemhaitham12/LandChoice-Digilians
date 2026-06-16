import { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { useCommunity } from '../../context/CommunityContext';
import { formatDistanceToNow } from '../../utils/dateUtils';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  // Safe context access
  const communityContext = useCommunity();
  const notifications = communityContext?.notifications || [];
  const unreadCount = communityContext?.unreadCount || 0;
  const clearNotifications = communityContext?.clearNotifications || (() => {});

  useEffect(() => {
    if (!communityContext) {
      console.error(' CommunityContext not available');
      setError('Notifications unavailable');
    }
  }, [communityContext]);

  const handleOpen = () => {
    try {
      setOpen(o => !o);
      if (!open && unreadCount > 0) {
        clearNotifications();
      }
    } catch (err) {
      console.error(' Failed to open notifications:', err);
      setError('Failed to load notifications');
    }
  };

  if (error && !open) {
    return (
      <button
        className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
        title="Notifications unavailable"
      >
        <FaBell size={16} />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
        title="Notifications"
      >
        <FaBell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <FaTimes size={14} />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {error ? (
              <div className="p-6 text-center text-red-400 text-sm">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No notifications yet</div>
            ) : (
              notifications.slice(0, 10).map(n => (
                <div key={n.id || Math.random()} className={`px-4 py-3 border-b border-white/5 last:border-0 ${!n.read ? 'bg-blue-500/5' : ''}`}>
                  <p className="text-slate-200 text-xs leading-relaxed">{n.message}</p>
                  <p className="text-slate-500 text-xs mt-1">{formatDistanceToNow(n.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
