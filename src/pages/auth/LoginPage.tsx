import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, type Resolver } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import BlankPageLoader from "../../Components/BlankPageLoader/BlankPageLoader";
import { Button } from "../../Components/Button/Button";
import { StorageVariable } from "../../utils/constants/storageVariables";
import { localStore } from "../../utils/localStore";
import { setLoginRequestStart } from "../../app/redux/reducers/auth/signUpReducer";
import {
  currentUserDataSelector,
  isAuthenticatedSelector,
  loginErrorSelector,
  loginLoadingSelector,
  loginSuccessSelector,
} from "../../app/redux/reducers/auth/selectors/signupSelector";
import { TextInput2 } from "../../Components/Input/TextInput2";
import { FlashMessage } from "../../Components/FlashMessage/Flashmessage";
import AuthLayout from "../../layouts/AuthLayout";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

type FormValues = yup.InferType<typeof schema>;
const resolver = yupResolver(schema) as Resolver<FormValues, any>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(loginLoadingSelector);
  const loginError = useSelector(loginErrorSelector);
  const loginSuccess = useSelector(loginSuccessSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const currentUser = useSelector(currentUserDataSelector);
  console.log("Current User:", currentUser);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    dispatch(
      setLoginRequestStart({
        formData: {
          email: data.email,
          password: data.password,
        },
      })
    );
  };

  // Helper to check authentication from localStorage (memoized to avoid recreation)
  const getAuthFromStorage = useCallback(() => {
    const authValue = localStore.getItem(StorageVariable.IS_AUTHENTICATED);
    if (authValue === null || authValue === undefined) return false;
    return authValue === "true" || authValue === true;
  }, []);

  useEffect(() => {
    const localIsAuth = getAuthFromStorage();

    if (loginSuccess && (isAuthenticated || localIsAuth)) {
      navigate("/dashboard", { replace: true });
    }
  }, [loginSuccess, isAuthenticated, navigate, getAuthFromStorage]);

  useEffect(() => {
    const localIsAuth = getAuthFromStorage();

    if (isAuthenticated || localIsAuth) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate, getAuthFromStorage]);

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  if (loading) {
    return <BlankPageLoader />;
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Sign in
        </h2>
        <p className="mt-1 mb-6 text-center text-sm text-gray-600">
          Access your workspace
        </p>

        {loginError && <FlashMessage message={loginError} type="error" />}
        {loginSuccess && !isAuthenticated && (
          <FlashMessage
            message="Login successful! Redirecting..."
            type="success"
          />
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

          <TextInput2
            name="password"
            label="Password"
            type={showPassword ? "text" : ("password" as any)}
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled
              />
              <label htmlFor="remember-me" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              Forgot your password?
            </button>
          </div>

          <Button variant="primary" type="submit" width="100%" height="48px">
            Sign In
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
