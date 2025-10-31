import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthGuard from "../../../../Components/auth/AuthGuard";
import BlankPageLoader from "../../../../Components/BlankPageLoader/BlankPageLoader";
import { FlashMessage } from "../../../../Components/FlashMessage/Flashmessage";
import { BackButton } from "../../../../Components/BackButton/BackButton";
import {
  allUsersSelector,
  allUsersLoadingSelector,
  allUsersErrorSelector,
} from "../../../../app/redux/reducers/user/selectors/userDetailsSelector";
import { setAllUsersStart } from "../../../../app/redux/reducers/user/userDetailsReducer";
import type { IBasicQueryFilter } from "../../../../app/redux/types/user";
import type { IUser } from "../../../../app/redux/types/user";
import { newDateFormatDate } from "../../../../utils/dateFomat";
import {
  FaEnvelope,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
} from "react-icons/fa";

// Extended user type to include optional fields from API
type ExtendedUser = IUser & {
  isEmailVerified?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  _id?: string;
};

const TeamMemberDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allUsers = useSelector(allUsersSelector) || [];
  const dataLoading = useSelector(allUsersLoadingSelector);
  const error = useSelector(allUsersErrorSelector);

  // Find the user by ID
  const user = allUsers.find(
    (u) => u.id === id || (u as ExtendedUser)._id === id
  ) as ExtendedUser | undefined;

  // Fetch users if not already loaded
  useEffect(() => {
    if (!user && !dataLoading) {
      const queryFilters: IBasicQueryFilter = {
        page: 1,
        limit: "100", // Fetch enough to find the user
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      dispatch(setAllUsersStart(queryFilters));
    }
  }, [dispatch, user, dataLoading]);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last;
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "super-admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "manager":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "project-manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "team-lead":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "team-member":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (dataLoading && !user) {
    return (
      <AuthGuard>
        <BlankPageLoader />
      </AuthGuard>
    );
  }

  if (error && !user) {
    return (
      <AuthGuard>
        <div className="w-full">
          <BackButton />
          <FlashMessage message={String(error)} type="error" />
        </div>
      </AuthGuard>
    );
  }

  if (!user) {
    return (
      <AuthGuard>
        <div className="w-full">
          <BackButton />
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <FaUser className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              Team Member Not Found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              The team member you're looking for doesn't exist or has been
              removed.
            </p>
            <button
              onClick={() => navigate("/dashboard/team/list")}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Back to Team List
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="w-full">
        <BackButton />

        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg">
                {getInitials(user.firstName, user.lastName)}
              </div>
            </div>

            {/* Name and Role */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(
                    user.role || ""
                  )}`}
                >
                  <FaBuilding className="w-3 h-3 mr-1.5" />
                  {user.role || "Team Member"}
                </span>
                {user.isEmailVerified !== undefined && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.isEmailVerified
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {user.isEmailVerified ? (
                      <FaCheckCircle className="w-3 h-3 mr-1.5" />
                    ) : (
                      <FaTimesCircle className="w-3 h-3 mr-1.5" />
                    )}
                    {user.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaUser className="w-5 h-5 text-blue-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaEnvelope className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-gray-900 break-all">
                    {user.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaCalendar className="w-5 h-5 text-blue-600" />
              Account Information
            </h2>
            <div className="space-y-4">
              {user.createdAt && (
                <div className="flex items-start gap-3">
                  <FaCalendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Member Since
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {newDateFormatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {user.updatedAt && (
                <div className="flex items-start gap-3">
                  <FaCalendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {newDateFormatDate(user.updatedAt)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <FaCheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Email Status
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      user.isEmailVerified
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {user.isEmailVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User ID (for reference) */}
        <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">
            User ID:{" "}
            <span className="font-mono text-gray-700">
              {user.id || (user as ExtendedUser)._id}
            </span>
          </p>
        </div>
      </div>
    </AuthGuard>
  );
};

export default TeamMemberDetails;
