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
import {
  allProjectsSelector,
  allProjectsLoadingSelector,
  allProjectsErrorSelector,
  projectDetailsSelector,
  projectDetailsLoadingSelector,
  projectDetailsErrorSelector,
  updateProjectLoadingSelector,
  updateProjectErrorSelector,
  updateProjectSuccessSelector,
  deleteProjectLoadingSelector,
  deleteProjectErrorSelector,
  deleteProjectSuccessSelector,
  addProjectMemberLoadingSelector,
  addProjectMemberErrorSelector,
  addProjectMemberSuccessSelector,
  removeProjectMemberLoadingSelector,
  removeProjectMemberErrorSelector,
  removeProjectMemberSuccessSelector,
} from "../../../app/redux/reducers/project/selectors/projectSelectors";
import { allUsersSelector } from "../../../app/redux/reducers/user/selectors/userDetailsSelector";
import { currentUserDataSelector } from "../../../app/redux/reducers/auth/selectors/signupSelector";
import {
  setAllProjectsStart,
  setProjectDetailsStart,
  setUpdateProjectStart,
  setDeleteProjectStart,
  setAddProjectMemberStart,
  setRemoveProjectMemberStart,
  resetProject,
} from "../../../app/redux/reducers/project/projectReducer";
import { setAllUsersStart } from "../../../app/redux/reducers/user/userDetailsReducer";
import type { IProjectQueryFilter } from "../../../app/redux/types/project";
import type { IProject } from "../../../app/redux/types/project";
import type { IUser } from "../../../app/redux/types/user";
import { newDateFormatDate } from "../../../utils/dateFomat";
import {
  FaFolder,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaTasks,
  FaUser,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaUserMinus,
  FaTimes,
} from "react-icons/fa";
import { UserRoleAccess } from "../../../app/redux/types/auth";

// Extended project type to include optional fields from API
type ExtendedProject = IProject & {
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  _id?: string;
  memberCount?: number;
  taskCount?: number;
  createdBy?:
    | string
    | { _id?: string; id?: string; firstName?: string; lastName?: string };
  projectManager?:
    | string
    | { _id?: string; id?: string; firstName?: string; lastName?: string };
  members?: IUser[] | string[];
};

type ExtendedUser = IUser & {
  _id?: string;
};

// Form validation schemas
const updateProjectSchema = yup.object({
  name: yup.string().required("Project name is required"),
  description: yup.string().optional(),
  isActive: yup.boolean().required(),
});

type UpdateProjectFormValues = yup.InferType<typeof updateProjectSchema>;

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);

  const allProjects = useSelector(allProjectsSelector) || [];
  const projectDetails = useSelector(projectDetailsSelector);
  const allProjectsLoading = useSelector(allProjectsLoadingSelector);
  const projectDetailsLoading = useSelector(projectDetailsLoadingSelector);
  const allProjectsError = useSelector(allProjectsErrorSelector);
  const projectDetailsError = useSelector(projectDetailsErrorSelector);
  const allUsers = useSelector(allUsersSelector) || [];
  const currentUser = useSelector(currentUserDataSelector);

  // Check if user is super admin
  const isSuperAdmin = currentUser?.role === UserRoleAccess.SUPER_ADMIN;

  // Update project states
  const updateLoading = useSelector(updateProjectLoadingSelector);
  const updateError = useSelector(updateProjectErrorSelector);
  const updateSuccess = useSelector(updateProjectSuccessSelector);

  // Delete project states
  const deleteLoading = useSelector(deleteProjectLoadingSelector);
  const deleteError = useSelector(deleteProjectErrorSelector);
  const deleteSuccess = useSelector(deleteProjectSuccessSelector);

  // Add member states
  const addMemberLoading = useSelector(addProjectMemberLoadingSelector);
  const addMemberError = useSelector(addProjectMemberErrorSelector);
  const addMemberSuccess = useSelector(addProjectMemberSuccessSelector);

  // Remove member states
  const removeMemberLoading = useSelector(removeProjectMemberLoadingSelector);
  const removeMemberError = useSelector(removeProjectMemberErrorSelector);
  const removeMemberSuccess = useSelector(removeProjectMemberSuccessSelector);

  // Try to find project in list first
  let project = allProjects.find(
    (p) => p._id === id || (p as ExtendedProject)._id === id
  ) as ExtendedProject | undefined;

  // If not found in list, use project details
  if (
    !project &&
    projectDetails &&
    (projectDetails._id === id ||
      (projectDetails as ExtendedProject)._id === id)
  ) {
    project = projectDetails as ExtendedProject;
  }

  // Update form
  const {
    handleSubmit: handleUpdateSubmit,
    formState: { errors: updateErrors },
    register: registerUpdate,
    watch: watchUpdate,
    setValue: setUpdateValue,
    reset: resetUpdate,
  } = useForm<UpdateProjectFormValues>({
    resolver: yupResolver(
      updateProjectSchema
    ) as Resolver<UpdateProjectFormValues>,
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      isActive: project?.isActive ?? true,
    },
  });

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      resetUpdate({
        name: project.name || "",
        description: project.description || "",
        isActive: project.isActive ?? true,
      });
    }
  }, [project, resetUpdate]);

  // Fetch users for member selection
  useEffect(() => {
    if (showAddMemberModal && allUsers.length === 0) {
      dispatch(setAllUsersStart({ page: 1, limit: 100 }));
    }
  }, [dispatch, showAddMemberModal, allUsers.length]);

  // Fetch project details if not already loaded
  useEffect(() => {
    if (id && !project && !projectDetailsLoading && !allProjectsLoading) {
      dispatch(setProjectDetailsStart({ projectId: id }));
    }
  }, [dispatch, id, project, projectDetailsLoading, allProjectsLoading]);

  // Also try fetching from list if project not found
  useEffect(() => {
    if (!project && !allProjectsLoading && id) {
      const queryFilters: IProjectQueryFilter = {
        page: 1,
        limit: 100,
      };
      dispatch(setAllProjectsStart(queryFilters));
    }
  }, [dispatch, project, allProjectsLoading, id]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      setShowUpdateModal(false);
      dispatch(resetProject());
      if (id) {
        dispatch(setProjectDetailsStart({ projectId: id }));
      }
    }
  }, [updateSuccess, dispatch, id]);

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      navigate("/dashboard/project/list");
      dispatch(resetProject());
    }
  }, [deleteSuccess, navigate, dispatch]);

  // Handle add member success
  useEffect(() => {
    if (addMemberSuccess) {
      setShowAddMemberModal(false);
      dispatch(resetProject());
      if (id) {
        dispatch(setProjectDetailsStart({ projectId: id }));
      }
    }
  }, [addMemberSuccess, dispatch, id]);

  // Handle remove member success
  useEffect(() => {
    if (removeMemberSuccess) {
      setShowRemoveMemberModal(false);
      dispatch(resetProject());
      if (id) {
        dispatch(setProjectDetailsStart({ projectId: id }));
      }
    }
  }, [removeMemberSuccess, dispatch, id]);

  const dataLoading = projectDetailsLoading || (allProjectsLoading && !project);

  // Get project members (handle both string array and IUser array)
  const projectMembers: ExtendedUser[] = project?.members
    ? project.members
        .map((m) => {
          if (typeof m === "string") {
            return allUsers.find(
              (u) => u.id === m || (u as ExtendedUser)._id === m
            ) as ExtendedUser | undefined;
          }
          return m as ExtendedUser;
        })
        .filter((m): m is ExtendedUser => m !== undefined)
    : [];

  // Get available users (not already members)
  const availableUsers = allUsers.filter((user) => {
    const userId = user.id || (user as ExtendedUser)._id;
    return !projectMembers.some(
      (member) => (member.id || member._id) === userId
    );
  });

  const onUpdateSubmit = (data: UpdateProjectFormValues) => {
    if (!id || !isSuperAdmin) return; // Only super admin can update
    dispatch(
      setUpdateProjectStart({
        projectId: id,
        data: {
          name: data.name,
          description: data.description || "",
          isActive: data.isActive,
        },
      })
    );
  };

  const handleDelete = () => {
    if (!id || !isSuperAdmin) return; // Only super admin can delete
    dispatch(setDeleteProjectStart({ projectId: id }));
  };

  const handleAddMember = (memberId: string) => {
    if (!id || !isSuperAdmin) return; // Only super admin can add members
    dispatch(setAddProjectMemberStart({ projectId: id, memberId }));
  };

  const handleRemoveMember = (memberId: string) => {
    if (!id) return;
    dispatch(setRemoveProjectMemberStart({ projectId: id, memberId }));
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last;
  };

  if (dataLoading && !project) {
    return (
      <AuthGuard>
        <BlankPageLoader />
      </AuthGuard>
    );
  }

  if ((allProjectsError || projectDetailsError) && !project) {
    return (
      <AuthGuard>
        <div className="w-full">
          <BackButton />
          {projectDetailsError && (
            <FlashMessage message={String(projectDetailsError)} type="error" />
          )}
          {allProjectsError && !projectDetailsError && (
            <FlashMessage message={String(allProjectsError)} type="error" />
          )}
        </div>
      </AuthGuard>
    );
  }

  if (!project) {
    return (
      <AuthGuard>
        <div className="w-full">
          <BackButton />
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <FaFolder className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              Project Not Found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/dashboard/project/list")}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Back to Project List
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
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <FaFolder className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
            </div>

            {/* Name and Status */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-2">
                    {project.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        project.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.isActive ? (
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
                    {project.memberCount !== undefined && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <FaUsers className="w-3 h-3 mr-1.5" />
                        {project.memberCount}{" "}
                        {project.memberCount === 1 ? "Member" : "Members"}
                      </span>
                    )}
                    {project.taskCount !== undefined && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        <FaTasks className="w-3 h-3 mr-1.5" />
                        {project.taskCount}{" "}
                        {project.taskCount === 1 ? "Task" : "Tasks"}
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
                  {isSuperAdmin && (
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <FaUserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </button>
                  )}
                  {projectMembers.length > 0 && (
                    <button
                      onClick={() => setShowRemoveMemberModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <FaUserMinus className="w-4 h-4 mr-2" />
                      Remove Member
                    </button>
                  )}
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
        {addMemberError && (
          <FlashMessage message={String(addMemberError)} type="error" />
        )}
        {removeMemberError && (
          <FlashMessage message={String(removeMemberError)} type="error" />
        )}
        {updateSuccess && (
          <FlashMessage
            message="Project updated successfully!"
            type="success"
          />
        )}
        {addMemberSuccess && (
          <FlashMessage message="Member added successfully!" type="success" />
        )}
        {removeMemberSuccess && (
          <FlashMessage message="Member removed successfully!" type="success" />
        )}

        {/* Description */}
        {project.description && (
          <div className="mb-6 sm:mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {project.description}
            </p>
          </div>
        )}

        {/* Details Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Project Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaFolder className="w-5 h-5 text-indigo-600" />
              Project Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      project.isActive ? "text-emerald-600" : "text-gray-600"
                    }`}
                  >
                    {project.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              {project.createdAt && (
                <div className="flex items-start gap-3">
                  <FaCalendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Created Date
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {newDateFormatDate(project.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {project.updatedAt && (
                <div className="flex items-start gap-3">
                  <FaCalendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {newDateFormatDate(project.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaTasks className="w-5 h-5 text-indigo-600" />
              Statistics
            </h2>
            <div className="space-y-4">
              {project.memberCount !== undefined && (
                <div className="flex items-start gap-3">
                  <FaUsers className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Total Members
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {project.memberCount}
                    </p>
                  </div>
                </div>
              )}

              {project.taskCount !== undefined && (
                <div className="flex items-start gap-3">
                  <FaTasks className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Total Tasks
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {project.taskCount}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Members List */}
        {projectMembers.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaUsers className="w-5 h-5 text-indigo-600" />
              Project Members
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectMembers.map((member) => {
                const memberId = member.id || member._id;
                return (
                  <div
                    key={memberId}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {getInitials(member.firstName, member.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Project ID (for reference) */}
        <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">
            Project ID:{" "}
            <span className="font-mono text-gray-700">
              {project._id || project._id}
            </span>
          </p>
        </div>

        {/* Update Project Modal - Only visible to Super Admin */}
        {isSuperAdmin && (
          <Modal
            isOpen={showUpdateModal}
            onClose={() => setShowUpdateModal(false)}
            title="Edit Project"
            size="lg"
          >
            <div className="px-6 py-4 sm:px-8">
              {updateError && (
                <div className="mb-4">
                  <FlashMessage message={String(updateError)} type="error" />
                </div>
              )}

              <form
                onSubmit={handleUpdateSubmit(onUpdateSubmit)}
                className="space-y-5"
              >
                <TextInput2
                  label="Project Name"
                  placeholder="Enter project name"
                  value={watchUpdate("name") || ""}
                  onChange={(e) => setUpdateValue("name", e.target.value)}
                  error={updateErrors.name?.message}
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
                  <textarea
                    placeholder="Enter project description"
                    value={watchUpdate("description") || ""}
                    onChange={(e) =>
                      setUpdateValue("description", e.target.value)
                    }
                    rows={3}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      updateErrors.description ? "border-red-500" : ""
                    }`}
                  />
                  {updateErrors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {updateErrors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Status
                  </label>
                  <SelectInput
                    options={[
                      { value: "true", label: "Active" },
                      { value: "false", label: "Inactive" },
                    ]}
                    value={watchUpdate("isActive")?.toString() || "true"}
                    onChange={(value) =>
                      setUpdateValue("isActive", value === "true")
                    }
                    placeholder="Select Status"
                    label=""
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
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
                    {updateLoading ? "Updating..." : "Update Project"}
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal - Only visible to Super Admin */}
        {isSuperAdmin && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete Project"
            size="sm"
          >
            <div className="p-6">
            {deleteError ? (
              <FlashMessage message={String(deleteError)} type="error" />
            ) : (
              <>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete{" "}
                  <strong>{project.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleteLoading}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash className="w-4 h-4" />
                        Delete Project
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
            </div>
          </Modal>
        )}

        {/* Add Member Modal - Only visible to Super Admin */}
        {isSuperAdmin && (
          <Modal
            isOpen={showAddMemberModal}
            onClose={() => setShowAddMemberModal(false)}
            title="Add Member"
            size="md"
          >
            <div className="p-6">
            {availableUsers.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                No available users to add to this project.
              </p>
            ) : (
              <div className="space-y-2">
                {availableUsers.map((user) => {
                  const userId = user.id || (user as ExtendedUser)._id;
                  return (
                    <div
                      key={userId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleAddMember(userId || "")}
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddMember(userId || "");
                        }}
                        disabled={addMemberLoading}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addMemberLoading ? "Adding..." : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {addMemberError && (
              <div className="mt-4">
                <FlashMessage message={String(addMemberError)} type="error" />
              </div>
            )}
            </div>
          </Modal>
        )}

        {/* Remove Member Modal */}
        <Modal
          isOpen={showRemoveMemberModal}
          onClose={() => setShowRemoveMemberModal(false)}
          title="Remove Member"
          size="md"
        >
          <div className="p-6">
            {projectMembers.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                No members to remove from this project.
              </p>
            ) : (
              <div className="space-y-2">
                {projectMembers.map((member) => {
                  const memberId = member.id || member._id;
                  return (
                    <div
                      key={memberId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {getInitials(member.firstName, member.lastName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {member.email}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(memberId || "")}
                        disabled={removeMemberLoading}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removeMemberLoading ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {removeMemberError && (
              <div className="mt-4">
                <FlashMessage
                  message={String(removeMemberError)}
                  type="error"
                />
              </div>
            )}
          </div>
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default ProjectDetails;
