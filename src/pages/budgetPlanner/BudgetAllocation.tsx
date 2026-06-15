/**
 * File: src/pages/budget/BudgetAllocations.tsx
 * Complete Budget Allocations Management page with list view, create/edit modal, and delete confirmation
 * Based on provided screenshots design
 */

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { useResourceData } from "@/hooks/useResourceData";
import {
  budgetAllocationHooks,
  budgetHooks,
  type BudgetAllocation as ApiBudgetAllocation,
} from "@/services/budgetPlanner";
import { fetchChartOfAccounts, type ChartAccount } from "@/services/doubleEntry";
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
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BudgetAllocation {
  id: string;
  budgetId: string;
  accountId: string;
  budget: string;
  account: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  createdAt: string;
}

// ─── Sample Data (offline fallback seed, API shape) ────────────────────────────

const sampleBudgetAllocations: ApiBudgetAllocation[] = [
  { id: "1", budget_id: { _id: "b1", budget_name: "Marketing Budget" }, account_id: { _id: "a1", name: "Cash" }, allocated_amount: 20000, spent_amount: 5000, createdAt: "2024-01-01" },
  { id: "2", budget_id: { _id: "b1", budget_name: "Marketing Budget" }, account_id: { _id: "a2", name: "Petty Cash" }, allocated_amount: 15000, spent_amount: 2500, createdAt: "2024-01-01" },
  { id: "3", budget_id: { _id: "b1", budget_name: "Marketing Budget" }, account_id: { _id: "a3", name: "Bank Account - Main" }, allocated_amount: 10000, spent_amount: 0, createdAt: "2024-01-01" },
  { id: "4", budget_id: { _id: "b1", budget_name: "Marketing Budget" }, account_id: { _id: "a4", name: "Bank Account - Savings" }, allocated_amount: 8000, spent_amount: 1200, createdAt: "2024-01-01" },
  { id: "5", budget_id: { _id: "b1", budget_name: "Marketing Budget" }, account_id: { _id: "a5", name: "Bank Account - Payroll" }, allocated_amount: 12000, spent_amount: 3500, createdAt: "2024-01-01" },
];

const refId = (v: any): string =>
  v && typeof v === "object" ? String(v._id ?? v.id ?? "") : String(v ?? "");
const refName = (v: any): string =>
  v && typeof v === "object" ? v.budget_name ?? v.name ?? v.account_name ?? "" : "";

function mapFromApi(a: any): BudgetAllocation {
  const allocated = Number(a.allocated_amount ?? a.allocatedAmount ?? 0);
  const spent = Number(a.spent_amount ?? a.spentAmount ?? 0);
  const remaining = Number(a.remaining_amount ?? a.remainingAmount ?? allocated - spent);
  return {
    id: String(a.id ?? a._id ?? ""),
    budgetId: refId(a.budget_id ?? a.budgetId),
    accountId: refId(a.account_id ?? a.accountId),
    budget: refName(a.budget_id ?? a.budgetId) || (typeof a.budget === "string" ? a.budget : ""),
    account: refName(a.account_id ?? a.accountId) || (typeof a.account === "string" ? a.account : ""),
    allocatedAmount: allocated,
    spentAmount: spent,
    remainingAmount: remaining,
    createdAt: (a.createdAt ?? a.created_at ?? "").slice(0, 10),
  };
}

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
  const {
    items: rawAllocations,
    create,
    update,
    remove,
  } = useResourceData(budgetAllocationHooks, {
    seed: sampleBudgetAllocations,
    params: { page: 1, limit: 100 },
  });
  const budgetAllocations = useMemo(
    () => rawAllocations.map(mapFromApi),
    [rawAllocations],
  );

  // Budget + account options for the form selects (fall back to static lists).
  const budgetQuery = budgetHooks.useList({ page: 1, limit: 100 }, { retry: 0 });
  const budgetOptions = useMemo(
    () =>
      (budgetQuery.data ?? []).map((b: any) => ({
        id: String(b.id ?? b._id ?? ""),
        name: b.budget_name ?? b.budgetName ?? "",
      })),
    [budgetQuery.data],
  );
  const [accountOptions, setAccountOptions] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    let active = true;
    fetchChartOfAccounts()
      .then((rows: ChartAccount[]) => {
        if (active)
          setAccountOptions(
            rows.map((r) => ({
              id: String(r.id ?? ""),
              name: r.name ?? r.account_name ?? r.account_code ?? "",
            })),
          );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
    budgetId: "",
    accountId: "",
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
      budgetId: "",
      accountId: "",
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
      budgetId: allocation.budgetId,
      accountId: allocation.accountId,
      allocatedAmount: allocation.allocatedAmount,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openDeleteModal = (allocation: BudgetAllocation) => {
    setSelectedAllocation(allocation);
    setShowDeleteModal(true);
  };

  const handleSaveAllocation = async () => {
    if (!allocationFormData.budgetId) {
      showToast("Please select a budget", "info");
      return;
    }
    if (!allocationFormData.accountId) {
      showToast("Please select an account", "info");
      return;
    }
    if (allocationFormData.allocatedAmount <= 0) {
      showToast("Please enter a valid allocated amount", "info");
      return;
    }

    const payload = {
      budget_id: allocationFormData.budgetId,
      account_id: allocationFormData.accountId,
      allocated_amount: allocationFormData.allocatedAmount,
    } as Partial<ApiBudgetAllocation>;

    try {
      if (isEditing && selectedAllocation) {
        await update(selectedAllocation.id, payload);
        showToast("Budget allocation updated successfully!", "success");
        setShowEditModal(false);
      } else {
        if (
          budgetAllocations.some(
            (a) =>
              a.budgetId === allocationFormData.budgetId &&
              a.accountId === allocationFormData.accountId,
          )
        ) {
          showToast(
            "Allocation for this budget and account already exists",
            "error",
          );
          return;
        }
        await create(payload);
        showToast("Budget allocation created successfully!", "success");
        setShowCreateModal(false);
      }
      resetAllocationForm();
    } catch {
      showToast("Could not save allocation. Please try again.", "error");
    }
  };

  const handleDeleteAllocation = async () => {
    if (!selectedAllocation) return;
    try {
      await remove(selectedAllocation.id);
      showToast("Budget allocation deleted successfully!", "success");
    } catch {
      showToast("Could not delete allocation.", "error");
    }
    setShowDeleteModal(false);
    setSelectedAllocation(null);
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
                value={allocationFormData.budgetId}
                onChange={(e) =>
                  setAllocationFormData({
                    ...allocationFormData,
                    budgetId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Budget</option>
                {budgetOptions.length > 0
                  ? budgetOptions.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))
                  : budgets.map((b) => (
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
                value={allocationFormData.accountId}
                onChange={(e) =>
                  setAllocationFormData({
                    ...allocationFormData,
                    accountId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Account</option>
                {accountOptions.length > 0
                  ? accountOptions.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))
                  : accounts.map((a) => (
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
