/**
 * File: src/pages/goals/Tracking.tsx
 * Complete Tracking Management page with list view, create/edit modal, and details modal
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
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  startDate: string;
  targetDate: string;
  goalType: string;
  description: string;
}

interface Tracking {
  id: string;
  goalId: string;
  goalName: string;
  trackingDate: string;
  previousAmount: number;
  contributionAmount: number;
  currentAmount: number;
  daysRemaining: number;
  status: "Ahead" | "On track" | "Behind";
  projectedCompletionDate: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleGoals: Goal[] = [
  {
    id: "1",
    name: "Investment Portfolio",
    targetAmount: 100000,
    startDate: "2024-02-01",
    targetDate: "2025-02-01",
    goalType: "Expense Reduction",
    description: "Diversify investment portfolio with stocks and bonds",
  },
  {
    id: "2",
    name: "Credit Card Debt",
    targetAmount: 100000,
    startDate: "2024-01-01",
    targetDate: "2025-12-31",
    goalType: "Debt Reduction",
    description: "Pay off all credit card debt",
  },
  {
    id: "3",
    name: "Operational Cost Reduction",
    targetAmount: 100000,
    startDate: "2024-01-01",
    targetDate: "2025-12-31",
    goalType: "Cost Reduction",
    description: "Reduce operational costs",
  },
  {
    id: "4",
    name: "Retirement Savings",
    targetAmount: 100000,
    startDate: "2024-01-01",
    targetDate: "2025-12-31",
    goalType: "Savings",
    description: "Save for retirement",
  },
  {
    id: "5",
    name: "Student Loan Payoff",
    targetAmount: 100000,
    startDate: "2024-01-01",
    targetDate: "2025-12-31",
    goalType: "Debt Reduction",
    description: "Pay off student loans",
  },
];

const sampleTrackings: Tracking[] = [
  {
    id: "1",
    goalId: "1",
    goalName: "Investment Portfolio",
    trackingDate: "2025-12-20",
    previousAmount: 0,
    contributionAmount: 5000,
    currentAmount: 5000,
    daysRemaining: 335,
    status: "Behind",
    projectedCompletionDate: "2027-02-23",
    createdAt: "2025-12-20",
  },
  {
    id: "2",
    goalId: "2",
    goalName: "Credit Card Debt",
    trackingDate: "2025-12-25",
    previousAmount: 5000,
    contributionAmount: 2500,
    currentAmount: 7500,
    daysRemaining: 330,
    status: "Behind",
    projectedCompletionDate: "2027-02-03",
    createdAt: "2025-12-25",
  },
  {
    id: "3",
    goalId: "3",
    goalName: "Operational Cost Reduction",
    trackingDate: "2025-12-30",
    previousAmount: 7500,
    contributionAmount: 1000,
    currentAmount: 8500,
    daysRemaining: 325,
    status: "On track",
    projectedCompletionDate: "2026-12-15",
    createdAt: "2025-12-30",
  },
  {
    id: "4",
    goalId: "4",
    goalName: "Retirement Savings",
    trackingDate: "2026-01-04",
    previousAmount: 8500,
    contributionAmount: 3000,
    currentAmount: 11500,
    daysRemaining: 320,
    status: "On track",
    projectedCompletionDate: "2026-11-20",
    createdAt: "2026-01-04",
  },
  {
    id: "5",
    goalId: "5",
    goalName: "Student Loan Payoff",
    trackingDate: "2026-01-09",
    previousAmount: 11500,
    contributionAmount: 1500,
    currentAmount: 13000,
    daysRemaining: 315,
    status: "On track",
    projectedCompletionDate: "2026-10-25",
    createdAt: "2026-01-09",
  },
  {
    id: "6",
    goalId: "1",
    goalName: "Investment Portfolio",
    trackingDate: "2026-01-14",
    previousAmount: 13000,
    contributionAmount: 750,
    currentAmount: 13750,
    daysRemaining: 310,
    status: "Ahead",
    projectedCompletionDate: "2026-09-30",
    createdAt: "2026-01-14",
  },
  {
    id: "7",
    goalId: "2",
    goalName: "Credit Card Debt",
    trackingDate: "2026-01-17",
    previousAmount: 13750,
    contributionAmount: 2000,
    currentAmount: 15750,
    daysRemaining: 307,
    status: "Ahead",
    projectedCompletionDate: "2026-09-15",
    createdAt: "2026-01-17",
  },
  {
    id: "8",
    goalId: "3",
    goalName: "Operational Cost Reduction",
    trackingDate: "2026-01-19",
    previousAmount: 15750,
    contributionAmount: 500,
    currentAmount: 16250,
    daysRemaining: 305,
    status: "Ahead",
    projectedCompletionDate: "2026-09-05",
    createdAt: "2026-01-19",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "goalName"
  | "trackingDate"
  | "contributionAmount"
  | "currentAmount"
  | "progress"
  | "daysRemaining"
  | "status";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Tracking: React.FC = () => {
  const navigate = useNavigate();
  const [trackings, setTrackings] = useState<Tracking[]>(sampleTrackings);
  const [goals] = useState<Goal[]>(sampleGoals);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("trackingDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState<Tracking | null>(
    null,
  );
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [trackingFormData, setTrackingFormData] = useState({
    goalId: "",
    goalName: "",
    trackingDate: new Date().toISOString().split("T")[0],
    previousAmount: 0,
    contributionAmount: 0,
    currentAmount: 0,
    daysRemaining: 0,
    status: "On track" as "Ahead" | "On track" | "Behind",
    projectedCompletionDate: "",
  });

  // Helper function to get goal by ID
  const getGoalById = (goalId: string): Goal | undefined => {
    return goals.find((g) => g.id === goalId);
  };

  // Helper function to calculate progress
  const calculateProgress = (
    currentAmount: number,
    targetAmount: number,
  ): number => {
    if (targetAmount === 0) return 0;
    return (currentAmount / targetAmount) * 100;
  };

  // Helper function to calculate days remaining
  const calculateDaysRemaining = (targetDate: string): number => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper function to determine status
  const determineStatus = (
    progress: number,
    daysRemaining: number,
    totalDays: number,
  ): "Ahead" | "On track" | "Behind" => {
    const expectedProgress = ((totalDays - daysRemaining) / totalDays) * 100;
    if (progress > expectedProgress + 5) return "Ahead";
    if (progress < expectedProgress - 5) return "Behind";
    return "On track";
  };

  // Helper function to calculate projected completion date
  const calculateProjectedCompletion = (
    currentAmount: number,
    targetAmount: number,
    startDate: string,
    trackingDate: string,
  ): string => {
    if (currentAmount === 0) return startDate;
    const start = new Date(startDate);
    const tracking = new Date(trackingDate);
    const daysElapsed = Math.max(
      1,
      Math.ceil((tracking.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const ratePerDay = currentAmount / daysElapsed;
    const remainingAmount = targetAmount - currentAmount;
    const daysNeeded = remainingAmount / ratePerDay;
    const completionDate = new Date(tracking);
    completionDate.setDate(tracking.getDate() + daysNeeded);
    return completionDate.toISOString().split("T")[0];
  };

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

  const filteredTrackings = useMemo(() => {
    let result = [...trackings];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.goalName.toLowerCase().includes(q));
    }

    if (statusFilter !== "All") {
      result = result.filter((t) => t.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal = (a as any)[sortField];
      let bVal = (b as any)[sortField];

      if (sortField === "contributionAmount") {
        aVal = a.contributionAmount;
        bVal = b.contributionAmount;
      }
      if (sortField === "currentAmount") {
        aVal = a.currentAmount;
        bVal = b.currentAmount;
      }
      if (sortField === "progress") {
        const goalA = getGoalById(a.goalId);
        const goalB = getGoalById(b.goalId);
        aVal = goalA
          ? calculateProgress(a.currentAmount, goalA.targetAmount)
          : 0;
        bVal = goalB
          ? calculateProgress(b.currentAmount, goalB.targetAmount)
          : 0;
      }
      if (sortField === "daysRemaining") {
        aVal = a.daysRemaining;
        bVal = b.daysRemaining;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [trackings, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredTrackings.length / perPage);
  const paginatedTrackings = filteredTrackings.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const handleGoalChange = (goalId: string) => {
    const goal = getGoalById(goalId);
    if (goal) {
      const daysRemaining = calculateDaysRemaining(goal.targetDate);
      setTrackingFormData({
        ...trackingFormData,
        goalId: goalId,
        goalName: goal.name,
        daysRemaining: daysRemaining,
      });
    }
  };

  const handleAmountChange = (amount: number, previousAmount: number) => {
    const contribution = amount - previousAmount;
    const goal = getGoalById(trackingFormData.goalId);
    if (goal) {
      const progress = calculateProgress(amount, goal.targetAmount);
      const totalDays = calculateDaysRemaining(goal.startDate);
      const status = determineStatus(
        progress,
        trackingFormData.daysRemaining,
        totalDays,
      );
      const projectedCompletion = calculateProjectedCompletion(
        amount,
        goal.targetAmount,
        goal.startDate,
        trackingFormData.trackingDate,
      );

      setTrackingFormData({
        ...trackingFormData,
        previousAmount: previousAmount,
        contributionAmount: contribution,
        currentAmount: amount,
        status: status,
        projectedCompletionDate: projectedCompletion,
      });
    }
  };

  const resetTrackingForm = () => {
    setTrackingFormData({
      goalId: "",
      goalName: "",
      trackingDate: new Date().toISOString().split("T")[0],
      previousAmount: 0,
      contributionAmount: 0,
      currentAmount: 0,
      daysRemaining: 0,
      status: "On track",
      projectedCompletionDate: "",
    });
  };

  const openCreateModal = () => {
    resetTrackingForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (tracking: Tracking) => {
    setSelectedTracking(tracking);
    setTrackingFormData({
      goalId: tracking.goalId,
      goalName: tracking.goalName,
      trackingDate: tracking.trackingDate,
      previousAmount: tracking.previousAmount,
      contributionAmount: tracking.contributionAmount,
      currentAmount: tracking.currentAmount,
      daysRemaining: tracking.daysRemaining,
      status: tracking.status,
      projectedCompletionDate: tracking.projectedCompletionDate,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (tracking: Tracking) => {
    setSelectedTracking(tracking);
    const goal = getGoalById(tracking.goalId);
    setSelectedGoal(goal || null);
    setShowViewModal(true);
  };

  const openDeleteModal = (tracking: Tracking) => {
    setSelectedTracking(tracking);
    setShowDeleteModal(true);
  };

  const handleSaveTracking = () => {
    if (!trackingFormData.goalId) {
      showToast("Please select a goal", "info");
      return;
    }
    if (!trackingFormData.trackingDate) {
      showToast("Please select tracking date", "info");
      return;
    }
    if (trackingFormData.currentAmount < 0) {
      showToast("Please enter a valid amount", "info");
      return;
    }

    const goal = getGoalById(trackingFormData.goalId);
    if (!goal) return;

    const progress = calculateProgress(
      trackingFormData.currentAmount,
      goal.targetAmount,
    );

    if (isEditing && selectedTracking) {
      setTrackings((prev) =>
        prev.map((t) =>
          t.id === selectedTracking.id
            ? {
                ...t,
                goalId: trackingFormData.goalId,
                goalName: trackingFormData.goalName,
                trackingDate: trackingFormData.trackingDate,
                previousAmount: trackingFormData.previousAmount,
                contributionAmount: trackingFormData.contributionAmount,
                currentAmount: trackingFormData.currentAmount,
                daysRemaining: trackingFormData.daysRemaining,
                status: trackingFormData.status,
                projectedCompletionDate:
                  trackingFormData.projectedCompletionDate,
              }
            : t,
        ),
      );
      showToast("Tracking updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newTracking: Tracking = {
        id: Date.now().toString(),
        goalId: trackingFormData.goalId,
        goalName: trackingFormData.goalName,
        trackingDate: trackingFormData.trackingDate,
        previousAmount: trackingFormData.previousAmount,
        contributionAmount: trackingFormData.contributionAmount,
        currentAmount: trackingFormData.currentAmount,
        daysRemaining: trackingFormData.daysRemaining,
        status: trackingFormData.status,
        projectedCompletionDate: trackingFormData.projectedCompletionDate,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTrackings((prev) => [newTracking, ...prev]);
      showToast("Tracking created successfully!", "success");
      setShowCreateModal(false);
    }
    resetTrackingForm();
  };

  const handleDeleteTracking = () => {
    if (selectedTracking) {
      setTrackings((prev) => prev.filter((t) => t.id !== selectedTracking.id));
      showToast("Tracking deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedTracking(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ahead":
        return "bg-green-100 text-green-700";
      case "On track":
        return "bg-blue-100 text-blue-700";
      case "Behind":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ahead":
        return <TrendingUp className="w-3 h-3" />;
      case "On track":
        return <CheckCircle className="w-3 h-3" />;
      case "Behind":
        return <AlertCircle className="w-3 h-3" />;
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
              {isEditing ? "Edit Tracking" : "Create Tracking"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update tracking information"
                : "Add a new tracking record"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetTrackingForm();
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
                Goal <span className="text-red-500">*</span>
              </label>
              <select
                value={trackingFormData.goalId}
                onChange={(e) => handleGoalChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Goal</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={trackingFormData.trackingDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setTrackingFormData({
                      ...trackingFormData,
                      trackingDate: newDate,
                    });
                    if (trackingFormData.goalId) {
                      const goal = getGoalById(trackingFormData.goalId);
                      if (goal) {
                        const projected = calculateProjectedCompletion(
                          trackingFormData.currentAmount,
                          goal.targetAmount,
                          goal.startDate,
                          newDate,
                        );
                        setTrackingFormData((prev) => ({
                          ...prev,
                          projectedCompletionDate: projected,
                        }));
                      }
                    }
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Previous Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={trackingFormData.previousAmount || ""}
                  onChange={(e) => {
                    const prevAmount = parseFloat(e.target.value) || 0;
                    handleAmountChange(
                      prevAmount + trackingFormData.contributionAmount,
                      prevAmount,
                    );
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={trackingFormData.currentAmount || ""}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value) || 0;
                    handleAmountChange(amount, trackingFormData.previousAmount);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days Remaining
              </label>
              <input
                type="number"
                value={trackingFormData.daysRemaining}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <input
                type="text"
                value={trackingFormData.status}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetTrackingForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTracking}
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
              Tracking Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedTracking?.goalName}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {selectedTracking && selectedGoal && (
          <div className="p-6">
            {/* Progress Overview */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Progress Overview
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
                    {fmtCurrency(selectedTracking.currentAmount)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-purple-600">Progress</p>
                  <p className="text-lg font-bold text-purple-700">
                    {calculateProgress(
                      selectedTracking.currentAmount,
                      selectedGoal.targetAmount,
                    ).toFixed(2)}
                    %
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${calculateProgress(selectedTracking.currentAmount, selectedGoal.targetAmount)}%`,
                  }}
                />
              </div>
            </div>

            {/* Financial Details */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Financial Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Previous Amount</p>
                  <p className="text-sm font-medium text-gray-900">
                    {fmtCurrency(selectedTracking.previousAmount)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Contribution Amount</p>
                  <p className="text-sm font-medium text-green-600">
                    {fmtCurrency(selectedTracking.contributionAmount)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Current Amount</p>
                  <p className="text-sm font-medium text-gray-900">
                    {fmtCurrency(selectedTracking.currentAmount)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Remaining Amount</p>
                  <p className="text-sm font-medium text-orange-600">
                    {fmtCurrency(
                      selectedGoal.targetAmount -
                        selectedTracking.currentAmount,
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Details */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Timeline Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Tracking Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedTracking.trackingDate}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Days Remaining</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedTracking.daysRemaining} days
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Projected Completion</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedTracking.projectedCompletionDate}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTracking.status)}`}
                  >
                    {getStatusIcon(selectedTracking.status)}
                    {selectedTracking.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Goal Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Goal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Goal Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedGoal.name}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm text-gray-600">
                    {selectedGoal.startDate}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Goal Type</p>
                  <p className="text-sm text-gray-600">
                    {selectedGoal.goalType}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Target Date</p>
                  <p className="text-sm text-gray-600">
                    {selectedGoal.targetDate}
                  </p>
                </div>
                <div className="md:col-span-2 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm text-gray-600">
                    {selectedGoal.description}
                  </p>
                </div>
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
              if (selectedTracking) openEditModal(selectedTracking);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Tracking
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
            Delete Tracking
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete this tracking record for{" "}
            <span className="font-semibold">{selectedTracking?.goalName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteTracking}
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
          <span className="text-gray-900 font-medium">Tracking</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Tracking
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Tracking"
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
                <div className="absolute right-0 top-10 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 pb-1.5 mb-1 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">
                      Status
                    </span>
                  </div>
                  {["All", "Ahead", "On track", "Behind"].map((st) => (
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
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="goalName" label="Goal" />
                <SortHeader field="trackingDate" label="Date" />
                <SortHeader field="contributionAmount" label="Contribution" />
                <SortHeader field="currentAmount" label="Current Amount" />
                <SortHeader field="progress" label="Progress" />
                <SortHeader field="daysRemaining" label="Days Left" />
                <SortHeader field="status" label="Status" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedTrackings.map((tracking) => {
                const goal = getGoalById(tracking.goalId);
                const progress = goal
                  ? calculateProgress(tracking.currentAmount, goal.targetAmount)
                  : 0;
                return (
                  <tr
                    key={tracking.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openViewModal(tracking)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {tracking.goalName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tracking.trackingDate}
                    </td>
                    <td className="px-4 py-3 font-medium text-green-600">
                      {fmtCurrency(tracking.contributionAmount)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {fmtCurrency(tracking.currentAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {progress.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tracking.daysRemaining}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tracking.status)}`}
                      >
                        {getStatusIcon(tracking.status)}
                        {tracking.status}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(tracking)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(tracking)}
                          className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(tracking)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedTrackings.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No tracking records found.
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
            {filteredTrackings.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredTrackings.length)} of{" "}
            {filteredTrackings.length} results
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
