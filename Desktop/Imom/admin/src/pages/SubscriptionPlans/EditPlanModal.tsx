import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { updateSubscriptionPlanService } from "../../services/subscriptionPlanService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import type { SubscriptionPlan, UpdateSubscriptionPlanPayload } from "../../types/entities";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
  onSuccess: () => void;
}

interface EditPlanForm {
  pause_allowance_days: string;
  pause_allowance_per_month: string;
  pause_label: string;
  replacement_allowance: string;
  replacement_per_month: string;
  replacement_label: string;
}

export default function EditPlanModal({ isOpen, onClose, plan, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<EditPlanForm>({ mode: "onChange" });

  useEffect(() => {
    if (plan && isOpen) {
      reset({
        pause_allowance_days: String(plan.pause_allowance_days ?? 0),
        pause_allowance_per_month: String(plan.pause_allowance_per_month ?? 0),
        pause_label: plan.pause_label ?? "",
        replacement_allowance: String(plan.replacement_allowance ?? 0),
        replacement_per_month: String(plan.replacement_per_month ?? 0),
        replacement_label: plan.replacement_label ?? "",
      });
    }
  }, [plan, isOpen, reset]);

  const onSubmit = async (values: EditPlanForm) => {
    if (!plan) return;

    const payload: UpdateSubscriptionPlanPayload = {
      pause_allowance_days: Number(values.pause_allowance_days),
      pause_allowance_per_month: Number(values.pause_allowance_per_month),
      pause_label: values.pause_label.trim(),
      replacement_allowance: Number(values.replacement_allowance),
      replacement_per_month: Number(values.replacement_per_month),
      replacement_label: values.replacement_label.trim(),
    };

    try {
      setLoading(true);
      const response = await updateSubscriptionPlanService(plan.id, payload);
      if (response.status === "success") {
        showAlert("success", "Plan limits updated. New subscriptions will use these values.");
        onSuccess();
        onClose();
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to update plan"), "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[640px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
          Edit plan limits
        </h4>
        {plan ? (
          <p className="mb-6 text-sm text-gray-500">
            {plan.name} — changes apply to <strong>new</strong> subscriptions only.
          </p>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Total pause days (plan)</Label>
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
            <div className="sm:col-span-2">
              <Label>Pause label (app display)</Label>
              <Input {...register("pause_label")} />
            </div>
            <div>
              <Label>Total replacements (use -1 for unlimited)</Label>
              <Input type="number" {...register("replacement_allowance", { required: true })} />
            </div>
            <div>
              <Label>Replacements per month (0 = no monthly cap)</Label>
              <Input type="number" min={0} {...register("replacement_per_month", { required: true })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Replacement label (app display)</Label>
              <Input {...register("replacement_label")} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || loading}>
              {loading ? "Saving..." : "Save plan limits"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
