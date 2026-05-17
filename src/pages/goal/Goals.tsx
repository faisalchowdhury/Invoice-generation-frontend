/**
 * File: src/pages/goals/Goals.tsx
 * Complete Goals Management page with list view, create/edit modal, and details modal
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
  Eye,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Flag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Goal {
  id: string;
  goalName: string;
  category: string;
  goalType: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  targetDate: string;
  startDate: string;
  priority: "High" | "Medium" | "Low" | "Critical";
  status: "Draft" | "Active" | "Completed" | "Cancelled";
  chartOfAccount: string;
  description: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleGoals: Goal[] = [
  {
    id: "1",
    goalName: "Emergency Fund",
    category: "Financial",
    goalType: "Savings",
    targetAmount: 50000,
    currentAmount: 15000,
    progress: 30,
    targetDate: "2024-12-31",
    startDate: "2024-01-01",
    priority: "High",
    status: "Draft",
    chartOfAccount: "",
    description: "Build an emergency fund to cover 6 months of expenses",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    goalName: "Investment Portfolio",
    category: "Financial",
    goalType: "Expense reduction",
    targetAmount: 100000,
    currentAmount: 25000,
    progress: 25,
    targetDate: "2025-02-01",
    startDate: "2024-02-01",
    priority: "Medium",
    status: "Active",
    chartOfAccount: "",
    description: "Diversify investment portfolio with stocks and bonds.",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    goalName: "Credit Card Debt",
    category: "Financial",
    goalType: "Debt reduction",
    targetAmount: 8000,
    currentAmount: 3000,
    progress: 38,
    targetDate: "2024-08-15",
    startDate: "2024-01-15",
    priority: "Critical",
    status: "Active",
    chartOfAccount: "",
    description: "Pay off all credit card debt",
    createdAt: "2024-01-15",
  },
  {
    id: "4",
    goalName: "Annual Revenue Target",
    category: "Financial",
    goalType: "Revenue growth",
    targetAmount: 500000,
    currentAmount: 125000,
    progress: 25,
    targetDate: "2024-12-31",
    startDate: "2024-01-01",
    priority: "High",
    status: "Draft",
    chartOfAccount: "",
    description: "Achieve annual revenue target",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    goalName: "Operational Cost Reduction",
    category: "Financial",
    goalType: "Cost reduction",
    targetAmount: 12000,
    currentAmount: 4000,
    progress: 33,
    targetDate: "2024-09-01",
    startDate: "2024-03-01",
    priority: "Medium",
    status: "Active",
    chartOfAccount: "",
    description: "Reduce operational costs through efficiency",
    createdAt: "2024-03-01",
  },
  {
    id: "6",
    goalName: "Vacation Fund",
    category: "Financial",
    goalType: "Savings",
    targetAmount: 15000,
    currentAmount: 8000,
    progress: 53,
    targetDate: "2024-06-30",
    startDate: "2024-01-01",
    priority: "Low",
    status: "Draft",
    chartOfAccount: "",
    description: "Save for family vacation",
    createdAt: "2024-01-01",
  },
  {
    id: "7",
    goalName: "Retirement Savings",
    category: "Financial",
    goalType: "Savings",
    targetAmount: 200000,
    currentAmount: 45000,
    progress: 23,
    targetDate: "2026-12-31",
    startDate: "2024-01-01",
    priority: "High",
    status: "Active",
    chartOfAccount: "",
    description: "Save for retirement",
    createdAt: "2024-01-01",
  },
  {
    id: "8",
    goalName: "Home Down Payment",
    category: "Financial",
    goalType: "Savings",
    targetAmount: 80000,
    currentAmount: 20000,
    progress: 25,
    targetDate: "2025-06-30",
    startDate: "2024-01-01",
    priority: "High",
    status: "Draft",
    chartOfAccount: "",
    description: "Save for down payment on a home",
    createdAt: "2024-01-01",
  },
  {
    id: "9",
    goalName: "Student Loan Payoff",
    category: "Financial",
    goalType: "Debt reduction",
    targetAmount: 25000,
    currentAmount: 10000,
    progress: 40,
    targetDate: "2025-12-31",
    startDate: "2024-01-01",
    priority: "Medium",
    status: "Active",
    chartOfAccount: "",
    description: "Pay off student loans",
    createdAt: "2024-01-01",
  },
];

const categories = ["Financial", "Business", "Personal", "Health", "Education"];
const goalTypes = [
  "Savings",
  "Debt reduction",
  "Expense reduction",
  "Revenue growth",
  "Cost reduction",
  "Investment",
];
const priorities = ["High", "Medium", "Low", "Critical"];
const statuses = ["Draft", "Active", "Completed", "Cancelled"];
const chartOfAccounts = [
  "None",
  "1000 - Cash",
  "2000 - Accounts Receivable",
  "3000 - Inventory",
  "4000 - Revenue",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "goalName"
  | "category"
  | "goalType"
  | "targetAmount"
  | "currentAmount"
  | "progress"
  | "targetDate"
  | "priority"
  | "status";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Goals: React.FC = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("goalName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [goalFormData, setGoalFormData] = useState({
    goalName: "",
    category: "",
    goalType: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
    startDate: new Date().toISOString().split("T")[0],
    priority: "Medium" as "High" | "Medium" | "Low" | "Critical",
    status: "Draft" as "Draft" | "Active" | "Completed" | "Cancelled",
    chartOfAccount: "",
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

  const filteredGoals = useMemo(() => {
    let result = [...goals];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.goalName.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.goalType.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((g) => g.status === statusFilter);
    }

    if (priorityFilter !== "All") {
      result = result.filter((g) => g.priority === priorityFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (
        sortField === "targetAmount" ||
        sortField === "currentAmount" ||
        sortField === "progress"
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
  }, [goals, searchQuery, statusFilter, priorityFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredGoals.length / perPage);
  const paginatedGoals = filteredGoals.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetGoalForm = () => {
    setGoalFormData({
      goalName: "",
      category: "",
      goalType: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: "",
      startDate: new Date().toISOString().split("T")[0],
      priority: "Medium",
      status: "Draft",
      chartOfAccount: "",
      description: "",
    });
  };

  const calculateProgress = (current: number, target: number): number => {
    if (target === 0) return 0;
    return Math.round((current / target) * 100);
  };

  const openCreateModal = () => {
    resetGoalForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setGoalFormData({
      goalName: goal.goalName,
      category: goal.category,
      goalType: goal.goalType,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
      startDate: goal.startDate,
      priority: goal.priority,
      status: goal.status,
      chartOfAccount: goal.chartOfAccount,
      description: goal.description,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowViewModal(true);
  };

  const openDeleteModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowDeleteModal(true);
  };

  const handleSaveGoal = () => {
    if (!goalFormData.goalName) {
      showToast("Please enter goal name", "info");
      return;
    }
    if (!goalFormData.category) {
      showToast("Please select a category", "info");
      return;
    }
    if (!goalFormData.targetDate) {
      showToast("Please select target date", "info");
      return;
    }
    if (goalFormData.targetAmount <= 0) {
      showToast("Please enter a valid target amount", "info");
      return;
    }

    const progress = calculateProgress(
      goalFormData.currentAmount,
      goalFormData.targetAmount,
    );

    if (isEditing && selectedGoal) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === selectedGoal.id
            ? {
                ...g,
                goalName: goalFormData.goalName,
                category: goalFormData.category,
                goalType: goalFormData.goalType,
                targetAmount: goalFormData.targetAmount,
                currentAmount: goalFormData.currentAmount,
                progress: progress,
                targetDate: goalFormData.targetDate,
                startDate: goalFormData.startDate,
                priority: goalFormData.priority,
                status: goalFormData.status,
                chartOfAccount: goalFormData.chartOfAccount,
                description: goalFormData.description,
              }
            : g,
        ),
      );
      showToast("Goal updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        goalName: goalFormData.goalName,
        category: goalFormData.category,
        goalType: goalFormData.goalType,
        targetAmount: goalFormData.targetAmount,
        currentAmount: goalFormData.currentAmount,
        progress: progress,
        targetDate: goalFormData.targetDate,
        startDate: goalFormData.startDate,
        priority: goalFormData.priority,
        status: goalFormData.status,
        chartOfAccount: goalFormData.chartOfAccount,
        description: goalFormData.description,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setGoals((prev) => [newGoal, ...prev]);
      showToast("Goal created successfully!", "success");
      setShowCreateModal(false);
    }
    resetGoalForm();
  };

  const handleDeleteGoal = () => {
    if (selectedGoal) {
      setGoals((prev) => prev.filter((g) => g.id !== selectedGoal.id));
      showToast("Goal deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedGoal(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Draft":
        return "bg-gray-100 text-gray-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-3 h-3" />;
      case "Draft":
        return <Clock className="w-3 h-3" />;
      case "Completed":
        return <CheckCircle className="w-3 h-3" />;
      case "Cancelled":
        return <X className="w-3 h-3" />;
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Goal" : "Create Goal"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update goal information"
                : "Create a new financial goal"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetGoalForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={goalFormData.goalName}
                onChange={(e) =>
                  setGoalFormData({ ...goalFormData, goalName: e.target.value })
                }
                placeholder="Enter goal name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={goalFormData.category}
                onChange={(e) =>
                  setGoalFormData({ ...goalFormData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Type
              </label>
              <select
                value={goalFormData.goalType}
                onChange={(e) =>
                  setGoalFormData({ ...goalFormData, goalType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Goal Type</option>
                {goalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={goalFormData.priority}
                onChange={(e) =>
                  setGoalFormData({
                    ...goalFormData,
                    priority: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={goalFormData.status}
                onChange={(e) =>
                  setGoalFormData({
                    ...goalFormData,
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
                Chart of Account
              </label>
              <select
                value={goalFormData.chartOfAccount}
                onChange={(e) =>
                  setGoalFormData({
                    ...goalFormData,
                    chartOfAccount: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {chartOfAccounts.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={goalFormData.targetAmount || ""}
                  onChange={(e) =>
                    setGoalFormData({
                      ...goalFormData,
                      targetAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={goalFormData.currentAmount || ""}
                  onChange={(e) =>
                    setGoalFormData({
                      ...goalFormData,
                      currentAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={goalFormData.startDate}
                  onChange={(e) =>
                    setGoalFormData({
                      ...goalFormData,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={goalFormData.targetDate}
                  onChange={(e) =>
                    setGoalFormData({
                      ...goalFormData,
                      targetDate: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={goalFormData.description}
                onChange={(e) =>
                  setGoalFormData({
                    ...goalFormData,
                    description: e.target.value,
                  })
                }
                rows={3}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
              />
            </div>
          </div>

          {/* Progress Preview */}
          {goalFormData.targetAmount > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Progress Preview</span>
                <span className="text-sm font-medium text-blue-600">
                  {calculateProgress(
                    goalFormData.currentAmount,
                    goalFormData.targetAmount,
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${calculateProgress(goalFormData.currentAmount, goalFormData.targetAmount)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Current: {fmtCurrency(goalFormData.currentAmount)}</span>
                <span>Target: {fmtCurrency(goalFormData.targetAmount)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetGoalForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveGoal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

  const ViewModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Goal Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedGoal?.goalName}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {selectedGoal && (
          <div className="p-6">
            {/* Goal Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Goal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Goal Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedGoal.goalName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm text-gray-600">
                    {selectedGoal.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Goal Type</p>
                  <p className="text-sm text-gray-600">
                    {selectedGoal.goalType || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Priority</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedGoal.priority)}`}
                  >
                    <Flag className="w-3 h-3" />
                    {selectedGoal.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedGoal.status)}`}
                  >
                    {getStatusIcon(selectedGoal.status)}
                    {selectedGoal.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Chart of Account</p>
                  <p className="text-sm text-gray-600">
                    {selectedGoal.chartOfAccount || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm text-gray-600">
                    {selectedGoal.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Target Date</p>
                  <p className="text-sm text-gray-600">
                    {selectedGoal.targetDate}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm text-gray-600">
                    {selectedGoal.description || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Progress */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Financial Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-blue-600">Target Amount</p>
                  <p className="text-lg font-bold text-blue-700">
                    {fmtCurrency(selectedGoal.targetAmount)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-green-600">Current Amount</p>
                  <p className="text-lg font-bold text-green-700">
                    {fmtCurrency(selectedGoal.currentAmount)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-purple-600">Progress</p>
                  <p className="text-lg font-bold text-purple-700">
                    {selectedGoal.progress}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${selectedGoal.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowViewModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              setShowViewModal(false);
              if (selectedGoal) openEditModal(selectedGoal);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Goal
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
            Delete Goal
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedGoal?.goalName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteGoal}
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
            onClick={() => navigate("/dashboard")}
            className="hover:text-gray-700"
          >
            Dashboard
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/goal")}
            className="hover:text-gray-700"
          >
            Goal
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Goals</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Manage Goals</h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Goal"
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
                placeholder="Search Goals..."
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
                  {["All", "Draft", "Active", "Completed", "Cancelled"].map(
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
                      Priority
                    </span>
                  </div>
                  {["All", "Critical", "High", "Medium", "Low"].map((pr) => (
                    <button
                      key={pr}
                      onClick={() => {
                        setPriorityFilter(pr);
                        setCurrentPage(1);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${priorityFilter === pr ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}`}
                    >
                      {pr}
                    </button>
                  ))}
                  <div className="px-3 pt-2">
                    <button
                      onClick={() => {
                        setStatusFilter("All");
                        setPriorityFilter("All");
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
          <table className="w-full text-sm min-w-[1200px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="goalName" label="Goal Name" />
                <SortHeader field="category" label="Category" />
                <SortHeader field="goalType" label="Type" />
                <SortHeader field="targetAmount" label="Target Amount" />
                <SortHeader field="currentAmount" label="Current Amount" />
                <SortHeader field="progress" label="Progress" />
                <SortHeader field="targetDate" label="Target Date" />
                <SortHeader field="priority" label="Priority" />
                <SortHeader field="status" label="Status" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedGoals.map((goal) => (
                <tr
                  key={goal.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(goal)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {goal.goalName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{goal.category}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {goal.goalType || "-"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fmtCurrency(goal.targetAmount)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {fmtCurrency(goal.currentAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {goal.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{goal.targetDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}
                    >
                      <Flag className="w-3 h-3" />
                      {goal.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}
                    >
                      {getStatusIcon(goal.status)}
                      {goal.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(goal)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(goal)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(goal)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedGoals.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No goals found.
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
            {filteredGoals.length === 0 ? 0 : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredGoals.length)} of{" "}
            {filteredGoals.length} results
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
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};
