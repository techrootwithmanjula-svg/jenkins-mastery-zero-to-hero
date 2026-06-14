import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DynamicTable from "../../components/tables/BasicTables/BasicTableOne";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import EditPlanModal from "./EditPlanModal";
import { getSubscriptionPlansService } from "../../services/subscriptionPlanService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import type { SubscriptionPlan } from "../../types/entities";

const formatLimit = (value: number, unlimitedLabel = "Unlimited") =>
  value < 0 ? unlimitedLabel : String(value);

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSubscriptionPlansService();
      if (response.status === "success") {
        setPlans(response.data.items ?? []);
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to load plans"), "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const columns = [
    {
      key: "id",
      header: "Tier",
      render: (value: string) => <span className="capitalize font-medium">{value}</span>,
    },
    { key: "name", header: "Plan name" },
    {
      key: "pause_allowance_days",
      header: "Pause (total)",
      render: (value: number) => formatLimit(value, "None"),
    },
    {
      key: "pause_allowance_per_month",
      header: "Pause / month",
      render: (value: number) => (value > 0 ? value : "—"),
    },
    {
      key: "replacement_allowance",
      header: "Replacements (total)",
      render: (value: number) => formatLimit(value),
    },
    {
      key: "replacement_per_month",
      header: "Replacements / month",
      render: (value: number) => (value > 0 ? value : "—"),
    },
    {
      key: "is_active",
      header: "Status",
      render: (value: boolean | undefined) => (
        <Badge size="sm" color={value ? "success" : "error"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: "Edit limits",
      variant: "outline" as const,
      onClick: (row: SubscriptionPlan) => {
        setSelectedPlan(row);
        setOpenEditModal(true);
      },
    },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Subscription Plans" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Plan catalog
            </h3>
            <p className="text-sm text-gray-500">
              Edit pause and replacement limits per tier. Existing subscriptions keep their saved
              limits unless you override them on the Subscriptions tab.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => fetchPlans()} disabled={loading}>
            Refresh
          </Button>
        </div>

        <DynamicTable
          columns={columns}
          data={plans}
          loading={loading}
          actions={actions}
          emptyMessage="No subscription plans found"
        />
      </div>

      <EditPlanModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        plan={selectedPlan}
        onSuccess={fetchPlans}
      />
    </>
  );
}
