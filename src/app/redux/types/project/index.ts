import type { IUser } from "../user";

export interface ProjectState {
  // Create Project
  createProjectLoading: boolean;
  createProjectError: any;
  createProjectSuccess: boolean;

  //   Fetch all Project

  fetchAllProjectsLoading: boolean;
  fetchAllProjectsError: any;
  allProjects: IProject[];
  allProjectCount: number;

  //   Fetch project details
  fetchProjectDetailsLoading: boolean;
  fetchProjectDetailsError: any;
  projectDetails: IProject | null;

  // Update project
  updateProjectLoading: boolean;
  updateProjectError: any;
  updateProjectSuccess: boolean;

  // Delete project
  deleteProjectLoading: boolean;
  deleteProjectError: any;
  deleteProjectSuccess: boolean;

  //   Add member
  addProjectMemberLoading: boolean;
  addProjectMemberError: any;
  addProjectMemberSuccess: boolean;

  //   Remove member
  removeProjectMemberLoading: boolean;
  removeProjectMemberError: any;
  removeProjectMemberSuccess: boolean;
}

export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  createdBy: IUser;
  team?: IUser;
  members: IUser;
  projectManager?: IUser;
  tasks: IProject[];
  isActive: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectQueryFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  createdBy?: IUser;
  projectManager?: IUser;
  memberId?: string;
  teamId?: string;
  isActive?: boolean;
}
