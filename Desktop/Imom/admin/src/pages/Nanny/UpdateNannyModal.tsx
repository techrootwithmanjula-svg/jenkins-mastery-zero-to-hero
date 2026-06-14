import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import Checkbox from "../../components/form/input/Checkbox";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import MultiSelectDropdown, {
  Option,
} from "../../components/ui/dropdown/multiSelectDropdown";
import { updateNannyService } from "../../services/nannyService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import { CERTIFICATE_OPTIONS, GENDER_OPTIONS, Gender } from "../../types/entities";
import type { Nanny as NannyData } from "../../types/entities";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nannyData: NannyData | null;
  onSuccess: () => void;
}

interface UpdateNannyForm {
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

export default function UpdateNannyModal({ isOpen, onClose, nannyData, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [genderDropdown, setGenderDropdown] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<UpdateNannyForm>({ mode: "onChange" });

  const isActive = watch("is_active");
  const gender = watch("gender");

  useEffect(() => {
    if (nannyData && isOpen) {
      reset({
        first_name: nannyData.first_name || "",
        middle_name: nannyData.middle_name || "",
        last_name: nannyData.last_name || "",
        dob: nannyData.dob?.split("T")[0] || "",
        mobile_number: nannyData.mobile_number || "",
        email_id: nannyData.email_id || "",
        gender: (nannyData.gender as Gender) || Gender.MALE,
        address: nannyData.address || "",
        permanent_address: nannyData.permanent_address || "",
        emergency_contact: nannyData.emergency_contact || "",
        experience: nannyData.experience ?? 0,
        aadhar_number: nannyData.aadhar_number || "",
        pan_card: nannyData.pan_card || "",
        is_active: nannyData.is_active,
      });

      // Map stored certificate values back to Option objects
      const mapped = (nannyData.certificates ?? []).map((c) => ({
        label: CERTIFICATE_OPTIONS.find((o) => o.value === c)?.label ?? c,
        value: c,
      }));
      setSelectedCertificates(mapped);
    }
  }, [nannyData, isOpen, reset]);

  const handleClose = () => {
    reset();
    setSelectedCertificates([]);
    setGenderDropdown(false);
    onClose();
  };

  const onSubmit = async (data: UpdateNannyForm) => {
    if (!nannyData?.id) return;

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

      const response = await updateNannyService(nannyData.id, {
        ...data,
        certificates: selectedCertificates.map((c) => c.value),
        dob: formatDobForApi(data.dob),
      });

      if (response.status === "success") {
        showAlert("success", response.message || "Nanny updated successfully", "Success");
        onSuccess();
        handleClose();
      } else {
        showAlert("error", response.message || "Something went wrong", "Error");
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to update nanny"), "Error");
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
      aria-labelledby="update-nanny-title"
    >
      <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 id="update-nanny-title" className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Update Nanny
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
            id="update-nanny-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input {...register("first_name", { required: true })} />
              </div>

              <div>
                <Label>Middle Name</Label>
                <Input {...register("middle_name")} />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input {...register("last_name", { required: true })} />
              </div>

              <div>
                <Label>Date of Birth</Label>
                <Input type="date" {...register("dob")} />
              </div>

              <div>
                <Label>Mobile</Label>
                <Input {...register("mobile_number")} />
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" {...register("email_id")} />
              </div>

              {/* Gender — consistent with CreateNannyModal */}
              <div className="relative">
                <Label>Gender</Label>
                <button
                  type="button"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-left capitalize text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  onClick={() => setGenderDropdown(!genderDropdown)}
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
                <Input type="number" {...register("experience")} />
              </div>

              <div>
                <Label>Aadhaar</Label>
                <Input {...register("aadhar_number")} />
              </div>

              <div>
                <Label>PAN Card</Label>
                <Input {...register("pan_card")} />
              </div>

              <div>
                <Label>Emergency Contact</Label>
                <Input {...register("emergency_contact")} />
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Input {...register("address")} />
            </div>

            <div>
              <Label>Permanent Address</Label>
              <Input {...register("permanent_address")} />
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
            form="update-nanny-form"
            disabled={loading || !isValid}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Nanny"}
          </Button>
        </div>
      </div>
    </div>
  );
}
