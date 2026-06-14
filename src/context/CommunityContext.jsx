import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchNotifications, markNotificationsRead } from '../Services/communityService';
import { useAuth } from './AuthContext';

const CommunityContext = createContext(null);
export const useCommunity = () => useContext(CommunityContext);

export default function CommunityProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    const data = await fetchNotifications();
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.read).length);
  }, [user]);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const clearNotifications = async () => {
    await markNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <CommunityContext.Provider value={{ notifications, unreadCount, clearNotifications, refreshNotifications: loadNotifications }}>
      {children}
    </CommunityContext.Provider>
  );
}
