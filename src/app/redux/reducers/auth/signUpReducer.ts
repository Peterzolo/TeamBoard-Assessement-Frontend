// userSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthState } from "../../types/auth";
import { localStore } from "../../../../utils/localStore";
import { StorageVariable } from "../../../../utils/constants/storageVariables";

// Helper function to safely check authentication from localStorage
const getAuthenticatedFromStorage = (): boolean => {
  const authValue = localStore.getItem(StorageVariable.IS_AUTHENTICATED);
  if (authValue === null || authValue === undefined) return false;
  // Handle both string "true" and boolean true
  return authValue === "true" || authValue === true;
};

const isAuthenticated = getAuthenticatedFromStorage();

const currentUserData = localStore.getItem(StorageVariable.USER_DATA)
  ? localStore.getItem(StorageVariable.USER_DATA)
  : null;

export const initialState: AuthState = {
  // IS AUTHENTICATED
  isAuthenticated,
  isAuthLoading: false,
  currentUserData,

  // SIGN UP
  signUpLoading: false,
  signUpError: null,
  signUpSuccess: false,
  signUpSuccessMessage: null,

  // COMPLETE SIGN UP
  completeSignUpLoading: false,
  completeSignUpError: null,
  completeSignUpSuccess: false,
  completeSignUpSuccessMessage: null,

  // CONFIRM SIGN UP
  confirmSignUpLoading: false,
  confirmSignUpError: null,
  confirmSignUpSuccess: false,
  confirmSignUpSuccessMessage: null,
  confirmationToken:
    localStore.getItem(StorageVariable.SIGNUP_CONFIRMATION_TOKEN) || null,

  // LOGIN
  loginLoading: false,
  loginError: null,
  loginSuccess: false,
  loginSuccessMessage: null,

  // LOGOUT
  logoutLoading: false,
  logoutError: null,
  logoutSuccess: false,

  // REFRESH TOKEN
  refreshTokenLoading: false,
  refreshTokenError: null,
  refreshTokenSuccess: false,

  // CURRENT USER
  currentUserLoading: false,
  currentUserError: null,

  // FORGOT PASSWORD
  forgotPasswordRequestLoading: false,
  forgotPasswordRequestError: null,
  forgotPasswordRequestSuccess: false,
  forgotPasswordRequestSuccessMessage: null,

  // RESET PASSWORD
  completePasswordResetLoading: false,
  completePasswordResetError: null,
  completePasswordResetSuccess: false,
  completePasswordResetSuccessMessage: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSignUpStart(state: AuthState, action: PayloadAction<any>) {
      state.signUpLoading = true;
      state.signUpError = null;
      state.signUpSuccess = false;
      state.signUpSuccessMessage = null;
    },
    setSignUpSuccess: (state: AuthState, action: PayloadAction<any>) => {
      state.signUpLoading = false;
      state.signUpSuccess = true;
      state.signUpSuccessMessage = action.payload.message;
      state.confirmSignUpSuccess = false;
      state.signUpError = null;
    },
    setSignUpFailure: (state: AuthState, action: PayloadAction<string>) => {
      state.signUpLoading = false;
      state.signUpError = action.payload;
      state.signUpSuccess = false;
      state.signUpSuccessMessage = null;
    },

    // COMPLETE SIGN UP

    setCompleteSignUpStart(state: AuthState, action: PayloadAction<any>) {
      state.completeSignUpLoading = true;
      state.completeSignUpError = null;
    },
    setCompleteSignUpSuccess: (
      state: AuthState,
      action: PayloadAction<any>
    ) => {
      state.completeSignUpLoading = false;
      state.completeSignUpSuccess = true;
      state.completeSignUpSuccessMessage = action.payload.message;
      state.completeSignUpError = null;
    },
    setCompleteSignUpFailure: (
      state: AuthState,
      action: PayloadAction<string>
    ) => {
      state.completeSignUpLoading = false;
      state.completeSignUpError = action.payload;
    },

    setConfirmSignUpUpStart(state: AuthState, action: PayloadAction<any>) {
      state.confirmSignUpLoading = true;
      state.confirmSignUpError = null;
      state.confirmSignUpError = null;
      state.confirmSignUpSuccess = false;
    },
    setConfirmSignUpSuccess: (state: AuthState, action: PayloadAction<any>) => {
      state.confirmSignUpLoading = false;
      state.confirmSignUpSuccess = true;
      state.confirmSignUpSuccessMessage = action.payload.message;

      // Store the confirmation token in state only (not localStorage for cross-browser compatibility)
      if (action.payload.token) {
        state.confirmationToken = action.payload.token;
        // Note: Token will be passed via URL parameters for cross-browser compatibility
      }
    },
    setConfirmSignUpFailure: (
      state: AuthState,
      action: PayloadAction<string>
    ) => {
      state.confirmSignUpLoading = false;
      state.confirmSignUpError = action.payload;
      state.confirmSignUpSuccess = false;
      state.confirmSignUpSuccessMessage = null;
    },

    setLoginRequestStart(state: AuthState, action: PayloadAction<any>) {
      state.loginLoading = true;
      state.loginError = null;
      state.loginSuccess = false;
      state.loginSuccessMessage = null;
    },
    setLoginRequestSuccess: (state: AuthState, action: PayloadAction<any>) => {
      state.loginLoading = false;
      state.loginSuccess = true;
      state.isAuthenticated = true;
      state.currentUserData = action.payload.user;
      state.loginSuccessMessage = action.payload.message;
      localStore.setItem(StorageVariable.IS_AUTHENTICATED, true);
      localStore.setItem(StorageVariable.USER_DATA, action.payload.user);
      // Store user ID separately for easy access
      if (action.payload.user?.id) {
        localStore.setItem(StorageVariable.USER_ID, action.payload.user.id);
      }
      state.loginError = null;

      // Note: This action sets initial user data during login.
      // For subsequent updates, use setRefreshUserDataSuccess instead.
    },
    setLoginRequestFailure: (
      state: AuthState,
      action: PayloadAction<string>
    ) => {
      state.loginLoading = false;
      state.loginError = action.payload;
      state.loginSuccess = false;
      state.loginSuccessMessage = null;
      state.isAuthenticated = false;
    },
    setLogoutRequestStart(state: AuthState) {
      state.logoutLoading = true;
      state.logoutError = null;
      state.logoutSuccess = false;
    },
    setLogoutRequestSuccess: (state: AuthState) => {
      state.logoutLoading = false;
      state.logoutSuccess = true;
      state.logoutError = null;

      // Reset all authentication states
      state.isAuthenticated = false;
      state.isAuthLoading = false;
      state.currentUserData = null;
      state.currentUserLoading = false;
      state.currentUserError = null;

      // Reset all sign-up states
      state.signUpLoading = false;
      state.signUpError = null;
      state.signUpSuccess = false;
      state.signUpSuccessMessage = null;

      // Reset complete sign-up states
      state.completeSignUpLoading = false;
      state.completeSignUpError = null;
      state.completeSignUpSuccess = false;
      state.completeSignUpSuccessMessage = null;

      // Reset confirm sign-up states
      state.confirmSignUpLoading = false;
      state.confirmSignUpError = null;
      state.confirmSignUpSuccess = false;
      state.confirmSignUpSuccessMessage = null;
      state.confirmationToken = null;

      // Reset login states
      state.loginLoading = false;
      state.loginError = null;
      state.loginSuccess = false;
      state.loginSuccessMessage = null;

      // Reset refresh token states
      state.refreshTokenLoading = false;
      state.refreshTokenError = null;
      state.refreshTokenSuccess = false;

      // Reset forgot password states
      state.forgotPasswordRequestLoading = false;
      state.forgotPasswordRequestError = null;
      state.forgotPasswordRequestSuccess = false;
      state.forgotPasswordRequestSuccessMessage = null;

      // Reset password reset states
      state.completePasswordResetLoading = false;
      state.completePasswordResetError = null;
      state.completePasswordResetSuccess = false;
      state.completePasswordResetSuccessMessage = null;
    },
    setLogoutRequestFailure(state: AuthState, action: PayloadAction<any>) {
      state.logoutLoading = false;
      state.logoutError = action.payload;
      state.logoutSuccess = false;
      state.isAuthenticated = true; // Keep authenticated state if logout fails
    },
    setRefreshTokenRequestStart(state: AuthState, action: PayloadAction<any>) {
      state.refreshTokenLoading = true;
      state.refreshTokenError = null;
      state.refreshTokenSuccess = false;
      state.isAuthenticated = false; // Reset authentication state on refresh request
    },
    setRefreshTokenRequestSuccess: (
      state: AuthState,
      action: PayloadAction<any>
    ) => {
      state.refreshTokenLoading = false;
      state.refreshTokenSuccess = true;
      state.isAuthenticated = true; // Set authenticated state on successful refresh
      state.refreshTokenError = null;
      // Optionally, you can update the user details here if needed
      state.currentUserData = action.payload.userDetails;
    },
    setRefreshTokenRequestFailure(
      state: AuthState,
      action: PayloadAction<any>
    ) {
      state.refreshTokenLoading = false;
      state.refreshTokenError = action.payload;
      state.refreshTokenSuccess = false;
      state.isAuthenticated = false;
      state.currentUserData = null;
    },
    setForgotPasswordRequestStart(
      state: AuthState,
      action: PayloadAction<any>
    ) {
      state.forgotPasswordRequestLoading = true;
      state.forgotPasswordRequestError = null;
      state.forgotPasswordRequestSuccess = false;
      state.forgotPasswordRequestSuccessMessage = null;
    },
    setForgotPasswordRequestSuccess: (
      state: AuthState,
      action: PayloadAction<any>
    ) => {
      state.forgotPasswordRequestLoading = false;
      state.forgotPasswordRequestError = null;
      state.forgotPasswordRequestSuccess = true;
      state.forgotPasswordRequestSuccessMessage = action.payload.message;
    },
    setForgotPasswordRequestFailure(
      state: AuthState,
      action: PayloadAction<any>
    ) {
      state.forgotPasswordRequestLoading = false;
      state.forgotPasswordRequestError = action.payload;
      state.forgotPasswordRequestSuccess = false;
      state.forgotPasswordRequestSuccessMessage = null;
    },

    // RESET PASSWORD
    setCompleteResetPasswordStart(
      state: AuthState,
      action: PayloadAction<any>
    ) {
      state.completePasswordResetLoading = true;
      state.completePasswordResetError = null;
      state.completePasswordResetSuccess = false;
      state.completePasswordResetSuccessMessage = null;
    },
    setCompleteResetPasswordSuccess: (
      state: AuthState,
      action: PayloadAction<any>
    ) => {
      state.completePasswordResetLoading = false;
      state.completePasswordResetSuccess = true;
      state.completePasswordResetSuccessMessage = action.payload.message;
      state.completePasswordResetError = null;
    },
    setCompleteResetPasswordFailure: (
      state: AuthState,
      action: PayloadAction<string>
    ) => {
      state.completePasswordResetLoading = false;
      state.completePasswordResetError = action.payload;
      state.completePasswordResetSuccess = false;
      state.completePasswordResetSuccessMessage = null;
    },

    resetSignUpState(state: AuthState) {
      state.signUpLoading = false;
      state.signUpError = null;
      state.signUpSuccess = false;
      state.signUpSuccessMessage = null;
    },
    confirmSignUpReset(state: AuthState) {
      state.confirmSignUpSuccess = false;
    },

    resetAuthState(state: AuthState) {
      state.signUpSuccess = false;
      state.forgotPasswordRequestSuccess = false;
      state.completePasswordResetSuccess = false;
    },

    clearError(state: AuthState) {
      state.signUpError = null;
      state.completePasswordResetError = null;
      state.confirmSignUpError = null;
      state.loginError = null;
      state.logoutError = null;
      state.refreshTokenError = null;
      state.forgotPasswordRequestError = null;
      state.completePasswordResetError = null;
    },

    // REFRESH USER DATA ACTIONS
    setRefreshUserDataStart(state: AuthState) {
      state.currentUserLoading = true;
      state.currentUserError = null;
    },
    setRefreshUserDataSuccess(state: AuthState, action: PayloadAction<any>) {
      state.currentUserLoading = false;
      state.currentUserError = null;
      state.currentUserData = action.payload;

      // Update localStorage with fresh data
      localStore.setItem(StorageVariable.USER_DATA, action.payload);

      // Note: This action is used to refresh user data after updates.
      // It's the preferred way to update user data without affecting authentication state.
    },
    setRefreshUserDataFailure(state: AuthState, action: PayloadAction<any>) {
      state.currentUserLoading = false;
      state.currentUserError = action.payload;
    },
  },
});

export const {
  setSignUpStart,
  setSignUpSuccess,
  setSignUpFailure,
  setCompleteSignUpStart,
  setCompleteSignUpSuccess,
  setCompleteSignUpFailure,
  setConfirmSignUpUpStart,
  setConfirmSignUpSuccess,
  setConfirmSignUpFailure,
  setLoginRequestStart,
  setLoginRequestSuccess,
  setLoginRequestFailure,
  setLogoutRequestStart,
  setLogoutRequestSuccess,
  setLogoutRequestFailure,
  setRefreshTokenRequestStart,
  setRefreshTokenRequestSuccess,
  setRefreshTokenRequestFailure,
  setForgotPasswordRequestStart,
  setForgotPasswordRequestSuccess,
  setForgotPasswordRequestFailure,
  setCompleteResetPasswordStart,
  setCompleteResetPasswordSuccess,
  setCompleteResetPasswordFailure,
  setRefreshUserDataStart,
  setRefreshUserDataSuccess,
  setRefreshUserDataFailure,
  resetSignUpState,
  confirmSignUpReset,
  resetAuthState,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
