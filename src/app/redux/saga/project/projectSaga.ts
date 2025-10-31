import { takeLatest, call, put } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  setAllProjectsFailure,
  setAllProjectsStart,
  setAllProjectsSuccess,
  setCreateProjectFailure,
  setCreateProjectStart,
  setCreateProjectSuccess,
  setDeleteProjectFailure,
  setDeleteProjectStart,
  setDeleteProjectSuccess,
  setProjectDetailsFailure,
  setProjectDetailsStart,
  setProjectDetailsSuccess,
  setUpdateProjectFailure,
  setUpdateProjectStart,
  setUpdateProjectSuccess,
  setAddProjectMemberFailure,
  setAddProjectMemberStart,
  setAddProjectMemberSuccess,
  setRemoveProjectMemberFailure,
  setRemoveProjectMemberStart,
  setRemoveProjectMemberSuccess,
} from "../../reducers/project/projectReducer";
import { request } from "../../../../utils/services/api";
import type { IProjectQueryFilter } from "../../types/project";

export function* fetchAllProjectsSaga(
  action: PayloadAction<IProjectQueryFilter>
): Generator<any, void, any> {
  try {
    const {
      search,
      createdBy,
      projectManager,
      memberId,
      teamId,
      isActive,
      page = 1,
      limit = 10,
    } = action.payload;

    const queryParams = new URLSearchParams();

    // Search and basic filtering parameters
    if (search && search.trim()) {
      queryParams.append("search", search.trim());
    }

    if (createdBy && typeof createdBy === "string") {
      queryParams.append("createdBy", createdBy);
    } else if (createdBy && typeof createdBy === "object" && createdBy.id) {
      queryParams.append("createdBy", createdBy.id);
    }

    if (projectManager && typeof projectManager === "string") {
      queryParams.append("projectManager", projectManager);
    } else if (
      projectManager &&
      typeof projectManager === "object" &&
      projectManager.id
    ) {
      queryParams.append("projectManager", projectManager.id);
    }

    if (memberId) {
      queryParams.append("memberId", memberId);
    }

    if (teamId) {
      queryParams.append("teamId", teamId);
    }

    if (isActive !== undefined) {
      queryParams.append("isActive", String(isActive));
    }

    // Pagination parameters
    const validatedPage = Math.max(1, Number(page || 1));
    const validatedLimit = Math.min(100, Math.max(1, Number(limit || 10)));

    queryParams.append("page", String(validatedPage));
    queryParams.append("limit", String(validatedLimit));

    // Sorting parameters
    const validSortFields = [
      "name",
      "createdBy",
      "projectManager",
      "createdAt",
      "updatedAt",
    ];
    const validSortOrders = ["asc", "desc"];

    const validatedSortBy = validSortFields.includes(action.payload.sortBy || "")
      ? action.payload.sortBy
      : "createdAt";
    const validatedSortOrder = validSortOrders.includes(action.payload.sortOrder || "desc")
      ? action.payload.sortOrder
      : "desc";

    if (validatedSortBy) {
      queryParams.append("sortBy", validatedSortBy);
    }
    if (validatedSortOrder) {
      queryParams.append("sortOrder", validatedSortOrder);
    }

    const url = `/projects?${queryParams.toString()}`;

    const config = {
      method: "GET",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    console.log("Fetched Projects SAGA:", response);
    
    // Transform response to match reducer expectations
    const transformedResponse = {
      data: response.data || [],
      total: response.meta?.total || response.total || 0,
      meta: response.meta,
      ...response,
    };
    
    yield put(setAllProjectsSuccess(transformedResponse));
  } catch (error: any) {
    console.error("Fetch Projects Error SAGA:", error);
    yield put(
      setAllProjectsFailure(error.message || "Failed to fetch projects")
    );
  }
}

export function* fetchProjectDetailsSaga(
  action: PayloadAction<{ projectId: string }>
): Generator<any, void, any> {
  try {
    const { projectId } = action.payload;
    console.log("PROJECT ID SAGA", projectId);
    console.log("PROJECT ID SAGA PAYLOAD ACTION", action.payload);

    // Use the correct endpoint for fetching a single project by ID
    const url = `/projects/${projectId}`;

    const config = {
      method: "GET",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    console.log("Fetched Project details SAGA:", response);
    yield put(setProjectDetailsSuccess(response));
  } catch (error: any) {
    console.error("Fetch Project Details Error SAGA:", error);
    yield put(
      setProjectDetailsFailure(
        error.message || "Failed to fetch project details"
      )
    );
  }
}

export function* createProjectSaga(
  action: PayloadAction<any>
): Generator<any, void, any> {
  try {
    console.log("CREATE PROJECT ACTION PAYLOAD SAGA", action.payload);

    const url = `/projects`;

    const config = {
      method: "POST",
      url,
      credentials: "include",
      data: action.payload,
    };

    const response: any = yield call(request as any, config);
    console.log("Created Project SAGA:", response);
    yield put(setCreateProjectSuccess(response));
  } catch (error: any) {
    console.error("Create Project Error SAGA:", error);
    yield put(
      setCreateProjectFailure(error.message || "Failed to create project")
    );
  }
}

export function* updateProjectSaga(
  action: PayloadAction<{ projectId: string; data: any }>
): Generator<any, void, any> {
  try {
    const { projectId, data } = action.payload;
    console.log("UPDATE PROJECT ACTION DATA", data);
    console.log("UPDATE PROJECT ACTION PROJECT ID", projectId);
    const url = `/projects/${projectId}`;

    const config = {
      method: "PUT",
      url,
      credentials: "include",
      data,
    };

    const response = yield call(request, config);
    console.log("Updated Project SAGA:", response);

    yield put(setUpdateProjectSuccess(response));
  } catch (error: any) {
    console.error("Update Project Error SAGA:", error);
    yield put(
      setUpdateProjectFailure(error.message || "Failed to update project")
    );
  }
}

export function* deleteProjectSaga(
  action: PayloadAction<{ projectId: string }>
): Generator<any, void, any> {
  try {
    const { projectId } = action.payload;
    const url = `/projects/${projectId}`;

    const config = {
      method: "DELETE",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    console.log("Deleted Project SAGA:", response);
    yield put(setDeleteProjectSuccess({ projectId }));
  } catch (error: any) {
    console.error("Delete Project Error SAGA:", error);
    yield put(
      setDeleteProjectFailure(error.message || "Failed to delete project")
    );
  }
}

export function* addProjectMemberSaga(
  action: PayloadAction<{ projectId: string; memberId: string }>
): Generator<any, void, any> {
  try {
    const { projectId, memberId } = action.payload;
    console.log("ADD PROJECT MEMBER SAGA", { projectId, memberId });

    const url = `/projects/${projectId}/members`;

    const config = {
      method: "POST",
      url,
      credentials: "include",
      data: { members: [memberId] },
    };

    const response = yield call(request, config);
    console.log("Added Project Member SAGA:", response);

    // Include projectId in the response for the reducer
    yield put(
      setAddProjectMemberSuccess({
        ...response,
        projectId,
        project: response.data || response,
      })
    );
  } catch (error: any) {
    console.error("Add Project Member Error SAGA:", error);
    yield put(
      setAddProjectMemberFailure(
        error.message || "Failed to add project member"
      )
    );
  }
}

export function* removeProjectMemberSaga(
  action: PayloadAction<{ projectId: string; memberId: string }>
): Generator<any, void, any> {
  try {
    const { projectId, memberId } = action.payload;
    console.log("REMOVE PROJECT MEMBER SAGA", { projectId, memberId });

    const url = `/projects/${projectId}/members/${memberId}`;

    const config = {
      method: "DELETE",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    console.log("Removed Project Member SAGA:", response);

    // Include projectId in the response for the reducer
    yield put(
      setRemoveProjectMemberSuccess({
        ...response,
        projectId,
        project: response.data || response,
      })
    );
  } catch (error: any) {
    console.error("Remove Project Member Error SAGA:", error);
    yield put(
      setRemoveProjectMemberFailure(
        error.message || "Failed to remove project member"
      )
    );
  }
}

export default function* projectSaga() {
  yield takeLatest(setAllProjectsStart.type, fetchAllProjectsSaga);
  yield takeLatest(setProjectDetailsStart.type, fetchProjectDetailsSaga);
  yield takeLatest(setCreateProjectStart.type, createProjectSaga);
  yield takeLatest(setUpdateProjectStart.type, updateProjectSaga);
  yield takeLatest(setDeleteProjectStart.type, deleteProjectSaga);
  yield takeLatest(setAddProjectMemberStart.type, addProjectMemberSaga);
  yield takeLatest(setRemoveProjectMemberStart.type, removeProjectMemberSaga);
}
