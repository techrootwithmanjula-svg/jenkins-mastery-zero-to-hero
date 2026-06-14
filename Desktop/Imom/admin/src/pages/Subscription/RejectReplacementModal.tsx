import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { rejectReplacementService } from "../../services/subscriptionService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import type { SubscriptionReplacementRequest } from "../../types/entities";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  replacement: SubscriptionReplacementRequest | null;
  onSuccess: () => void;
}

interface RejectReplacementForm {
  reason: string;
}

export default function RejectReplacementModal({
  isOpen,
  onClose,
  replacement,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<RejectReplacementForm>({ mode: "onChange" });

  useEffect(() => {
    if (!isOpen) {
      reset({ reason: "" });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: RejectReplacementForm) => {
    if (!replacement) return;

    try {
      setLoading(true);
      const response = await rejectReplacementService(
        replacement.subscription_id,
        replacement.id,
        { reason: data.reason.trim() || undefined }
      );

      if (response.status === "success") {
        showAlert(
          "success",
          response.message || "Replacement request rejected",
          "Success"
        );
        onSuccess();
        onClose();
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to reject replacement"), "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6 lg:p-8">
      <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
        Reject Replacement
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Reject the replacement request from {replacement?.parent_name ?? "this parent"}.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Reason (optional)</Label>
          <textarea
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            rows={4}
            placeholder="Explain why this request is being rejected"
            disabled={loading}
            {...register("reason", { maxLength: 500 })}
          />
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Rejecting..." : "Reject Request"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
