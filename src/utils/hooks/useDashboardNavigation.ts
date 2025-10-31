import { useRouter } from "next/navigation";
import { useUserId } from "./useUserId";
import { getDashboardRoute } from "@/app/utils/roleUtils";
import { useSelector } from "react-redux";
import { currentUserDataSelector } from "@/app/redux/reducers/auth/selectors/signupSelector";

export const useDashboardNavigation = () => {
  const router = useRouter();
  const { userId } = useUserId();
  const currentUser = useSelector(currentUserDataSelector);

  // Navigate to dashboard pages with clean URLs (no user ID)
  const navigateTo = (path: string, options?: { replace?: boolean }) => {
    // Use clean URLs without user ID for security
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };

  // Navigate to specific dashboard sections
  const navigateToOverview = (replace = false) => {
    // Use role-based routing for overview
    const overviewRoute = getDashboardRoute(currentUser);
    navigateTo(overviewRoute, { replace });
  };

  const navigateToOrders = (replace = false) => {
    navigateTo("/screens/dashboard/order", { replace });
  };

  const navigateToCreateOrder = (replace = false) => {
    navigateTo("/screens/dashboard/order/create", { replace });
  };

  const navigateToSettings = (replace = false) => {
    navigateTo("/screens/dashboard/setting", { replace });
  };

  const navigateToOrderDetails = (orderId: string, replace = false) => {
    navigateTo(`/screens/dashboard/order/${orderId}`, { replace });
  };

  // Get clean URL for a dashboard page (no user ID for security)
  const getDashboardUrl = (path: string) => {
    return path; // Return clean URL without user ID
  };

  // Check if current path is a dashboard path
  const isDashboardPath = (path: string) => {
    return path.startsWith("/screens/dashboard") || path.startsWith("/screens/admin-dashboard");
  };

  return {
    userId,
    navigateTo,
    navigateToOverview,
    navigateToOrders,
    navigateToCreateOrder,
    navigateToSettings,
    navigateToOrderDetails,
    getDashboardUrl,
    isDashboardPath,
  };
};
