export interface TeamState {
  // Create Team
  createTeamLoading: boolean;
  createTeamError: any;
  createTeamSuccess: boolean;

  // Fetch all Teams
  fetchAllTeamsLoading: boolean;
  fetchAllTeamsError: any;
  allTeams: ITeam[];
  allTeamCount: number;

  // Fetch team details
  fetchTeamDetailsLoading: boolean;
  fetchTeamDetailsError: any;
  teamDetails: ITeam | null;
}

export interface ITeam {
  _id?: string;
  name: string;
  description?: string;
  teamLeader?: string | { _id?: string; id?: string; firstName?: string; lastName?: string };
  members?: string[];
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ITeamQueryFilter {
  page?: number;
  limit?: number;
  search?: string;
  teamLeader?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

