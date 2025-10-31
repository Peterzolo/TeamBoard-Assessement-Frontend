import type { IUser } from "../user";

export interface ISignUpData {
  email: string;
}

export interface ICompleteSignup {
  password: string;
  firstName: string;
  email: string;
  lastName: string;
  phoneNumber: string;
  userType: ContextType;
}
export interface ILoginData {
  password: string;
  email: string;
}

export enum ContextType {
  USER = "USER",
  DRIVER = "DRIVER",
  SUPER_ADMIN = "SUPER_ADMIN",
  STUDENT = "STUDENT",
}

export enum UserRole {}

export interface AuthState {
  // SIGN UP
  signUpLoading: boolean;
  signUpError: string | null;
  signUpSuccess: boolean;
  signUpSuccessMessage: string | null;

  // COMPLETE SIGN UP
  completeSignUpLoading: boolean;
  completeSignUpError: string | null;
  completeSignUpSuccess: boolean;
  completeSignUpSuccessMessage: string | null;

  // CONFIRM SIGN UP
  confirmSignUpLoading: boolean;
  confirmSignUpError: string | null;
  confirmSignUpSuccess: boolean;
  confirmSignUpSuccessMessage: string | null;
  confirmationToken: string | null;

  // LOGIN
  loginLoading: boolean;
  loginError: string | null;
  loginSuccess: boolean;
  loginSuccessMessage: string | null;

  // lLOGOUT
  logoutLoading: boolean;
  logoutError: string | null;
  logoutSuccess: boolean;

  // REFRESH TOKEN
  refreshTokenLoading: boolean;
  refreshTokenError: string | null;
  refreshTokenSuccess: boolean;

  // CURRENT USER
  currentUserLoading: boolean;
  currentUserError: string | null;
  currentUserData: IUser | null;

  // FORGOT PASSWORD
  forgotPasswordRequestLoading: boolean;
  forgotPasswordRequestError: string | null;
  forgotPasswordRequestSuccess: boolean;
  forgotPasswordRequestSuccessMessage: string | null;

  // RESET PASSWORD
  completePasswordResetLoading: boolean;
  completePasswordResetError: string | null;
  completePasswordResetSuccess: boolean;
  completePasswordResetSuccessMessage: string | null;

  // IS AUTHENTICATED
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

export interface ISignUpUser {
  email: string;
  termsAccepted: boolean;
}

export interface ICompleteProfiledata {
  firstName: string;
  lastName: string;
  token: string;
  password: string;
}

export enum UserRoleAccess {
  SUPER_ADMIN = "Super-admin",
  ADMIN = "Admin",
  PROJECT_MANAGER = "Project-manager",
  TEAM_MEMBER = "Team-member",
  TEAM_LEAD = "Team-lead",
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
export interface IConfirmSignUpResponse {
  message: string;
}
export interface IForgotPasswordResponse {
  message: string;
}
export interface ICompletePasswordResetResponse {
  message: string;
}

export interface ICompleteSignUpResponse {
  message: string;
}
export interface ISignUpResponse {
  message: string;
}

export interface IForgotPasswordRequest {
  message: string;
}
