import { createSelector } from "reselect";
import type { RootState } from "../../../store/store";
import { initialState } from "../projectReducer";

export const mySelector = (state: RootState) => state.project || initialState;

// Fetch all Projects selectors
export const allProjectsLoadingSelector = createSelector(
  mySelector,
  (state) => state.fetchAllProjectsLoading
);
export const allProjectsErrorSelector = createSelector(
  mySelector,
  (state) => state.fetchAllProjectsError
);
export const allProjectsSelector = createSelector(
  mySelector,
  (state) => state.allProjects
);
export const allProjectsCountSelector = createSelector(
  mySelector,
  (state) => state.allProjectCount
);

// Fetch Project details selectors
export const projectDetailsLoadingSelector = createSelector(
  mySelector,
  (state) => state.fetchProjectDetailsLoading
);
export const projectDetailsErrorSelector = createSelector(
  mySelector,
  (state) => state.fetchProjectDetailsError
);
export const projectDetailsSelector = createSelector(
  mySelector,
  (state) => state.projectDetails
);

// Create Project selectors
export const createProjectLoadingSelector = createSelector(
  mySelector,
  (state) => state.createProjectLoading
);
export const createProjectErrorSelector = createSelector(
  mySelector,
  (state) => state.createProjectError
);
export const createProjectSuccessSelector = createSelector(
  mySelector,
  (state) => state.createProjectSuccess
);

// Update Project selectors
export const updateProjectLoadingSelector = createSelector(
  mySelector,
  (state) => state.updateProjectLoading
);
export const updateProjectErrorSelector = createSelector(
  mySelector,
  (state) => state.updateProjectError
);
export const updateProjectSuccessSelector = createSelector(
  mySelector,
  (state) => state.updateProjectSuccess
);

// Delete Project selectors
export const deleteProjectLoadingSelector = createSelector(
  mySelector,
  (state) => state.deleteProjectLoading
);
export const deleteProjectErrorSelector = createSelector(
  mySelector,
  (state) => state.deleteProjectError
);
export const deleteProjectSuccessSelector = createSelector(
  mySelector,
  (state) => state.deleteProjectSuccess
);

// Add Project Member selectors
export const addProjectMemberLoadingSelector = createSelector(
  mySelector,
  (state) => state.addProjectMemberLoading
);
export const addProjectMemberErrorSelector = createSelector(
  mySelector,
  (state) => state.addProjectMemberError
);
export const addProjectMemberSuccessSelector = createSelector(
  mySelector,
  (state) => state.addProjectMemberSuccess
);

// Remove Project Member selectors
export const removeProjectMemberLoadingSelector = createSelector(
  mySelector,
  (state) => state.removeProjectMemberLoading
);
export const removeProjectMemberErrorSelector = createSelector(
  mySelector,
  (state) => state.removeProjectMemberError
);
export const removeProjectMemberSuccessSelector = createSelector(
  mySelector,
  (state) => state.removeProjectMemberSuccess
);
