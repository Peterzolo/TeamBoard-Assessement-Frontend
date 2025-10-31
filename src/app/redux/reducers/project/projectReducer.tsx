import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { IProjectQueryFilter, ProjectState } from "../../types/project";

// Initial state
export const initialState: ProjectState = {
  // Create Project
  createProjectLoading: false,
  createProjectError: null,
  createProjectSuccess: false,

  //   Fetch all Project

  fetchAllProjectsLoading: false,
  fetchAllProjectsError: null,
  allProjects: [],
  allProjectCount: 0,

  //   Fetch project details
  fetchProjectDetailsLoading: false,
  fetchProjectDetailsError: null,
  projectDetails: null,

  // Update project
  updateProjectLoading: false,
  updateProjectError: null,
  updateProjectSuccess: false,

  // Delete project
  deleteProjectLoading: false,
  deleteProjectError: null,
  deleteProjectSuccess: false,

  //   Add member
  addProjectMemberLoading: false,
  addProjectMemberError: null,
  addProjectMemberSuccess: false,

  //   Remove member
  removeProjectMemberLoading: false,
  removeProjectMemberError: null,
  removeProjectMemberSuccess: false,
};

// Create the slice
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    // Fetch all Projects actions
    setAllProjectsStart: (
      state,
      action: PayloadAction<IProjectQueryFilter>
    ) => {
      state.fetchAllProjectsLoading = true;
      state.fetchAllProjectsError = null;
    },
    setAllProjectsSuccess: (state, action: PayloadAction<any>) => {
      state.fetchAllProjectsLoading = false;
      state.allProjects = action.payload.data || [];
      state.allProjectCount = action.payload.total || action.payload.meta?.total || 0;
      state.fetchAllProjectsError = null;
    },
    setAllProjectsFailure: (state, action: PayloadAction<string>) => {
      state.fetchAllProjectsLoading = false;
      state.fetchAllProjectsError = action.payload;
    },

    // Fetch Project details actions
    setProjectDetailsStart: (
      state,
      action: PayloadAction<{ projectId: string }>
    ) => {
      state.fetchProjectDetailsLoading = true;
      state.fetchProjectDetailsError = null;
    },
    setProjectDetailsSuccess: (state, action: PayloadAction<any>) => {
      state.fetchProjectDetailsLoading = false;
      state.projectDetails = action.payload.data;
      state.fetchProjectDetailsError = null;
    },
    setProjectDetailsFailure: (state, action: PayloadAction<string>) => {
      state.fetchProjectDetailsLoading = false;
      state.fetchProjectDetailsError = action.payload;
    },

    // Create Project actions
    setCreateProjectStart: (state, action: PayloadAction<any>) => {
      state.createProjectLoading = true;
      state.createProjectError = null;
      state.createProjectSuccess = false;
    },
    setCreateProjectSuccess: (state, action: PayloadAction<any>) => {
      state.createProjectLoading = false;
      state.createProjectSuccess = true;
      state.createProjectError = null;
    },
    setCreateProjectFailure: (state, action: PayloadAction<string>) => {
      state.createProjectLoading = false;
      state.createProjectError = action.payload;
    },

    // Update Project actions
    setUpdateProjectStart: (
      state,
      action: PayloadAction<{ projectId: string; data: any }>
    ) => {
      state.updateProjectLoading = true;
      state.updateProjectError = null;
      state.updateProjectSuccess = false;
    },

    setUpdateProjectSuccess(state, action: PayloadAction<any>) {
      state.updateProjectLoading = false;
      state.updateProjectError = null;
      state.updateProjectSuccess = true;

      // If the updated project is the currently selected one, update it
      if (state.projectDetails?._id === action.payload._id) {
        state.projectDetails = action.payload;
      }

      // Update the project in the list
      state.allProjects = state.allProjects.map((project) =>
        project._id === action.payload._id ? action.payload : project
      );
    },

    setUpdateProjectFailure: (state, action: PayloadAction<string>) => {
      state.updateProjectLoading = false;
      state.updateProjectError = action.payload;
    },

    // Delete Project actions
    setDeleteProjectStart: (
      state,
      action: PayloadAction<{ projectId: string }>
    ) => {
      state.deleteProjectLoading = true;
      state.deleteProjectError = null;
      state.deleteProjectSuccess = false;
    },
    setDeleteProjectSuccess: (
      state,
      action: PayloadAction<{ projectId: string }>
    ) => {
      state.deleteProjectLoading = false;
      state.deleteProjectSuccess = true;
      state.deleteProjectError = null;
      // Remove the Project from the list
      state.allProjects = state.allProjects.filter(
        (s: { _id?: string }) => s._id !== action.payload.projectId
      );
      state.allProjectCount = Math.max(0, state.allProjectCount - 1);
      // Clear current Project if it's the deleted one
      if (
        state.projectDetails &&
        state.projectDetails._id === action.payload.projectId
      ) {
        state.projectDetails = null;
      }
    },
    setDeleteProjectFailure: (state, action: PayloadAction<string>) => {
      state.deleteProjectLoading = false;
      state.deleteProjectError = action.payload;
    },
    resetProject: (state) => {
      state.createProjectSuccess = false;
      state.updateProjectSuccess = false;
      state.deleteProjectSuccess = false;
      state.addProjectMemberSuccess = false;
      state.removeProjectMemberSuccess = false;
    },

    // Add Project Member actions
    setAddProjectMemberStart: (
      state,
      action: PayloadAction<{ projectId: string; memberId: string }>
    ) => {
      state.addProjectMemberLoading = true;
      state.addProjectMemberError = null;
      state.addProjectMemberSuccess = false;
    },
    setAddProjectMemberSuccess: (state, action: PayloadAction<any>) => {
      state.addProjectMemberLoading = false;
      state.addProjectMemberSuccess = true;
      state.addProjectMemberError = null;

      const updatedProject =
        action.payload.data || action.payload.project || action.payload;
      const projectId = updatedProject._id || action.payload.projectId;

      // Update project details if it's the current project
      if (state.projectDetails && state.projectDetails._id === projectId) {
        state.projectDetails = updatedProject;
      }

      // Update the project in the list
      if (projectId) {
        state.allProjects = state.allProjects.map((project) =>
          project._id === projectId ? updatedProject : project
        );
      }
    },
    setAddProjectMemberFailure: (state, action: PayloadAction<string>) => {
      state.addProjectMemberLoading = false;
      state.addProjectMemberError = action.payload;
      state.addProjectMemberSuccess = false;
    },

    // Remove Project Member actions
    setRemoveProjectMemberStart: (
      state,
      action: PayloadAction<{ projectId: string; memberId: string }>
    ) => {
      state.removeProjectMemberLoading = true;
      state.removeProjectMemberError = null;
      state.removeProjectMemberSuccess = false;
    },
    setRemoveProjectMemberSuccess: (state, action: PayloadAction<any>) => {
      state.removeProjectMemberLoading = false;
      state.removeProjectMemberSuccess = true;
      state.removeProjectMemberError = null;

      const updatedProject =
        action.payload.data || action.payload.project || action.payload;
      const projectId = updatedProject._id || action.payload.projectId;

      // Update project details if it's the current project
      if (state.projectDetails && state.projectDetails._id === projectId) {
        state.projectDetails = updatedProject;
      }

      // Update the project in the list
      if (projectId) {
        state.allProjects = state.allProjects.map((project) =>
          project._id === projectId ? updatedProject : project
        );
      }
    },
    setRemoveProjectMemberFailure: (state, action: PayloadAction<string>) => {
      state.removeProjectMemberLoading = false;
      state.removeProjectMemberError = action.payload;
      state.removeProjectMemberSuccess = false;
    },
  },
});

// Export actions
export const {
  // Fetch all Projects
  setAllProjectsStart,
  setAllProjectsSuccess,
  setAllProjectsFailure,

  // Fetch Project details
  setProjectDetailsStart,
  setProjectDetailsSuccess,
  setProjectDetailsFailure,

  // Create Project
  setCreateProjectStart,
  setCreateProjectSuccess,
  setCreateProjectFailure,

  // Update Project
  setUpdateProjectStart,
  setUpdateProjectSuccess,
  setUpdateProjectFailure,

  // Delete Project
  setDeleteProjectStart,
  setDeleteProjectSuccess,
  setDeleteProjectFailure,

  // Add Project Member
  setAddProjectMemberStart,
  setAddProjectMemberSuccess,
  setAddProjectMemberFailure,

  // Remove Project Member
  setRemoveProjectMemberStart,
  setRemoveProjectMemberSuccess,
  setRemoveProjectMemberFailure,

  resetProject,
} = projectSlice.actions;

// Export reducer
export default projectSlice.reducer;
