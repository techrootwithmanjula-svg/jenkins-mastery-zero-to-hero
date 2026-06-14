import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { completeReplacementService } from "../../services/subscriptionService";
import { getNanniesService } from "../../services/nannyService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import type { Nanny, SubscriptionReplacementRequest } from "../../types/entities";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  replacement: SubscriptionReplacementRequest | null;
  onSuccess: () => void;
}

interface CompleteReplacementForm {
  new_nanny_id: string;
}

export default function CompleteReplacementModal({
  isOpen,
  onClose,
  replacement,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [nanniesLoading, setNanniesLoading] = useState(false);
  const [nannies, setNannies] = useState<Nanny[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CompleteReplacementForm>({ mode: "onChange" });

  useEffect(() => {
    if (!isOpen) {
      reset({ new_nanny_id: "" });
      return;
    }

    const fetchNannies = async () => {
      try {
        setNanniesLoading(true);
        const response = await getNanniesService({ page: 1, limit: 100, is_active: true });
        if (response.status === "success") {
          setNannies(response.data.items);
        }
      } catch (error) {
        showAlert("error", formatErrorMessage(error, "Failed to load nannies"), "Error");
      } finally {
        setNanniesLoading(false);
      }
    };

    fetchNannies();
  }, [isOpen, reset]);

  const onSubmit = async (data: CompleteReplacementForm) => {
    if (!replacement) return;

    try {
      setLoading(true);
      const response = await completeReplacementService(
        replacement.subscription_id,
        replacement.id,
        { new_nanny_id: Number(data.new_nanny_id) }
      );

      if (response.status === "success") {
        showAlert(
          "success",
          response.message || "Replacement completed successfully",
          "Success"
        );
        onSuccess();
        onClose();
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to complete replacement"), "Error");
    } finally {
      setLoading(false);
    }
  };

  const availableNannies = nannies.filter(
    (nanny) => nanny.id !== replacement?.old_nanny_id && nanny.id !== replacement?.current_nanny_id
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6 lg:p-8">
      <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
        Complete Replacement
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Assign a new nanny for {replacement?.parent_name ?? "this parent"}&apos;s{" "}
        {replacement?.plan_name ?? "subscription"} request.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>New Nanny</Label>
          <select
            className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            disabled={nanniesLoading || loading}
            {...register("new_nanny_id", { required: true })}
          >
            <option value="">
              {nanniesLoading ? "Loading nannies..." : "Select a nanny"}
            </option>
            {availableNannies.map((nanny) => (
              <option key={nanny.id} value={nanny.id}>
                {nanny.first_name} {nanny.last_name} (ID: {nanny.id})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full" disabled={loading || !isValid}>
            {loading ? "Completing..." : "Complete Replacement"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
