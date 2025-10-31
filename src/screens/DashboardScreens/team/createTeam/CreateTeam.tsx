import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Resolver } from "react-hook-form";
import AuthGuard from "../../../../Components/auth/AuthGuard";
import { UserRoleAccess } from "../../../../app/redux/types/auth";
import { TextInput2 } from "../../../../Components/Input/TextInput2";
import { TextArea } from "../../../../Components/Input/TextArea/TextArea";
import { SelectInput } from "../../../../Components/Input/SelectInput/SelectInput";
import { Button } from "../../../../Components/Button/Button";
import { FlashMessage } from "../../../../Components/FlashMessage/Flashmessage";
import { BackButton } from "../../../../Components/BackButton/BackButton";

import {
  resetCreateTeam,
  setCreateTeamStart,
} from "../../../../app/redux/reducers/team/teamReducer";
import { allUsersSelector } from "../../../../app/redux/reducers/user/selectors/userDetailsSelector";
import { setAllUsersStart } from "../../../../app/redux/reducers/user/userDetailsReducer";
import type { IUser } from "../../../../app/redux/types/user";
import {
  createTeamErrorSelector,
  createTeamLoadingSelector,
  createTeamSuccessSelector,
} from "../../../../app/redux/reducers/team/selectors/teamSelectors";

const schema = yup
  .object({
    name: yup.string().required("Team name is required"),
    description: yup.string().optional(),
    teamLeader: yup.string().required("Team leader is required"),
  })
  .required();

type FormValues = yup.InferType<typeof schema>;
const resolver = yupResolver(schema) as Resolver<FormValues, any>;

type ExtendedUser = IUser & {
  _id?: string;
};

const CreateTeam = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(createTeamLoadingSelector);
  const error = useSelector(createTeamErrorSelector);
  const success = useSelector(createTeamSuccessSelector);
  const allUsers = useSelector(allUsersSelector) || [];

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      name: "",
      description: "",
      teamLeader: "",
    },
  });

  // Fetch users for team leader selection
  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(setAllUsersStart({ page: 1, limit: 100 }));
    }
  }, [dispatch, allUsers.length]);

  // Prepare team leader options
  const teamLeaderOptions = allUsers.map((user: ExtendedUser) => ({
    value: user.id || user._id || "",
    label: `${user.firstName} ${user.lastName} (${user.email})`,
  }));

  const onSubmit = (data: FormValues) => {
    dispatch(
      setCreateTeamStart({
        name: data.name,
        description: data.description || "",
        teamLeader: data.teamLeader,
      })
    );
  };

  // Handle success - redirect to team list
  useEffect(() => {
    if (success) {
      dispatch(resetCreateTeam());
      navigate("/dashboard/team/list");
    }
  }, [success, navigate, dispatch]);

  return (
    <AuthGuard allowedRoles={[UserRoleAccess.SUPER_ADMIN]}>
      <div className="w-full">
        <BackButton />
        <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Create Team
          </h2>
          <p className="mt-1 mb-6 text-center text-sm text-gray-600">
            Create a new team
          </p>

          {error && <FlashMessage message={String(error)} type="error" />}
          {success && (
            <FlashMessage message="Team created successfully!" type="success" />
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <TextInput2
              name="name"
              label="Team Name"
              type="text"
              placeholder="Enter team name"
              value={watch("name")}
              onChange={(e) => setValue("name", e.target.value)}
              error={errors.name?.message}
              backgroundColor="bg-white"
              borderRadius="rounded-lg"
              labelColor="text-gray-800"
              className="text-base text-gray-900"
              placeholderColor="placeholder-gray-400"
            />

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter team description"
                value={watch("description") || ""}
                onChange={(e) => setValue("description", e.target.value)}
                rows={3}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Team Leader
              </label>
              <SelectInput
                options={teamLeaderOptions}
                value={watch("teamLeader") || ""}
                onChange={(value) => setValue("teamLeader", value)}
                placeholder="Select team leader"
                label=""
                error={errors.teamLeader?.message}
              />
            </div>

            <Button variant="primary" type="submit" width="100%" height="48px">
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CreateTeam;
