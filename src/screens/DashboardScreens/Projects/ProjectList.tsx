import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthGuard from "../../../Components/auth/AuthGuard";
import BlankPageLoader from "../../../Components/BlankPageLoader/BlankPageLoader";
import { FlashMessage } from "../../../Components/FlashMessage/Flashmessage";
import { CustomPagination } from "../../../Components/Pagination/Pagination";
import { SearchComponent } from "../../../Components/SearchComponent/SearchComponent";
import { newDateFormatDate } from "../../../utils/dateFomat";
import { SelectInput } from "../../../Components/Input/SelectInput/SelectInput";
import {
  FaSearch,
  FaFolder,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { HiAdjustments } from "react-icons/hi";
import {
  ResponsiveTable,
  type TableColumn,
} from "../../../Components/table/ResponsiveTable";
import {
  allProjectsCountSelector,
  allProjectsErrorSelector,
  allProjectsLoadingSelector,
  allProjectsSelector,
} from "../../../app/redux/reducers/project/selectors/projectSelectors";
import { setAllProjectsStart } from "../../../app/redux/reducers/project/projectReducer";
import type { IProjectQueryFilter } from "../../../app/redux/types/project";
import type { IProject } from "../../../app/redux/types/project";
import { BackButton } from "../../../Components/BackButton/BackButton";

// Extended project type to include optional fields from API
type ExtendedProject = IProject & {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  _id?: string;
  memberCount?: number;
  taskCount?: number;
  createdBy?: string | { _id?: string; id?: string };
  projectManager?: string | { _id?: string; id?: string };
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const ProjectList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IProjectQueryFilter>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const dataLoading = useSelector(allProjectsLoadingSelector);
  const error = useSelector(allProjectsErrorSelector);
  const allProjects = useSelector(allProjectsSelector) || [];
  const totalItems = useSelector(allProjectsCountSelector) || 0;

  const [retryFetch, setRetryFetch] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch projects when filters change
  useEffect(() => {
    const queryFilters: IProjectQueryFilter = {
      page: filters.page,
      limit: filters.limit,
      search: debouncedSearchTerm,
      isActive: filters.isActive,
      sortBy: filters.sortBy || "createdAt",
      sortOrder: filters.sortOrder || "desc",
    };

    dispatch(setAllProjectsStart(queryFilters));
  }, [dispatch, retryFetch, debouncedSearchTerm, filters]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilters((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  const handleSearch = (value: string) => setSearchTerm(value);

  const handleRetry = () => {
    setRetryFetch((prev) => !prev);
  };

  const handleFilterChange = (newFilters: Partial<IProjectQueryFilter>) => {
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
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSearchTerm("");
  };

  const handleSort = (key: string, order: "asc" | "desc") => {
    setFilters((prev) => ({
      ...prev,
      sortBy: key as any,
      sortOrder: order,
      page: 1, // Reset to first page when sorting
    }));
  };

  const columns: TableColumn<ExtendedProject>[] = [
    {
      key: "name",
      label: "Project Name",
      sortable: true,
      render: (value: any, project: ExtendedProject) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              <FaFolder className="w-5 h-5" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{value}</div>
            {project.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {project.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (value: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {value ? (
            <>
              <FaCheckCircle className="w-3 h-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <FaTimesCircle className="w-3 h-3 mr-1" />
              Inactive
            </>
          )}
        </span>
      ),
    },
    {
      key: "memberCount",
      label: "Members",
      sortable: false,
      render: (value: any) => (
        <div className="text-sm text-gray-900">
          {value !== undefined ? value : 0}
        </div>
      ),
    },
    {
      key: "taskCount",
      label: "Tasks",
      sortable: false,
      render: (value: any) => (
        <div className="text-sm text-gray-900">
          {value !== undefined ? value : 0}
        </div>
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
      key: "name" as keyof ExtendedProject,
      label: "Actions",
      sortable: false,
      render: (_: any, project: ExtendedProject) => {
        const projectId = project._id;
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (projectId) {
                  navigate(`/dashboard/project/${projectId}`);
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

  const hasActiveFilters = filters.isActive !== undefined || searchTerm;

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
              <FaFolder className="text-xl sm:text-2xl text-indigo-600 flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Projects
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage all projects ({totalItems} total)
          </p>
        </div>

        {/* Project List Section */}
        {allProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <FaFolder className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              There are no projects to display at this time.
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
                    <FaFolder className="text-indigo-500 flex-shrink-0" />
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                      All Projects ({totalItems})
                    </h2>
                  </div>
                </div>

                {/* Search and Filter Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-initial sm:w-64">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <SearchComponent
                      placeholder="Search projects..."
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
                        {[filters.isActive, searchTerm].filter(Boolean).length}
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
                      {/* Status Filter */}
                      <div>
                        <SelectInput
                          options={[
                            { value: "", label: "All Status" },
                            { value: "true", label: "Active" },
                            { value: "false", label: "Inactive" },
                          ]}
                          value={
                            filters.isActive !== undefined
                              ? filters.isActive.toString()
                              : ""
                          }
                          onChange={(value) =>
                            handleFilterChange({
                              isActive:
                                value === "true"
                                  ? true
                                  : value === "false"
                                  ? false
                                  : undefined,
                            })
                          }
                          placeholder="Select Status"
                          label="Project Status"
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
            <ResponsiveTable<ExtendedProject>
              data={allProjects}
              columns={columns}
              onSort={handleSort}
              currentSort={filters.sortBy}
              currentSortOrder={filters.sortOrder as "asc" | "desc"}
              emptyStateMessage="No projects found"
              minTableWidth={800}
              onRowClick={(project) => {
                const projectId = (project as ExtendedProject)._id;
                if (projectId) {
                  navigate(`/dashboard/project/${projectId}`);
                }
              }}
            />

            {/* Pagination */}
            <div className="bg-gray-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200">
              <CustomPagination
                count={Math.ceil(totalItems / (filters.limit || 10))}
                page={Number(filters.page || 1)}
                pageSize={filters.limit || 10}
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

export default ProjectList;
