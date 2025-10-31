import { IUser, UserRoleAccess } from "@/app/redux/types/auth";

/**
 * Helper function to check if a role is an admin role
 * @param role - The role string to check
 * @returns boolean indicating if role is admin
 */
const isAdminRole = (role?: string): boolean => {
  if (!role) return false;

  const adminRoles = [
    UserRoleAccess.SUPER_ADMIN, // "Super-admin"
    UserRoleAccess.ADMIN, // "Admin"
    UserRoleAccess.CEO, // "CEO"
  ];
  return adminRoles.includes(role as UserRoleAccess);
};

/**
 * Determines the appropriate dashboard route based on user role
 * @param user - The user object containing role information
 * @returns The dashboard route path (clean URL without user ID)
 */
export const getDashboardRoute = (user: IUser | null): string => {
  // If no user, redirect to general dashboard
  if (!user) {
    return "/screens/dashboard/overview";
  }

  // Check user role for role-based redirection
  const userRole = user.role || user.userType;

  // Determine redirect path based on role
  if (userRole && isAdminRole(userRole)) {
    // Redirect admin users to admin dashboard
    return "/screens/admin-dashboard/overview";
  } else {
    // Redirect regular users (customers) to regular dashboard
    return "/screens/dashboard/overview";
  }
};

/**
 * Checks if a user has admin privileges
 * @param user - The user object containing role information
 * @returns boolean indicating if user is admin
 */
export const isAdminUser = (user: IUser | null): boolean => {
  if (!user) return false;

  const userRole = user.role || user.userType;
  return isAdminRole(userRole);
};

/**
 * Checks if a user has customer privileges
 * @param user - The user object containing role information
 * @returns boolean indicating if user is a customer
 */
export const isCustomerUser = (user: IUser | null): boolean => {
  if (!user) return true; // Default to customer if no role specified

  const userRole = user.role || user.userType;
  return !isAdminRole(userRole);
};

/**
 * Gets a human-readable role name
 * @param user - The user object containing role information
 * @returns string with formatted role name
 */
export const getUserRoleName = (user: IUser | null): string => {
  if (!user) return "Customer";

  const userRole = user.role || user.userType;

  switch (userRole) {
    case UserRoleAccess.CEO:
      return "CEO";
    case UserRoleAccess.CUSTOMER:
      return "Customer";
    case UserRoleAccess.SUPER_ADMIN:
      return "Super Admin";
    case UserRoleAccess.MANAGER:
      return "Manager";
    case UserRoleAccess.ADMIN:
      return "Admin";
    case UserRoleAccess.ACCOUNT:
      return "Account";
    case UserRoleAccess.TECHNICIAN:
      return "Technician";
    case UserRoleAccess.STAFF:
      return "Staff";
    case UserRoleAccess.DEV:
      return "Developer";
    default:
      return "Customer";
  }
};

/**
 * Debug function to log user role information
 * @param user - The user object to debug
 */
export const debugUserRole = (user: IUser | null): void => {
  if (!user) {
    console.log("🔍 Debug: No user provided");
    return;
  }

  const userRole = user.role || user.userType;
  const isAdmin = isAdminRole(userRole);

  console.log("🔍 User Role Debug:", {
    user: user,
    role: user.role,
    userType: user.userType,
    finalRole: userRole,
    isAdmin: isAdmin,
    dashboardRoute: getDashboardRoute(user),
    roleName: getUserRoleName(user),
  });
};
