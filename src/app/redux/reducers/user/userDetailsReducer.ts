// dashboardOverview.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { IBasicQueryFilter, UserState } from "../../types/user";

export const initialState: UserState = {
  // Fetch all users
  fetchAllUsersLoading: false,
  fetchAllUsersError: null,
  allUsers: [],
  totalUsers: 0,

  //   Fetch user details

  fetchUserDetailsLoading: false,
  fetchUserDetailsError: null,
  userDetails: null,

  // Create user
  createUserLoading: false,
  createUserError: null,
  createUserSuccess: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAllUsersStart(
      state: UserState,
      action: PayloadAction<IBasicQueryFilter>
    ) {
      state.fetchAllUsersLoading = true;
      state.fetchAllUsersError = null;
    },

    setAllUsersSuccess(state: UserState, action: PayloadAction<any>) {
      state.fetchAllUsersLoading = false;
      state.fetchAllUsersError = null;
      state.allUsers = action.payload.data;
      state.totalUsers =
        action.payload.total || action.payload.data?.length || 0;
    },

    setAllUsersFailure(state: UserState, action: PayloadAction<any>) {
      state.fetchAllUsersLoading = false;
      state.fetchAllUsersError = action.payload;
    },

    // Fetch user details
    setUserDetailsStart(state: UserState, action: PayloadAction<any>) {
      state.fetchUserDetailsLoading = true;
      state.fetchUserDetailsError = null;
    },

    // Fetch user details
    setUserDetailsSuccess(state: UserState, action: PayloadAction<any>) {
      state.fetchUserDetailsLoading = false;
      state.fetchUserDetailsError = null;
      state.userDetails = action.payload;
    },

    setUserDetailsFailure(state: UserState, action: PayloadAction<any>) {
      state.fetchUserDetailsLoading = false;
      state.fetchUserDetailsError = action.payload.error;
    },

    // Create user actions
    setCreateUserStart(state: UserState, action: PayloadAction<{ email: string; role: string }>) {
      state.createUserLoading = true;
      state.createUserError = null;
      state.createUserSuccess = false;
    },
    setCreateUserSuccess(state: UserState, action: PayloadAction<any>) {
      state.createUserLoading = false;
      state.createUserSuccess = true;
      state.createUserError = null;
    },
    setCreateUserFailure(state: UserState, action: PayloadAction<any>) {
      state.createUserLoading = false;
      state.createUserError = action.payload;
      state.createUserSuccess = false;
    },
    resetCreateUser(state: UserState) {
      state.createUserSuccess = false;
      state.createUserError = null;
    },
    clearError(state: UserState) {
      state.fetchAllUsersError = null;
      state.fetchUserDetailsError = null;
    },
  },
});

export const {
  clearError,
  setAllUsersStart,
  setAllUsersSuccess,
  setAllUsersFailure,
  //   Fetch user details
  setUserDetailsStart,
  setUserDetailsSuccess,
  setUserDetailsFailure,
  // Create user
  setCreateUserStart,
  setCreateUserSuccess,
  setCreateUserFailure,
  resetCreateUser,
} = userSlice.actions;

// Selectors
export const selectAllUsers = (state: { user: UserState }) =>
  state.user.allUsers;
export const selectAllUsersLoading = (state: { user: UserState }) =>
  state.user.fetchAllUsersLoading;
export const selectAllUsersError = (state: { user: UserState }) =>
  state.user.fetchAllUsersError;
export const selectTotalUsers = (state: { user: UserState }) =>
  state.user.totalUsers;

export const selectUserDetails = (state: { user: UserState }) =>
  state.user.userDetails;
export const selectUserDetailsLoading = (state: { user: UserState }) =>
  state.user.fetchUserDetailsLoading;
export const selectUserDetailsError = (state: { user: UserState }) =>
  state.user.fetchUserDetailsError;

// Create user selectors
export const selectCreateUserLoading = (state: { user: UserState }) =>
  state.user.createUserLoading;
export const selectCreateUserError = (state: { user: UserState }) =>
  state.user.createUserError;
export const selectCreateUserSuccess = (state: { user: UserState }) =>
  state.user.createUserSuccess;

export default userSlice.reducer;
