import { combineReducers } from "@reduxjs/toolkit";
import signUpReducer from "./auth/signUpReducer";
import userReducer from "./user/userDetailsReducer";
import projectReducer from "./project/projectReducer";
import taskReducer from "./task/taskReducer";
import teamReducer from "./team/teamReducer";

const rootReducer = combineReducers({
  signUp: signUpReducer,
  user: userReducer,
  project: projectReducer,
  task: taskReducer,
  team: teamReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
