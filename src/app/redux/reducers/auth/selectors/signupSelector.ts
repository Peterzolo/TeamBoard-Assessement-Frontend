import { createSelector } from "reselect";
import { initialState } from "../signUpReducer";
import type { RootState } from "../../../store/store";

export const mySelector = (state: RootState) => state.signUp || initialState;

// SIGN UP SELECTORS
export const signUpLoadingSelector = createSelector(
  mySelector,
  (state) => state.signUpLoading
);
export const signUpErrorSelector = createSelector(
  mySelector,
  (state) => state.signUpError
);
export const signUpSuccessSelector = createSelector(
  mySelector,
  (state) => state.signUpSuccess
);

// COMPLETE SIGN UP SELECTORS
export const completeSignUpLoadingSelector = createSelector(
  mySelector,
  (state) => state.completeSignUpLoading
);
export const completeSignUpErrorSelector = createSelector(
  mySelector,
  (state) => state.completeSignUpError
);
export const completeSignUpSuccessSelector = createSelector(
  mySelector,
  (state) => state.completeSignUpSuccess
);

// CONFIRM SIGN UP SELECTORS
export const confirmSignUpLoadingSelector = createSelector(
  mySelector,
  (state) => state.confirmSignUpLoading
);
export const confirmSignUpErrorSelector = createSelector(
  mySelector,
  (state) => state.confirmSignUpError
);
export const confirmSignUpSuccessSelector = createSelector(
  mySelector,
  (state) => state.confirmSignUpSuccess
);

// LOGIN SELECTORS
export const loginLoadingSelector = createSelector(
  mySelector,
  (state) => state.loginLoading
);
export const loginErrorSelector = createSelector(
  mySelector,
  (state) => state.loginError
);
export const loginSuccessSelector = createSelector(
  mySelector,
  (state) => state.loginSuccess
);
export const isAuthenticatedSelector = createSelector(
  mySelector,
  (state) => state.isAuthenticated
);
export const currentUserLoadingSelector = createSelector(
  mySelector,
  (state) => state.currentUserLoading
);
export const currentUserErrorSelector = createSelector(
  mySelector,
  (state) => state.currentUserError
);
export const currentUserDataSelector = createSelector(
  mySelector,
  (state) => state.currentUserData
);
export const isAuthLoadingSelector = createSelector(
  mySelector,
  (state) => state.isAuthLoading
);

// LOGOUT SELECTORS
export const logoutLoadingSelector = createSelector(
  mySelector,
  (state) => state.logoutLoading
);
export const logoutErrorSelector = createSelector(
  mySelector,
  (state) => state.logoutError
);
export const logoutSuccessSelector = createSelector(
  mySelector,
  (state) => state.logoutSuccess
);

// FORGOT PASSWORD SELECTORS
export const forgotPasswordResetLoadingSelector = createSelector(
  mySelector,
  (state) => state.forgotPasswordRequestLoading
);
export const forgotPasswordResetErrorSelector = createSelector(
  mySelector,
  (state) => state.forgotPasswordRequestError
);
export const forgotPasswordResetSuccessSelector = createSelector(
  mySelector,
  (state) => state.forgotPasswordRequestSuccess
);

// COMPLETE PASSWORD RESET SELECTORS
export const completePasswordResetLoadingSelector = createSelector(
  mySelector,
  (state) => state.completePasswordResetLoading
);
export const completePasswordResetErrorSelector = createSelector(
  mySelector,
  (state) => state.completePasswordResetError
);
export const completePasswordResetSuccessSelector = createSelector(
  mySelector,
  (state) => state.completePasswordResetSuccess
);
