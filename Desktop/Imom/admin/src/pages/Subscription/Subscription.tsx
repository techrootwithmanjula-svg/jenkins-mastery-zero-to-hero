import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import DynamicTable from "../../components/tables/BasicTables/BasicTableOne";
import Badge from "../../components/ui/badge/Badge";
import CompleteReplacementModal from "./CompleteReplacementModal";
import RejectReplacementModal from "./RejectReplacementModal";
import EditSubscriptionLimitsModal from "./EditSubscriptionLimitsModal";
import {
  getReplacementRequestsService,
  getSubscriptionsService,
} from "../../services/subscriptionService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import type {
  ReplacementStatus,
  Subscription,
  SubscriptionPlanTier,
  SubscriptionReplacementRequest,
  SubscriptionStatus,
} from "../../types/entities";

type TabKey = "replacements" | "subscriptions";

interface SubscriptionFilters {
  status: string;
  plan_tier: string;
}

interface ReplacementFilters {
  status: string;
}

const PAGE_SIZE = 10;

const PLAN_TIERS: SubscriptionPlanTier[] = [
  "silver",
  "gold",
  "platinum",
  "elite",
  "diamond",
];

const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ["active", "paused", "cancelled"];

const REPLACEMENT_STATUSES: ReplacementStatus[] = [
  "requested",
  "approved",
  "completed",
  "rejected",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const formatLimit = (value: number) => (value < 0 ? "Unlimited" : String(value));

const formatDate = (value: string) =>
  value ? new Date(value).toLocaleDateString("en-IN") : "-";

const getSubscriptionStatusColor = (status: SubscriptionStatus) => {
  if (status === "active") return "success";
  if (status === "paused") return "warning";
  return "error";
};

const getReplacementStatusColor = (status: ReplacementStatus) => {
  if (status === "requested") return "warning";
  if (status === "approved") return "info";
  if (status === "completed") return "success";
  return "error";
};

const computeTotalPages = (page: number, itemCount: number, limit: number) =>
  itemCount < limit ? page : page + 1;

export default function Subscription() {
  const [activeTab, setActiveTab] = useState<TabKey>("replacements");

  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [replacementsLoading, setReplacementsLoading] = useState(false);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [replacements, setReplacements] = useState<SubscriptionReplacementRequest[]>([]);

  const [subscriptionPage, setSubscriptionPage] = useState(1);
  const [replacementPage, setReplacementPage] = useState(1);
  const [subscriptionTotalPages, setSubscriptionTotalPages] = useState(1);
  const [replacementTotalPages, setReplacementTotalPages] = useState(1);

  const emptySubscriptionFilters: SubscriptionFilters = { status: "", plan_tier: "" };
  const emptyReplacementFilters: ReplacementFilters = { status: "requested" };

  const [subscriptionFilters, setSubscriptionFilters] =
    useState<SubscriptionFilters>(emptySubscriptionFilters);
  const [appliedSubscriptionFilters, setAppliedSubscriptionFilters] =
    useState<SubscriptionFilters>(emptySubscriptionFilters);

  const [replacementFilters, setReplacementFilters] =
    useState<ReplacementFilters>(emptyReplacementFilters);
  const [appliedReplacementFilters, setAppliedReplacementFilters] =
    useState<ReplacementFilters>(emptyReplacementFilters);

  const [selectedReplacement, setSelectedReplacement] =
    useState<SubscriptionReplacementRequest | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openLimitsModal, setOpenLimitsModal] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setSubscriptionsLoading(true);

      const response = await getSubscriptionsService({
        page: subscriptionPage,
        limit: PAGE_SIZE,
        status: appliedSubscriptionFilters.status
          ? (appliedSubscriptionFilters.status as SubscriptionStatus)
          : undefined,
        plan_tier: appliedSubscriptionFilters.plan_tier
          ? (appliedSubscriptionFilters.plan_tier as SubscriptionPlanTier)
          : undefined,
      });

      if (response.status === "success") {
        const items = response.data.items ?? [];
        setSubscriptions(items);
        setSubscriptionTotalPages(
          computeTotalPages(subscriptionPage, items.length, PAGE_SIZE)
        );
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to fetch subscriptions"), "Error");
    } finally {
      setSubscriptionsLoading(false);
    }
  }, [subscriptionPage, appliedSubscriptionFilters]);

  const fetchReplacements = useCallback(async () => {
    try {
      setReplacementsLoading(true);

      const response = await getReplacementRequestsService({
        page: replacementPage,
        limit: PAGE_SIZE,
        status: appliedReplacementFilters.status
          ? (appliedReplacementFilters.status as ReplacementStatus)
          : undefined,
      });

      if (response.status === "success") {
        const items = response.data.items ?? [];
        setReplacements(items);
        setReplacementTotalPages(
          computeTotalPages(replacementPage, items.length, PAGE_SIZE)
        );
      }
    } catch (error) {
      showAlert(
        "error",
        formatErrorMessage(error, "Failed to fetch replacement requests"),
        "Error"
      );
    } finally {
      setReplacementsLoading(false);
    }
  }, [replacementPage, appliedReplacementFilters]);

  useEffect(() => {
    if (activeTab === "subscriptions") {
      fetchSubscriptions();
    }
  }, [activeTab, fetchSubscriptions]);

  useEffect(() => {
    if (activeTab === "replacements") {
      fetchReplacements();
    }
  }, [activeTab, fetchReplacements]);

  const handleSubscriptionSearch = () => {
    setSubscriptionPage(1);
    setAppliedSubscriptionFilters({ ...subscriptionFilters });
  };

  const handleReplacementSearch = () => {
    setReplacementPage(1);
    setAppliedReplacementFilters({ ...replacementFilters });
  };

  const subscriptionColumns = [
    { key: "id", header: "ID" },
    {
      key: "parent_name",
      header: "Parent",
      render: (value: string) => value || "-",
    },
    { key: "nanny_name", header: "Nanny" },
    {
      key: "plan_tier",
      header: "Plan",
      render: (_: unknown, row: Subscription) => (
        <div className="min-w-[140px]">
          <p className="font-medium capitalize">{row.plan_tier}</p>
          <p className="text-theme-xs text-gray-400">{row.plan_name}</p>
        </div>
      ),
    },
    {
      key: "weekdays",
      header: "Schedule",
      render: (_: unknown, row: Subscription) => (
        <div className="min-w-[180px] whitespace-normal">
          <p>{row.weekdays?.join(", ") || "-"}</p>
          <p className="text-theme-xs text-gray-400">
            {row.start_time} - {row.end_time}
          </p>
        </div>
      ),
    },
    {
      key: "start_date",
      header: "Start / Expiry",
      render: (_: unknown, row: Subscription) => (
        <div>
          <p>{formatDate(row.start_date)}</p>
          <p className="text-theme-xs text-gray-400">{formatDate(row.expiry_date)}</p>
        </div>
      ),
    },
    {
      key: "total_amount_inr",
      header: "Amount",
      render: (value: number) => formatCurrency(value),
    },
    {
      key: "status",
      header: "Status",
      render: (value: SubscriptionStatus) => (
        <Badge size="sm" color={getSubscriptionStatusColor(value)}>
          <span className="capitalize">{value}</span>
        </Badge>
      ),
    },
    {
      key: "pause_allowance_days",
      header: "Pause",
      render: (_: unknown, row: Subscription) => (
        <div className="text-theme-sm">
          <p>{row.remaining_pause_days ?? 0} left</p>
          <p className="text-theme-xs text-gray-400">
            {row.pause_allowance_days} total · {row.pause_allowance_per_month}/mo cap
          </p>
        </div>
      ),
    },
    {
      key: "replacement_allowance",
      header: "Replacements",
      render: (_: unknown, row: Subscription) => (
        <div className="text-theme-sm">
          <p>
            {row.replacement_allowance < 0
              ? "Unlimited"
              : `${row.remaining_replacements ?? 0} left`}
          </p>
          <p className="text-theme-xs text-gray-400">
            {formatLimit(row.replacement_allowance)} total · {row.replacement_used} used
          </p>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Created At",
      render: (value: string) => formatDate(value),
    },
  ];

  const replacementColumns = [
    { key: "id", header: "Request ID" },
    { key: "subscription_id", header: "Subscription ID" },
    { key: "parent_name", header: "Parent" },
    {
      key: "plan_tier",
      header: "Plan",
      render: (_: unknown, row: SubscriptionReplacementRequest) => (
        <div className="min-w-[140px]">
          <p className="font-medium capitalize">{row.plan_tier}</p>
          <p className="text-theme-xs text-gray-400">{row.plan_name}</p>
        </div>
      ),
    },
    { key: "old_nanny_name", header: "Current Nanny" },
    {
      key: "effective_date",
      header: "Effective Date",
      render: (value: string) => formatDate(value),
    },
    {
      key: "reason",
      header: "Reason",
      render: (value: string | null) => (
        <div className="min-w-[220px] whitespace-normal">{value || "-"}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: ReplacementStatus) => (
        <Badge size="sm" color={getReplacementStatusColor(value)}>
          <span className="capitalize">{value}</span>
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Requested At",
      render: (value: string) => formatDate(value),
    },
  ];

  const replacementActions = [
    {
      label: "Complete",
      variant: "outline" as const,
      hidden: (row: SubscriptionReplacementRequest) =>
        !["requested", "approved"].includes(row.status),
      onClick: (row: SubscriptionReplacementRequest) => {
        setSelectedReplacement(row);
        setOpenCompleteModal(true);
      },
    },
    {
      label: "Reject",
      variant: "outline" as const,
      hidden: (row: SubscriptionReplacementRequest) =>
        !["requested", "approved"].includes(row.status),
      onClick: (row: SubscriptionReplacementRequest) => {
        setSelectedReplacement(row);
        setOpenRejectModal(true);
      },
    },
  ];

  const subscriptionActions = [
    {
      label: "Edit limits",
      variant: "outline" as const,
      onClick: (row: Subscription) => {
        setSelectedSubscription(row);
        setOpenLimitsModal(true);
      },
    },
  ];

  const tabButtonClass = (tab: TabKey) =>
    activeTab === tab
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <>
      <PageBreadcrumb pageTitle="Subscriptions" />

      <div className="space-y-6">
        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Subscription Management
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Completing or rejecting replacements requires admin access.
              </p>
            </div>

            <div className="flex w-full max-w-md items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
              <button
                type="button"
                onClick={() => setActiveTab("replacements")}
                className={`w-full rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${tabButtonClass("replacements")}`}
              >
                Pending Replacements
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("subscriptions")}
                className={`w-full rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${tabButtonClass("subscriptions")}`}
              >
                All Subscriptions
              </button>
            </div>
          </div>

          {activeTab === "replacements" ? (
            <>
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <select
                  className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  value={replacementFilters.status}
                  onChange={(e) =>
                    setReplacementFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="">All Statuses</option>
                  {REPLACEMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                <Button className="w-full" onClick={handleReplacementSearch}>
                  Search
                </Button>
              </div>

              <DynamicTable
                columns={replacementColumns}
                data={replacements}
                actions={replacementActions}
                loading={replacementsLoading}
                currentPage={replacementPage}
                totalPages={replacementTotalPages}
                onPageChange={setReplacementPage}
                emptyMessage="No replacement requests found"
              />
            </>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <select
                  className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  value={subscriptionFilters.status}
                  onChange={(e) =>
                    setSubscriptionFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="">All Statuses</option>
                  {SUBSCRIPTION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  value={subscriptionFilters.plan_tier}
                  onChange={(e) =>
                    setSubscriptionFilters((prev) => ({ ...prev, plan_tier: e.target.value }))
                  }
                >
                  <option value="">All Plans</option>
                  {PLAN_TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </option>
                  ))}
                </select>

                <Button className="w-full sm:col-span-2 lg:col-span-1" onClick={handleSubscriptionSearch}>
                  Search
                </Button>
              </div>

              <DynamicTable
                columns={subscriptionColumns}
                data={subscriptions}
                actions={subscriptionActions}
                loading={subscriptionsLoading}
                currentPage={subscriptionPage}
                totalPages={subscriptionTotalPages}
                onPageChange={setSubscriptionPage}
                emptyMessage="No subscriptions found"
              />
            </>
          )}
        </div>
      </div>

      <CompleteReplacementModal
        isOpen={openCompleteModal}
        replacement={selectedReplacement}
        onClose={() => {
          setOpenCompleteModal(false);
          setSelectedReplacement(null);
        }}
        onSuccess={fetchReplacements}
      />

      <RejectReplacementModal
        isOpen={openRejectModal}
        replacement={selectedReplacement}
        onClose={() => {
          setOpenRejectModal(false);
          setSelectedReplacement(null);
        }}
        onSuccess={fetchReplacements}
      />

      <EditSubscriptionLimitsModal
        isOpen={openLimitsModal}
        subscription={selectedSubscription}
        onClose={() => {
          setOpenLimitsModal(false);
          setSelectedSubscription(null);
        }}
        onSuccess={fetchSubscriptions}
      />
    </>
  );
}
