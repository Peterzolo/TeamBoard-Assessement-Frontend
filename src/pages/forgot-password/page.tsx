"use client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, type Resolver } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPasswordResetErrorSelector,
  forgotPasswordResetLoadingSelector,
  forgotPasswordResetSuccessSelector,
} from "../../app/redux/reducers/auth/selectors/signupSelector";
import {
  resetAuthState,
  resetSignUpState,
  setForgotPasswordRequestStart,
} from "../../app/redux/reducers/auth/signUpReducer";
import AuthLayout from "../../layouts/AuthLayout";
import { FlashMessage } from "../../Components/FlashMessage/Flashmessage";
import { TextInput2 } from "../../Components/Input/TextInput2";
import { Button } from "../../Components/Button/Button";
import BlankPageLoader from "../../Components/BlankPageLoader/BlankPageLoader";

type FormValues = {
  email: string;
};

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
  })
  .required();

const resolver = yupResolver(schema) as Resolver<FormValues, any>;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [userEmail, setUserEmail] = useState("");

  const loading = useSelector(forgotPasswordResetLoadingSelector);
  const forgotPasswordError = useSelector(forgotPasswordResetErrorSelector);
  const forgotPasswordSuccess = useSelector(forgotPasswordResetSuccessSelector);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setUserEmail(data.email);
    const formData = {
      email: data.email,
    };
    dispatch(setForgotPasswordRequestStart(formData));
  };

  // Handle success and show modal
  useEffect(() => {
    if (forgotPasswordSuccess) {
      setShowSuccessModal(true);
      setCountdown(30);

      // Reset Redux state immediately to prevent re-triggering
      dispatch(resetAuthState());

      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setShowSuccessModal(false);
            navigate("/", { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [forgotPasswordSuccess, navigate, dispatch]);

  // Cleanup modal state when component unmounts or user navigates
  useEffect(() => {
    return () => {
      setShowSuccessModal(false);
      setCountdown(30);
      setUserEmail("");
    };
  }, []);

  if (loading) {
    return <BlankPageLoader />;
  }

  return (
    <>
      <AuthLayout>
        <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Reset your password
          </h2>
          <p className="mt-1 mb-6 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {forgotPasswordError && (
            <FlashMessage message={forgotPasswordError} type="error" />
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <TextInput2
              name="email"
              label="Email address"
              type="text"
              placeholder="Enter your email"
              value={watch("email")}
              onChange={(e) => setValue("email", e.target.value)}
              error={errors.email?.message}
              backgroundColor="bg-white"
              borderRadius="rounded-lg"
              labelColor="text-gray-800"
              className="text-base text-gray-900"
              placeholderColor="placeholder-gray-400"
            />

            <Button variant="primary" type="submit" width="100%" height="48px" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-700">
            Remember your password?{" "}
            <Link
              to="/"
              className="font-semibold text-blue-700 hover:text-blue-900"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </AuthLayout>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            {/* Success Icon */}
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

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Check your email!
            </h3>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to{" "}
              <span className="font-semibold text-blue-600">{userEmail}</span>
            </p>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Click the link in your email to reset your password. The link
                will expire in 24 hours.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                💡 <strong>Tip:</strong> The reset link will work in any browser
                or device.
              </p>
            </div>

            {/* Countdown */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">
                Redirecting to home page in:
              </p>
              <div className="text-2xl font-bold text-blue-600">
                {countdown} seconds
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setCountdown(30);
                  setUserEmail("");
                  dispatch(resetSignUpState());
                  navigate("/", { replace: true });
                }}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Home
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setCountdown(30);
                  setUserEmail("");
                  dispatch(resetSignUpState());
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPasswordPage;
