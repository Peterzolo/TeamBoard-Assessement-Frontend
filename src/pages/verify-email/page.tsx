"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { AuthLayout } from "@/app/Components/AuthLayout";

import {
  confirmSignUpErrorSelector,
  confirmSignUpLoadingSelector,
  confirmSignUpSuccessSelector,
} from "../../app/redux/reducers/auth/selectors/signupSelector";
import { setConfirmSignUpUpStart } from "../../app/redux/reducers/auth/signUpReducer";
import AuthLayout from "../../layouts/AuthLayout";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const token = searchParams.get("token");

  const loading = useSelector(confirmSignUpLoadingSelector);
  const success = useSelector(confirmSignUpSuccessSelector);
  const error = useSelector(confirmSignUpErrorSelector);

  useEffect(() => {
    if (!token) {
      return;
    }

    // Dispatch the saga action to verify email
    dispatch(setConfirmSignUpUpStart({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    if (success && token) {
      navigate(`/screens/auth/complete-sign-up?token=${token}`, { replace: true });
    }
  }, [success, token, navigate]);

  // Debug: Log all state changes
  useEffect(() => {}, [loading, success, error, token]);

  if (!token) {
    return (
      <AuthLayout>
        <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
          <div className="text-center">
            <p className="text-red-600 text-lg font-medium mb-4">No verification token found</p>
            <p className="text-gray-600 text-sm">Please check your email for a valid verification link.</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Verification Failed</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm mb-4">This could be due to:</p>
          <ul className="text-gray-600 text-sm text-left max-w-md mx-auto mb-6 space-y-1">
            <li>• Backend server not running</li>
            <li>• Network connectivity issues</li>
            <li>• Invalid or expired token</li>
            <li>• CORS configuration problems</li>
          </ul>
          <button
            onClick={() => {
              console.log("Retrying verification...");
              dispatch(setConfirmSignUpUpStart({ token }));
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Retry Verification
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Email Verified!</h2>
          <p className="text-green-600 text-lg font-medium mb-2">Email verified successfully!</p>
          <p className="text-gray-600 text-sm">Redirecting to complete your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Verifying Email</h2>
        <p className="text-blue-600 font-medium">Verifying your email...</p>
        {loading && (
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we verify your email address.
          </p>
        )}
      </div>
    </div>
  );
};

export default function VerifyEmailWithLayout() {
  return (
    <AuthLayout>
      <VerifyEmail />
    </AuthLayout>
  );
}
