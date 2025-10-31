import { takeLatest, call, put } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  setCompleteResetPasswordFailure,
  setCompleteResetPasswordStart,
  setCompleteResetPasswordSuccess,
  setCompleteSignUpFailure,
  setCompleteSignUpStart,
  setCompleteSignUpSuccess,
  setConfirmSignUpFailure,
  setConfirmSignUpSuccess,
  setConfirmSignUpUpStart,
  setForgotPasswordRequestFailure,
  setForgotPasswordRequestStart,
  setForgotPasswordRequestSuccess,
  setLoginRequestFailure,
  setLoginRequestStart,
  setLoginRequestSuccess,
  setLogoutRequestFailure,
  setLogoutRequestStart,
  setLogoutRequestSuccess,
  setRefreshTokenRequestFailure,
  setRefreshTokenRequestStart,
  setRefreshTokenRequestSuccess,
  setSignUpFailure,
  setSignUpStart,
  setSignUpSuccess,
  setRefreshUserDataStart,
  setRefreshUserDataSuccess,
  setRefreshUserDataFailure,
} from "../../reducers/auth/signUpReducer";

import type {
  ICompleteProfiledata,
  IForgotPasswordRequest,
  ILoginData,
  ISignUpUser,
} from "../../types/auth";
import { localStore } from "../../../../utils/localStore";
import { StorageVariable } from "../../../../utils/constants/storageVariables";
import { request } from "../../../../utils/services/api";

function* signUpUser(
  action: PayloadAction<ISignUpUser>
): Generator<any, void, any> {
  try {
    const { email, termsAccepted } = action.payload;
    const userData: ISignUpUser = {
      email,

      termsAccepted,
    };

    const config = {
      method: "POST",
      url: "/users/customer-signup",
      data: userData,
      credentials: "include",
    };
    const response = yield call(request, config);
    yield put(setSignUpSuccess(response));
  } catch (error: any) {
    yield put(setSignUpFailure(error));
  }
}

function* completeSignUpSaga(
  action: PayloadAction<ICompleteProfiledata>
): Generator<any, void, any> {
  try {
    const { firstName, lastName, password, token } = action.payload;

    // Only include phoneNumber if it's a non-empty string
    const userData = {
      password,
      firstName,
      lastName,
      token,
    };

    // Ensure we never send undefined, null, or empty string values
    const cleanUserData = Object.fromEntries(
      Object.entries(userData).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    const config = {
      method: "POST",
      url: "/users/complete-profile",
      data: cleanUserData,
      credentials: "include",
    };

    const response = yield call(request, config);

    yield put(setCompleteSignUpSuccess(response));

    // Refresh user data after completing profile to get the latest information
    yield put(setRefreshUserDataStart());
  } catch (error: any) {
    yield put(setCompleteSignUpFailure(error));
  }
}

function* confirmSignUp(
  action: PayloadAction<{ token: string }>
): Generator<any, void, any> {
  try {
    const { token } = action.payload;

    // Make the verification request
    const config = {
      method: "GET",
      url: `/auth/verify-email?token=${token}`,
      credentials: "include",
    };

    // Make the request - handle both success and redirect responses
    try {
      const response = yield call(request, config);

      // Mark as successful and pass the token for storage
      yield put(
        setConfirmSignUpSuccess({
          message: "Email verified successfully",
          token: response?.token || token,
        })
      );
    } catch (requestError: any) {
      // Check if this is a redirect response (which the request utility might treat as error)

      // If the backend is redirecting, treat it as success
      if (requestError.message && requestError.message.includes("redirect")) {
        yield put(
          setConfirmSignUpSuccess({
            message: "Email verified successfully",
            token: token,
          })
        );
      } else {
        // Re-throw other errors
        throw requestError;
      }
    }

    // Note: Component will handle redirect based on Redux state
  } catch (error: any) {
    yield put(setConfirmSignUpFailure(error.message));
  }
}

function* login(
  action: PayloadAction<{
    formData: ILoginData;
  }>
): Generator<any, void, any> {
  try {
    const config = {
      method: "POST",
      url: `/auth/login`,
      data: action.payload.formData,
      credentials: "include",
    };
    const response = yield call(request, config);

    yield put(setLoginRequestSuccess(response));
  } catch (error: any) {
    yield put(setLoginRequestFailure(error.message));
  }
}

function* refreshAccessToken(): Generator<any, void, any> {
  try {
    const config = {
      method: "POST",
      url: "/auth/refresh",
      credentials: "include",
    };
    const response = yield call(request, config);
    yield put(setRefreshTokenRequestSuccess(response));
  } catch (error: any) {
    yield put(setRefreshTokenRequestFailure(error.message));
  }
}

function* logout(): Generator<any, void, any> {
  try {
    const config = {
      method: "POST",
      url: "/auth/logout",
      credentials: "include",
    };
    yield call(request, config);

    // Clear all localStorage items
    if (typeof window !== "undefined") {
      // Clear all authentication-related localStorage items
      localStore.removeItem(StorageVariable.ONBOARDING_TOKEN);
      localStore.removeItem(StorageVariable.ACCESS_TOKENS);
      localStore.removeItem(StorageVariable.REFRESH_TOKENS);
      localStore.removeItem(StorageVariable.TOKEN_EXPIRY);
      localStore.removeItem(StorageVariable.IS_AUTHENTICATED);
      localStore.removeItem(StorageVariable.USER_DATA);
      localStore.removeItem(StorageVariable.USER_EMAIL);
      localStore.removeItem(StorageVariable.AUTH_DATA);
      localStore.removeItem(StorageVariable.LOGGED_IN_USER_DATA);
      localStore.removeItem(StorageVariable.SUPER_ADMIN);
      localStore.removeItem(StorageVariable.USER_ID);
      localStore.removeItem(StorageVariable.USER_TYPE);
      localStore.removeItem(StorageVariable.ACCESS_TOKEN_EXPIRY);
      localStore.removeItem(StorageVariable.SIGNUP_CONFIRMATION_TOKEN);
      localStore.removeItem(StorageVariable.PASSWORD_RESET_TOKEN);

      // Clear any other app-specific data
      localStore.removeItem(StorageVariable.DRIVERS);
      localStore.removeItem(StorageVariable.SEARCH_QUERIES);
    }

    yield put(setLogoutRequestSuccess());
    yield put(setRefreshUserDataFailure(null));

    // Redirect to home page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  } catch (error: any) {
    yield put(setLogoutRequestFailure(error.message));
  }
}

function* forgotPassword(
  action: PayloadAction<{
    formData: IForgotPasswordRequest;
  }>
): Generator<any, void, any> {
  try {
    const config = {
      method: "POST",
      url: `/auth/forgot-password`,
      data: action.payload,
    };
    const response = yield call(request, config);

    // Store email and token in localStorage as fallback
    if (response.resetToken) {
      localStore.setItem(
        StorageVariable.PASSWORD_RESET_TOKEN,
        response.resetToken
      );
    }

    yield put(setForgotPasswordRequestSuccess(response));
  } catch (error: any) {
    yield put(setForgotPasswordRequestFailure(error.message));
  }
}

function* completePasswordReset(
  action: PayloadAction<{ token: string }>
): Generator<any, void, any> {
  try {
    const config = {
      method: "POST",
      url: `/auth/reset-password`,
      data: action.payload,
    };
    const response = yield call(request, config);

    yield put(setCompleteResetPasswordSuccess(response));
  } catch (error: any) {
    yield put(setCompleteResetPasswordFailure(error.message));
  }
}

export function* refreshUserData(): Generator<any, void, any> {
  try {
    const config = {
      method: "GET",
      url: "/auth/me",
      credentials: "include",
      logoutOnAuthError: false,
    };
    const response = yield call(request, config);

    yield put(setRefreshUserDataSuccess(response));
  } catch (error: any) {
    yield put(setRefreshUserDataFailure(error.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(setSignUpStart.type, signUpUser);
  yield takeLatest(setCompleteSignUpStart.type, completeSignUpSaga);
  yield takeLatest(setConfirmSignUpUpStart.type, confirmSignUp);
  yield takeLatest(setLoginRequestStart.type, login);
  yield takeLatest(setRefreshTokenRequestStart.type, refreshAccessToken);
  yield takeLatest(setLogoutRequestStart.type, logout);
  yield takeLatest(setForgotPasswordRequestStart.type, forgotPassword);
  yield takeLatest(setCompleteResetPasswordStart.type, completePasswordReset);
  yield takeLatest(setRefreshUserDataStart.type, refreshUserData);

  // Add more sagas as needed
}
