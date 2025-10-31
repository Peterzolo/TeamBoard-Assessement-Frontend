import { createSelector } from "reselect";
import type { RootState } from "../../../store/store";
import { initialState } from "../userDetailsReducer";

export const mySelector = (state: RootState) => state.user || initialState;

// SIGN UP SELECTORS
export const allUsersLoadingSelector = createSelector(
  mySelector,
  (state) => state.fetchAllUsersLoading
);
export const allUsersErrorSelector = createSelector(
  mySelector,
  (state) => state.fetchAllUsersError
);
export const allUsersSelector = createSelector(
  mySelector,
  (state) => state.allUsers
);
export const allUsersCountSelector = createSelector(
  mySelector,
  (state) => state.totalUsers
);

// User details

export const userDetailsLoadingSelector = createSelector(
  mySelector,
  (state) => state.fetchUserDetailsLoading
);
export const userDetailsErrorSelector = createSelector(
  mySelector,
  (state) => state.fetchUserDetailsError
);
export const userDetailsSelector = createSelector(
  mySelector,
  (state) => state.userDetails
);
