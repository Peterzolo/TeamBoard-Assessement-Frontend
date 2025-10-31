import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthGuard from "../../../../Components/auth/AuthGuard";
import BlankPageLoader from "../../../../Components/BlankPageLoader/BlankPageLoader";
import { FlashMessage } from "../../../../Components/FlashMessage/Flashmessage";
import { CustomPagination } from "../../../../Components/Pagination/Pagination";
import { SearchComponent } from "../../../../Components/SearchComponent/SearchComponent";
import { newDateFormatDate } from "../../../../utils/dateFomat";
import { SelectInput } from "../../../../Components/Input/SelectInput/SelectInput";
import { FaSearch, FaUsers, FaEye } from "react-icons/fa";
import { HiAdjustments } from "react-icons/hi";
import EmptyState from "../../../../Components/EmptyState/EmptyState";
import {
  ResponsiveTable,
  type TableColumn,
} from "../../../../Components/table/ResponsiveTable";
import {
  allUsersCountSelector,
  allUsersErrorSelector,
  allUsersLoadingSelector,
  allUsersSelector,
} from "../../../../app/redux/reducers/user/selectors/userDetailsSelector";
import { setAllUsersStart } from "../../../../app/redux/reducers/user/userDetailsReducer";
import type { IBasicQueryFilter } from "../../../../app/redux/types/user";
import type { IUser } from "../../../../app/redux/types/user";
import { BackButton } from "../../../../Components/BackButton/BackButton";

// Extended user type to include optional fields from API
type ExtendedUser = IUser & {
  phoneNumber?: string;
  isEmailVerified?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  _id?: string;
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const TeamList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IBasicQueryFilter>({
    page: 1,
    limit: "10",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const dataLoading = useSelector(allUsersLoadingSelector);
  const error = useSelector(allUsersErrorSelector);
  const allUsers = useSelector(allUsersSelector) || [];
  const totalItems = useSelector(allUsersCountSelector) || 0;

  const [retryFetch, setRetryFetch] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch users when filters change
  useEffect(() => {
    const queryFilters: IBasicQueryFilter = {
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      search: debouncedSearchTerm,
      role: filters.role,
      isEmailVerified: filters.isEmailVerified,
    };

    dispatch(setAllUsersStart(queryFilters));
  }, [dispatch, retryFetch, debouncedSearchTerm, filters]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilters((prev) => ({ ...prev, limit: size.toString(), page: 1 }));
  };

  const handleSearch = (value: string) => setSearchTerm(value);

  const handleRetry = () => {
    setRetryFetch((prev) => !prev);
  };

  const handleFilterChange = (newFilters: Partial<IBasicQueryFilter>) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        ...newFilters,
        page: 1, // Reset to first page when filtering
      };
      return updated;
    });
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: "10",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSearchTerm("");
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "super-admin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-indigo-100 text-indigo-800";
      case "project-manager":
        return "bg-blue-100 text-blue-800";
      case "team-lead":
        return "bg-yellow-100 text-yellow-800";
      case "team-member":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last;
  };

  const handleSort = (key: string, order: "asc" | "desc") => {
    setFilters((prev) => ({
      ...prev,
      sortBy: key as any,
      sortOrder: order,
      page: 1, // Reset to first page when sorting
    }));
  };

  const columns: TableColumn<ExtendedUser>[] = [
    {
      key: "firstName",
      label: "User",
      sortable: false,
      render: (_: any, user: ExtendedUser) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {getInitials(user.firstName, user.lastName)}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            {user.phoneNumber && (
              <div className="text-sm text-gray-500">{user.phoneNumber}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value: any) => (
        <div className="text-sm text-gray-900">{value}</div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (value: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
            value
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "isEmailVerified",
      label: "Status",
      sortable: true,
      render: (value: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {value ? "Verified" : "Unverified"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (value: any) => (
        <div className="text-sm text-gray-500">
          {value ? newDateFormatDate(value) : "N/A"}
        </div>
      ),
    },
    {
      key: "email" as keyof ExtendedUser, // Using email as key for Actions column
      label: "Actions",
      sortable: false,
      render: (_: any, user: ExtendedUser) => {
        const userId = user.id || user._id;
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                if (userId) {
                  navigate(`/dashboard/team/${userId}`);
                }
              }}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <FaEye className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const hasActiveFilters =
    filters.role || filters.isEmailVerified !== undefined || searchTerm;

  if (dataLoading) {
    return (
      <AuthGuard>
        <BlankPageLoader />
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="w-full">
          <BackButton />
          <div className="w-full">
            <FlashMessage message={String(error)} type="error" />
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="w-full min-h-0">
        <BackButton />
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaUsers className="text-xl sm:text-2xl text-blue-600 flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Team Members
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage all team members ({totalItems} total)
          </p>
        </div>

        {/* User List Section */}
        {allUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <FaUsers className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No team members found
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              There are no team members to display at this time.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Controls Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 border-b border-gray-200">
              <div className="flex flex-col gap-4">
                {/* Title Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FaUsers className="text-indigo-500 flex-shrink-0" />
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                      System Users ({totalItems})
                    </h2>
                  </div>
                </div>

                {/* Search and Filter Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-initial sm:w-64">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <SearchComponent
                      placeholder="Search users..."
                      onChange={handleSearch}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                    />
                  </div>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                      showFilters
                        ? "bg-indigo-100 border-indigo-300 text-indigo-700 shadow-sm"
                        : hasActiveFilters
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    <HiAdjustments
                      className={`h-4 w-4 flex-shrink-0 ${
                        hasActiveFilters ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span className="text-sm sm:text-base">Filters</span>
                    {hasActiveFilters && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-600 text-white rounded-full flex-shrink-0">
                        {
                          [
                            filters.role,
                            filters.isEmailVerified,
                            searchTerm,
                          ].filter(Boolean).length
                        }
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200">
                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                        <HiAdjustments className="text-indigo-500 flex-shrink-0 text-base sm:text-lg" />
                        <span>Filter Options</span>
                      </h3>
                      <button
                        onClick={handleClearFilters}
                        className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors duration-150 self-start sm:self-auto"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                      {/* Role Filter */}
                      <div>
                        <SelectInput
                          options={[
                            { value: "", label: "All Roles" },
                            { value: "Super-admin", label: "Super Admin" },
                            { value: "Admin", label: "Admin" },
                            { value: "Manager", label: "Manager" },
                            {
                              value: "Project-manager",
                              label: "Project Manager",
                            },
                            { value: "Team-lead", label: "Team Lead" },
                            { value: "Team-member", label: "Team Member" },
                          ]}
                          value={filters.role || ""}
                          onChange={(value) =>
                            handleFilterChange({ role: value as any })
                          }
                          placeholder="Select Role"
                          label="Role"
                          className="w-full [&>label]:text-xs sm:[&>label]:text-sm [&>label]:mb-1"
                          size="sm"
                        />
                      </div>

                      {/* Status Filter */}
                      <div>
                        <SelectInput
                          options={[
                            { value: "", label: "All Status" },
                            { value: "true", label: "Verified" },
                            { value: "false", label: "Unverified" },
                          ]}
                          value={filters.isEmailVerified?.toString() || ""}
                          onChange={(value) =>
                            handleFilterChange({
                              isEmailVerified:
                                value === "true"
                                  ? true
                                  : value === "false"
                                  ? false
                                  : undefined,
                            })
                          }
                          placeholder="Select Status"
                          label="Email Status"
                          className="w-full [&>label]:text-xs sm:[&>label]:text-sm [&>label]:mb-1"
                          size="sm"
                        />
                      </div>

                      {/* Sort By */}
                      <div>
                        <SelectInput
                          options={[
                            { value: "createdAt", label: "Created Date" },
                            { value: "firstName", label: "First Name" },
                            { value: "lastName", label: "Last Name" },
                            { value: "email", label: "Email" },
                            { value: "role", label: "Role" },
                            {
                              value: "isEmailVerified",
                              label: "Email Status",
                            },
                            { value: "updatedAt", label: "Updated Date" },
                          ]}
                          value={filters.sortBy || "createdAt"}
                          onChange={(value) =>
                            handleFilterChange({ sortBy: value as any })
                          }
                          placeholder="Sort By"
                          label="Sort By"
                          className="w-full [&>label]:text-xs sm:[&>label]:text-sm [&>label]:mb-1"
                          size="sm"
                        />
                      </div>

                      {/* Sort Order */}
                      <div>
                        <SelectInput
                          options={[
                            { value: "desc", label: "Descending" },
                            { value: "asc", label: "Ascending" },
                          ]}
                          value={filters.sortOrder || "desc"}
                          onChange={(value) =>
                            handleFilterChange({ sortOrder: value as any })
                          }
                          placeholder="Sort Order"
                          label="Sort Order"
                          className="w-full [&>label]:text-xs sm:[&>label]:text-sm [&>label]:mb-1"
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Table Section */}
            <ResponsiveTable<ExtendedUser>
              data={allUsers}
              columns={columns}
              onSort={handleSort}
              currentSort={filters.sortBy}
              currentSortOrder={filters.sortOrder as "asc" | "desc"}
              emptyStateMessage="No team members found"
              minTableWidth={800}
              onRowClick={(user) => {
                const userId = (user as ExtendedUser).id || (user as ExtendedUser)._id;
                if (userId) {
                  navigate(`/dashboard/team/${userId}`);
                }
              }}
            />

            {/* Pagination */}
            <div className="bg-gray-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200">
              <CustomPagination
                count={Math.ceil(
                  totalItems / parseInt(String(filters.limit || "10"))
                )}
                page={Number(filters.page || 1)}
                pageSize={parseInt(String(filters.limit || "10"))}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default TeamList;
