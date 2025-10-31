"use client";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, type Resolver } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSignUpState,
  setCompleteSignUpStart,
} from "../../app/redux/reducers/auth/signUpReducer";
import {
  completeSignUpErrorSelector,
  completeSignUpLoadingSelector,
  completeSignUpSuccessSelector,
} from "../../app/redux/reducers/auth/selectors/signupSelector";
import { TextInput2 } from "../../Components/Input/TextInput2";
import { FlashMessage } from "../../Components/FlashMessage/Flashmessage";
import { Button } from "../../Components/Button/Button";
import BlankPageLoader from "../../Components/BlankPageLoader/BlankPageLoader";
import AuthLayout from "../../layouts/AuthLayout";

type FormValues = {
  firstName: string;
  lastName: string;
  token: string;
  password: string;
  confirmPassword: string;
};

const schema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    token: yup.string().required("Email confirmation token is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();

const resolver = yupResolver(schema) as Resolver<FormValues, any>;

const CompleteSignUpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const loading = useSelector(completeSignUpLoadingSelector) || false;
  const completeSignUpError = useSelector(completeSignUpErrorSelector) || null;
  const completeSignUpSuccess =
    useSelector(completeSignUpSuccessSelector) || false;

  const [emailConfirmation, setEmailConfirmation] = useState<string | null>(
    null
  );

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check for token in URL parameters only (cross-browser compatible)
  useEffect(() => {
    if (isMounted) {
      const token = searchParams.get("token") || null;
      setEmailConfirmation(token);

      if (!token) {
        navigate("/", { replace: true });
      }
    }
  }, [isMounted, searchParams, navigate]);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      token: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Set token value when emailConfirmation is loaded
  useEffect(() => {
    if (emailConfirmation) {
      setValue("token", emailConfirmation);
    }
  }, [emailConfirmation, setValue]);

  // Handle successful signup and redirect
  useEffect(() => {
    if (completeSignUpSuccess) {
      // Reset the form
      reset();

      // Reset Redux state
      dispatch(resetSignUpState());

      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000); // 2 second delay to show success message
    }
  }, [completeSignUpSuccess, dispatch, navigate, reset]);

  const onSubmit = (data: FormValues) => {
    // Ensure token is present before submission
    if (!data.token || !emailConfirmation) {
      return;
    }
    const formData = {
      token: data.token,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    };
    dispatch(setCompleteSignUpStart(formData));
  };

  if (loading) {
    return <BlankPageLoader />;
  }

  if (!isMounted || !emailConfirmation) {
    return (
      <AuthLayout>
        <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
          <div className="text-center">
            <p className="text-red-600 text-lg font-medium mb-4">
              Invalid or missing token. Please request a new sign-up link.
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Create your account
        </h2>
        <p className="mt-1 mb-6 text-center text-sm text-gray-600">
          Complete your profile to get started
        </p>

        {completeSignUpError && (
          <FlashMessage message={completeSignUpError} type="error" />
        )}
        {completeSignUpSuccess && (
          <FlashMessage
            message="Account created successfully! Redirecting to login..."
            type="success"
          />
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput2
              name="firstName"
              label="First name"
              type="text"
              placeholder="Enter your first name"
              value={watch("firstName")}
              onChange={(e) => setValue("firstName", e.target.value)}
              error={errors.firstName?.message}
              backgroundColor="bg-white"
              borderRadius="rounded-lg"
              labelColor="text-gray-800"
              className="text-base text-gray-900"
              placeholderColor="placeholder-gray-400"
            />
            <TextInput2
              name="lastName"
              label="Last name"
              type="text"
              placeholder="Enter your last name"
              value={watch("lastName")}
              onChange={(e) => setValue("lastName", e.target.value)}
              error={errors.lastName?.message}
              backgroundColor="bg-white"
              borderRadius="rounded-lg"
              labelColor="text-gray-800"
              className="text-base text-gray-900"
              placeholderColor="placeholder-gray-400"
            />
          </div>

              <div className="relative">
                <TextInput2
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={watch("password")}
                  onChange={(e) => setValue("password", e.target.value)}
                  error={errors.password?.message}
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
                  label="Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
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
          <Button variant="primary" type="submit" width="100%" height="48px" disabled={loading || !emailConfirmation}>
            {loading ? "Creating account..." : !emailConfirmation ? "Waiting for token..." : "Create Account"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default CompleteSignUpPage;
