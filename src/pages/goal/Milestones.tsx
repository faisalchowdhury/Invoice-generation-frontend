/**
 * File: src/pages/goals/Milestones.tsx
 * Complete Milestones Management page with list view, create/edit modal, and details modal
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
  CheckCircle,
  Clock,
  AlertCircle,
  Flag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Milestone {
  id: string;
  goal: string;
  milestoneName: string;
  targetAmount: number;
  achievedAmount: number;
  targetDate: string;
  achievedDate: string;
  status: "Not Started" | "In Progress" | "Achieved" | "Cancelled";
  description: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleMilestones: Milestone[] = [
  {
    id: "1",
    goal: "Investment Portfolio",
    milestoneName: "First Quarter Target",
    targetAmount: 25000,
    achievedAmount: 22000,
    targetDate: "2026-04-19",
    achievedDate: "2026-01-14",
    status: "In Progress",
    description: "Achieve 25% of the annual goal target",
    createdAt: "2026-01-01",
  },
  {
    id: "2",
    goal: "Credit Card Debt",
    milestoneName: "Mid-Year Milestone",
    targetAmount: 50000,
    achievedAmount: 0,
    targetDate: "2026-06-30",
    achievedDate: "",
    status: "Not Started",
    description: "Pay off 50% of credit card debt",
    createdAt: "2026-01-01",
  },
  {
    id: "3",
    goal: "Operational Cost Reduction",
    milestoneName: "Third Quarter Goal",
    targetAmount: 75000,
    achievedAmount: 0,
    targetDate: "2026-09-30",
    achievedDate: "",
    status: "Not Started",
    description: "Reduce operational costs by 15%",
    createdAt: "2026-01-01",
  },
  {
    id: "4",
    goal: "Retirement Savings",
    milestoneName: "Year-End Target",
    targetAmount: 100000,
    achievedAmount: 0,
    targetDate: "2026-12-31",
    achievedDate: "",
    status: "Not Started",
    description: "Reach 100k in retirement savings",
    createdAt: "2026-01-01",
  },
  {
    id: "5",
    goal: "Student Loan Payoff",
    milestoneName: "Emergency Fund Setup",
    targetAmount: 5000,
    achievedAmount: 5000,
    targetDate: "2026-03-31",
    achievedDate: "2026-01-15",
    status: "Achieved",
    description: "Set up emergency fund before loan payoff",
    createdAt: "2026-01-01",
  },
  {
    id: "6",
    goal: "Investment Portfolio",
    milestoneName: "Investment Portfolio",
    targetAmount: 15000,
    achievedAmount: 15000,
    targetDate: "2026-02-28",
    achievedDate: "2026-01-20",
    status: "Achieved",
    description: "Initial investment contribution",
    createdAt: "2026-01-01",
  },
];

const goalsList = [
  "Investment Portfolio",
  "Credit Card Debt",
  "Operational Cost Reduction",
  "Retirement Savings",
  "Student Loan Payoff",
  "Emergency Fund",
  "Annual Revenue Target",
  "Home Down Payment",
];

const statuses = ["Not Started", "In Progress", "Achieved", "Cancelled"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "goal"
  | "milestoneName"
  | "targetAmount"
  | "achievedAmount"
  | "targetDate"
  | "status";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Milestones: React.FC = () => {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState<Milestone[]>(sampleMilestones);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("goal");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [milestoneFormData, setMilestoneFormData] = useState({
    goal: "",
    milestoneName: "",
    targetAmount: 0,
    achievedAmount: 0,
    targetDate: "",
    achievedDate: "",
    status: "Not Started" as
      | "Not Started"
      | "In Progress"
      | "Achieved"
      | "Cancelled",
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

  const filteredMilestones = useMemo(() => {
    let result = [...milestones];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.goal.toLowerCase().includes(q) ||
          m.milestoneName.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((m) => m.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "targetAmount" || sortField === "achievedAmount") {
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
  }, [milestones, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredMilestones.length / perPage);
  const paginatedMilestones = filteredMilestones.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetMilestoneForm = () => {
    setMilestoneFormData({
      goal: "",
      milestoneName: "",
      targetAmount: 0,
      achievedAmount: 0,
      targetDate: "",
      achievedDate: "",
      status: "Not Started",
      description: "",
    });
  };

  const openCreateModal = () => {
    resetMilestoneForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setMilestoneFormData({
      goal: milestone.goal,
      milestoneName: milestone.milestoneName,
      targetAmount: milestone.targetAmount,
      achievedAmount: milestone.achievedAmount,
      targetDate: milestone.targetDate,
      achievedDate: milestone.achievedDate,
      status: milestone.status,
      description: milestone.description,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowViewModal(true);
  };

  const openDeleteModal = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowDeleteModal(true);
  };

  const handleSaveMilestone = () => {
    if (!milestoneFormData.goal) {
      showToast("Please select a goal", "info");
      return;
    }
    if (!milestoneFormData.milestoneName) {
      showToast("Please enter milestone name", "info");
      return;
    }
    if (milestoneFormData.targetAmount <= 0) {
      showToast("Please enter a valid target amount", "info");
      return;
    }
    if (!milestoneFormData.targetDate) {
      showToast("Please select target date", "info");
      return;
    }

    if (isEditing && selectedMilestone) {
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === selectedMilestone.id
            ? {
                ...m,
                goal: milestoneFormData.goal,
                milestoneName: milestoneFormData.milestoneName,
                targetAmount: milestoneFormData.targetAmount,
                achievedAmount: milestoneFormData.achievedAmount,
                targetDate: milestoneFormData.targetDate,
                achievedDate: milestoneFormData.achievedDate,
                status: milestoneFormData.status,
                description: milestoneFormData.description,
              }
            : m,
        ),
      );
      showToast("Milestone updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        goal: milestoneFormData.goal,
        milestoneName: milestoneFormData.milestoneName,
        targetAmount: milestoneFormData.targetAmount,
        achievedAmount: milestoneFormData.achievedAmount,
        targetDate: milestoneFormData.targetDate,
        achievedDate: milestoneFormData.achievedDate,
        status: milestoneFormData.status,
        description: milestoneFormData.description,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setMilestones((prev) => [newMilestone, ...prev]);
      showToast("Milestone created successfully!", "success");
      setShowCreateModal(false);
    }
    resetMilestoneForm();
  };

  const handleDeleteMilestone = () => {
    if (selectedMilestone) {
      setMilestones((prev) =>
        prev.filter((m) => m.id !== selectedMilestone.id),
      );
      showToast("Milestone deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedMilestone(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Achieved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Not Started":
        return "bg-gray-100 text-gray-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Achieved":
        return <CheckCircle className="w-3 h-3" />;
      case "In Progress":
        return <Clock className="w-3 h-3" />;
      case "Not Started":
        return <AlertCircle className="w-3 h-3" />;
      case "Cancelled":
        return <X className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = (achieved: number, target: number): number => {
    if (target === 0) return 0;
    return Math.round((achieved / target) * 100);
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
              {isEditing ? "Edit Milestone" : "Create Milestone"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update milestone information"
                : "Create a new milestone"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetMilestoneForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal <span className="text-red-500">*</span>
              </label>
              <select
                value={milestoneFormData.goal}
                onChange={(e) =>
                  setMilestoneFormData({
                    ...milestoneFormData,
                    goal: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Goal</option>
                {goalsList.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Milestone Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={milestoneFormData.milestoneName}
                onChange={(e) =>
                  setMilestoneFormData({
                    ...milestoneFormData,
                    milestoneName: e.target.value,
                  })
                }
                placeholder="Enter milestone name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
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
                  value={milestoneFormData.targetAmount || ""}
                  onChange={(e) =>
                    setMilestoneFormData({
                      ...milestoneFormData,
                      targetAmount: parseFloat(e.target.value) || 0,
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
                  value={milestoneFormData.targetDate}
                  onChange={(e) =>
                    setMilestoneFormData({
                      ...milestoneFormData,
                      targetDate: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Achieved Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={milestoneFormData.achievedAmount || ""}
                  onChange={(e) =>
                    setMilestoneFormData({
                      ...milestoneFormData,
                      achievedAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Achieved Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={milestoneFormData.achievedDate}
                  onChange={(e) =>
                    setMilestoneFormData({
                      ...milestoneFormData,
                      achievedDate: e.target.value,
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
                value={milestoneFormData.status}
                onChange={(e) =>
                  setMilestoneFormData({
                    ...milestoneFormData,
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={milestoneFormData.description}
                onChange={(e) =>
                  setMilestoneFormData({
                    ...milestoneFormData,
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
          {milestoneFormData.targetAmount > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Progress Preview</span>
                <span className="text-sm font-medium text-blue-600">
                  {getProgressPercentage(
                    milestoneFormData.achievedAmount,
                    milestoneFormData.targetAmount,
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${getProgressPercentage(milestoneFormData.achievedAmount, milestoneFormData.targetAmount)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>
                  Achieved: {fmtCurrency(milestoneFormData.achievedAmount)}
                </span>
                <span>
                  Target: {fmtCurrency(milestoneFormData.targetAmount)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetMilestoneForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveMilestone}
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
              Milestone Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedMilestone?.milestoneName}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {selectedMilestone && (
          <div className="p-6">
            {/* Milestone Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Milestone Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Goal</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedMilestone.goal}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Milestone Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedMilestone.milestoneName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Target Amount</p>
                  <p className="text-sm font-medium text-gray-900">
                    {fmtCurrency(selectedMilestone.targetAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Target Date</p>
                  <p className="text-sm text-gray-600">
                    {selectedMilestone.targetDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Achieved Amount</p>
                  <p className="text-sm font-medium text-green-600">
                    {fmtCurrency(selectedMilestone.achievedAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Achieved Date</p>
                  <p className="text-sm text-gray-600">
                    {selectedMilestone.achievedDate || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMilestone.status)}`}
                  >
                    {getStatusIcon(selectedMilestone.status)}
                    {selectedMilestone.status}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm text-gray-600">
                    {selectedMilestone.description || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Progress</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Completion Progress
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {getProgressPercentage(
                      selectedMilestone.achievedAmount,
                      selectedMilestone.targetAmount,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${getProgressPercentage(selectedMilestone.achievedAmount, selectedMilestone.targetAmount)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">Achieved:</span>
                    <span className="font-medium text-green-600 ml-1">
                      {fmtCurrency(selectedMilestone.achievedAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Remaining:</span>
                    <span className="font-medium text-orange-600 ml-1">
                      {fmtCurrency(
                        selectedMilestone.targetAmount -
                          selectedMilestone.achievedAmount,
                      )}
                    </span>
                  </div>
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
              if (selectedMilestone) openEditModal(selectedMilestone);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Milestone
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
            Delete Milestone
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedMilestone?.milestoneName}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteMilestone}
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
            onClick={() => navigate("/goal")}
            className="hover:text-gray-700"
          >
            Goal
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Milestones</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Milestones
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Milestone"
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
                placeholder="Search Milestones..."
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
                  {[
                    "All",
                    "Not Started",
                    "In Progress",
                    "Achieved",
                    "Cancelled",
                  ].map((st) => (
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
                <SortHeader field="goal" label="Goal" />
                <SortHeader field="milestoneName" label="Milestone Name" />
                <SortHeader field="targetAmount" label="Target Amount" />
                <SortHeader field="achievedAmount" label="Achieved Amount" />
                <SortHeader field="targetDate" label="Target Date" />
                <SortHeader field="status" label="Status" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedMilestones.map((milestone) => (
                <tr
                  key={milestone.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(milestone)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {milestone.goal}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {milestone.milestoneName}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fmtCurrency(milestone.targetAmount)}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-600">
                    {fmtCurrency(milestone.achievedAmount)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {milestone.targetDate}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}
                    >
                      {getStatusIcon(milestone.status)}
                      {milestone.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(milestone)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(milestone)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(milestone)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedMilestones.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No milestones found.
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
            {filteredMilestones.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredMilestones.length)} of{" "}
            {filteredMilestones.length} results
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
