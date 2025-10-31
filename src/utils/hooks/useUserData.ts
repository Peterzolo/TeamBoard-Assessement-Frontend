"use client";

import { useState, useEffect } from "react";
import { localStore } from "@/app/utils/localStore";
import { StorageVariable } from "@/app/utils/constants/storageVariables";
import { BackofficeUserType, IUser } from "@/app/redux/types/auth";

export const useStoredUserData = (): IUser | null => {
  const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUserdata = localStore.getItem(
      StorageVariable.LOGGED_IN_USER_DATA
    );
    if (storedUserdata) {
      setUserData(storedUserdata);
    }
  }, []);

  return userData;
};

// Define the type of userType if you have specific values
type UserType =
  | BackofficeUserType.SUPER_ADMIN
  | BackofficeUserType.ADMIN
  | BackofficeUserType.MANAGER
  | BackofficeUserType.SUPERVISOR
  | BackofficeUserType.ACCOUNT;

export const useUserType = (): UserType => {
  const [userType, setUserType] = useState<UserType>(
    BackofficeUserType.SUPER_ADMIN
  ); // Default to 'DEFAULT_USER_TYPE' or any appropriate fallback

  useEffect(() => {
    // Fetch userType from local storage
    const storedUserType = localStore.getItem(StorageVariable.USER_TYPE);
    if (storedUserType) {
      setUserType(storedUserType as UserType); // Type assertion if necessary
    }
  }, []);

  return userType;
};
