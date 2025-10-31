import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Resolver } from "react-hook-form";
import AuthGuard from "../../../Components/auth/AuthGuard";
import BlankPageLoader from "../../../Components/BlankPageLoader/BlankPageLoader";
import { FlashMessage } from "../../../Components/FlashMessage/Flashmessage";
import { BackButton } from "../../../Components/BackButton/BackButton";
import { TextInput2 } from "../../../Components/Input/TextInput2";
import { TextArea } from "../../../Components/Input/TextArea/TextArea";
import { SelectInput } from "../../../Components/Input/SelectInput/SelectInput";
import { Button } from "../../../Components/Button/Button";
import Modal from "../../../Components/modal/Modal";
import ConfirmationModal from "../../../Components/modal/ConfirmationModal";
import {
  allTasksSelector,
  allTasksLoadingSelector,
  allTasksErrorSelector,
  taskDetailsSelector,
  taskDetailsLoadingSelector,
  taskDetailsErrorSelector,
  updateTaskLoadingSelector,
  updateTaskErrorSelector,
  updateTaskSuccessSelector,
  deleteTaskLoadingSelector,
  deleteTaskErrorSelector,
  deleteTaskSuccessSelector,
  assignTaskMemberLoadingSelector,
  assignTaskMemberErrorSelector,
  assignTaskMemberSuccessSelector,
  unassignTaskMemberLoadingSelector,
  unassignTaskMemberErrorSelector,
  unassignTaskMemberSuccessSelector,
  updateTaskPriorityLoadingSelector,
  updateTaskPriorityErrorSelector,
  updateTaskPrioritySuccessSelector,
  updateTaskStatusLoadingSelector,
  updateTaskStatusErrorSelector,
  updateTaskStatusSuccessSelector,
  reviewTaskLoadingSelector,
  reviewTaskErrorSelector,
  reviewTaskSuccessSelector,
} from "../../../app/redux/reducers/task/selectors/taskSelectors";
import { allUsersSelector } from "../../../app/redux/reducers/user/selectors/userDetailsSelector";
import { currentUserDataSelector } from "../../../app/redux/reducers/auth/selectors/signupSelector";
import {
  setAllTasksStart,
  setTaskDetailsStart,
  setUpdateTaskStart,
  setDeleteTaskStart,
  setAssignTaskMemberStart,
  setUnassignTaskMemberStart,
  setUpdateTaskPriorityStart,
  setUpdateTaskStatusStart,
  setReviewTaskStart,
  resetTask,
} from "../../../app/redux/reducers/task/taskReducer";
import { setAllUsersStart } from "../../../app/redux/reducers/user/userDetailsReducer";
import { allProjectsSelector } from "../../../app/redux/reducers/project/selectors/projectSelectors";
import { setAllProjectsStart } from "../../../app/redux/reducers/project/projectReducer";
import type { ITaskQueryFilter } from "../../../app/redux/types/task";
import {
  type ITask,
  TaskPriority,
  TaskStatus,
  TaskReviewStatus,
} from "../../../app/redux/types/task";
import { newDateFormatDate } from "../../../utils/dateFomat";
import {
  FaTasks,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaUserMinus,
  FaFlag,
  FaClipboardCheck,
  FaCommentAlt,
} from "react-icons/fa";
import { UserRoleAccess } from "../../../app/redux/types/auth";
import type { IUser } from "../../../app/redux/types/user";
import type { IProject } from "../../../app/redux/types/project";

// Extended task type to handle the Task field issue
type ExtendedTask = ITask & {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  _id?: string;
  dueDate?: string | Date;
  project?: IProject | string; // Handle project field properly
  assignees?: IUser[] | string[];
  createdBy?:
    | string
    | { _id?: string; id?: string; firstName?: string; lastName?: string };
};

type ExtendedUser = IUser & {
  _id?: string;
};

type ExtendedProject = IProject & {
  _id?: string;
};

// Form validation schemas
const updateTaskSchema = yup.object({
  title: yup.string().required("Task title is required"),
  description: yup.string().optional(),
  isActive: yup.boolean().required(),
});

type UpdateTaskFormValues = yup.InferType<typeof updateTaskSchema>;

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showUpdatePriorityModal, setShowUpdatePriorityModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState<TaskReviewStatus>(
    TaskReviewStatus.PENDING
  );

  const allTasks = useSelector(allTasksSelector) || [];
  const taskDetails = useSelector(taskDetailsSelector);
  const allTasksLoading = useSelector(allTasksLoadingSelector);
  const taskDetailsLoading = useSelector(taskDetailsLoadingSelector);
  const allTasksError = useSelector(allTasksErrorSelector);
  const taskDetailsError = useSelector(taskDetailsErrorSelector);
  const allUsers = useSelector(allUsersSelector) || [];
  const allProjects = useSelector(allProjectsSelector) || [];
  const currentUser = useSelector(currentUserDataSelector);

  // Check if user is super admin
  const isSuperAdmin = currentUser?.role === UserRoleAccess.SUPER_ADMIN;

  // Update task states
  const updateLoading = useSelector(updateTaskLoadingSelector);
  const updateError = useSelector(updateTaskErrorSelector);
  const updateSuccess = useSelector(updateTaskSuccessSelector);

  // Delete task states
  const deleteLoading = useSelector(deleteTaskLoadingSelector);
  const deleteError = useSelector(deleteTaskErrorSelector);
  const deleteSuccess = useSelector(deleteTaskSuccessSelector);

  // Assign member states
  const assignLoading = useSelector(assignTaskMemberLoadingSelector);
  const assignError = useSelector(assignTaskMemberErrorSelector);
  const assignSuccess = useSelector(assignTaskMemberSuccessSelector);

  // Unassign member states
  const unassignLoading = useSelector(unassignTaskMemberLoadingSelector);
  const unassignError = useSelector(unassignTaskMemberErrorSelector);
  const unassignSuccess = useSelector(unassignTaskMemberSuccessSelector);

  // Update priority states
  const updatePriorityLoading = useSelector(updateTaskPriorityLoadingSelector);
  const updatePriorityError = useSelector(updateTaskPriorityErrorSelector);
  const updatePrioritySuccess = useSelector(updateTaskPrioritySuccessSelector);

  // Update status states
  const updateStatusLoading = useSelector(updateTaskStatusLoadingSelector);
  const updateStatusError = useSelector(updateTaskStatusErrorSelector);
  const updateStatusSuccess = useSelector(updateTaskStatusSuccessSelector);

  // Review states
  const reviewLoading = useSelector(reviewTaskLoadingSelector);
  const reviewError = useSelector(reviewTaskErrorSelector);
  const reviewSuccess = useSelector(reviewTaskSuccessSelector);

  // Try to find task in list first
  let task = allTasks.find(
    (t) => t._id === id || (t as ExtendedTask)._id === id
  ) as ExtendedTask | undefined;

  // If not found in list, use task details
  if (
    !task &&
    taskDetails &&
    (taskDetails._id === id || (taskDetails as ExtendedTask)._id === id)
  ) {
    task = taskDetails as ExtendedTask;
  }

  // Update form
  const {
    handleSubmit: handleUpdateSubmit,
    formState: { errors: updateErrors },
    register: registerUpdate,
    watch: watchUpdate,
    setValue: setUpdateValue,
    reset: resetUpdate,
  } = useForm<UpdateTaskFormValues>({
    resolver: yupResolver(updateTaskSchema) as Resolver<UpdateTaskFormValues>,
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      isActive: task?.isActive ?? true,
    },
  });

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      resetUpdate({
        title: task.title || "",
        description: task.description || "",
        isActive: task.isActive ?? true,
      });
    }
  }, [task, resetUpdate]);

  // Fetch users and projects for selection
  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(setAllUsersStart({ page: 1, limit: 100 }));
    }
    if (allProjects.length === 0) {
      dispatch(setAllProjectsStart({ page: 1, limit: 100 }));
    }
  }, [dispatch, allUsers.length, allProjects.length]);

  // Fetch task details if not already loaded
  useEffect(() => {
    if (id && !task && !taskDetailsLoading && !allTasksLoading) {
      dispatch(setTaskDetailsStart({ taskId: id }));
    }
  }, [dispatch, id, task, taskDetailsLoading, allTasksLoading]);

  // Also try fetching from list if task not found
  useEffect(() => {
    if (!task && !allTasksLoading && id) {
      const queryFilters: ITaskQueryFilter = {
        page: 1,
        limit: 100,
      };
      dispatch(setAllTasksStart(queryFilters));
    }
  }, [dispatch, task, allTasksLoading, id]);

  // Handle success states
  useEffect(() => {
    if (
      updateSuccess ||
      deleteSuccess ||
      assignSuccess ||
      unassignSuccess ||
      updatePrioritySuccess ||
      updateStatusSuccess ||
      reviewSuccess
    ) {
      setShowUpdateModal(false);
      setShowDeleteModal(false);
      setShowAssignModal(false);
      setShowUnassignModal(false);
      setShowUpdateStatusModal(false);
      setShowUpdatePriorityModal(false);
      setShowReviewModal(false);
      dispatch(resetTask());
      if (id) {
        dispatch(setTaskDetailsStart({ taskId: id }));
      }
    }
  }, [
    updateSuccess,
    deleteSuccess,
    assignSuccess,
    unassignSuccess,
    updatePrioritySuccess,
    updateStatusSuccess,
    reviewSuccess,
    dispatch,
    id,
  ]);

  // Handle delete success - navigate to list
  useEffect(() => {
    if (deleteSuccess) {
      navigate("/dashboard/task/list");
      dispatch(resetTask());
    }
  }, [deleteSuccess, navigate, dispatch]);

  const dataLoading = taskDetailsLoading || (allTasksLoading && !task);

  // Get task assignees
  const taskAssignees: ExtendedUser[] = task?.assignees
    ? task.assignees
        .map((assignee) => {
          if (typeof assignee === "string") {
            const assigneeId = assignee;
            return allUsers.find(
              (u: ExtendedUser) => u.id === assigneeId || u._id === assigneeId
            ) as ExtendedUser | undefined;
          }
          return assignee as ExtendedUser;
        })
        .filter((a): a is ExtendedUser => a !== undefined)
    : [];

  // Get available users (not already assignees)
  const availableUsers = allUsers.filter((user) => {
    const userId = user.id || (user as ExtendedUser)._id;
    return !taskAssignees.some(
      (assignee) => (assignee.id || assignee._id) === userId
    );
  });

  // Get project name
  const getProjectName = (): string => {
    if (!task?.project) return "N/A";

    if (typeof task.project === "string") {
      const projectId = task.project;
      const project = allProjects.find(
        (p: ExtendedProject) => p._id === projectId || p._id === projectId
      );
      return project ? project.name : projectId;
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

  // Get status color
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

  // Get priority color
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

  // Get review status color
  const getReviewStatusColor = (status?: TaskReviewStatus | string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-emerald-100 text-emerald-800";
      case "Changes-required":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last;
  };

  const onUpdateSubmit = (data: UpdateTaskFormValues) => {
    if (!id || !isSuperAdmin) return;
    dispatch(
      setUpdateTaskStart({
        taskId: id,
        data: {
          title: data.title,
          description: data.description || "",
          isActive: data.isActive,
        },
      })
    );
  };

  const handleDelete = () => {
    if (!id || !isSuperAdmin) return;
    dispatch(setDeleteTaskStart({ taskId: id }));
  };

  const handleAssign = () => {
    if (!id || !selectedMemberId) return;
    dispatch(
      setAssignTaskMemberStart({ taskId: id, memberId: selectedMemberId })
    );
  };

  const handleUnassign = () => {
    if (!id || !selectedMemberId) return;
    dispatch(
      setUnassignTaskMemberStart({ taskId: id, memberId: selectedMemberId })
    );
  };

  const handleUpdateStatus = (status: TaskStatus) => {
    if (!id) return;
    dispatch(setUpdateTaskStatusStart({ taskId: id, status }));
    setShowUpdateStatusModal(false);
  };

  const handleUpdatePriority = (priority: TaskPriority) => {
    if (!id) return;
    dispatch(setUpdateTaskPriorityStart({ taskId: id, priority }));
    setShowUpdatePriorityModal(false);
  };

  const handleReview = () => {
    if (!id) return;
    dispatch(
      setReviewTaskStart({
        taskId: id,
        review: {
          comment: reviewComment,
          status: reviewStatus,
        },
      })
    );
  };

  if (dataLoading && !task) {
    return (
      <AuthGuard>
        <BlankPageLoader />
      </AuthGuard>
    );
  }

  if ((allTasksError || taskDetailsError) && !task) {
    return (
      <AuthGuard>
        <div className="w-full">
          <BackButton />
          {taskDetailsError && (
            <FlashMessage message={String(taskDetailsError)} type="error" />
          )}
          {allTasksError && !taskDetailsError && (
            <FlashMessage message={String(allTasksError)} type="error" />
          )}
        </div>
      </AuthGuard>
    );
  }

  if (!task) {
    return (
      <AuthGuard>
        <div className="w-full">
          <BackButton />
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <FaTasks className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              Task Not Found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              The task you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/dashboard/task/list")}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Back to Task List
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
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white shadow-lg">
                <FaTasks className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
            </div>

            {/* Title and Status */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-2">
                    {task.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status || "N/A"}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      <FaFlag className="w-3 h-3 mr-1.5" />
                      {task.priority || "N/A"}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getReviewStatusColor(
                        task.reviewStatus
                      )}`}
                    >
                      {task.reviewStatus || "Pending"}
                    </span>
                    {task.isActive !== undefined && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          task.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.isActive ? (
                          <>
                            <FaCheckCircle className="w-3 h-3 mr-1.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="w-3 h-3 mr-1.5" />
                            Inactive
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {isSuperAdmin && (
                    <button
                      onClick={() => setShowUpdateModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <FaEdit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <FaUserPlus className="w-4 h-4 mr-2" />
                    Assign
                  </button>
                  {taskAssignees.length > 0 && (
                    <button
                      onClick={() => setShowUnassignModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <FaUserMinus className="w-4 h-4 mr-2" />
                      Unassign
                    </button>
                  )}
                  <button
                    onClick={() => setShowUpdateStatusModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <FaClipboardCheck className="w-4 h-4 mr-2" />
                    Update Status
                  </button>
                  <button
                    onClick={() => setShowUpdatePriorityModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <FaFlag className="w-4 h-4 mr-2" />
                    Update Priority
                  </button>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <FaCommentAlt className="w-4 h-4 mr-2" />
                    Review
                  </button>
                  {isSuperAdmin && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <FaTrash className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Messages */}
        {updateError && (
          <FlashMessage message={String(updateError)} type="error" />
        )}
        {deleteError && (
          <FlashMessage message={String(deleteError)} type="error" />
        )}
        {assignError && (
          <FlashMessage message={String(assignError)} type="error" />
        )}
        {unassignError && (
          <FlashMessage message={String(unassignError)} type="error" />
        )}
        {updatePriorityError && (
          <FlashMessage message={String(updatePriorityError)} type="error" />
        )}
        {updateStatusError && (
          <FlashMessage message={String(updateStatusError)} type="error" />
        )}
        {reviewError && (
          <FlashMessage message={String(reviewError)} type="error" />
        )}
        {updateSuccess && (
          <FlashMessage message="Task updated successfully!" type="success" />
        )}
        {assignSuccess && (
          <FlashMessage
            message="Member assigned successfully!"
            type="success"
          />
        )}
        {unassignSuccess && (
          <FlashMessage
            message="Member unassigned successfully!"
            type="success"
          />
        )}
        {updatePrioritySuccess && (
          <FlashMessage
            message="Priority updated successfully!"
            type="success"
          />
        )}
        {updateStatusSuccess && (
          <FlashMessage message="Status updated successfully!" type="success" />
        )}
        {reviewSuccess && (
          <FlashMessage
            message="Review submitted successfully!"
            type="success"
          />
        )}

        {/* Description */}
        {task.description && (
          <div className="mb-6 sm:mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        {/* Details Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Task Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaTasks className="w-5 h-5 text-purple-600" />
              Task Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaClipboardCheck className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {task.status || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaFlag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Priority
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {task.priority || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaClipboardCheck className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Review Status
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {task.reviewStatus || "Pending"}
                  </p>
                </div>
              </div>

              {task.dueDate && (
                <div className="flex items-start gap-3">
                  <FaCalendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Due Date
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {newDateFormatDate(task.dueDate)}
                    </p>
                  </div>
                </div>
              )}

              {task.createdAt && (
                <div className="flex items-start gap-3">
                  <FaCalendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Created Date
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {newDateFormatDate(task.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {task.updatedAt && (
                <div className="flex items-start gap-3">
                  <FaCalendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {newDateFormatDate(task.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project and Assignees */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaUsers className="w-5 h-5 text-blue-600" />
              Project & Assignees
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaTasks className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Project
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {getProjectName()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaUsers className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Assignees ({taskAssignees.length})
                  </p>
                  {taskAssignees.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {taskAssignees.map((assignee) => (
                        <div
                          key={assignee.id || assignee._id}
                          className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"
                        >
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                            {getInitials(assignee.firstName, assignee.lastName)}
                          </div>
                          <span className="text-sm text-gray-900">
                            {assignee.firstName} {assignee.lastName}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No assignees</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {task.reviews && task.reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaCommentAlt className="w-5 h-5 text-purple-600" />
              Reviews
            </h2>
            <div className="space-y-4">
              {task.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-l-4 border-purple-500 pl-4 py-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-semibold text-xs">
                        {getInitials(
                          review.reviewer?.firstName,
                          review.reviewer?.lastName
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {review.reviewer?.firstName} {review.reviewer?.lastName}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReviewStatusColor(
                        review.status
                      )}`}
                    >
                      {review.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                  {review.createdAt && (
                    <p className="text-xs text-gray-500">
                      {newDateFormatDate(review.createdAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Update Task Modal */}
        {isSuperAdmin && (
          <Modal
            isOpen={showUpdateModal}
            onClose={() => setShowUpdateModal(false)}
            title="Edit Task"
            size="md"
          >
            <form
              onSubmit={handleUpdateSubmit(onUpdateSubmit)}
              className="space-y-5 px-6 py-4 sm:px-8"
            >
              <TextInput2
                name="title"
                label="Task Title"
                type="text"
                placeholder="Enter task title"
                value={watchUpdate("title")}
                onChange={(e) => setUpdateValue("title", e.target.value)}
                error={updateErrors.title?.message}
                backgroundColor="bg-white"
                borderRadius="rounded-lg"
                labelColor="text-gray-800"
                className="text-base text-gray-900"
                placeholderColor="placeholder-gray-400"
              />

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Description
                </label>
                <TextArea
                  placeholder="Enter task description"
                  value={watchUpdate("description") || ""}
                  onChange={(e) =>
                    setUpdateValue("description", e.target.value)
                  }
                  error={updateErrors.description?.message}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...registerUpdate("isActive")}
                    checked={watchUpdate("isActive")}
                    onChange={(e) =>
                      setUpdateValue("isActive", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    Active Task
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="tertiary"
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  width="50%"
                  height="44px"
                  disabled={updateLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  width="50%"
                  height="44px"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Updating..." : "Update Task"}
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {isSuperAdmin && (
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title="Delete Task"
            message="Are you sure you want to delete this task? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            loading={deleteLoading}
            type="danger"
          />
        )}

        {/* Assign Member Modal */}
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Assign Member"
          size="md"
        >
          <div className="space-y-5 px-6 py-4 sm:px-8">
            <div>
              <SelectInput
                options={[
                  { value: "", label: "Select a member" },
                  ...availableUsers.map((user: ExtendedUser) => ({
                    value: user.id || user._id || "",
                    label: `${user.firstName} ${user.lastName} (${user.email})`,
                  })),
                ]}
                value={selectedMemberId}
                onChange={(value) => setSelectedMemberId(value)}
                placeholder="Select a member"
                label="Member"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="tertiary"
                type="button"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedMemberId("");
                }}
                width="50%"
                height="44px"
                disabled={assignLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={handleAssign}
                width="50%"
                height="44px"
                disabled={assignLoading || !selectedMemberId}
              >
                {assignLoading ? "Assigning..." : "Assign"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Unassign Member Modal */}
        <Modal
          isOpen={showUnassignModal}
          onClose={() => setShowUnassignModal(false)}
          title="Unassign Member"
          size="md"
        >
          <div className="space-y-5 px-6 py-4 sm:px-8">
            <div>
              <SelectInput
                options={[
                  { value: "", label: "Select a member" },
                  ...taskAssignees.map((assignee: ExtendedUser) => ({
                    value: assignee.id || assignee._id || "",
                    label: `${assignee.firstName} ${assignee.lastName} (${assignee.email})`,
                  })),
                ]}
                value={selectedMemberId}
                onChange={(value) => setSelectedMemberId(value)}
                placeholder="Select a member to unassign"
                label="Member"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="tertiary"
                type="button"
                onClick={() => {
                  setShowUnassignModal(false);
                  setSelectedMemberId("");
                }}
                width="50%"
                height="44px"
                disabled={unassignLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={handleUnassign}
                width="50%"
                height="44px"
                disabled={unassignLoading || !selectedMemberId}
              >
                {unassignLoading ? "Unassigning..." : "Unassign"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Update Status Modal */}
        <Modal
          isOpen={showUpdateStatusModal}
          onClose={() => setShowUpdateStatusModal(false)}
          title="Update Task Status"
          size="md"
        >
          <div className="space-y-4 px-6 py-4 sm:px-8">
            <div className="grid grid-cols-1 gap-3">
              {[TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    disabled={updateStatusLoading || task.status === status}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      task.status === status
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    } ${
                      updateStatusLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <span className="font-medium text-gray-900">{status}</span>
                  </button>
                )
              )}
            </div>
            <div className="flex items-center justify-end pt-2">
              <Button
                variant="tertiary"
                type="button"
                onClick={() => setShowUpdateStatusModal(false)}
                width="100%"
                height="44px"
                disabled={updateStatusLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Update Priority Modal */}
        <Modal
          isOpen={showUpdatePriorityModal}
          onClose={() => setShowUpdatePriorityModal(false)}
          title="Update Task Priority"
          size="md"
        >
          <div className="space-y-4 px-6 py-4 sm:px-8">
            <div className="grid grid-cols-1 gap-3">
              {[TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH].map(
                (priority) => (
                  <button
                    key={priority}
                    onClick={() => handleUpdatePriority(priority)}
                    disabled={
                      updatePriorityLoading || task.priority === priority
                    }
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      task.priority === priority
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    } ${
                      updatePriorityLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <span className="font-medium text-gray-900">
                      {priority}
                    </span>
                  </button>
                )
              )}
            </div>
            <div className="flex items-center justify-end pt-2">
              <Button
                variant="tertiary"
                type="button"
                onClick={() => setShowUpdatePriorityModal(false)}
                width="100%"
                height="44px"
                disabled={updatePriorityLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Review Modal */}
        <Modal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          title="Review Task"
          size="md"
        >
          <div className="space-y-5 px-6 py-4 sm:px-8">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Review Status
              </label>
              <SelectInput
                options={[
                  { value: TaskReviewStatus.PENDING, label: "Pending" },
                  { value: TaskReviewStatus.APPROVED, label: "Approved" },
                  {
                    value: TaskReviewStatus.CHANGES_REQUIRED,
                    label: "Changes Required",
                  },
                ]}
                value={reviewStatus}
                onChange={(value) => setReviewStatus(value as TaskReviewStatus)}
                placeholder="Select review status"
                label=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Comment
              </label>
              <TextArea
                placeholder="Enter review comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="tertiary"
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewComment("");
                  setReviewStatus(TaskReviewStatus.PENDING);
                }}
                width="50%"
                height="44px"
                disabled={reviewLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={handleReview}
                width="50%"
                height="44px"
                disabled={reviewLoading || !reviewComment.trim()}
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default TaskDetails;
