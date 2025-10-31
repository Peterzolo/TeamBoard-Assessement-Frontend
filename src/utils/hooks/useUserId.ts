import { useSelector } from "react-redux";
import { currentUserDataSelector } from "@/app/redux/reducers/auth/selectors/signupSelector";
import { StorageVariable } from "@/app/utils/constants/storageVariables";

export const useUserId = () => {
  const currentUser = useSelector(currentUserDataSelector);
  
  // Get user ID from Redux state first, then fallback to localStorage
  const getUserId = (): string | null => {
    if (currentUser?.id) {
      return currentUser.id;
    }
    
    // Fallback to localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem(StorageVariable.USER_ID);
    }
    
    return null;
  };

  // Get user ID with loading state
  const userId = getUserId();
  const isLoading = !currentUser && typeof window !== "undefined";

  return {
    userId,
    isLoading,
    currentUser,
    // Helper function to check if user is authenticated
    isAuthenticated: !!userId,
  };
};
