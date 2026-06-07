/**
 * File: src/pages/budget/BudgetAllocations.tsx
 * Complete Budget Allocations Management page with list view, create/edit modal, and delete confirmation
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
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BudgetAllocation {
  id: string;
  budget: string;
  account: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleBudgetAllocations: BudgetAllocation[] = [
  {
    id: "1",
    budget: "Marketing Budget",
    account: "Cash",
    allocatedAmount: 20000.0,
    spentAmount: 5000.0,
    remainingAmount: 15000.0,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    budget: "Marketing Budget",
    account: "Petty Cash",
    allocatedAmount: 15000.0,
    spentAmount: 2500.0,
    remainingAmount: 12500.0,
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    budget: "Marketing Budget",
    account: "Bank Account - Main",
    allocatedAmount: 10000.0,
    spentAmount: 0.0,
    remainingAmount: 10000.0,
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    budget: "Marketing Budget",
    account: "Bank Account - Savings",
    allocatedAmount: 8000.0,
    spentAmount: 1200.0,
    remainingAmount: 6800.0,
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    budget: "Marketing Budget",
    account: "Bank Account - Payroll",
    allocatedAmount: 12000.0,
    spentAmount: 3500.0,
    remainingAmount: 8500.0,
    createdAt: "2024-01-01",
  },
];

const budgets = [
  "Marketing Budget",
  "IT Infrastructure",
  "HR Operations",
  "Office Supplies",
  "Research & Development",
  "Sales Budget",
  "Operations Budget",
];

const accounts = [
  "Cash",
  "Petty Cash",
  "Bank Account - Main",
  "Bank Account - Savings",
  "Bank Account - Payroll",
  "Credit Card Account",
  "Investment Account",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "budget"
  | "account"
  | "allocatedAmount"
  | "spentAmount"
  | "remainingAmount";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const BudgetAllocations: React.FC = () => {
  const navigate = useNavigate();
  const [budgetAllocations, setBudgetAllocations] = useState<
    BudgetAllocation[]
  >(sampleBudgetAllocations);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("budget");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [budgetFilter, setBudgetFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAllocation, setSelectedAllocation] =
    useState<BudgetAllocation | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [allocationFormData, setAllocationFormData] = useState({
    budget: "",
    account: "",
    allocatedAmount: 0,
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

  const filteredAllocations = useMemo(() => {
    let result = [...budgetAllocations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.budget.toLowerCase().includes(q) ||
          a.account.toLowerCase().includes(q),
      );
    }

    if (budgetFilter !== "All") {
      result = result.filter((a) => a.budget === budgetFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (
        sortField === "allocatedAmount" ||
        sortField === "spentAmount" ||
        sortField === "remainingAmount"
      ) {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [budgetAllocations, searchQuery, budgetFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredAllocations.length / perPage);
  const paginatedAllocations = filteredAllocations.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetAllocationForm = () => {
    setAllocationFormData({
      budget: "",
      account: "",
      allocatedAmount: 0,
    });
  };

  const openCreateModal = () => {
    resetAllocationForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (allocation: BudgetAllocation) => {
    setSelectedAllocation(allocation);
    setAllocationFormData({
      budget: allocation.budget,
      account: allocation.account,
      allocatedAmount: allocation.allocatedAmount,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openDeleteModal = (allocation: BudgetAllocation) => {
    setSelectedAllocation(allocation);
    setShowDeleteModal(true);
  };

  const handleSaveAllocation = () => {
    if (!allocationFormData.budget) {
      showToast("Please select a budget", "info");
      return;
    }
    if (!allocationFormData.account) {
      showToast("Please select an account", "info");
      return;
    }
    if (allocationFormData.allocatedAmount <= 0) {
      showToast("Please enter a valid allocated amount", "info");
      return;
    }

    if (isEditing && selectedAllocation) {
      // Calculate new spent amount and remaining amount
      const oldAllocated = selectedAllocation.allocatedAmount;
      const newAllocated = allocationFormData.allocatedAmount;
      const spentAmount = selectedAllocation.spentAmount;
      const remainingAmount = newAllocated - spentAmount;

      setBudgetAllocations((prev) =>
        prev.map((a) =>
          a.id === selectedAllocation.id
            ? {
                ...a,
                budget: allocationFormData.budget,
                account: allocationFormData.account,
                allocatedAmount: allocationFormData.allocatedAmount,
                remainingAmount: remainingAmount,
              }
            : a,
        ),
      );
      showToast("Budget allocation updated successfully!", "success");
      setShowEditModal(false);
    } else {
      // Check for duplicate (same budget and account)
      if (
        budgetAllocations.some(
          (a) =>
            a.budget === allocationFormData.budget &&
            a.account === allocationFormData.account,
        )
      ) {
        showToast(
          "Allocation for this budget and account already exists",
          "error",
        );
        return;
      }

      const newAllocation: BudgetAllocation = {
        id: Date.now().toString(),
        budget: allocationFormData.budget,
        account: allocationFormData.account,
        allocatedAmount: allocationFormData.allocatedAmount,
        spentAmount: 0,
        remainingAmount: allocationFormData.allocatedAmount,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setBudgetAllocations((prev) => [newAllocation, ...prev]);
      showToast("Budget allocation created successfully!", "success");
      setShowCreateModal(false);
    }
    resetAllocationForm();
  };

  const handleDeleteAllocation = () => {
    if (selectedAllocation) {
      setBudgetAllocations((prev) =>
        prev.filter((a) => a.id !== selectedAllocation.id),
      );
      showToast("Budget allocation deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedAllocation(null);
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
              {isEditing
                ? "Edit Budget Allocation"
                : "Create Budget Allocation"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update budget allocation information"
                : "Add a new budget allocation"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetAllocationForm();
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
                Budget <span className="text-red-500">*</span>
              </label>
              <select
                value={allocationFormData.budget}
                onChange={(e) =>
                  setAllocationFormData({
                    ...allocationFormData,
                    budget: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Budget</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account <span className="text-red-500">*</span>
              </label>
              <select
                value={allocationFormData.account}
                onChange={(e) =>
                  setAllocationFormData({
                    ...allocationFormData,
                    account: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Account</option>
                {accounts.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allocated Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={allocationFormData.allocatedAmount || ""}
                  onChange={(e) =>
                    setAllocationFormData({
                      ...allocationFormData,
                      allocatedAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Preview Section for Edit Mode */}
          {isEditing && selectedAllocation && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Current Spending
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent Amount</span>
                  <span className="font-medium text-orange-600">
                    {fmtCurrency(selectedAllocation.spentAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Remaining</span>
                  <span className="font-medium text-green-600">
                    {fmtCurrency(selectedAllocation.remainingAmount)}
                  </span>
                </div>
                {allocationFormData.allocatedAmount !==
                  selectedAllocation.allocatedAmount && (
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600">New Remaining</span>
                    <span className="font-medium text-blue-600">
                      {fmtCurrency(
                        allocationFormData.allocatedAmount -
                          selectedAllocation.spentAmount,
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetAllocationForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAllocation}
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
            Delete Budget Allocation
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete this allocation for{" "}
            <span className="font-semibold">{selectedAllocation?.budget}</span>{" "}
            -{" "}
            <span className="font-semibold">{selectedAllocation?.account}</span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteAllocation}
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
            Budget Planner
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Budget Allocations</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Budget Allocations
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Budget Allocation"
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
                placeholder="Search Budget Allocations..."
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
                <div className="absolute right-0 top-10 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-3 pb-2 mb-1 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">
                      Budget
                    </span>
                  </div>
                  {["All", ...budgets].map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        setBudgetFilter(b);
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${budgetFilter === b ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}`}
                    >
                      {b}
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
                <SortHeader field="budget" label="Budget" />
                <SortHeader field="account" label="Account" />
                <SortHeader field="allocatedAmount" label="Allocated Amount" />
                <SortHeader field="spentAmount" label="Spent Amount" />
                <SortHeader field="remainingAmount" label="Remaining Amount" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedAllocations.map((allocation) => (
                <tr key={allocation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {allocation.budget}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {allocation.account}
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-600">
                    {fmtCurrency(allocation.allocatedAmount)}
                  </td>
                  <td className="px-4 py-3 font-medium text-orange-600">
                    {fmtCurrency(allocation.spentAmount)}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-600">
                    {fmtCurrency(allocation.remainingAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(allocation)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(allocation)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedAllocations.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No budget allocations found.
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
            {filteredAllocations.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredAllocations.length)} of{" "}
            {filteredAllocations.length} results
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
