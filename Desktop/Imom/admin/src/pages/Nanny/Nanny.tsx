import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import DynamicTable from "../../components/tables/BasicTables/BasicTableOne";
import Badge from "../../components/ui/badge/Badge";
import Input from "../../components/form/input/InputField";
import UpdateNannyModal from "./UpdateNannyModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { getNanniesService, deleteNannyService } from "../../services/nannyService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import { Gender } from "../../types/entities";
import type { Nanny as NannyData } from "../../types/entities";

interface Filters {
  mobile: string;
  gender: string;
  is_active: string;
  experience_min: string;
  experience_max: string;
}

export default function Nanny() {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [nannies, setNannies] = useState<NannyData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedNanny, setSelectedNanny] = useState<NannyData | null>(null);
  const emptyFilters: Filters = {
    mobile: "",
    gender: "",
    is_active: "",
    experience_min: "",
    experience_max: "",
  };

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(emptyFilters);

  const fetchNannies = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getNanniesService({
        page,
        limit: 10,
        mobile: appliedFilters.mobile || undefined,
        gender: appliedFilters.gender ? (appliedFilters.gender as Gender) : undefined,
        is_active:
          appliedFilters.is_active === ""
            ? undefined
            : appliedFilters.is_active === "true",
        experience_min: appliedFilters.experience_min
          ? Number(appliedFilters.experience_min)
          : undefined,
        experience_max: appliedFilters.experience_max
          ? Number(appliedFilters.experience_max)
          : undefined,
      });

      if (response.status === "success") {
        setNannies(response.data.items);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to fetch nannies"), "Error");
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters]);

  useEffect(() => {
    fetchNannies();
  }, [fetchNannies]);

  const handleSearch = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteNanny = async () => {
    if (!selectedNanny) return;

    try {
      setDeleteLoading(true);

      const response = await deleteNannyService(selectedNanny.id);

      if (response.status === "success") {
        showAlert(
          "success",
          response.message || "Nanny deleted successfully",
          "Success"
        );
        fetchNannies();
        setOpenDeleteModal(false);
        setSelectedNanny(null);
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to delete nanny"), "Error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "user_id", header: "User ID" },
    {
      key: "first_name",
      header: "Full Name",
      render: (_: unknown, row: NannyData) => (
        <div className="min-w-[180px]">
          <p className="font-medium capitalize">
            {row.first_name} {row.middle_name} {row.last_name}
          </p>
        </div>
      ),
    },
    {
      key: "dob",
      header: "DOB",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    { key: "mobile_number", header: "Mobile Number" },
    {
      key: "email_id",
      header: "Email",
      render: (value: string) => <div className="min-w-[220px]">{value}</div>,
    },
    {
      key: "gender",
      header: "Gender",
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    {
      key: "experience",
      header: "Experience",
      render: (value: number) => `${value} Years`,
    },
    { key: "aadhar_number", header: "Aadhaar" },
    { key: "pan_card", header: "PAN Card" },
    {
      key: "address",
      header: "Address",
      render: (value: string) => (
        <div className="min-w-[250px] whitespace-normal">{value}</div>
      ),
    },
    {
      key: "permanent_address",
      header: "Permanent Address",
      render: (value: string) => (
        <div className="min-w-[250px] whitespace-normal">{value}</div>
      ),
    },
    { key: "emergency_contact", header: "Emergency Contact" },
    {
      key: "certificates",
      header: "Certificates",
      render: (value: string[]) =>
        value?.length ? `${value.length} Uploaded` : "No Certificates",
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
    {
      key: "created_at",
      header: "Created At",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: "updated_at",
      header: "Updated At",
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  const actions = [
    {
      label: "Edit",
      variant: "outline" as const,
      onClick: (row: NannyData) => {
        setSelectedNanny(row);
        setOpenEditModal(true);
      },
    },
    {
      label: "Delete",
      variant: "outline" as const,
      onClick: (row: NannyData) => {
        setSelectedNanny(row);
        setOpenDeleteModal(true);
      },
    },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Nannies" />

      <div className="space-y-5 sm:space-y-6">
        {/* Full-width card — layout sizing is the responsibility of AppLayout */}
        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Nannies</h2>
          </div>

          {/* Filters */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              placeholder="Search Mobile"
              value={filters.mobile}
              onChange={(e) => handleFilterChange("mobile", e.target.value)}
            />

            <select
              className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
            >
              <option value="">All Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select
              className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              value={filters.is_active}
              onChange={(e) => handleFilterChange("is_active", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <Input
              type="number"
              placeholder="Min Exp"
              value={filters.experience_min}
              onChange={(e) => handleFilterChange("experience_min", e.target.value)}
            />

            <Input
              type="number"
              placeholder="Max Exp"
              value={filters.experience_max}
              onChange={(e) => handleFilterChange("experience_max", e.target.value)}
            />

            <Button className="w-full" onClick={handleSearch}>
              Search
            </Button>
          </div>

          <DynamicTable
            columns={columns}
            data={nannies}
            actions={actions}
            loading={loading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Update Modal */}
      <UpdateNannyModal
        isOpen={openEditModal}
        nannyData={selectedNanny}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedNanny(null);
        }}
        onSuccess={fetchNannies}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        title="Delete Nanny"
        description={`Are you sure you want to delete ${selectedNanny?.first_name ?? ""} ${selectedNanny?.last_name ?? ""}?`}
        loading={deleteLoading}
        onClose={() => {
          setOpenDeleteModal(false);
          setSelectedNanny(null);
        }}
        onConfirm={handleDeleteNanny}
      />
    </>
  );
}
