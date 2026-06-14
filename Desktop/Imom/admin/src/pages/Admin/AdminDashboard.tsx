import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import DynamicTable from "../../components/tables/BasicTables/BasicTableOne";
import Badge from "../../components/ui/badge/Badge";
import DeleteConfirmationModal from "../Nanny/DeleteConfirmationModal";
import { getBookingsService, cancelBookingService } from "../../services/bookingService";
import { getNanniesService, updateNannyService } from "../../services/nannyService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import type {
  Booking,
  BookingServiceStatus,
  BookingStatus,
  Nanny,
} from "../../types/entities";

type TabKey = "bookings" | "nannies";

interface BookingFilters {
  status: string;
  service_status: string;
}

const PAGE_SIZE = 10;

const BOOKING_STATUSES: BookingStatus[] = ["active", "cancelled", "completed"];

const SERVICE_STATUSES: BookingServiceStatus[] = [
  "scheduled",
  "in_progress",
  "completed",
  "missed",
  "paused",
];

const formatCurrency = (value: number | null) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const formatDateTime = (value: string) =>
  value ? new Date(value).toLocaleString("en-IN") : "-";

const getBookingStatusColor = (status: BookingStatus) => {
  if (status === "active") return "success";
  if (status === "completed") return "info";
  return "error";
};

const computeTotalPages = (pagination?: {
  totalPages?: number;
  page?: number;
  limit?: number;
  total?: number;
}) => {
  if (pagination?.totalPages) return pagination.totalPages;
  if (pagination?.total && pagination?.limit) {
    return Math.ceil(pagination.total / pagination.limit) || 1;
  }
  return 1;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("bookings");

  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [nanniesLoading, setNanniesLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [nannyToggleLoading, setNannyToggleLoading] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [nannies, setNannies] = useState<Nanny[]>([]);

  const [bookingPage, setBookingPage] = useState(1);
  const [nannyPage, setNannyPage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);
  const [nannyTotalPages, setNannyTotalPages] = useState(1);

  const emptyBookingFilters: BookingFilters = { status: "", service_status: "" };
  const [bookingFilters, setBookingFilters] = useState<BookingFilters>(emptyBookingFilters);
  const [appliedBookingFilters, setAppliedBookingFilters] =
    useState<BookingFilters>(emptyBookingFilters);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedNanny, setSelectedNanny] = useState<Nanny | null>(null);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openNannyStatusModal, setOpenNannyStatusModal] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setBookingsLoading(true);

      const response = await getBookingsService({
        page: bookingPage,
        limit: PAGE_SIZE,
        status: appliedBookingFilters.status
          ? (appliedBookingFilters.status as BookingStatus)
          : undefined,
        service_status: appliedBookingFilters.service_status
          ? (appliedBookingFilters.service_status as BookingServiceStatus)
          : undefined,
      });

      if (response.status === "success") {
        setBookings(response.data.items ?? []);
        setBookingTotalPages(computeTotalPages(response.data.pagination));
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to fetch bookings"), "Error");
    } finally {
      setBookingsLoading(false);
    }
  }, [bookingPage, appliedBookingFilters]);

  const fetchNannies = useCallback(async () => {
    try {
      setNanniesLoading(true);

      const response = await getNanniesService({
        page: nannyPage,
        limit: PAGE_SIZE,
      });

      if (response.status === "success") {
        setNannies(response.data.items);
        setNannyTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to fetch nannies"), "Error");
    } finally {
      setNanniesLoading(false);
    }
  }, [nannyPage]);

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab, fetchBookings]);

  useEffect(() => {
    if (activeTab === "nannies") {
      fetchNannies();
    }
  }, [activeTab, fetchNannies]);

  const handleBookingSearch = () => {
    setBookingPage(1);
    setAppliedBookingFilters({ ...bookingFilters });
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setCancelLoading(true);
      const response = await cancelBookingService(selectedBooking.id, {
        cancellation_reason: "Cancelled by admin",
      });

      if (response.status === "success") {
        showAlert(
          "success",
          response.message || "Booking cancelled successfully",
          "Success"
        );
        fetchBookings();
        setOpenCancelModal(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to cancel booking"), "Error");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleToggleNannyStatus = async () => {
    if (!selectedNanny) return;

    try {
      setNannyToggleLoading(true);
      const response = await updateNannyService(selectedNanny.id, {
        is_active: !selectedNanny.is_active,
      });

      if (response.status === "success") {
        showAlert(
          "success",
          response.message || "Nanny status updated successfully",
          "Success"
        );
        fetchNannies();
        setOpenNannyStatusModal(false);
        setSelectedNanny(null);
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to update nanny status"), "Error");
    } finally {
      setNannyToggleLoading(false);
    }
  };

  const bookingColumns = [
    { key: "id", header: "ID" },
    {
      key: "parent_name",
      header: "Parent",
      render: (value: string | null) => value || "-",
    },
    {
      key: "nanny_name",
      header: "Nanny",
      render: (value: string | null) => value || "-",
    },
    {
      key: "start_datetime",
      header: "Schedule",
      render: (_: unknown, row: Booking) => (
        <div className="min-w-[180px]">
          <p>{formatDateTime(row.start_datetime)}</p>
          <p className="text-theme-xs text-gray-400">{formatDateTime(row.end_datetime)}</p>
        </div>
      ),
    },
    {
      key: "total_charges_inr",
      header: "Amount",
      render: (value: number | null) => formatCurrency(value),
    },
    {
      key: "booking_status",
      header: "Booking Status",
      render: (value: BookingStatus) => (
        <Badge size="sm" color={getBookingStatusColor(value)}>
          <span className="capitalize">{value}</span>
        </Badge>
      ),
    },
    {
      key: "service_status",
      header: "Service Status",
      render: (value: BookingServiceStatus) => (
        <Badge size="sm" color="light">
          <span className="capitalize">{value.replace("_", " ")}</span>
        </Badge>
      ),
    },
  ];

  const bookingActions = [
    {
      label: "Cancel",
      variant: "outline" as const,
      hidden: (row: Booking) =>
        row.booking_status === "cancelled" || row.booking_status === "completed",
      onClick: (row: Booking) => {
        setSelectedBooking(row);
        setOpenCancelModal(true);
      },
    },
  ];

  const nannyColumns = [
    { key: "id", header: "ID" },
    {
      key: "first_name",
      header: "Name",
      render: (_: unknown, row: Nanny) => (
        <span className="capitalize">
          {row.first_name} {row.last_name}
        </span>
      ),
    },
    { key: "mobile_number", header: "Mobile" },
    {
      key: "experience",
      header: "Experience",
      render: (value: number) => `${value} Years`,
    },
    {
      key: "is_active",
      header: "Status",
      render: (value: boolean) => (
        <Badge size="sm" color={value ? "success" : "error"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const nannyActions = [
    {
      label: "Deactivate",
      variant: "outline" as const,
      hidden: (row: Nanny) => !row.is_active,
      onClick: (row: Nanny) => {
        setSelectedNanny(row);
        setOpenNannyStatusModal(true);
      },
    },
    {
      label: "Activate",
      variant: "outline" as const,
      hidden: (row: Nanny) => row.is_active,
      onClick: (row: Nanny) => {
        setSelectedNanny(row);
        setOpenNannyStatusModal(true);
      },
    },
  ];

  const tabButtonClass = (tab: TabKey) =>
    activeTab === tab
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <>
      <PageBreadcrumb pageTitle="Admin Operations" />

      <div className="space-y-6">
        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Admin Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage bookings and nanny availability from the admin portal.
              </p>
            </div>

            <div className="flex w-full max-w-md items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
              <button
                type="button"
                onClick={() => setActiveTab("bookings")}
                className={`w-full rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${tabButtonClass("bookings")}`}
              >
                Bookings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("nannies")}
                className={`w-full rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${tabButtonClass("nannies")}`}
              >
                Nanny Status
              </button>
            </div>
          </div>

          {activeTab === "bookings" ? (
            <>
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <select
                  className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  value={bookingFilters.status}
                  onChange={(e) =>
                    setBookingFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="">All Booking Statuses</option>
                  {BOOKING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  value={bookingFilters.service_status}
                  onChange={(e) =>
                    setBookingFilters((prev) => ({ ...prev, service_status: e.target.value }))
                  }
                >
                  <option value="">All Service Statuses</option>
                  {SERVICE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>

                <Button className="w-full sm:col-span-2 lg:col-span-1" onClick={handleBookingSearch}>
                  Search
                </Button>
              </div>

              <DynamicTable
                columns={bookingColumns}
                data={bookings}
                actions={bookingActions}
                loading={bookingsLoading}
                currentPage={bookingPage}
                totalPages={bookingTotalPages}
                onPageChange={setBookingPage}
                emptyMessage="No bookings found"
              />
            </>
          ) : (
            <DynamicTable
              columns={nannyColumns}
              data={nannies}
              actions={nannyActions}
              loading={nanniesLoading}
              currentPage={nannyPage}
              totalPages={nannyTotalPages}
              onPageChange={setNannyPage}
              emptyMessage="No nannies found"
            />
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={openCancelModal}
        title="Cancel Booking"
        description={`Cancel booking #${selectedBooking?.id ?? ""} for ${selectedBooking?.parent_name ?? "this parent"}?`}
        confirmLabel="Cancel Booking"
        confirmingLabel="Cancelling..."
        loading={cancelLoading}
        onClose={() => {
          setOpenCancelModal(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleCancelBooking}
      />

      <DeleteConfirmationModal
        isOpen={openNannyStatusModal}
        title={selectedNanny?.is_active ? "Deactivate Nanny" : "Activate Nanny"}
        description={
          selectedNanny?.is_active
            ? `Deactivate ${selectedNanny.first_name} ${selectedNanny.last_name}? They will not receive new bookings.`
            : `Activate ${selectedNanny?.first_name ?? ""} ${selectedNanny?.last_name ?? ""}?`
        }
        confirmLabel={selectedNanny?.is_active ? "Deactivate" : "Activate"}
        confirmingLabel="Updating..."
        loading={nannyToggleLoading}
        onClose={() => {
          setOpenNannyStatusModal(false);
          setSelectedNanny(null);
        }}
        onConfirm={handleToggleNannyStatus}
      />
    </>
  );
}
