import { takeLatest, call, put } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  setAllTasksFailure,
  setAllTasksStart,
  setAllTasksSuccess,
  setTaskDetailsFailure,
  setTaskDetailsStart,
  setTaskDetailsSuccess,
  setCreateTaskFailure,
  setCreateTaskStart,
  setCreateTaskSuccess,
  setUpdateTaskFailure,
  setUpdateTaskStart,
  setUpdateTaskSuccess,
  setDeleteTaskFailure,
  setDeleteTaskStart,
  setDeleteTaskSuccess,
  setAssignTaskMemberFailure,
  setAssignTaskMemberStart,
  setAssignTaskMemberSuccess,
  setUnassignTaskMemberFailure,
  setUnassignTaskMemberStart,
  setUnassignTaskMemberSuccess,
  setUpdateTaskPriorityFailure,
  setUpdateTaskPriorityStart,
  setUpdateTaskPrioritySuccess,
  setUpdateTaskStatusFailure,
  setUpdateTaskStatusStart,
  setUpdateTaskStatusSuccess,
  setReviewTaskFailure,
  setReviewTaskStart,
  setReviewTaskSuccess,
} from "../../reducers/task/taskReducer";
import { request } from "../../../../utils/services/api";
import type { ITaskQueryFilter } from "../../types/task";

export function* fetchAllTasksSaga(
  action: PayloadAction<ITaskQueryFilter>
): Generator<any, void, any> {
  try {
    const {
      search,
      project,
      assignee,
      status,
      priority,
      isActive,
      page = 1,
      limit = 10,
    } = action.payload;

    const queryParams = new URLSearchParams();

    // Search and basic filtering parameters
    if (search && search.trim()) {
      queryParams.append("search", search.trim());
    }

    if (project) {
      const projectId =
        typeof project === "string" ? project : project._id || project._id;
      if (projectId) {
        queryParams.append("project", projectId);
      }
    }

    if (assignee) {
      const assigneeId =
        typeof assignee === "string" ? assignee : assignee.id || assignee.id;
      if (assigneeId) {
        queryParams.append("assignee", assigneeId);
      }
    }

    if (status) {
      queryParams.append("status", status);
    }

    if (priority) {
      queryParams.append("priority", priority);
    }

    if (isActive !== undefined) {
      queryParams.append("isActive", String(isActive));
    }

    // Pagination parameters
    const validatedPage = Math.max(1, Number(page || 1));
    const validatedLimit = Math.min(100, Math.max(1, Number(limit || 10)));

    queryParams.append("page", String(validatedPage));
    queryParams.append("limit", String(validatedLimit));

    const url = `/tasks?${queryParams.toString()}`;

    const config = {
      method: "GET",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    console.log("Fetched Tasks SAGA:", response);
    yield put(setAllTasksSuccess(response));
  } catch (error: any) {
    console.error("Fetch Tasks Error SAGA:", error);
    yield put(setAllTasksFailure(error.message || "Failed to fetch tasks"));
  }
}

export function* fetchTaskDetailsSaga(
  action: PayloadAction<{ taskId: string }>
): Generator<any, void, any> {
  try {
    const { taskId } = action.payload;
    console.log("TASK ID SAGA", taskId);
    console.log("TASK ID SAGA PAYLOAD ACTION", action.payload);

    // Use the correct endpoint for fetching a single task by ID
    const url = `/tasks/${taskId}`;

    const config = {
      method: "GET",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    console.log("Fetched Task details SAGA:", response);
    yield put(setTaskDetailsSuccess(response));
  } catch (error: any) {
    console.error("Fetch Task Details Error SAGA:", error);
    yield put(
      setTaskDetailsFailure(error.message || "Failed to fetch task details")
    );
  }
}

export function* createTaskSaga(
  action: PayloadAction<any>
): Generator<any, void, any> {
  try {
    console.log("CREATE TASK ACTION PAYLOAD SAGA", action.payload);

    const url = `/tasks`;

    const config = {
      method: "POST",
      url,
      credentials: "include",
      data: action.payload,
    };

    const response: any = yield call(request as any, config);
    console.log("Created Task SAGA:", response);
    yield put(setCreateTaskSuccess(response));
  } catch (error: any) {
    console.error("Create Task Error SAGA:", error);
    yield put(setCreateTaskFailure(error.message || "Failed to create task"));
  }
}

export function* updateTaskSaga(
  action: PayloadAction<{ taskId: string; data: any }>
): Generator<any, void, any> {
  try {
    const { taskId, data } = action.payload;
    console.log("UPDATE TASK ACTION DATA", data);
    console.log("UPDATE TASK ACTION TASK ID", taskId);
    const url = `/tasks/${taskId}`;

    const config = {
      method: "PUT",
      url,
      credentials: "include",
      data,
    };

    const response = yield call(request, config);
    console.log("Updated Task SAGA:", response);

    yield put(setUpdateTaskSuccess(response));
  } catch (error: any) {
    console.error("Update Task Error SAGA:", error);
    yield put(setUpdateTaskFailure(error.message || "Failed to update task"));
  }
}

export function* deleteTaskSaga(
  action: PayloadAction<{ taskId: string }>
): Generator<any, void, any> {
  try {
    const { taskId } = action.payload;
    const url = `/tasks/${taskId}`;

    const config = {
      method: "DELETE",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    console.log("Deleted Task SAGA:", response);
    yield put(setDeleteTaskSuccess({ taskId }));
  } catch (error: any) {
    console.error("Delete Task Error SAGA:", error);
    yield put(setDeleteTaskFailure(error.message || "Failed to delete task"));
  }
}

export function* assignTaskMemberSaga(
  action: PayloadAction<{ taskId: string; memberId: string }>
): Generator<any, void, any> {
  try {
    const { taskId, memberId } = action.payload;
    console.log("ASSIGN TASK MEMBER SAGA", { taskId, memberId });

    const url = `/tasks/${taskId}/assign`;

    const config = {
      method: "POST",
      url,
      credentials: "include",
      data: { memberId },
    };

    const response = yield call(request, config);
    console.log("Assigned Task Member SAGA:", response);

    // Include taskId in the response for the reducer
    yield put(
      setAssignTaskMemberSuccess({
        ...response,
        taskId,
        task: response.data || response,
      })
    );
  } catch (error: any) {
    console.error("Assign Task Member Error SAGA:", error);
    yield put(
      setAssignTaskMemberFailure(
        error.message || "Failed to assign task member"
      )
    );
  }
}

export function* unassignTaskMemberSaga(
  action: PayloadAction<{ taskId: string; memberId: string }>
): Generator<any, void, any> {
  try {
    const { taskId, memberId } = action.payload;
    console.log("UNASSIGN TASK MEMBER SAGA", { taskId, memberId });

    const url = `/tasks/${taskId}/unassign/${memberId}`;

    const config = {
      method: "DELETE",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    console.log("Unassigned Task Member SAGA:", response);

    // Include taskId in the response for the reducer
    yield put(
      setUnassignTaskMemberSuccess({
        ...response,
        taskId,
        task: response.data || response,
      })
    );
  } catch (error: any) {
    console.error("Unassign Task Member Error SAGA:", error);
    yield put(
      setUnassignTaskMemberFailure(
        error.message || "Failed to unassign task member"
      )
    );
  }
}

export function* updateTaskPrioritySaga(
  action: PayloadAction<{ taskId: string; priority: string }>
): Generator<any, void, any> {
  try {
    const { taskId, priority } = action.payload;
    console.log("UPDATE TASK PRIORITY SAGA", { taskId, priority });

    const url = `/tasks/${taskId}/priority`;

    const config = {
      method: "PATCH",
      url,
      credentials: "include",
      data: { priority },
    };

    const response = yield call(request, config);
    console.log("Updated Task Priority SAGA:", response);

    // Include taskId in the response for the reducer
    yield put(
      setUpdateTaskPrioritySuccess({
        ...response,
        taskId,
        task: response.data || response,
      })
    );
  } catch (error: any) {
    console.error("Update Task Priority Error SAGA:", error);
    yield put(
      setUpdateTaskPriorityFailure(
        error.message || "Failed to update task priority"
      )
    );
  }
}

export function* updateTaskStatusSaga(
  action: PayloadAction<{ taskId: string; status: string }>
): Generator<any, void, any> {
  try {
    const { taskId, status } = action.payload;
    console.log("UPDATE TASK STATUS SAGA", { taskId, status });

    const url = `/tasks/${taskId}/status`;

    const config = {
      method: "PATCH",
      url,
      credentials: "include",
      data: { status },
    };

    const response = yield call(request, config);
    console.log("Updated Task Status SAGA:", response);

    // Include taskId in the response for the reducer
    yield put(
      setUpdateTaskStatusSuccess({
        ...response,
        taskId,
        task: response.data || response,
      })
    );
  } catch (error: any) {
    console.error("Update Task Status Error SAGA:", error);
    yield put(
      setUpdateTaskStatusFailure(
        error.message || "Failed to update task status"
      )
    );
  }
}

export function* reviewTaskSaga(
  action: PayloadAction<{ taskId: string; review: any }>
): Generator<any, void, any> {
  try {
    const { taskId, review } = action.payload;
    console.log("REVIEW TASK SAGA", { taskId, review });

    const url = `/tasks/${taskId}/review`;

    const config = {
      method: "POST",
      url,
      credentials: "include",
      data: review,
    };

    const response = yield call(request, config);
    console.log("Reviewed Task SAGA:", response);

    // Include taskId in the response for the reducer
    yield put(
      setReviewTaskSuccess({
        ...response,
        taskId,
        task: response.data || response,
      })
    );
  } catch (error: any) {
    console.error("Review Task Error SAGA:", error);
    yield put(setReviewTaskFailure(error.message || "Failed to review task"));
  }
}

export default function* taskSaga() {
  yield takeLatest(setAllTasksStart.type, fetchAllTasksSaga);
  yield takeLatest(setTaskDetailsStart.type, fetchTaskDetailsSaga);
  yield takeLatest(setCreateTaskStart.type, createTaskSaga);
  yield takeLatest(setUpdateTaskStart.type, updateTaskSaga);
  yield takeLatest(setDeleteTaskStart.type, deleteTaskSaga);
  yield takeLatest(setAssignTaskMemberStart.type, assignTaskMemberSaga);
  yield takeLatest(setUnassignTaskMemberStart.type, unassignTaskMemberSaga);
  yield takeLatest(setUpdateTaskPriorityStart.type, updateTaskPrioritySaga);
  yield takeLatest(setUpdateTaskStatusStart.type, updateTaskStatusSaga);
  yield takeLatest(setReviewTaskStart.type, reviewTaskSaga);
}
