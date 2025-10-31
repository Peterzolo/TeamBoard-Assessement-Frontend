export interface UserState {
  fetchAllUsersLoading: boolean;
  fetchAllUsersError: unknown;
  allUsers: IUser[];
  totalUsers: number;

  //   Fetch user details

  fetchUserDetailsLoading: boolean;
  fetchUserDetailsError: unknown;
  userDetails: IUser | null;

  // Create user
  createUserLoading: boolean;
  createUserError: unknown;
  createUserSuccess: boolean;
}

export interface IUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface IBasicQueryFilter {
  // Search and filtering
  search?: string;
  role?:
    | "Super-admin"
    | "Admin"
    | "Team-member"
    | "Project-manager"
    | "Team-lead";
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isEmailVerified?: boolean | string; // Support both boolean and string for flexibility
  page?: number | string;
  limit?: number | string;
  pageSize?: number;
  sortBy?:
    | "firstName"
    | "lastName"
    | "email"
    | "role"
    | "createdAt"
    | "updatedAt";
  sortOrder?: "asc" | "desc";
}
