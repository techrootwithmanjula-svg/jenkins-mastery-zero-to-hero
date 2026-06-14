import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import DynamicTable from "../../components/tables/BasicTables/BasicTableOne";
import Badge from "../../components/ui/badge/Badge";
import Input from "../../components/form/input/InputField";
import CreateUserModal from "./CreateUserModal";
import CreateNannyModal from "./CreateNannyModal";
import { getUsersService } from "../../services/userService";
import { showAlert } from "../../services/alertService";
import { formatErrorMessage } from "../../utils/errors";
import { UserRole } from "../../types/entities";
import type { User as UserData } from "../../types/entities";

interface Filters {
  mobile: string;
  role: string;
  is_active: string;
}

export default function User() {
  const [openModal, setOpenModal] = useState(false);
  const [openNannyModal, setOpenNannyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const emptyFilters: Filters = {
    mobile: "",
    role: "",
    is_active: "",
  };

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(emptyFilters);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getUsersService({
        page,
        limit: 10,
        mobile: appliedFilters.mobile || undefined,
        role: appliedFilters.role ? (appliedFilters.role as UserRole) : undefined,
        is_active:
          appliedFilters.is_active === ""
            ? undefined
            : appliedFilters.is_active === "true",
      });

      if (response.status === "success") {
        setUsers(response.data.items);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to fetch users"), "Error");
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "mobile", header: "Mobile Number" },
    {
      key: "role",
      header: "Role",
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    {
      key: "is_verified",
      header: "Verified",
      render: (value: boolean) => (
        <Badge size="sm" color={value ? "success" : "error"}>
          {value ? "Yes" : "No"}
        </Badge>
      ),
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
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions = [
    {
      label: "Edit",
      variant: "outline" as const,
      onClick: (row: UserData) => {
        setSelectedUser(row);
        setOpenModal(true);
      },
    },
    {
      label: "Create Nanny",
      variant: "outline" as const,
      /** Only show for nanny-role users who haven't logged in yet */
      hidden: (row: UserData) =>
        row.last_login_at !== null || row.role === "admin" || row.role === "user",
      onClick: (row: UserData) => {
        setSelectedUserId(row.id);
        setOpenNannyModal(true);
      },
    },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Users" />

      <div className="space-y-6">
        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Users</h2>
            <Button
              onClick={() => {
                setSelectedUser(null);
                setOpenModal(true);
              }}
            >
              Create User
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Search Mobile"
              value={filters.mobile}
              onChange={(e) => handleFilterChange("mobile", e.target.value)}
            />

            <select
              className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="nanny">Nanny</option>
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

            <Button className="w-full" onClick={handleSearch}>
              Search
            </Button>
          </div>

          {/* Table */}
          <DynamicTable
            columns={columns}
            data={users}
            actions={actions}
            loading={loading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        {/* Create / Edit User */}
        <CreateUserModal
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            setSelectedUser(null);
          }}
          userData={selectedUser}
          onSuccess={fetchUsers}
        />

        {/* Create Nanny */}
        <CreateNannyModal
          isOpen={openNannyModal}
          onClose={() => setOpenNannyModal(false)}
          userId={selectedUserId ? Number(selectedUserId) : null}
          onSuccess={fetchUsers}
        />
      </div>
    </>
  );
}
