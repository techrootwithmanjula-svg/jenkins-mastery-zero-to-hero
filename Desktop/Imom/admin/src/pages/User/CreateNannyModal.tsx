import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import Checkbox from "../../components/form/input/Checkbox";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import MultiSelectDropdown, {
  Option,
} from "../../components/ui/dropdown/multiSelectDropdown";
import { showAlert } from "../../services/alertService";
import { createNannyService } from "../../services/nannyService";
import { formatErrorMessage } from "../../utils/errors";
import { CERTIFICATE_OPTIONS, GENDER_OPTIONS, Gender } from "../../types/entities";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  onSuccess: () => void;
}

interface CreateNannyForm {
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  email_id: string;
  gender: Gender;
  address: string;
  permanent_address: string;
  emergency_contact: string;
  experience: number;
  aadhar_number: string;
  pan_card: string;
  is_active: boolean;
}

const DEFAULT_VALUES: CreateNannyForm = {
  first_name: "",
  middle_name: "",
  last_name: "",
  dob: "",
  mobile_number: "",
  email_id: "",
  gender: Gender.MALE,
  address: "",
  permanent_address: "",
  emergency_contact: "",
  experience: 0,
  aadhar_number: "",
  pan_card: "",
  is_active: true,
};

export default function CreateNannyModal({ isOpen, onClose, onSuccess, userId }: Props) {
  const [loading, setLoading] = useState(false);
  const [genderDropdown, setGenderDropdown] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateNannyForm>({ mode: "onChange", defaultValues: DEFAULT_VALUES });

  const gender = watch("gender");
  const isActive = watch("is_active");

  const handleClose = () => {
    reset(DEFAULT_VALUES);
    setSelectedCertificates([]);
    setGenderDropdown(false);
    onClose();
  };

  const onSubmit = async (data: CreateNannyForm) => {
    if (!userId) {
      showAlert("error", "No user selected for nanny creation", "Error");
      return;
    }

    const formatDobForApi = (dob?: string) => {
      if (!dob) return "";
      if (dob.includes("-")) {
        const [y, m, d] = dob.split("-");
        return `${d}/${m}/${y}`;
      }
      return dob;
    };

    try {
      setLoading(true);

      const payload = {
        ...data,
        user_id: userId,
        experience: Number(data.experience),
        certificates: selectedCertificates.map((c) => c.value),
        dob: formatDobForApi(data.dob),
      };

      const response = await createNannyService(payload);

      if (response.status === "success") {
        showAlert("success", response.message || "Nanny created successfully", "Success");
        onSuccess();
        handleClose();
      } else {
        showAlert("error", response.message || "Something went wrong", "Error");
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to create nanny"), "Error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-nanny-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 id="create-nanny-title" className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Create Nanny
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="text-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="create-nanny-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  error={!!errors.first_name}
                  hint={errors.first_name?.message}
                  {...register("first_name", { required: "First name is required" })}
                />
              </div>

              <div>
                <Label>Middle Name</Label>
                <Input {...register("middle_name")} />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  error={!!errors.last_name}
                  hint={errors.last_name?.message}
                  {...register("last_name", { required: "Last name is required" })}
                />
              </div>

              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  error={!!errors.dob}
                  hint={errors.dob?.message}
                  {...register("dob", { required: "Date of birth is required" })}
                />
              </div>

              <div>
                <Label>Mobile Number</Label>
                <Input
                  error={!!errors.mobile_number}
                  hint={errors.mobile_number?.message}
                  {...register("mobile_number", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit Indian mobile number",
                    },
                  })}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  error={!!errors.email_id}
                  hint={errors.email_id?.message}
                  {...register("email_id", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>

              {/* Gender — uses Dropdown component for consistency */}
              <div className="relative">
                <Label>Gender</Label>
                <button
                  type="button"
                  onClick={() => setGenderDropdown(!genderDropdown)}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-left capitalize text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  {gender}
                </button>
                <Dropdown
                  isOpen={genderDropdown}
                  onClose={() => setGenderDropdown(false)}
                  className="w-full"
                >
                  {GENDER_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="w-full px-4 py-2 text-left capitalize hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        setValue("gender", item as Gender, { shouldValidate: true });
                        setGenderDropdown(false);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </Dropdown>
              </div>

              <div>
                <Label>Experience (Years)</Label>
                <Input
                  type="number"
                  error={!!errors.experience}
                  hint={errors.experience?.message}
                  {...register("experience", {
                    required: "Experience is required",
                    min: { value: 0, message: "Must be 0 or more" },
                    max: { value: 100, message: "Must be 100 or less" },
                  })}
                />
              </div>

              <div>
                <Label>Aadhaar Number</Label>
                <Input
                  error={!!errors.aadhar_number}
                  hint={errors.aadhar_number?.message}
                  {...register("aadhar_number", {
                    required: "Aadhaar number is required",
                    pattern: {
                      value: /^\d{12}$/,
                      message: "Aadhaar must be 12 digits",
                    },
                  })}
                />
              </div>

              <div>
                <Label>PAN Card</Label>
                <Input
                  error={!!errors.pan_card}
                  hint={errors.pan_card?.message}
                  {...register("pan_card", {
                    required: "PAN card is required",
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "Invalid PAN format (e.g. ABCDE1234F)",
                    },
                  })}
                />
              </div>

              <div>
                <Label>Emergency Contact</Label>
                <Input
                  error={!!errors.emergency_contact}
                  hint={errors.emergency_contact?.message}
                  {...register("emergency_contact", {
                    required: "Emergency contact is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit Indian mobile number",
                    },
                  })}
                />
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Input
                error={!!errors.address}
                hint={errors.address?.message}
                {...register("address", { required: "Address is required" })}
              />
            </div>

            <div>
              <Label>Permanent Address</Label>
              <Input
                error={!!errors.permanent_address}
                hint={errors.permanent_address?.message}
                {...register("permanent_address", { required: "Permanent address is required" })}
              />
            </div>

            <div>
              <Label>Certificates</Label>
              <MultiSelectDropdown
                options={CERTIFICATE_OPTIONS}
                value={selectedCertificates}
                onChange={setSelectedCertificates}
                placeholder="Select certificates"
              />
            </div>

            <Checkbox
              label="Is Active"
              checked={isActive}
              onChange={(checked) => setValue("is_active", checked)}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 p-6 dark:border-gray-800">
          <Button variant="outline" className="w-full" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-nanny-form"
            disabled={loading || !isValid}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Nanny"}
          </Button>
        </div>
      </div>
    </div>
  );
}
