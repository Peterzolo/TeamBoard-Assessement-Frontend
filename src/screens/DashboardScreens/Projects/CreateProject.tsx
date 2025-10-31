import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Resolver } from "react-hook-form";
import AuthGuard from "../../../Components/auth/AuthGuard";
import { UserRoleAccess } from "../../../app/redux/types/auth";
import { TextInput2 } from "../../../Components/Input/TextInput2";
import { SelectInput } from "../../../Components/Input/SelectInput/SelectInput";
import { Button } from "../../../Components/Button/Button";
import { FlashMessage } from "../../../Components/FlashMessage/Flashmessage";
import { BackButton } from "../../../Components/BackButton/BackButton";
import {
  resetProject,
  setCreateProjectStart,
} from "../../../app/redux/reducers/project/projectReducer";
import { allUsersSelector } from "../../../app/redux/reducers/user/selectors/userDetailsSelector";
import { setAllUsersStart } from "../../../app/redux/reducers/user/userDetailsReducer";
import type { IUser } from "../../../app/redux/types/user";
import {
  createProjectErrorSelector,
  createProjectLoadingSelector,
  createProjectSuccessSelector,
} from "../../../app/redux/reducers/project/selectors/projectSelectors";

const schema = yup
  .object({
    name: yup.string().required("Project name is required"),
    description: yup.string().optional(),
    projectManager: yup.string().optional(),
    isActive: yup.boolean().required(),
  })
  .required();

type FormValues = yup.InferType<typeof schema>;
const resolver = yupResolver(schema) as Resolver<FormValues, any>;

type ExtendedUser = IUser & {
  _id?: string;
};

const CreateProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(createProjectLoadingSelector);
  const error = useSelector(createProjectErrorSelector);
  const success = useSelector(createProjectSuccessSelector);
  const allUsers = useSelector(allUsersSelector) || [];

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      name: "",
      description: "",
      projectManager: "",
      isActive: true,
    },
  });

  // Fetch users for project manager selection
  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(setAllUsersStart({ page: 1, limit: 100 }));
    }
  }, [dispatch, allUsers.length]);

  // Prepare project manager options
  const projectManagerOptions = [
    { value: "", label: "None" },
    ...allUsers.map((user: ExtendedUser) => ({
      value: user.id || user._id || "",
      label: `${user.firstName} ${user.lastName} (${user.email})`,
    })),
  ];

  const onSubmit = (data: FormValues) => {
    const payload: any = {
      name: data.name,
      description: data.description || "",
      isActive: data.isActive,
    };

    // Only include projectManager if it's selected
    if (data.projectManager) {
      payload.projectManager = data.projectManager;
    }

    dispatch(setCreateProjectStart(payload));
  };

  // Handle success - redirect to project list
  useEffect(() => {
    if (success) {
      dispatch(resetProject());
      navigate("/dashboard/project/list");
    }
  }, [success, navigate, dispatch]);

  return (
    <AuthGuard allowedRoles={[UserRoleAccess.SUPER_ADMIN]}>
      <div className="w-full">
        <BackButton />
        <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Create Project
          </h2>
          <p className="mt-1 mb-6 text-center text-sm text-gray-600">
            Create a new project
          </p>

          {error && <FlashMessage message={String(error)} type="error" />}
          {success && (
            <FlashMessage message="Project created successfully!" type="success" />
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <TextInput2
              name="name"
              label="Project Name"
              type="text"
              placeholder="Enter project name"
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
                placeholder="Enter project description"
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
                Project Manager
              </label>
              <SelectInput
                options={projectManagerOptions}
                value={watch("projectManager") || ""}
                onChange={(value) => setValue("projectManager", value)}
                placeholder="Select project manager (optional)"
                label=""
                error={errors.projectManager?.message}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  checked={watch("isActive")}
                  onChange={(e) => setValue("isActive", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-800">
                  Active Project
                </span>
              </label>
              {errors.isActive && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.isActive.message}
                </p>
              )}
            </div>

            <Button variant="primary" type="submit" width="100%" height="48px">
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CreateProject;

