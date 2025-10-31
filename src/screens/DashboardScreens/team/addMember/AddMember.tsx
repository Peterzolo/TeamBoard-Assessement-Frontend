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
import { SelectInput } from "../../../../Components/Input/SelectInput/SelectInput";
import { Button } from "../../../../Components/Button/Button";
import { FlashMessage } from "../../../../Components/FlashMessage/Flashmessage";
import { BackButton } from "../../../../Components/BackButton/BackButton";
import {
  selectCreateUserLoading,
  selectCreateUserError,
  selectCreateUserSuccess,
  resetCreateUser,
} from "../../../../app/redux/reducers/user/userDetailsReducer";
import { setCreateUserStart } from "../../../../app/redux/reducers/user/userDetailsReducer";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    role: yup.string().required("Role is required"),
  })
  .required();

type FormValues = yup.InferType<typeof schema>;
const resolver = yupResolver(schema) as Resolver<FormValues, any>;

// Available roles excluding SUPER_ADMIN
const availableRoles = [
  { value: UserRoleAccess.ADMIN, label: "Admin" },
  { value: UserRoleAccess.PROJECT_MANAGER, label: "Project Manager" },
  { value: UserRoleAccess.TEAM_MEMBER, label: "Team Member" },
  { value: UserRoleAccess.TEAM_LEAD, label: "Team Lead" },
];

const AddMember = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(selectCreateUserLoading);
  const error = useSelector(selectCreateUserError);
  const success = useSelector(selectCreateUserSuccess);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      email: "",
      role: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    dispatch(
      setCreateUserStart({
        email: data.email,
        role: data.role,
      })
    );
  };

  // Handle success - redirect to team list
  useEffect(() => {
    if (success) {
      dispatch(resetCreateUser());
      navigate("/dashboard/team/list");
    }
  }, [success, navigate, dispatch]);

  return (
    <AuthGuard allowedRoles={[UserRoleAccess.SUPER_ADMIN]}>
      <div className="w-full">
        <BackButton />
        <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Add Team Member
          </h2>
          <p className="mt-1 mb-6 text-center text-sm text-gray-600">
            Create a new team member account
          </p>

          {error && <FlashMessage message={String(error)} type="error" />}
          {success && (
            <FlashMessage
              message="Team member created successfully!"
              type="success"
            />
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <TextInput2
              name="email"
              label="Email address"
              type="text"
              placeholder="Enter email address"
              value={watch("email")}
              onChange={(e) => setValue("email", e.target.value)}
              error={errors.email?.message}
              backgroundColor="bg-white"
              borderRadius="rounded-lg"
              labelColor="text-gray-800"
              className="text-base text-gray-900"
              placeholderColor="placeholder-gray-400"
            />

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Role
              </label>
              <SelectInput
                options={availableRoles}
                value={watch("role") || ""}
                onChange={(value) => setValue("role", value)}
                placeholder="Select a role"
                label=""
                error={errors.role?.message}
              />
            </div>

            <Button variant="primary" type="submit" width="100%" height="48px">
              {loading ? "Creating..." : "Add Team Member"}
            </Button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AddMember;
