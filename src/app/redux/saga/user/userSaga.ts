import { takeLatest, call, put } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  setAllUsersFailure,
  setAllUsersStart,
  setAllUsersSuccess,
  setUserDetailsFailure,
  setUserDetailsStart,
  setUserDetailsSuccess,
  setCreateUserStart,
  setCreateUserSuccess,
  setCreateUserFailure,
} from "../../reducers/user/userDetailsReducer";
import type { IBasicQueryFilter } from "../../types/user";
import { request } from "../../../../utils/services/api";

export function* fetchAllUsersSaga(
  action: PayloadAction<IBasicQueryFilter>
): Generator<any, void, any> {
  try {
    const {
      search,
      role,
      firstName,
      lastName,
      email,
      phoneNumber,
      isEmailVerified,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      // Legacy support
      pageSize,
    } = action.payload;

    const queryParams = new URLSearchParams();

    // Search and filtering parameters
    if (search && search.trim()) {
      queryParams.append("search", search.trim());
    }

    if (role && role.trim()) {
      queryParams.append("role", role.trim());
    }

    if (firstName && firstName.trim()) {
      queryParams.append("firstName", firstName.trim());
    }

    if (lastName && lastName.trim()) {
      queryParams.append("lastName", lastName.trim());
    }

    if (email && email.trim()) {
      queryParams.append("email", email.trim());
    }

    if (phoneNumber && phoneNumber.trim()) {
      queryParams.append("phoneNumber", phoneNumber.trim());
    }

    // Handle email verification status (support both boolean and string)
    if (
      isEmailVerified !== undefined &&
      isEmailVerified !== null &&
      isEmailVerified !== ""
    ) {
      const emailVerifiedValue =
        typeof isEmailVerified === "boolean"
          ? isEmailVerified.toString()
          : String(isEmailVerified);
      queryParams.append("isEmailVerified", emailVerifiedValue);
    }

    // Pagination parameters
    const pageValue = page || pageSize || 1;
    const limitValue = limit || 10;

    // Validate pagination values
    const validatedPage = Math.max(1, Number(pageValue));
    const validatedLimit = Math.min(100, Math.max(1, Number(limitValue)));

    queryParams.append("page", String(validatedPage));
    queryParams.append("limit", String(validatedLimit));

    // Sorting parameters
    const validSortFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "role",
      "isEmailVerified",
      "createdAt",
      "updatedAt",
    ];
    const validSortOrders = ["asc", "desc"];

    const validatedSortBy = validSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";
    const validatedSortOrder = validSortOrders.includes(sortOrder)
      ? sortOrder
      : "desc";

    queryParams.append("sortBy", validatedSortBy);
    queryParams.append("sortOrder", validatedSortOrder);

    const url = `/users?${queryParams.toString()}`;

    const config = {
      method: "GET",
      url,
      credentials: "include",
    };

    console.log("API Request URL:", url);
    console.log("API Request Config:", config);

    const response = yield call(request, config);
    console.log("Fetched Users SAGA:", response);
    yield put(setAllUsersSuccess(response));
  } catch (error: any) {
    console.error("Fetch Users Error SAGA:", error);
    yield put(setAllUsersFailure(error.message));
  }
}

export function* fetchUserDetailsSaga(
  action: PayloadAction<{ userId: string }>
): Generator<any, void, any> {
  try {
    const { userId } = action.payload;
    console.log("USER ID SAGA", userId);
    console.log("USER ID SAGA PAYLOAD ACTION", action.payload);

    // Use the correct endpoint for fetching a single user by ID
    const url = `/users/${userId}`;

    const config = {
      method: "GET",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    console.log("Fetched User details SAGA:", response);
    yield put(setUserDetailsSuccess(response));
  } catch (error: any) {
    console.error("Fetch user Details Error SAGA:", error);
    yield put(setUserDetailsFailure(error.message));
  }
}

export function* createUserSaga(
  action: PayloadAction<{ email: string; role: string }>
): Generator<any, void, any> {
  try {
    const { email, role } = action.payload;
    console.log("CREATE USER SAGA", { email, role });

    const config = {
      method: "POST",
      url: "/users/invite",
      credentials: "include",
      data: { email, role },
    };

    const response = yield call(request, config);
    console.log("Created User SAGA:", response);

    yield put(setCreateUserSuccess(response));
  } catch (error: any) {
    console.error("Create User Error SAGA:", error);
    yield put(setCreateUserFailure(error.message || "Failed to create user"));
  }
}

export default function* userSaga() {
  yield takeLatest(setAllUsersStart.type, fetchAllUsersSaga);
  yield takeLatest(setUserDetailsStart.type, fetchUserDetailsSaga);
  yield takeLatest(setCreateUserStart.type, createUserSaga);
}
