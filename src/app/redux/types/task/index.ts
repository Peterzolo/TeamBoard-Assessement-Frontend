import type { IProject } from "../project";
import type { IUser } from "../user";

export interface TaskState {
  // Create Task
  createTaskLoading: boolean;
  createTaskError: any;
  createTaskSuccess: boolean;

  //   Fetch all Task

  fetchAllTasksLoading: boolean;
  fetchAllTasksError: any;
  allTasks: ITask[];
  allTaskCount: number;

  //   Fetch Task details
  fetchTaskDetailsLoading: boolean;
  fetchTaskDetailsError: any;
  TaskDetails: ITask | null;

  // Update Task
  updateTaskLoading: boolean;
  updateTaskError: any;
  updateTaskSuccess: boolean;

  // Delete Task
  deleteTaskLoading: boolean;
  deleteTaskError: any;
  deleteTaskSuccess: boolean;

  //   Assign member
  assignTaskMemberLoading: boolean;
  assignTaskMemberError: any;
  assignTaskMemberSuccess: boolean;

  //   Unassign member
  unassignTaskMemberLoading: boolean;
  unassignTaskMemberError: any;
  unassignTaskMemberSuccess: boolean;

  //   Update Task priority
  updateTaskPriorityLoading: boolean;
  updateTaskPriorityError: any;
  updateTaskPrioritySuccess: boolean;

  // Update Task Status
  updateTaskStatusLoading: boolean;
  updateTaskStatusError: any;
  updateTaskStatusSuccess: boolean;

  // Review Task
  reviewTaskStatusLoading: boolean;
  reviewTaskStatusError: any;
  reviewTaskStatusSuccess: boolean;
}

export enum TaskStatus {
  TODO = "Todo",
  IN_PROGRESS = "In-progress",
  DONE = "Done",
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum TaskReviewStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  CHANGES_REQUIRED = "Changes-required",
}

export interface ITaskReviewEntry {
  reviewer: IUser;
  comment: string;
  status: TaskReviewStatus;
  createdAt: Date;
}

export interface ITask {
  _id?: string;
  title: string;
  description?: string;
  Task: ITask;
  createdBy: IUser;
  assignees: IUser[];
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  reviewStatus: TaskReviewStatus;
  lastReviewedAt?: Date | null;
  reviews: ITaskReviewEntry[];
  isActive: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITaskQueryFilter {
  page?: number;
  limit?: number;
  search?: string;
  project?: IProject;
  assignee?: IUser;
  status?: TaskStatus;
  priority?: TaskPriority;
  isActive?: boolean;
}
