import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import Checkbox from "../../components/form/input/Checkbox";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { createUserService, updateUserService } from "../../services/userService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import { UserRole, type User as UserData } from "../../types/entities";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userData?: UserData | null;
}

interface CreateUserForm {
  mobile: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
}

const ROLES: UserRole[] = [UserRole.USER, UserRole.ADMIN, UserRole.NANNY];

const DEFAULT_VALUES: CreateUserForm = {
  mobile: "",
  role: UserRole.USER,
  is_verified: true,
  is_active: true,
};

export default function CreateUserModal({ isOpen, onClose, onSuccess, userData }: Props) {
  const [loading, setLoading] = useState(false);
  const [roleDropdown, setRoleDropdown] = useState(false);

  const isEditMode = !!userData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateUserForm>({ mode: "onChange", defaultValues: DEFAULT_VALUES });

  const role = watch("role");
  const isVerified = watch("is_verified");
  const isActive = watch("is_active");

  useEffect(() => {
    if (isOpen && userData) {
      reset({
        mobile: userData.mobile,
        role: userData.role,
        is_verified: userData.is_verified,
        is_active: userData.is_active,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [userData, isOpen, reset]);

  const handleClose = () => {
    reset(DEFAULT_VALUES);
    setRoleDropdown(false);
    onClose();
  };

  const onSubmit = async (data: CreateUserForm) => {
    try {
      setLoading(true);

      const response = isEditMode && userData?.id
        ? await updateUserService(userData.id, data)
        : await createUserService(data);

      if (response.status === "success") {
        showAlert(
          "success",
          response.message || `User ${isEditMode ? "updated" : "created"} successfully`,
          "Success"
        );
        onSuccess();
        handleClose();
      } else {
        showAlert("error", response.message || "Something went wrong", "Error");
      }
    } catch (error) {
      showAlert(
        "error",
        formatErrorMessage(error, `Failed to ${isEditMode ? "update" : "create"} user`),
        "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="user-modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            {isEditMode ? "Update User" : "Create User"}
          </h2>

          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="text-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Mobile */}
          <div>
            <Label>Mobile Number</Label>
            <Input
              placeholder="Enter mobile number"
              error={!!errors.mobile}
              hint={errors.mobile?.message}
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit Indian mobile number",
                },
              })}
            />
          </div>

          {/* Role */}
          <div className="relative">
            <Label>Role</Label>
            <button
              type="button"
              onClick={() => setRoleDropdown(!roleDropdown)}
              className={`h-11 w-full rounded-lg border px-4 text-left capitalize text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              {role}
            </button>

            <Dropdown
              isOpen={roleDropdown}
              onClose={() => setRoleDropdown(false)}
              className="w-full"
            >
              {ROLES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="w-full px-4 py-2 text-left capitalize hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setValue("role", item, { shouldValidate: true });
                    setRoleDropdown(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </Dropdown>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <Checkbox
              label="Is Verified"
              checked={isVerified}
              onChange={(checked) => setValue("is_verified", checked)}
            />
            <Checkbox
              label="Is Active"
              checked={isActive}
              onChange={(checked) => setValue("is_active", checked)}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="w-full" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="w-full" disabled={loading || !isValid}>
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update User"
                : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
