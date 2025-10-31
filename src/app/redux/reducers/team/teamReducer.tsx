import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TeamState, ITeamQueryFilter } from "../../types/team";

// Initial state
export const initialState: TeamState = {
  // Create Team
  createTeamLoading: false,
  createTeamError: null,
  createTeamSuccess: false,

  // Fetch all Teams
  fetchAllTeamsLoading: false,
  fetchAllTeamsError: null,
  allTeams: [],
  allTeamCount: 0,

  // Fetch team details
  fetchTeamDetailsLoading: false,
  fetchTeamDetailsError: null,
  teamDetails: null,
};

// Create the slice
const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    // Create Team actions
    setCreateTeamStart: (state, action: PayloadAction<{ name: string; description?: string; teamLeader: string }>) => {
      state.createTeamLoading = true;
      state.createTeamError = null;
      state.createTeamSuccess = false;
    },
    setCreateTeamSuccess: (state, action: PayloadAction<any>) => {
      state.createTeamLoading = false;
      state.createTeamSuccess = true;
      state.createTeamError = null;
    },
    setCreateTeamFailure: (state, action: PayloadAction<string>) => {
      state.createTeamLoading = false;
      state.createTeamError = action.payload;
      state.createTeamSuccess = false;
    },
    resetCreateTeam: (state) => {
      state.createTeamSuccess = false;
      state.createTeamError = null;
    },

    // Fetch all Teams actions
    setAllTeamsStart: (state, action: PayloadAction<ITeamQueryFilter>) => {
      state.fetchAllTeamsLoading = true;
      state.fetchAllTeamsError = null;
    },
    setAllTeamsSuccess: (state, action: PayloadAction<any>) => {
      state.fetchAllTeamsLoading = false;
      state.allTeams = action.payload.data || [];
      state.allTeamCount = action.payload.total || action.payload.meta?.total || 0;
      state.fetchAllTeamsError = null;
    },
    setAllTeamsFailure: (state, action: PayloadAction<string>) => {
      state.fetchAllTeamsLoading = false;
      state.fetchAllTeamsError = action.payload;
    },

    // Fetch Team details actions
    setTeamDetailsStart: (state, action: PayloadAction<{ teamId: string }>) => {
      state.fetchTeamDetailsLoading = true;
      state.fetchTeamDetailsError = null;
    },
    setTeamDetailsSuccess: (state, action: PayloadAction<any>) => {
      state.fetchTeamDetailsLoading = false;
      state.teamDetails = action.payload.data;
      state.fetchTeamDetailsError = null;
    },
    setTeamDetailsFailure: (state, action: PayloadAction<string>) => {
      state.fetchTeamDetailsLoading = false;
      state.fetchTeamDetailsError = action.payload;
    },

    resetTeam: (state) => {
      state.createTeamSuccess = false;
      state.createTeamError = null;
    },
  },
});

export const {
  setCreateTeamStart,
  setCreateTeamSuccess,
  setCreateTeamFailure,
  resetCreateTeam,
  setAllTeamsStart,
  setAllTeamsSuccess,
  setAllTeamsFailure,
  setTeamDetailsStart,
  setTeamDetailsSuccess,
  setTeamDetailsFailure,
  resetTeam,
} = teamSlice.actions;

export default teamSlice.reducer;

