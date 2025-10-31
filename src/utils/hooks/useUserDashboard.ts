import { useState, useEffect } from "react";
import { useUserId } from "./useUserId";

interface UserDashboardData {
  orders: any[];
  recentActivity: any[];
  profile: any;
  isLoading: boolean;
  error: string | null;
}

export const useUserDashboard = () => {
  const { userId, currentUser, isAuthenticated } = useUserId();
  const [dashboardData, setDashboardData] = useState<UserDashboardData>({
    orders: [],
    recentActivity: [],
    profile: currentUser,
    isLoading: false,
    error: null,
  });

  // Fetch user-specific dashboard data
  const fetchUserDashboardData = async () => {
    if (!userId || !isAuthenticated) return;

    setDashboardData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Example API calls - you can customize these based on your backend
      const [ordersResponse, activityResponse] = await Promise.all([
        // Fetch user orders
        fetch(`/api/users/${userId}/orders`).then(res => res.json()),
        // Fetch recent activity
        fetch(`/api/users/${userId}/activity`).then(res => res.json()),
      ]);

      setDashboardData({
        orders: ordersResponse.orders || [],
        recentActivity: activityResponse.activity || [],
        profile: currentUser,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setDashboardData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      }));
    }
  };

  // Refresh dashboard data
  const refreshDashboard = () => {
    fetchUserDashboardData();
  };

  useEffect(() => {
    if (userId && isAuthenticated) {
      fetchUserDashboardData();
    }
  }, [userId, isAuthenticated]);

  return {
    ...dashboardData,
    userId,
    currentUser,
    isAuthenticated,
    refreshDashboard,
    // Helper functions
    getUserFullName: () => {
      if (currentUser?.firstName && currentUser?.lastName) {
        return `${currentUser.firstName} ${currentUser.lastName}`;
      }
      return currentUser?.email || 'User';
    },
    getUserInitials: () => {
      if (currentUser?.firstName && currentUser?.lastName) {
        return `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();
      }
      return currentUser?.email?.[0]?.toUpperCase() || 'U';
    },
  };
};
