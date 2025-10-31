import { takeLatest, call, put } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  setCreateTeamStart,
  setCreateTeamSuccess,
  setCreateTeamFailure,
  setAllTeamsStart,
  setAllTeamsSuccess,
  setAllTeamsFailure,
  setTeamDetailsStart,
  setTeamDetailsSuccess,
  setTeamDetailsFailure,
} from "../../reducers/team/teamReducer";
import type { ITeamQueryFilter } from "../../types/team";
import { request } from "../../../../utils/services/api";

export function* createTeamSaga(
  action: PayloadAction<{ name: string; description?: string; teamLeader: string }>
): Generator<any, void, any> {
  try {
    const { name, description, teamLeader } = action.payload;
    console.log("CREATE TEAM SAGA", { name, description, teamLeader });

    const config = {
      method: "POST",
      url: "/teams",
      credentials: "include",
      data: { name, description, teamLeader },
    };

    const response = yield call(request, config);
    console.log("Created Team SAGA:", response);

    yield put(setCreateTeamSuccess(response));
  } catch (error: any) {
    console.error("Create Team Error SAGA:", error);
    yield put(setCreateTeamFailure(error.message || "Failed to create team"));
  }
}

export function* fetchAllTeamsSaga(
  action: PayloadAction<ITeamQueryFilter>
): Generator<any, void, any> {
  try {
    const {
      search,
      teamLeader,
      isActive,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = action.payload;

    const queryParams = new URLSearchParams();

    if (search && search.trim()) {
      queryParams.append("search", search.trim());
    }
    if (teamLeader) {
      queryParams.append("teamLeader", teamLeader);
    }
    if (isActive !== undefined) {
      queryParams.append("isActive", String(isActive));
    }
    if (page) {
      queryParams.append("page", String(page));
    }
    if (limit) {
      queryParams.append("limit", String(limit));
    }
    if (sortBy) {
      queryParams.append("sortBy", sortBy);
    }
    if (sortOrder) {
      queryParams.append("sortOrder", sortOrder);
    }

    const url = `/teams?${queryParams.toString()}`;
    const config = {
      method: "GET",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    yield put(
      setAllTeamsSuccess({
        data: response.data || [],
        total: response.meta?.total || response.total || 0,
      })
    );
  } catch (error: any) {
    console.error("Fetch All Teams Error SAGA:", error);
    yield put(setAllTeamsFailure(error.message || "Failed to fetch teams"));
  }
}

export function* fetchTeamDetailsSaga(
  action: PayloadAction<{ teamId: string }>
): Generator<any, void, any> {
  try {
    const { teamId } = action.payload;
    const url = `/teams/${teamId}`;
    const config = {
      method: "GET",
      url,
      credentials: "include",
    };

    const response = yield call(request, config);
    yield put(setTeamDetailsSuccess(response));
  } catch (error: any) {
    console.error("Fetch Team Details Error SAGA:", error);
    yield put(setTeamDetailsFailure(error.message || "Failed to fetch team details"));
  }
}

export default function* teamSaga() {
  yield takeLatest(setCreateTeamStart.type, createTeamSaga);
  yield takeLatest(setAllTeamsStart.type, fetchAllTeamsSaga);
  yield takeLatest(setTeamDetailsStart.type, fetchTeamDetailsSaga);
}

