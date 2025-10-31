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
  FaTasks,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { HiAdjustments } from "react-icons/hi";
import {
  ResponsiveTable,
  type TableColumn,
} from "../../../Components/table/ResponsiveTable";
import {
  allTasksLoadingSelector,
  allTasksErrorSelector,
  allTasksSelector,
  allTasksCountSelector,
} from "../../../app/redux/reducers/task/selectors/taskSelectors";
import { setAllTasksStart } from "../../../app/redux/reducers/task/taskReducer";
import type { ITaskQueryFilter } from "../../../app/redux/types/task";
import type {
  ITask,
  TaskStatus,
  TaskPriority,
} from "../../../app/redux/types/task";
import { BackButton } from "../../../Components/BackButton/BackButton";
import { allProjectsSelector } from "../../../app/redux/reducers/project/selectors/projectSelectors";
import { setAllProjectsStart } from "../../../app/redux/reducers/project/projectReducer";
import { allUsersSelector } from "../../../app/redux/reducers/user/selectors/userDetailsSelector";
import { setAllUsersStart } from "../../../app/redux/reducers/user/userDetailsReducer";
import type { IProject } from "../../../app/redux/types/project";
import type { IUser } from "../../../app/redux/types/user";

// Extended task type to include optional fields from API
type ExtendedTask = ITask & {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  _id?: string;
  dueDate?: string | Date;
  project?: IProject | string; // Handle project as string ID from API
  assignees?: IUser[] | string[];
  createdBy?:
    | string
    | { _id?: string; id?: string; firstName?: string; lastName?: string };
};

type ExtendedProject = IProject & {
  _id?: string;
};

type ExtendedUser = IUser & {
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

const TaskList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<
    Omit<ITaskQueryFilter, "project" | "assignee"> & {
      project?: string;
      assignee?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  >({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const dataLoading = useSelector(allTasksLoadingSelector);
  const error = useSelector(allTasksErrorSelector);
  const allTasks = useSelector(allTasksSelector) || [];
  const totalItems = useSelector(allTasksCountSelector) || 0;
  const allProjects = useSelector(allProjectsSelector) || [];
  const allUsers = useSelector(allUsersSelector) || [];

  const [retryFetch, setRetryFetch] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch projects and users for filters
  useEffect(() => {
    if (allProjects.length === 0) {
      dispatch(setAllProjectsStart({ page: 1, limit: 100 }));
    }
    if (allUsers.length === 0) {
      dispatch(setAllUsersStart({ page: 1, limit: 100 }));
    }
  }, [dispatch, allProjects.length, allUsers.length]);

  // Fetch tasks when filters change
  useEffect(() => {
    const queryFilters: ITaskQueryFilter = {
      page: filters.page,
      limit: filters.limit,
      search: debouncedSearchTerm,
      project: filters.project ? (filters.project as any) : undefined,
      assignee: filters.assignee ? (filters.assignee as any) : undefined,
      status: filters.status,
      priority: filters.priority,
      isActive: filters.isActive,
    };

    dispatch(setAllTasksStart(queryFilters));
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

  const handleFilterChange = (
    newFilters: Partial<
      Omit<ITaskQueryFilter, "project" | "assignee"> & {
        project?: string;
        assignee?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >
  ) => {
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

  const getStatusColor = (status?: TaskStatus | string) => {
    switch (status) {
      case "Todo":
        return "bg-gray-100 text-gray-800";
      case "In-progress":
        return "bg-blue-100 text-blue-800";
      case "Done":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority?: TaskPriority | string) => {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAssigneeNames = (task: ExtendedTask): string => {
    if (!task.assignees || task.assignees.length === 0) return "Unassigned";

    if (Array.isArray(task.assignees) && task.assignees.length > 0) {
      if (typeof task.assignees[0] === "string") {
        // If assignees are IDs, try to find users
        const assigneeIds = task.assignees as string[];
        const names = assigneeIds
          .map((assigneeId: string) => {
            const user = allUsers.find(
              (u: ExtendedUser) => u.id === assigneeId || u._id === assigneeId
            );
            return user ? `${user.firstName} ${user.lastName}` : "";
          })
          .filter(Boolean);
        return names.length > 0 ? names.join(", ") : "Unassigned";
      } else {
        // If assignees are user objects
        const assigneeUsers = task.assignees as IUser[];
        const names = assigneeUsers.map(
          (user: IUser) => `${user.firstName} ${user.lastName}`
        );
        return names.join(", ");
      }
    }

    return "Unassigned";
  };

  const getProjectName = (task: ExtendedTask): string => {
    if (!task.project) return "N/A";

    if (typeof task.project === "string") {
      const project = allProjects.find(
        (p: ExtendedProject) => p._id === task.project || p._id === task.project
      );
      return project ? project.name : task.project;
    }

    if (
      task.project &&
      typeof task.project === "object" &&
      "name" in task.project
    ) {
      return task.project.name;
    }

    return "N/A";
  };

  const columns: TableColumn<ExtendedTask>[] = [
    {
      key: "title",
      label: "Task Title",
      sortable: false,
      render: (value: any, task: ExtendedTask) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              <FaTasks className="w-5 h-5" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{value}</div>
            {task.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {task.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "project",
      label: "Project",
      sortable: false,
      render: (_: any, task: ExtendedTask) => (
        <div className="text-sm text-gray-900">{getProjectName(task)}</div>
      ),
    },
    {
      key: "assignees",
      label: "Assignees",
      sortable: false,
      render: (_: any, task: ExtendedTask) => (
        <div className="text-sm text-gray-900">{getAssigneeNames(task)}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      render: (value: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            value
          )}`}
        >
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: false,
      render: (value: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
            value
          )}`}
        >
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: false,
      render: (value: any) => (
        <div className="text-sm text-gray-500">
          {value ? newDateFormatDate(value) : "N/A"}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: false,
      render: (value: any) => (
        <div className="text-sm text-gray-500">
          {value ? newDateFormatDate(value) : "N/A"}
        </div>
      ),
    },
    {
      key: "title" as keyof ExtendedTask,
      label: "Actions",
      sortable: false,
      render: (_: any, task: ExtendedTask) => {
        const taskId = task._id;
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (taskId) {
                  navigate(`/dashboard/task/${taskId}`);
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
    filters.project ||
    filters.assignee ||
    filters.status ||
    filters.priority ||
    filters.isActive !== undefined ||
    searchTerm;

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

  // Prepare filter options
  const projectOptions = [
    { value: "", label: "All Projects" },
    ...allProjects.map((project: ExtendedProject) => ({
      value: project._id || "",
      label: project.name,
    })),
  ];

  const assigneeOptions = [
    { value: "", label: "All Assignees" },
    ...allUsers.map((user: ExtendedUser) => ({
      value: user.id || user._id || "",
      label: `${user.firstName} ${user.lastName}`,
    })),
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Todo", label: "Todo" },
    { value: "In-progress", label: "In Progress" },
    { value: "Done", label: "Done" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  return (
    <AuthGuard>
      <div className="w-full min-h-0">
        <BackButton />
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaTasks className="text-xl sm:text-2xl text-purple-600 flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Tasks
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage all tasks ({totalItems} total)
          </p>
        </div>

        {/* Task List Section */}
        {allTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <FaTasks className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              There are no tasks to display at this time.
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
                    <FaTasks className="text-purple-500 flex-shrink-0" />
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                      Tasks ({totalItems})
                    </h2>
                  </div>
                </div>

                {/* Search and Filter Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-initial sm:w-64">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <SearchComponent
                      placeholder="Search tasks..."
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
                            filters.project,
                            filters.assignee,
                            filters.status,
                            filters.priority,
                            filters.isActive,
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
                      {/* Project Filter */}
                      <div>
                        <SelectInput
                          options={projectOptions}
                          value={filters.project || ""}
                          onChange={(value) =>
                            handleFilterChange({ project: value || undefined })
                          }
                          placeholder="Select Project"
                          label="Project"
                          className="w-full [&>label]:text-xs sm:[&>label]:text-sm [&>label]:mb-1"
                          size="sm"
                        />
                      </div>

                      {/* Assignee Filter */}
                      <div>
                        <SelectInput
                          options={assigneeOptions}
                          value={filters.assignee || ""}
                          onChange={(value) =>
                            handleFilterChange({ assignee: value || undefined })
                          }
                          placeholder="Select Assignee"
                          label="Assignee"
                          className="w-full [&>label]:text-xs sm:[&>label]:text-sm [&>label]:mb-1"
                          size="sm"
                        />
                      </div>

                      {/* Status Filter */}
                      <div>
                        <SelectInput
                          options={statusOptions}
                          value={filters.status || ""}
                          onChange={(value) =>
                            handleFilterChange({
                              status: (value as TaskStatus) || undefined,
                            })
                          }
                          placeholder="Select Status"
                          label="Status"
                          className="w-full [&>label]:text-xs sm:[&>label]:text-sm [&>label]:mb-1"
                          size="sm"
                        />
                      </div>

                      {/* Priority Filter */}
                      <div>
                        <SelectInput
                          options={priorityOptions}
                          value={filters.priority || ""}
                          onChange={(value) =>
                            handleFilterChange({
                              priority: (value as TaskPriority) || undefined,
                            })
                          }
                          placeholder="Select Priority"
                          label="Priority"
                          className="w-full [&>label]:text-xs sm:[&>label]:text-sm [&>label]:mb-1"
                          size="sm"
                        />
                      </div>

                      {/* Status Filter */}
                      <div>
                        <SelectInput
                          options={[
                            { value: "", label: "All Status" },
                            { value: "true", label: "Active" },
                            { value: "false", label: "Inactive" },
                          ]}
                          value={filters.isActive?.toString() || ""}
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
                          label="Active Status"
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
            <ResponsiveTable<ExtendedTask>
              data={allTasks}
              columns={columns}
              onSort={() => {}} // Tasks don't support sorting in API yet
              currentSort={filters.sortBy}
              currentSortOrder={filters.sortOrder as "asc" | "desc"}
              emptyStateMessage="No tasks found"
              minTableWidth={1000}
              onRowClick={(task) => {
                const taskId = (task as ExtendedTask)._id;
                if (taskId) {
                  navigate(`/dashboard/task/${taskId}`);
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

export default TaskList;
