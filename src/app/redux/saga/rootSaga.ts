import { all } from "redux-saga/effects";
import signupSaga from "./auth/signUpSaga";
import userSaga from "./user/userSaga";
import projectSaga from "./project/projectSaga";
import taskSaga from "./task/taskSaga";
import teamSaga from "./team/teamSaga";

export default function* rootSaga() {
  yield all([signupSaga(), userSaga(), projectSaga(), taskSaga(), teamSaga()]);
}
