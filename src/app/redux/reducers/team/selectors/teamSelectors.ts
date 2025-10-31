import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/store";

const mySelector = (state: RootState) => state.team;

// Create Team selectors
export const createTeamLoadingSelector = createSelector(
  mySelector,
  (state) => state.createTeamLoading
);
export const createTeamErrorSelector = createSelector(
  mySelector,
  (state) => state.createTeamError
);
export const createTeamSuccessSelector = createSelector(
  mySelector,
  (state) => state.createTeamSuccess
);

// Fetch all Teams selectors
export const allTeamsLoadingSelector = createSelector(
  mySelector,
  (state) => state.fetchAllTeamsLoading
);
export const allTeamsErrorSelector = createSelector(
  mySelector,
  (state) => state.fetchAllTeamsError
);
export const allTeamsSelector = createSelector(
  mySelector,
  (state) => state.allTeams
);
export const allTeamsCountSelector = createSelector(
  mySelector,
  (state) => state.allTeamCount
);

// Fetch Team details selectors
export const teamDetailsLoadingSelector = createSelector(
  mySelector,
  (state) => state.fetchTeamDetailsLoading
);
export const teamDetailsErrorSelector = createSelector(
  mySelector,
  (state) => state.fetchTeamDetailsError
);
export const teamDetailsSelector = createSelector(
  mySelector,
  (state) => state.teamDetails
);

