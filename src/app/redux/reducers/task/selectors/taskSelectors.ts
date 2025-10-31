import { createSelector } from "reselect";
import type { RootState } from "../../../store/store";
import { initialState } from "../taskReducer";

export const mySelector = (state: RootState) => state.task || initialState;

// Fetch all Tasks selectors
export const allTasksLoadingSelector = createSelector(
  mySelector,
  (state) => state.fetchAllTasksLoading
);
export const allTasksErrorSelector = createSelector(
  mySelector,
  (state) => state.fetchAllTasksError
);
export const allTasksSelector = createSelector(
  mySelector,
  (state) => state.allTasks
);
export const allTasksCountSelector = createSelector(
  mySelector,
  (state) => state.allTaskCount
);

// Fetch Task details selectors
export const taskDetailsLoadingSelector = createSelector(
  mySelector,
  (state) => state.fetchTaskDetailsLoading
);
export const taskDetailsErrorSelector = createSelector(
  mySelector,
  (state) => state.fetchTaskDetailsError
);
export const taskDetailsSelector = createSelector(
  mySelector,
  (state) => state.TaskDetails
);

// Create Task selectors
export const createTaskLoadingSelector = createSelector(
  mySelector,
  (state) => state.createTaskLoading
);
export const createTaskErrorSelector = createSelector(
  mySelector,
  (state) => state.createTaskError
);
export const createTaskSuccessSelector = createSelector(
  mySelector,
  (state) => state.createTaskSuccess
);

// Update Task selectors
export const updateTaskLoadingSelector = createSelector(
  mySelector,
  (state) => state.updateTaskLoading
);
export const updateTaskErrorSelector = createSelector(
  mySelector,
  (state) => state.updateTaskError
);
export const updateTaskSuccessSelector = createSelector(
  mySelector,
  (state) => state.updateTaskSuccess
);

// Delete Task selectors
export const deleteTaskLoadingSelector = createSelector(
  mySelector,
  (state) => state.deleteTaskLoading
);
export const deleteTaskErrorSelector = createSelector(
  mySelector,
  (state) => state.deleteTaskError
);
export const deleteTaskSuccessSelector = createSelector(
  mySelector,
  (state) => state.deleteTaskSuccess
);

// Assign Task Member selectors
export const assignTaskMemberLoadingSelector = createSelector(
  mySelector,
  (state) => state.assignTaskMemberLoading
);
export const assignTaskMemberErrorSelector = createSelector(
  mySelector,
  (state) => state.assignTaskMemberError
);
export const assignTaskMemberSuccessSelector = createSelector(
  mySelector,
  (state) => state.assignTaskMemberSuccess
);

// Unassign Task Member selectors
export const unassignTaskMemberLoadingSelector = createSelector(
  mySelector,
  (state) => state.unassignTaskMemberLoading
);
export const unassignTaskMemberErrorSelector = createSelector(
  mySelector,
  (state) => state.unassignTaskMemberError
);
export const unassignTaskMemberSuccessSelector = createSelector(
  mySelector,
  (state) => state.unassignTaskMemberSuccess
);

// Update Task Priority selectors
export const updateTaskPriorityLoadingSelector = createSelector(
  mySelector,
  (state) => state.updateTaskPriorityLoading
);
export const updateTaskPriorityErrorSelector = createSelector(
  mySelector,
  (state) => state.updateTaskPriorityError
);
export const updateTaskPrioritySuccessSelector = createSelector(
  mySelector,
  (state) => state.updateTaskPrioritySuccess
);

// Update Task Status selectors
export const updateTaskStatusLoadingSelector = createSelector(
  mySelector,
  (state) => state.updateTaskStatusLoading
);
export const updateTaskStatusErrorSelector = createSelector(
  mySelector,
  (state) => state.updateTaskStatusError
);
export const updateTaskStatusSuccessSelector = createSelector(
  mySelector,
  (state) => state.updateTaskStatusSuccess
);

// Review Task selectors
export const reviewTaskLoadingSelector = createSelector(
  mySelector,
  (state) => state.reviewTaskStatusLoading
);
export const reviewTaskErrorSelector = createSelector(
  mySelector,
  (state) => state.reviewTaskStatusError
);
export const reviewTaskSuccessSelector = createSelector(
  mySelector,
  (state) => state.reviewTaskStatusSuccess
);
