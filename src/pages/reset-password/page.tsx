"use client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, type Resolver } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  completePasswordResetErrorSelector,
  completePasswordResetLoadingSelector,
  completePasswordResetSuccessSelector,
} from "../../app/redux/reducers/auth/selectors/signupSelector";
import { setCompleteResetPasswordStart, resetAuthState } from "../../app/redux/reducers/auth/signUpReducer";
import { FlashMessage } from "../../Components/FlashMessage/Flashmessage";
import { TextInput2 } from "../../Components/Input/TextInput2";
import { Button } from "../../Components/Button/Button";
import BlankPageLoader from "../../Components/BlankPageLoader/BlankPageLoader";
import AuthLayout from "../../layouts/AuthLayout";

type FormValues = {
  newPassword: string;
  confirmPassword: string;
  token: string;
};

const schema = yup
  .object({
    newPassword: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
    token: yup.string().required("Email confirmation token is required"),
  })
  .required();

const resolver = yupResolver(schema) as Resolver<FormValues, any>;

const PasswordResetPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [resetToken, setResetToken] = useState<string | null>(null);

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loading = useSelector(completePasswordResetLoadingSelector);
  const resetError = useSelector(completePasswordResetErrorSelector);
  const completeResetSuccess = useSelector(
    completePasswordResetSuccessSelector
  );

  // Check if token exists in URL, if not redirect to forgot password page
  useEffect(() => {
    if (isMounted) {
      const urlToken = searchParams.get("token");

      if (urlToken) {
        setResetToken(urlToken);
        console.log("Reset Token from URL:", urlToken);
      } else {
        // No token found in URL, redirect to forgot password
        console.log(
          "No reset token found in URL, redirecting to forgot password"
        );
        navigate("/screens/auth/forgot-password", { replace: true });
      }
    }
  }, [isMounted, searchParams, navigate]);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      token: "",
    },
  });

  // Set token value when resetToken is loaded
  useEffect(() => {
    if (resetToken) {
      setValue("token", resetToken);
    }
  }, [resetToken, setValue]);

  const onSubmit = (data: FormValues) => {
    if (!isMounted || !resetToken) {
      navigate("/screens/auth/forgot-password", { replace: true });
      return;
    }

    const formData = {
      newPassword: data.newPassword,
      token: data.token,
    };
    console.log("Password Reset Form Data:", formData);
    dispatch(setCompleteResetPasswordStart(formData));
  };

  useEffect(() => {
    if (completeResetSuccess) {
      navigate("/", { replace: true });
      setTimeout(() => {
        dispatch(resetAuthState());
      }, 100);
    }
  }, [completeResetSuccess, navigate, dispatch]);

  if (loading) {
    return <BlankPageLoader />;
  }

  if (!isMounted) {
    return (
      <AuthLayout>
        <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!resetToken) {
    return (
      <AuthLayout>
        <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
          <div className="text-center">
            <p className="text-red-600 text-lg font-medium mb-4">
              Invalid or missing reset token. Please request a new password reset.
            </p>
            <Link
              to="/screens/auth/forgot-password"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Request New Reset
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Reset your password
        </h2>
        <p className="mt-1 mb-6 text-center text-sm text-gray-600">
          Enter your new password below to complete the reset process.
        </p>

        {resetError && (
          <FlashMessage message={resetError} type="error" />
        )}
        {completeResetSuccess && (
          <FlashMessage
            message="Password reset successful! Redirecting to login..."
            type="success"
          />
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <TextInput2
              name="newPassword"
              label="New password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={watch("newPassword")}
              onChange={(e) => setValue("newPassword", e.target.value)}
              error={errors.newPassword?.message}
              backgroundColor="bg-white"
              borderRadius="rounded-lg"
              labelColor="text-gray-800"
              className="text-base text-gray-900 pr-12"
              placeholderColor="placeholder-gray-400"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <div className="relative">
            <TextInput2
              name="confirmPassword"
              label="Confirm new password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              value={watch("confirmPassword")}
              onChange={(e) => setValue("confirmPassword", e.target.value)}
              error={errors.confirmPassword?.message}
              backgroundColor="bg-white"
              borderRadius="rounded-lg"
              labelColor="text-gray-800"
              className="text-base text-gray-900 pr-12"
              placeholderColor="placeholder-gray-400"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <Button variant="primary" type="submit" width="100%" height="48px" disabled={loading}>
            {loading ? "Resetting password..." : "Reset password"}
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
  );
};

export default PasswordResetPage;
