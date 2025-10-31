import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BlankPageLoader from "../BlankPageLoader/BlankPageLoader";
import {
  isAuthenticatedSelector,
  currentUserDataSelector,
} from "../../app/redux/reducers/auth/selectors/signupSelector";
import { localStore } from "../../utils/localStore";
import { StorageVariable } from "../../utils/constants/storageVariables";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: string[]; // Optional: restrict access to specific roles
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const isAuthenticatedFromRedux = useSelector(isAuthenticatedSelector);
  const currentUser = useSelector(currentUserDataSelector);

  // Get authentication state from localStorage as fallback
  const getAuthFromStorage = () => {
    const authValue = localStore.getItem(StorageVariable.IS_AUTHENTICATED);
    if (authValue === null || authValue === undefined) return false;
    return authValue === "true" || authValue === true;
  };
  
  const isAuthenticatedFromStorage = getAuthFromStorage();
  
  // Use Redux state if available (not null/undefined), otherwise fallback to localStorage
  const isAuthenticated = isAuthenticatedFromRedux !== null && isAuthenticatedFromRedux !== undefined 
    ? isAuthenticatedFromRedux 
    : isAuthenticatedFromStorage;

  // Ensure component is mounted and initialized on client side
  useEffect(() => {
    setIsMounted(true);
    // Small delay to ensure Redux store is initialized from localStorage
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted || isInitializing) return; // Don't redirect until mounted and initialized

    // Check both Redux and localStorage - prioritize Redux but fallback to localStorage
    const authCheck = isAuthenticatedFromRedux !== null && isAuthenticatedFromRedux !== undefined
      ? isAuthenticatedFromRedux
      : isAuthenticatedFromStorage;

    // Only redirect if we're definitely not authenticated (both Redux and storage say false)
    if (authCheck === false || (!authCheck && !isAuthenticatedFromStorage && isAuthenticatedFromRedux === false)) {
      navigate("/", { replace: true }); // redirect to home/login
    } else if (
      authCheck &&
      allowedRoles &&
      !allowedRoles.includes(currentUser?.role ?? "")
    ) {
      navigate("/dashboard", { replace: true }); // redirect to dashboard if authenticated but no permission
    }
  }, [isAuthenticatedFromRedux, isAuthenticatedFromStorage, currentUser, allowedRoles, navigate, isMounted, isInitializing]);

  // Show loading while mounting, initializing, or verifying authentication state
  if (
    !isMounted ||
    isInitializing ||
    isAuthenticatedFromRedux === undefined ||
    (allowedRoles && !currentUser)
  ) {
    return <BlankPageLoader />;
  }

  // Block access if unauthenticated or unauthorized
  if (!isAuthenticated) return null;
  if (allowedRoles && !allowedRoles.includes(currentUser?.role ?? ""))
    return null;

  return <>{children}</>;
};

export default AuthGuard;
