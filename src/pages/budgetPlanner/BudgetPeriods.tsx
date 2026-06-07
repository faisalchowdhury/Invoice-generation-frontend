/**
 * File: src/pages/budget/BudgetPeriods.tsx
 * Complete Budget Periods Management page with list view, create/edit modal, and delete confirmation
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  X,
  CheckCircle,
  XCircle,
  Calendar,
  Building2,
  DollarSign,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BudgetPeriod {
  id: string;
  periodName: string;
  financialYear: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive" | "Closed";
  approvedBy: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleBudgetPeriods: BudgetPeriod[] = [
  {
    id: "1",
    periodName: "Q1 2024 Budget",
    financialYear: "2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "Active",
    approvedBy: "Express Suppliers",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    periodName: "Q2 2024 Budget",
    financialYear: "2024",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    status: "Active",
    approvedBy: "ABC Corporation",
    createdAt: "2024-04-01",
  },
  {
    id: "3",
    periodName: "Q3 2024 Budget",
    financialYear: "2024",
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    status: "Active",
    approvedBy: "Robert Taylor",
    createdAt: "2024-07-01",
  },
  {
    id: "4",
    periodName: "Q4 2024 Budget",
    financialYear: "2024",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    status: "Active",
    approvedBy: "ABC Corporation",
    createdAt: "2024-10-01",
  },
  {
    id: "5",
    periodName: "Annual Budget 2024",
    financialYear: "2024",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Active",
    approvedBy: "Anthony Walker",
    createdAt: "2024-01-01",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SortField =
  | "periodName"
  | "financialYear"
  | "startDate"
  | "endDate"
  | "status"
  | "approvedBy";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const BudgetPeriods: React.FC = () => {
  const navigate = useNavigate();
  const [budgetPeriods, setBudgetPeriods] =
    useState<BudgetPeriod[]>(sampleBudgetPeriods);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("periodName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBudgetPeriod, setSelectedBudgetPeriod] =
    useState<BudgetPeriod | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [budgetPeriodFormData, setBudgetPeriodFormData] = useState({
    periodName: "",
    financialYear: new Date().getFullYear().toString(),
    startDate: "",
    endDate: "",
    status: "Active" as "Active" | "Inactive" | "Closed",
    approvedBy: "",
  });

  // ─── Sorting ────────────────────────────────────────────────────────────────

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  // ─── Filtered & Sorted ─────────────────────────────────────────────────────

  const filteredBudgetPeriods = useMemo(() => {
    let result = [...budgetPeriods];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.periodName.toLowerCase().includes(q) ||
          b.financialYear.toLowerCase().includes(q) ||
          b.approvedBy.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((b) => b.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [budgetPeriods, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredBudgetPeriods.length / perPage);
  const paginatedBudgetPeriods = filteredBudgetPeriods.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetBudgetPeriodForm = () => {
    setBudgetPeriodFormData({
      periodName: "",
      financialYear: new Date().getFullYear().toString(),
      startDate: "",
      endDate: "",
      status: "Active",
      approvedBy: "",
    });
  };

  const openCreateModal = () => {
    resetBudgetPeriodForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (budgetPeriod: BudgetPeriod) => {
    setSelectedBudgetPeriod(budgetPeriod);
    setBudgetPeriodFormData({
      periodName: budgetPeriod.periodName,
      financialYear: budgetPeriod.financialYear,
      startDate: budgetPeriod.startDate,
      endDate: budgetPeriod.endDate,
      status: budgetPeriod.status,
      approvedBy: budgetPeriod.approvedBy,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openDeleteModal = (budgetPeriod: BudgetPeriod) => {
    setSelectedBudgetPeriod(budgetPeriod);
    setShowDeleteModal(true);
  };

  const handleSaveBudgetPeriod = () => {
    if (!budgetPeriodFormData.periodName) {
      showToast("Please enter period name", "info");
      return;
    }
    if (!budgetPeriodFormData.financialYear) {
      showToast("Please enter financial year", "info");
      return;
    }
    if (!budgetPeriodFormData.startDate) {
      showToast("Please select start date", "info");
      return;
    }
    if (!budgetPeriodFormData.endDate) {
      showToast("Please select end date", "info");
      return;
    }
    if (budgetPeriodFormData.startDate > budgetPeriodFormData.endDate) {
      showToast("Start date cannot be after end date", "error");
      return;
    }

    if (isEditing && selectedBudgetPeriod) {
      setBudgetPeriods((prev) =>
        prev.map((b) =>
          b.id === selectedBudgetPeriod.id
            ? {
                ...b,
                periodName: budgetPeriodFormData.periodName,
                financialYear: budgetPeriodFormData.financialYear,
                startDate: budgetPeriodFormData.startDate,
                endDate: budgetPeriodFormData.endDate,
                status: budgetPeriodFormData.status,
                approvedBy: budgetPeriodFormData.approvedBy,
              }
            : b,
        ),
      );
      showToast("Budget period updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newBudgetPeriod: BudgetPeriod = {
        id: Date.now().toString(),
        periodName: budgetPeriodFormData.periodName,
        financialYear: budgetPeriodFormData.financialYear,
        startDate: budgetPeriodFormData.startDate,
        endDate: budgetPeriodFormData.endDate,
        status: budgetPeriodFormData.status,
        approvedBy: budgetPeriodFormData.approvedBy || "System",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setBudgetPeriods((prev) => [newBudgetPeriod, ...prev]);
      showToast("Budget period created successfully!", "success");
      setShowCreateModal(false);
    }
    resetBudgetPeriodForm();
  };

  const handleDeleteBudgetPeriod = () => {
    if (selectedBudgetPeriod) {
      setBudgetPeriods((prev) =>
        prev.filter((b) => b.id !== selectedBudgetPeriod.id),
      );
      showToast("Budget period deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedBudgetPeriod(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-yellow-100 text-yellow-700";
      case "Closed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-3 h-3" />;
      case "Inactive":
        return <AlertCircle className="w-3 h-3" />;
      case "Closed":
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // ─── Sort Header ────────────────────────────────────────────────────────────

  const SortHeader: React.FC<{ field: SortField; label: string }> = ({
    field,
    label,
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer select-none hover:bg-gray-50 whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`w-3 h-3 ${sortField === field ? "text-gray-900" : "text-gray-400"}`}
        />
      </div>
    </th>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MODALS
  // ═══════════════════════════════════════════════════════════════════════════

  const CreateEditModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Budget Period" : "Create Budget Period"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update budget period information"
                : "Add a new budget period"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetBudgetPeriodForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={budgetPeriodFormData.periodName}
                onChange={(e) =>
                  setBudgetPeriodFormData({
                    ...budgetPeriodFormData,
                    periodName: e.target.value,
                  })
                }
                placeholder="Enter Period Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Financial Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={budgetPeriodFormData.financialYear}
                onChange={(e) =>
                  setBudgetPeriodFormData({
                    ...budgetPeriodFormData,
                    financialYear: e.target.value,
                  })
                }
                placeholder="Enter Financial Year (e.g., 2024)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={budgetPeriodFormData.startDate}
                  onChange={(e) =>
                    setBudgetPeriodFormData({
                      ...budgetPeriodFormData,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={budgetPeriodFormData.endDate}
                  onChange={(e) =>
                    setBudgetPeriodFormData({
                      ...budgetPeriodFormData,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={budgetPeriodFormData.status}
                onChange={(e) =>
                  setBudgetPeriodFormData({
                    ...budgetPeriodFormData,
                    status: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approved By
              </label>
              <input
                type="text"
                value={budgetPeriodFormData.approvedBy}
                onChange={(e) =>
                  setBudgetPeriodFormData({
                    ...budgetPeriodFormData,
                    approvedBy: e.target.value,
                  })
                }
                placeholder="Enter approver name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetBudgetPeriodForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveBudgetPeriod}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

  const DeleteModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Budget Period
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedBudgetPeriod?.periodName}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteBudgetPeriod}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate("/")}
            className="hover:text-gray-700"
          >
            Dashboard
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/budget-planner")}
            className="hover:text-gray-700"
          >
            Budget
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Budget Periods</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Budget Periods
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Budget Period"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Budget Periods..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-80 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => showToast("Search applied", "info")}
              className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Filters</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showFilters && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 pb-1.5 mb-1 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">
                      Status
                    </span>
                  </div>
                  {["All", "Active", "Inactive", "Closed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setStatusFilter(st);
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${statusFilter === st ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="periodName" label="Period Name" />
                <SortHeader field="financialYear" label="Financial Year" />
                <SortHeader field="startDate" label="Start Date" />
                <SortHeader field="endDate" label="End Date" />
                <SortHeader field="status" label="Status" />
                <SortHeader field="approvedBy" label="Approved By" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedBudgetPeriods.map((budgetPeriod) => (
                <tr key={budgetPeriod.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {budgetPeriod.periodName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {budgetPeriod.financialYear}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {budgetPeriod.startDate}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {budgetPeriod.endDate}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(budgetPeriod.status)}`}
                    >
                      {getStatusIcon(budgetPeriod.status)}
                      {budgetPeriod.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {budgetPeriod.approvedBy}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(budgetPeriod)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(budgetPeriod)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedBudgetPeriods.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No budget periods found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {filteredBudgetPeriods.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredBudgetPeriods.length)}{" "}
            of {filteredBudgetPeriods.length} results
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 text-sm rounded-md flex items-center justify-center ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(showCreateModal || showEditModal) && <CreateEditModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

// Add missing AlertCircle import
const AlertCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
