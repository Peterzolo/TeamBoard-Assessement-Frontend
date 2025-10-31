import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Resolver } from "react-hook-form";
import AuthGuard from "../../../Components/auth/AuthGuard";
import { TextInput2 } from "../../../Components/Input/TextInput2";
import { TextArea } from "../../../Components/Input/TextArea/TextArea";
import { SelectInput } from "../../../Components/Input/SelectInput/SelectInput";
import { Button } from "../../../Components/Button/Button";
import { FlashMessage } from "../../../Components/FlashMessage/Flashmessage";
import { BackButton } from "../../../Components/BackButton/BackButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  resetTask,
  setCreateTaskStart,
} from "../../../app/redux/reducers/task/taskReducer";
import { allProjectsSelector } from "../../../app/redux/reducers/project/selectors/projectSelectors";
import { setAllProjectsStart } from "../../../app/redux/reducers/project/projectReducer";
import { allUsersSelector } from "../../../app/redux/reducers/user/selectors/userDetailsSelector";
import { setAllUsersStart } from "../../../app/redux/reducers/user/userDetailsReducer";
import type { IUser } from "../../../app/redux/types/user";
import type { IProject } from "../../../app/redux/types/project";
import {
  createTaskErrorSelector,
  createTaskLoadingSelector,
  createTaskSuccessSelector,
} from "../../../app/redux/reducers/task/selectors/taskSelectors";
import { TaskPriority } from "../../../app/redux/types/task";

const schema = yup
  .object({
    title: yup.string().required("Task title is required"),
    description: yup.string().optional(),
    project: yup.string().required("Project is required"),
    assignees: yup.array().of(yup.string()).optional(),
    priority: yup.string().required("Priority is required"),
    dueDate: yup.date().nullable().optional(),
  })
  .required();

type FormValues = yup.InferType<typeof schema>;
const resolver = yupResolver(schema) as Resolver<FormValues, any>;

type ExtendedUser = IUser & {
  _id?: string;
};

type ExtendedProject = IProject & {
  _id?: string;
};

const CreateTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(createTaskLoadingSelector);
  const error = useSelector(createTaskErrorSelector);
  const success = useSelector(createTaskSuccessSelector);
  const allProjects = useSelector(allProjectsSelector) || [];
  const allUsers = useSelector(allUsersSelector) || [];

  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      title: "",
      description: "",
      project: "",
      assignees: [],
      priority: TaskPriority.MEDIUM,
      dueDate: null,
    },
  });

  // Fetch projects and users for selection
  useEffect(() => {
    if (allProjects.length === 0) {
      dispatch(setAllProjectsStart({ page: 1, limit: 100 }));
    }
    if (allUsers.length === 0) {
      dispatch(setAllUsersStart({ page: 1, limit: 100 }));
    }
  }, [dispatch, allProjects.length, allUsers.length]);

  // Prepare project options
  const projectOptions = [
    { value: "", label: "Select a project" },
    ...allProjects.map((project: ExtendedProject) => ({
      value: project._id || "",
      label: project.name,
    })),
  ];

  // Prepare assignee options
  const assigneeOptions = allUsers.map((user: ExtendedUser) => ({
    value: user.id || user._id || "",
    label: `${user.firstName} ${user.lastName} (${user.email})`,
  }));

  // Prepare priority options
  const priorityOptions = [
    { value: TaskPriority.LOW, label: "Low" },
    { value: TaskPriority.MEDIUM, label: "Medium" },
    { value: TaskPriority.HIGH, label: "High" },
  ];

  const onSubmit = (data: FormValues) => {
    const payload: any = {
      title: data.title,
      description: data.description || "",
      project: data.project,
      priority: data.priority,
    };

    // Include assignees if any are selected
    if (selectedAssignees.length > 0) {
      payload.assignees = selectedAssignees;
    }

    // Include due date if selected
    if (dueDate) {
      payload.dueDate = dueDate.toISOString();
    }

    // Update form assignees value
    setValue("assignees", selectedAssignees);

    dispatch(setCreateTaskStart(payload));
  };

  // Handle success - redirect to task list
  useEffect(() => {
    if (success) {
      dispatch(resetTask());
      navigate("/dashboard/task/list");
    }
  }, [success, navigate, dispatch]);

  const handleAssigneeToggle = (userId: string) => {
    setSelectedAssignees((prev) => {
      const newAssignees = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
      setValue("assignees", newAssignees);
      return newAssignees;
    });
  };

  return (
    <AuthGuard>
      <div className="w-full">
        <BackButton />
        <div className="rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-blue-50 px-6 py-8 sm:px-8 sm:py-10 w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Create Task
          </h2>
          <p className="mt-1 mb-6 text-center text-sm text-gray-600">
            Create a new task
          </p>

          {error && <FlashMessage message={String(error)} type="error" />}
          {success && (
            <FlashMessage message="Task created successfully!" type="success" />
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <TextInput2
              name="title"
              label="Task Title"
              type="text"
              placeholder="Enter task title"
              value={watch("title")}
              onChange={(e) => setValue("title", e.target.value)}
              error={errors.title?.message}
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
              <TextArea
                placeholder="Enter task description"
                value={watch("description") || ""}
                onChange={(e) => setValue("description", e.target.value)}
                error={errors.description?.message}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Project
              </label>
              <SelectInput
                options={projectOptions}
                value={watch("project") || ""}
                onChange={(value) => setValue("project", value)}
                placeholder="Select a project"
                label=""
                error={errors.project?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Priority
              </label>
              <SelectInput
                options={priorityOptions}
                value={watch("priority") || TaskPriority.MEDIUM}
                onChange={(value) => setValue("priority", value)}
                placeholder="Select priority"
                label=""
                error={errors.priority?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Assignees (Optional)
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2 bg-white">
                {assigneeOptions.length === 0 ? (
                  <p className="text-sm text-gray-500">No users available</p>
                ) : (
                  assigneeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAssignees.includes(option.value)}
                        onChange={() => handleAssigneeToggle(option.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900">
                        {option.label}
                      </span>
                    </label>
                  ))
                )}
              </div>
              {selectedAssignees.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {selectedAssignees.length} assignee(s) selected
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Due Date (Optional)
              </label>
              <DatePicker
                selected={dueDate}
                onChange={(date: Date | null) => {
                  setDueDate(date);
                  setValue("dueDate", date, { shouldValidate: true });
                }}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select due date"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                minDate={new Date()}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            <Button variant="primary" type="submit" width="100%" height="48px">
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CreateTask;

