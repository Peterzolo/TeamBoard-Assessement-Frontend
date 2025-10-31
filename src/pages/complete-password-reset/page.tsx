"use client";

import React, { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  completePasswordResetErrorSelector,
  completePasswordResetLoadingSelector,
  completePasswordResetSuccessSelector,
} from "../../app/redux/reducers/auth/selectors/signupSelector";
import BlankPageLoader from "../../Components/BlankPageLoader/BlankPageLoader";
import { FlashMessage } from "../../Components/FlashMessage/Flashmessage";
import { TextInput2 } from "../../Components/Input/TextInput2";
import { Button } from "../../Components/Button/Button";
import { setCompleteResetPasswordStart } from "../../app/redux/reducers/auth/signUpReducer";
import AuthLayout from "../../layouts/AuthLayout";

type FormValues = {
  password: string;
  confirmPassword: string;
  token: string;
};

const schema = yup
  .object({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .test("passwords-match", "Passwords must match", function (value) {
        return this.parent.password === value;
      }),
    token: yup.string().required("Reset token is required"),
  })
  .required();

const resolver = yupResolver(schema) as Resolver<FormValues, any>;

const PasswordReset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const resetError = useSelector(completePasswordResetErrorSelector);
  const dataLoading = useSelector(completePasswordResetLoadingSelector);
  const completeResetSuccess = useSelector(
    completePasswordResetSuccessSelector
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: "",
    },
    resolver,
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setResetToken(token);
      setValue("token", token);
    } else {
      navigate("/screens/auth/forgot-password", { replace: true });
    }
  }, [searchParams, setValue, navigate]);

  const onSubmit = (data: FormValues) => {
    if (!data.token || !resetToken) {
      return;
    }
    const formData = {
      newPassword: data.password,
      token: data.token,
    };
    dispatch(setCompleteResetPasswordStart(formData));
  };

  useEffect(() => {
    if (completeResetSuccess) {
      navigate("/", { replace: true });
    }
  }, [completeResetSuccess, navigate]);

  if (dataLoading) {
    return <BlankPageLoader />;
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
              name="password"
              label="New password"
              placeholder="Enter your new password"
              type={showPassword ? "text" : "password"}
              value={watch("password")}
              onChange={(e) => setValue("password", e.target.value)}
              error={errors?.password?.message}
              backgroundColor="bg-white"
              borderRadius="rounded-lg"
              labelColor="text-gray-800"
              className="text-base text-gray-900 pr-12"
              placeholderColor="placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
              placeholder="Re-enter your new password"
              type={showConfirmPassword ? "text" : "password"}
              value={watch("confirmPassword")}
              onChange={(e) => setValue("confirmPassword", e.target.value)}
              error={errors?.confirmPassword?.message}
              backgroundColor="bg-white"
              borderRadius="rounded-lg"
              labelColor="text-gray-800"
              className="text-base text-gray-900 pr-12"
              placeholderColor="placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Password Requirements:
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains at least one uppercase letter</li>
              <li>• Contains at least one lowercase letter</li>
              <li>• Contains at least one number</li>
            </ul>
          </div>

          <Button variant="primary" type="submit" width="100%" height="48px" disabled={dataLoading}>
            {dataLoading ? "Resetting password..." : "Reset password"}
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

export default PasswordReset;
