import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AddMember from "../../screens/DashboardScreens/team/addMember/AddMember";
import ProjectList from "../../screens/DashboardScreens/Projects/ProjectList";

const LoginPage = lazy(() => import("../../pages/auth/LoginPage"));
const NotFoundPage = lazy(() => import("../../pages/not-found/NotFoundPage"));
const VerifyEmailPage = lazy(() => import("../../pages/verify-email/page"));
const ForgotPasswordPage = lazy(
  () => import("../../pages/forgot-password/page")
);
const ResetPasswordPage = lazy(() => import("../../pages/reset-password/page"));
const CompletePasswordResetPage = lazy(
  () => import("../../pages/complete-password-reset/page")
);
const CompleteSignUpPage = lazy(
  () => import("../../pages/complete-sign-up/page")
);
const DashboardLayout = lazy(() => import("../../layouts/DashboardLayout"));
const HomeScreen = lazy(
  () => import("../../screens/DashboardScreens/home/HomeScreen")
);
const TeamMemberList = lazy(
  () => import("../../screens/DashboardScreens/team/teamMembers/TeamList")
);
const TeamList = lazy(
  () => import("../../screens/DashboardScreens/team/TeamList/TeamList")
);
const TeamMemberDetails = lazy(
  () =>
    import("../../screens/DashboardScreens/team/teamMembers/TeamMemberDetails")
);
const ProjectDetails = lazy(
  () => import("../../screens/DashboardScreens/Projects/ProjectDetails")
);
const CreateTeam = lazy(
  () => import("../../screens/DashboardScreens/team/createTeam/CreateTeam")
);
const CreateProject = lazy(
  () => import("../../screens/DashboardScreens/Projects/CreateProject")
);

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/verify-email", element: <VerifyEmailPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/complete-password-reset", element: <CompletePasswordResetPage /> },
  { path: "/complete-sign-up", element: <CompleteSignUpPage /> },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: "team/list", element: <TeamMemberList /> },
      { path: "teams", element: <TeamList /> },
      { path: "team/:id", element: <TeamMemberDetails /> },
      { path: "team/create", element: <CreateTeam /> },
      { path: "add/member", element: <AddMember /> },
      { path: "project/list", element: <ProjectList /> },
      { path: "project/create", element: <CreateProject /> },
      { path: "project/:id", element: <ProjectDetails /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
