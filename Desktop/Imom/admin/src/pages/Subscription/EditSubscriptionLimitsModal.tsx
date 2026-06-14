import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { updateSubscriptionLimitsService } from "../../services/subscriptionService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import type { Subscription, UpdateSubscriptionLimitsPayload } from "../../types/entities";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onSuccess: () => void;
}

interface EditLimitsForm {
  pause_allowance_days: string;
  pause_allowance_per_month: string;
  pause_days_used: string;
  replacement_allowance: string;
  replacement_per_month: string;
  replacement_used: string;
}

export default function EditSubscriptionLimitsModal({
  isOpen,
  onClose,
  subscription,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<EditLimitsForm>({ mode: "onChange" });

  useEffect(() => {
    if (subscription && isOpen) {
      reset({
        pause_allowance_days: String(subscription.pause_allowance_days ?? 0),
        pause_allowance_per_month: String(subscription.pause_allowance_per_month ?? 0),
        pause_days_used: String(subscription.pause_days_used ?? 0),
        replacement_allowance: String(subscription.replacement_allowance ?? 0),
        replacement_per_month: String(subscription.replacement_per_month ?? 0),
        replacement_used: String(subscription.replacement_used ?? 0),
      });
    }
  }, [subscription, isOpen, reset]);

  const onSubmit = async (values: EditLimitsForm) => {
    if (!subscription) return;

    const payload: UpdateSubscriptionLimitsPayload = {
      pause_allowance_days: Number(values.pause_allowance_days),
      pause_allowance_per_month: Number(values.pause_allowance_per_month),
      pause_days_used: Number(values.pause_days_used),
      replacement_allowance: Number(values.replacement_allowance),
      replacement_per_month: Number(values.replacement_per_month),
      replacement_used: Number(values.replacement_used),
    };

    try {
      setLoading(true);
      const response = await updateSubscriptionLimitsService(subscription.id, payload);
      if (response.status === "success") {
        showAlert("success", "Subscription limits updated for this parent.");
        onSuccess();
        onClose();
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to update limits"), "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[640px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
          Edit subscription limits
        </h4>
        {subscription ? (
          <p className="mb-6 text-sm text-gray-500">
            Subscription #{subscription.id} · {subscription.plan_name} · {subscription.nanny_name}
          </p>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Total pause days</Label>
              <Input type="number" min={0} {...register("pause_allowance_days", { required: true })} />
            </div>
            <div>
              <Label>Pause days per month</Label>
              <Input
                type="number"
                min={0}
                {...register("pause_allowance_per_month", { required: true })}
              />
            </div>
            <div>
              <Label>Pause days used</Label>
              <Input type="number" min={0} {...register("pause_days_used", { required: true })} />
            </div>
            <div>
              <Label>Total replacements (-1 = unlimited)</Label>
              <Input type="number" {...register("replacement_allowance", { required: true })} />
            </div>
            <div>
              <Label>Replacements per month</Label>
              <Input type="number" min={0} {...register("replacement_per_month", { required: true })} />
            </div>
            <div>
              <Label>Replacements used</Label>
              <Input type="number" min={0} {...register("replacement_used", { required: true })} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || loading}>
              {loading ? "Saving..." : "Save limits"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
