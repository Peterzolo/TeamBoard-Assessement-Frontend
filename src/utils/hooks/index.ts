/**
 * User Data Management Documentation
 * 
 * This file contains utilities and hooks for managing user data in the application.
 * The main goal is to ensure that user data is always up-to-date and synchronized
 * with the server without requiring users to log in again.
 * 
 * ## Key Concepts:
 * 
 * 1. **setLoginRequestSuccess**: Sets initial user data during login
 * 2. **setRefreshUserDataSuccess**: Used to refresh user data after updates (unified approach)
 * 
 * ## Usage Patterns:
 * 
 * ### Manual Refresh
 * ```typescript
 * import { useRefreshUserData } from '@/app/utils/hooks/useRefreshUserData';
 * 
 * const MyComponent = () => {
 *   const { refreshUserData } = useRefreshUserData();
 *   
 *   const handleRefresh = () => {
 *     refreshUserData(); // Triggers user data refresh
 *   };
 * };
 * ```
 * 
 * ### Auto Refresh
 * ```typescript
 * import { useAutoRefreshUserData } from '@/app/utils/hooks/useAutoRefreshUserData';
 * 
 * const MyComponent = () => {
 *   // Auto-refresh every 5 minutes and on app focus
 *   useAutoRefreshUserData(true, 5 * 60 * 1000);
 * };
 * ```
 * 
 * ## When User Data is Refreshed:
 * 
 * 1. **After Profile Image Updates**: Automatically refreshed
 * 2. **After Background Image Updates**: Automatically refreshed  
 * 3. **After Profile Completion**: Automatically refreshed
 * 4. **On App Focus**: Refreshed if more than 30 seconds since last refresh
 * 5. **Periodically**: Every 5 minutes (configurable)
 * 6. **Manually**: Via refresh button or programmatic calls
 * 
 * ## Benefits:
 * 
 * - No need to log out/in to see updated data
 * - Consistent state across the application
 * - Better user experience
 * - Automatic synchronization with server
 */

export { useRefreshUserData } from './useRefreshUserData';
export { useAutoRefreshUserData } from './useAutoRefreshUserData';
