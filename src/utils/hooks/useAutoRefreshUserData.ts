import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setRefreshUserDataStart } from '@/app/redux/reducers/auth/signUpReducer';
import { useSelector } from 'react-redux';
import { isAuthenticatedSelector } from '@/app/redux/reducers/auth/selectors/signupSelector';

/**
 * Custom hook to automatically refresh user data when the app comes back into focus
 * This ensures the user data is always up-to-date when the user returns to the app
 * 
 * @param {boolean} enabled - Whether to enable automatic refresh (default: true)
 * @param {number} refreshInterval - Interval in milliseconds for periodic refresh (default: 5 minutes)
 */
export const useAutoRefreshUserData = (enabled: boolean = true, refreshInterval: number = 5 * 60 * 1000) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(Date.now());

  // Function to refresh user data
  const refreshUserData = () => {
    if (isAuthenticated) {
      console.log('Auto-refreshing user data...');
      dispatch(setRefreshUserDataStart());
      lastRefreshRef.current = Date.now();
    }
  };

  // Handle app focus/blur events
  useEffect(() => {
    if (!enabled || !isAuthenticated) return;

    const handleFocus = () => {
      const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
      // Only refresh if it's been more than 30 seconds since last refresh
      if (timeSinceLastRefresh > 30000) {
        refreshUserData();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
        // Only refresh if it's been more than 30 seconds since last refresh
        if (timeSinceLastRefresh > 30000) {
          refreshUserData();
        }
      }
    };

    // Add event listeners
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, isAuthenticated]);

  // Handle periodic refresh
  useEffect(() => {
    if (!enabled || !isAuthenticated || refreshInterval <= 0) return;

    intervalRef.current = setInterval(() => {
      refreshUserData();
    }, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, isAuthenticated, refreshInterval]);

  return { refreshUserData };
};

export default useAutoRefreshUserData;
