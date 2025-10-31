import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { localStore } from "@/app/utils/localStore";
import { StorageVariable } from "@/app/utils/constants/storageVariables";
import { isAuthenticatedSelector } from "@/app/redux/reducers/auth/selectors/signupSelector";

export const useAuthentication = () => {
  const isAuthFromStore = useSelector(isAuthenticatedSelector);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthentication = () => {
      const isAuthenticatedFromStorage = localStore.getItem(
        StorageVariable.IS_AUTHENTICATED
      );

      const storedUserId = localStore.getItem(StorageVariable.USER_ID);
      setIsAuthenticated(!!isAuthenticatedFromStorage);
      setUserId(storedUserId || null);
    };

    checkAuthentication();
  }, []);

  return {
    isAuthenticated: isAuthFromStore || isAuthenticated,
    userId,
  };
};
