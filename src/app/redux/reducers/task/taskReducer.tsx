import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ITaskQueryFilter, TaskState } from "../../types/task";

// Initial state
export const initialState: TaskState = {
  // Create Task
  createTaskLoading: false,
  createTaskError: null,
  createTaskSuccess: false,

  //   Fetch all Task

  fetchAllTasksLoading: false,
  fetchAllTasksError: null,
  allTasks: [],
  allTaskCount: 0,

  //   Fetch Task details
  fetchTaskDetailsLoading: false,
  fetchTaskDetailsError: null,
  TaskDetails: null,

  // Update Task
  updateTaskLoading: false,
  updateTaskError: null,
  updateTaskSuccess: false,

  // Delete Task
  deleteTaskLoading: false,
  deleteTaskError: null,
  deleteTaskSuccess: false,

  //   Assign member
  assignTaskMemberLoading: false,
  assignTaskMemberError: null,
  assignTaskMemberSuccess: false,

  //   Unassign member
  unassignTaskMemberLoading: false,
  unassignTaskMemberError: null,
  unassignTaskMemberSuccess: false,

  //   Update Task priority
  updateTaskPriorityLoading: false,
  updateTaskPriorityError: null,
  updateTaskPrioritySuccess: false,

  // Update Task Status
  updateTaskStatusLoading: false,
  updateTaskStatusError: null,
  updateTaskStatusSuccess: false,

  // Review Task
  reviewTaskStatusLoading: false,
  reviewTaskStatusError: null,
  reviewTaskStatusSuccess: false,
};

// Create the slice
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    // Fetch all Tasks actions
    setAllTasksStart: (state, action: PayloadAction<ITaskQueryFilter>) => {
      state.fetchAllTasksLoading = true;
      state.fetchAllTasksError = null;
    },
    setAllTasksSuccess: (state, action: PayloadAction<any>) => {
      state.fetchAllTasksLoading = false;
      state.allTasks = action.payload.data || [];
      state.allTaskCount = action.payload.meta?.total || action.payload.total || 0;
      state.fetchAllTasksError = null;
    },
    setAllTasksFailure: (state, action: PayloadAction<string>) => {
      state.fetchAllTasksLoading = false;
      state.fetchAllTasksError = action.payload;
    },

    // Fetch Task details actions
    setTaskDetailsStart: (state, action: PayloadAction<{ taskId: string }>) => {
      state.fetchTaskDetailsLoading = true;
      state.fetchTaskDetailsError = null;
    },
    setTaskDetailsSuccess: (state, action: PayloadAction<any>) => {
      state.fetchTaskDetailsLoading = false;
      state.TaskDetails = action.payload.data;
      state.fetchTaskDetailsError = null;
    },
    setTaskDetailsFailure: (state, action: PayloadAction<string>) => {
      state.fetchTaskDetailsLoading = false;
      state.fetchTaskDetailsError = action.payload;
    },

    // Create Task actions
    setCreateTaskStart: (state, action: PayloadAction<any>) => {
      state.createTaskLoading = true;
      state.createTaskError = null;
      state.createTaskSuccess = false;
    },
    setCreateTaskSuccess: (state, action: PayloadAction<any>) => {
      state.createTaskLoading = false;
      state.createTaskSuccess = true;
      state.createTaskError = null;
    },
    setCreateTaskFailure: (state, action: PayloadAction<string>) => {
      state.createTaskLoading = false;
      state.createTaskError = action.payload;
    },

    // Update Task actions
    setUpdateTaskStart: (
      state,
      action: PayloadAction<{ taskId: string; data: any }>
    ) => {
      state.updateTaskLoading = true;
      state.updateTaskError = null;
      state.updateTaskSuccess = false;
    },

    setUpdateTaskSuccess(state, action: PayloadAction<any>) {
      state.updateTaskLoading = false;
      state.updateTaskError = null;
      state.updateTaskSuccess = true;

      // If the updated Task is the currently selected one, update it
      if (state.TaskDetails?._id === action.payload._id) {
        state.TaskDetails = action.payload;
      }

      // Update the Task in the list
      state.allTasks = state.allTasks.map((Task) =>
        Task._id === action.payload._id ? action.payload : Task
      );
    },

    setUpdateTaskFailure: (state, action: PayloadAction<string>) => {
      state.updateTaskLoading = false;
      state.updateTaskError = action.payload;
    },

    // Delete Task actions
    setDeleteTaskStart: (state, action: PayloadAction<{ taskId: string }>) => {
      state.deleteTaskLoading = true;
      state.deleteTaskError = null;
      state.deleteTaskSuccess = false;
    },
    setDeleteTaskSuccess: (
      state,
      action: PayloadAction<{ taskId: string }>
    ) => {
      state.deleteTaskLoading = false;
      state.deleteTaskSuccess = true;
      state.deleteTaskError = null;
      // Remove the Task from the list
      state.allTasks = state.allTasks.filter(
        (s: { _id?: string }) => s._id !== action.payload.taskId
      );
      state.allTaskCount = Math.max(0, state.allTaskCount - 1);
      // Clear current Task if it's the deleted one
      if (
        state.TaskDetails &&
        state.TaskDetails._id === action.payload.taskId
      ) {
        state.TaskDetails = null;
      }
    },
    setDeleteTaskFailure: (state, action: PayloadAction<string>) => {
      state.deleteTaskLoading = false;
      state.deleteTaskError = action.payload;
    },
    resetTask: (state) => {
      state.createTaskSuccess = false;
      state.updateTaskSuccess = false;
      state.deleteTaskSuccess = false;
      state.assignTaskMemberSuccess = false;
      state.unassignTaskMemberSuccess = false;
      state.updateTaskPrioritySuccess = false;
      state.updateTaskStatusSuccess = false;
      state.reviewTaskStatusSuccess = false;
    },

    // Assign Task Member actions
    setAssignTaskMemberStart: (
      state,
      action: PayloadAction<{ taskId: string; memberId: string }>
    ) => {
      state.assignTaskMemberLoading = true;
      state.assignTaskMemberError = null;
      state.assignTaskMemberSuccess = false;
    },
    setAssignTaskMemberSuccess: (state, action: PayloadAction<any>) => {
      state.assignTaskMemberLoading = false;
      state.assignTaskMemberSuccess = true;
      state.assignTaskMemberError = null;

      const updatedTask =
        action.payload.data || action.payload.task || action.payload;
      const taskId = updatedTask._id || action.payload.taskId;

      // Update Task details if it's the current Task
      if (state.TaskDetails && state.TaskDetails._id === taskId) {
        state.TaskDetails = updatedTask;
      }

      // Update the Task in the list
      if (taskId) {
        state.allTasks = state.allTasks.map((task) =>
          task._id === taskId ? updatedTask : task
        );
      }
    },
    setAssignTaskMemberFailure: (state, action: PayloadAction<string>) => {
      state.assignTaskMemberLoading = false;
      state.assignTaskMemberError = action.payload;
      state.assignTaskMemberSuccess = false;
    },

    // Unassign Task Member actions
    setUnassignTaskMemberStart: (
      state,
      action: PayloadAction<{ taskId: string; memberId: string }>
    ) => {
      state.unassignTaskMemberLoading = true;
      state.unassignTaskMemberError = null;
      state.unassignTaskMemberSuccess = false;
    },
    setUnassignTaskMemberSuccess: (state, action: PayloadAction<any>) => {
      state.unassignTaskMemberLoading = false;
      state.unassignTaskMemberSuccess = true;
      state.unassignTaskMemberError = null;

      const updatedTask =
        action.payload.data || action.payload.task || action.payload;
      const taskId = updatedTask._id || action.payload.taskId;

      // Update Task details if it's the current Task
      if (state.TaskDetails && state.TaskDetails._id === taskId) {
        state.TaskDetails = updatedTask;
      }

      // Update the Task in the list
      if (taskId) {
        state.allTasks = state.allTasks.map((task) =>
          task._id === taskId ? updatedTask : task
        );
      }
    },
    setUnassignTaskMemberFailure: (state, action: PayloadAction<string>) => {
      state.unassignTaskMemberLoading = false;
      state.unassignTaskMemberError = action.payload;
      state.unassignTaskMemberSuccess = false;
    },

    // Update Task Priority actions
    setUpdateTaskPriorityStart: (
      state,
      action: PayloadAction<{ taskId: string; priority: string }>
    ) => {
      state.updateTaskPriorityLoading = true;
      state.updateTaskPriorityError = null;
      state.updateTaskPrioritySuccess = false;
    },
    setUpdateTaskPrioritySuccess: (state, action: PayloadAction<any>) => {
      state.updateTaskPriorityLoading = false;
      state.updateTaskPrioritySuccess = true;
      state.updateTaskPriorityError = null;

      const updatedTask =
        action.payload.data || action.payload.task || action.payload;
      const taskId = updatedTask._id || action.payload.taskId;

      // Update Task details if it's the current Task
      if (state.TaskDetails && state.TaskDetails._id === taskId) {
        state.TaskDetails = updatedTask;
      }

      // Update the Task in the list
      if (taskId) {
        state.allTasks = state.allTasks.map((task) =>
          task._id === taskId ? updatedTask : task
        );
      }
    },
    setUpdateTaskPriorityFailure: (state, action: PayloadAction<string>) => {
      state.updateTaskPriorityLoading = false;
      state.updateTaskPriorityError = action.payload;
      state.updateTaskPrioritySuccess = false;
    },

    // Update Task Status actions
    setUpdateTaskStatusStart: (
      state,
      action: PayloadAction<{ taskId: string; status: string }>
    ) => {
      state.updateTaskStatusLoading = true;
      state.updateTaskStatusError = null;
      state.updateTaskStatusSuccess = false;
    },
    setUpdateTaskStatusSuccess: (state, action: PayloadAction<any>) => {
      state.updateTaskStatusLoading = false;
      state.updateTaskStatusSuccess = true;
      state.updateTaskStatusError = null;

      const updatedTask =
        action.payload.data || action.payload.task || action.payload;
      const taskId = updatedTask._id || action.payload.taskId;

      // Update Task details if it's the current Task
      if (state.TaskDetails && state.TaskDetails._id === taskId) {
        state.TaskDetails = updatedTask;
      }

      // Update the Task in the list
      if (taskId) {
        state.allTasks = state.allTasks.map((task) =>
          task._id === taskId ? updatedTask : task
        );
      }
    },
    setUpdateTaskStatusFailure: (state, action: PayloadAction<string>) => {
      state.updateTaskStatusLoading = false;
      state.updateTaskStatusError = action.payload;
      state.updateTaskStatusSuccess = false;
    },

    // Review Task actions
    setReviewTaskStart: (
      state,
      action: PayloadAction<{ taskId: string; review: any }>
    ) => {
      state.reviewTaskStatusLoading = true;
      state.reviewTaskStatusError = null;
      state.reviewTaskStatusSuccess = false;
    },
    setReviewTaskSuccess: (state, action: PayloadAction<any>) => {
      state.reviewTaskStatusLoading = false;
      state.reviewTaskStatusSuccess = true;
      state.reviewTaskStatusError = null;

      const updatedTask =
        action.payload.data || action.payload.task || action.payload;
      const taskId = updatedTask._id || action.payload.taskId;

      // Update Task details if it's the current Task
      if (state.TaskDetails && state.TaskDetails._id === taskId) {
        state.TaskDetails = updatedTask;
      }

      // Update the Task in the list
      if (taskId) {
        state.allTasks = state.allTasks.map((task) =>
          task._id === taskId ? updatedTask : task
        );
      }
    },
    setReviewTaskFailure: (state, action: PayloadAction<string>) => {
      state.reviewTaskStatusLoading = false;
      state.reviewTaskStatusError = action.payload;
      state.reviewTaskStatusSuccess = false;
    },
  },
});

// Export actions
export const {
  // Fetch all Tasks
  setAllTasksStart,
  setAllTasksSuccess,
  setAllTasksFailure,

  // Fetch Task details
  setTaskDetailsStart,
  setTaskDetailsSuccess,
  setTaskDetailsFailure,

  // Create Task
  setCreateTaskStart,
  setCreateTaskSuccess,
  setCreateTaskFailure,

  // Update Task
  setUpdateTaskStart,
  setUpdateTaskSuccess,
  setUpdateTaskFailure,

  // Delete Task
  setDeleteTaskStart,
  setDeleteTaskSuccess,
  setDeleteTaskFailure,

  // Assign Task Member
  setAssignTaskMemberStart,
  setAssignTaskMemberSuccess,
  setAssignTaskMemberFailure,

  // Unassign Task Member
  setUnassignTaskMemberStart,
  setUnassignTaskMemberSuccess,
  setUnassignTaskMemberFailure,

  // Update Task Priority
  setUpdateTaskPriorityStart,
  setUpdateTaskPrioritySuccess,
  setUpdateTaskPriorityFailure,

  // Update Task Status
  setUpdateTaskStatusStart,
  setUpdateTaskStatusSuccess,
  setUpdateTaskStatusFailure,

  // Review Task
  setReviewTaskStart,
  setReviewTaskSuccess,
  setReviewTaskFailure,

  resetTask,
} = taskSlice.actions;

// Export reducer
export default taskSlice.reducer;
