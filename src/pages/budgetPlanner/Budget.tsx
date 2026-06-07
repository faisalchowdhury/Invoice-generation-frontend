/**
 * File: src/pages/budget/Budget.tsx
 * Complete Budget Management page with list view, create/edit modal, and delete confirmation
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
  DollarSign,
  Calendar,
  Building2,
  Tag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Budget {
  id: string;
  budgetName: string;
  period: string;
  type: "Operational" | "Capital";
  amount: number;
  status: "Draft" | "Active" | "Closed" | "Approved";
  approvedBy: string;
  description: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleBudgets: Budget[] = [
  {
    id: "1",
    budgetName: "Marketing Budget",
    period: "Q1 2024 Budget",
    type: "Operational",
    amount: 50000.0,
    status: "Closed",
    approvedBy: "Matthew Clark",
    description: "Marketing expenses for Q1 2024",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    budgetName: "IT Infrastructure",
    period: "Q1 2024 Budget",
    type: "Operational",
    amount: 75000.0,
    status: "Closed",
    approvedBy: "Christopher Lee",
    description: "IT infrastructure upgrades",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    budgetName: "HR Operations",
    period: "Q1 2024 Budget",
    type: "Operational",
    amount: 30000.0,
    status: "Closed",
    approvedBy: "ABC Corporation",
    description: "HR operational expenses",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    budgetName: "Office Supplies",
    period: "Q1 2024 Budget",
    type: "Operational",
    amount: 15000.0,
    status: "Closed",
    approvedBy: "Advanced Materials",
    description: "Office supplies and stationery",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    budgetName: "Research & Development",
    period: "Q1 2024 Budget",
    type: "Capital",
    amount: 100000.0,
    status: "Closed",
    approvedBy: "Emily Davis",
    description: "R&D projects and initiatives",
    createdAt: "2024-01-01",
  },
];

const periods = [
  "Q1 2024 Budget",
  "Q2 2024 Budget",
  "Q3 2024 Budget",
  "Q4 2024 Budget",
  "Annual Budget 2024",
  "Q1 2025 Budget",
  "Q2 2025 Budget",
];

const budgetTypes = ["Operational", "Capital"];
const statuses = ["Draft", "Active", "Approved", "Closed"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "budgetName"
  | "period"
  | "type"
  | "amount"
  | "status"
  | "approvedBy";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Budget: React.FC = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("budgetName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [budgetFormData, setBudgetFormData] = useState({
    budgetName: "",
    period: "",
    type: "Operational" as "Operational" | "Capital",
    amount: 0,
    status: "Draft" as "Draft" | "Active" | "Approved" | "Closed",
    approvedBy: "",
    description: "",
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

  const filteredBudgets = useMemo(() => {
    let result = [...budgets];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.budgetName.toLowerCase().includes(q) ||
          b.period.toLowerCase().includes(q) ||
          b.approvedBy.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (typeFilter !== "All") {
      result = result.filter((b) => b.type === typeFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "amount") {
        aVal = a.amount;
        bVal = b.amount;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [budgets, searchQuery, statusFilter, typeFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredBudgets.length / perPage);
  const paginatedBudgets = filteredBudgets.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetBudgetForm = () => {
    setBudgetFormData({
      budgetName: "",
      period: "",
      type: "Operational",
      amount: 0,
      status: "Draft",
      approvedBy: "",
      description: "",
    });
  };

  const openCreateModal = () => {
    resetBudgetForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (budget: Budget) => {
    setSelectedBudget(budget);
    setBudgetFormData({
      budgetName: budget.budgetName,
      period: budget.period,
      type: budget.type,
      amount: budget.amount,
      status: budget.status,
      approvedBy: budget.approvedBy,
      description: budget.description,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openDeleteModal = (budget: Budget) => {
    setSelectedBudget(budget);
    setShowDeleteModal(true);
  };

  const handleSaveBudget = () => {
    if (!budgetFormData.budgetName) {
      showToast("Please enter budget name", "info");
      return;
    }
    if (!budgetFormData.period) {
      showToast("Please select a period", "info");
      return;
    }
    if (budgetFormData.amount <= 0) {
      showToast("Please enter a valid amount", "info");
      return;
    }

    if (isEditing && selectedBudget) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === selectedBudget.id
            ? {
                ...b,
                budgetName: budgetFormData.budgetName,
                period: budgetFormData.period,
                type: budgetFormData.type,
                amount: budgetFormData.amount,
                status: budgetFormData.status,
                approvedBy: budgetFormData.approvedBy || "System",
                description: budgetFormData.description,
              }
            : b,
        ),
      );
      showToast("Budget updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newBudget: Budget = {
        id: Date.now().toString(),
        budgetName: budgetFormData.budgetName,
        period: budgetFormData.period,
        type: budgetFormData.type,
        amount: budgetFormData.amount,
        status: budgetFormData.status,
        approvedBy: budgetFormData.approvedBy || "System",
        description: budgetFormData.description,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setBudgets((prev) => [newBudget, ...prev]);
      showToast("Budget created successfully!", "success");
      setShowCreateModal(false);
    }
    resetBudgetForm();
  };

  const handleDeleteBudget = () => {
    if (selectedBudget) {
      setBudgets((prev) => prev.filter((b) => b.id !== selectedBudget.id));
      showToast("Budget deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedBudget(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Approved":
        return "bg-blue-100 text-blue-700";
      case "Closed":
        return "bg-gray-100 text-gray-700";
      case "Draft":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-3 h-3" />;
      case "Approved":
        return <CheckCircle className="w-3 h-3" />;
      case "Closed":
        return <XCircle className="w-3 h-3" />;
      case "Draft":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Operational":
        return "bg-purple-100 text-purple-700";
      case "Capital":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
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
              {isEditing ? "Edit Budget" : "Create Budget"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing ? "Update budget information" : "Add a new budget"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetBudgetForm();
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
                Budget Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={budgetFormData.budgetName}
                onChange={(e) =>
                  setBudgetFormData({
                    ...budgetFormData,
                    budgetName: e.target.value,
                  })
                }
                placeholder="Enter Budget Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period <span className="text-red-500">*</span>
              </label>
              <select
                value={budgetFormData.period}
                onChange={(e) =>
                  setBudgetFormData({
                    ...budgetFormData,
                    period: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Period</option>
                {periods.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={budgetFormData.type}
                onChange={(e) =>
                  setBudgetFormData({
                    ...budgetFormData,
                    type: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {budgetTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={budgetFormData.amount || ""}
                  onChange={(e) =>
                    setBudgetFormData({
                      ...budgetFormData,
                      amount: parseFloat(e.target.value) || 0,
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
                value={budgetFormData.status}
                onChange={(e) =>
                  setBudgetFormData({
                    ...budgetFormData,
                    status: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approved By
              </label>
              <input
                type="text"
                value={budgetFormData.approvedBy}
                onChange={(e) =>
                  setBudgetFormData({
                    ...budgetFormData,
                    approvedBy: e.target.value,
                  })
                }
                placeholder="Enter approver name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={budgetFormData.description}
                onChange={(e) =>
                  setBudgetFormData({
                    ...budgetFormData,
                    description: e.target.value,
                  })
                }
                rows={3}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetBudgetForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveBudget}
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
            Delete Budget
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedBudget?.budgetName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteBudget}
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
          <span className="text-gray-900 font-medium">Budget</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Manage Budget</h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Budget"
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
                placeholder="Search Budgets..."
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
                      Status
                    </span>
                  </div>
                  {["All", "Draft", "Active", "Approved", "Closed"].map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setStatusFilter(st);
                          setCurrentPage(1);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${statusFilter === st ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}`}
                      >
                        {st}
                      </button>
                    ),
                  )}
                  <div className="px-3 pb-2 mt-2 mb-1 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">
                      Type
                    </span>
                  </div>
                  {["All", "Operational", "Capital"].map((tp) => (
                    <button
                      key={tp}
                      onClick={() => {
                        setTypeFilter(tp);
                        setCurrentPage(1);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${typeFilter === tp ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}`}
                    >
                      {tp}
                    </button>
                  ))}
                  <div className="px-3 pt-2">
                    <button
                      onClick={() => {
                        setStatusFilter("All");
                        setTypeFilter("All");
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className="w-full px-3 py-1.5 text-center text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Reset Filters
                    </button>
                  </div>
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
                <SortHeader field="budgetName" label="Budget Name" />
                <SortHeader field="period" label="Period" />
                <SortHeader field="type" label="Type" />
                <SortHeader field="amount" label="Amount" />
                <SortHeader field="status" label="Status" />
                <SortHeader field="approvedBy" label="Approved By" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedBudgets.map((budget) => (
                <tr key={budget.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {budget.budgetName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{budget.period}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(budget.type)}`}
                    >
                      {budget.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fmtCurrency(budget.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}
                    >
                      {getStatusIcon(budget.status)}
                      {budget.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {budget.approvedBy}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(budget)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(budget)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedBudgets.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No budgets found.
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
            {filteredBudgets.length === 0 ? 0 : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredBudgets.length)} of{" "}
            {filteredBudgets.length} results
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

// Add missing AlertCircle component
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
