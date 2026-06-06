/**
 * File: src/pages/performance/EmployeeGoals.tsx
 * Complete Employee Goals Management page with list view, create/edit modal, and details modal
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
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  User,
  Calendar,
  Flag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmployeeGoal {
  id: string;
  employee: string;
  goalType: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  startDate: string;
  endDate: string;
  status: "Not Started" | "In Progress" | "Completed" | "Overdue";
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleGoals: EmployeeGoal[] = [
  {
    id: "1",
    employee: "Daniel Thompson",
    goalType: "Strategic Objectives",
    title: "Implement New CRM System",
    description:
      "Deploy and configure new customer relationship management system",
    target: 108226,
    progress: 90,
    startDate: "2025-09-17",
    endDate: "2026-03-20",
    status: "In Progress",
    createdAt: "2025-09-10",
  },
  {
    id: "2",
    employee: "James Garcia",
    goalType: "Leadership Growth",
    title: "Create Employee Handbook",
    description: "Develop comprehensive employee handbook and policies",
    target: 80,
    progress: 62,
    startDate: "2025-09-22",
    endDate: "2026-01-13",
    status: "Overdue",
    createdAt: "2025-09-15",
  },
  {
    id: "3",
    employee: "James Garcia",
    goalType: "Innovation & Creativity",
    title: "Optimize Database Performance",
    description: "Improve database query performance by 30%",
    target: 97,
    progress: 63,
    startDate: "2025-08-18",
    endDate: "2026-04-21",
    status: "In Progress",
    createdAt: "2025-08-10",
  },
  {
    id: "4",
    employee: "Michael Brown",
    goalType: "Customer Excellence",
    title: "Achieve 100% Compliance Rate",
    description:
      "Ensure all customer service processes meet compliance standards",
    target: 54,
    progress: 100,
    startDate: "2025-12-18",
    endDate: "2026-01-15",
    status: "Completed",
    createdAt: "2025-12-10",
  },
  {
    id: "5",
    employee: "Mark Allen",
    goalType: "Innovation & Creativity",
    title: "Conduct Annual Team Building Event",
    description: "Organize and execute team building activities",
    target: 90,
    progress: 0,
    startDate: "2026-02-17",
    endDate: "2026-11-19",
    status: "Not Started",
    createdAt: "2026-02-10",
  },
  {
    id: "6",
    employee: "Christopher Lee",
    goalType: "Strategic Objectives",
    title: "Establish Strategic Partnership",
    description: "Form partnership with key industry player",
    target: 66,
    progress: 53,
    startDate: "2025-11-28",
    endDate: "2026-01-16",
    status: "Overdue",
    createdAt: "2025-11-20",
  },
  {
    id: "7",
    employee: "Daniel Thompson",
    goalType: "Customer Excellence",
    title: "Develop Mobile Application",
    description: "Create mobile app for customer engagement",
    target: 331465,
    progress: 65,
    startDate: "2025-11-15",
    endDate: "2026-01-13",
    status: "Overdue",
    createdAt: "2025-11-10",
  },
  {
    id: "8",
    employee: "Mark Allen",
    goalType: "Market Development",
    title: "Expand Client Portfolio by 15 Accounts",
    description: "Acquire 15 new enterprise clients",
    target: 47,
    progress: 0,
    startDate: "2026-03-06",
    endDate: "2026-08-30",
    status: "Not Started",
    createdAt: "2026-03-01",
  },
  {
    id: "9",
    employee: "James Garcia",
    goalType: "Leadership Growth",
    title: "Launch Marketing Campaign",
    description: "Execute multi-channel marketing campaign",
    target: 84,
    progress: 100,
    startDate: "2025-10-16",
    endDate: "2026-01-25",
    status: "Completed",
    createdAt: "2025-10-10",
  },
];

const employees = [
  "Daniel Thompson",
  "James Garcia",
  "Michael Brown",
  "Mark Allen",
  "Christopher Lee",
  "John Smith",
  "Anthony Walker",
  "Matthew Clark",
];

const goalTypes = [
  "Strategic Objectives",
  "Leadership Growth",
  "Innovation & Creativity",
  "Customer Excellence",
  "Market Development",
  "Operational Efficiency",
  "Financial Targets",
];

const statuses = ["Not Started", "In Progress", "Completed", "Overdue"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatNumber = (num: number) => {
  return num.toLocaleString();
};

type SortField =
  | "title"
  | "employee"
  | "goalType"
  | "target"
  | "progress"
  | "startDate"
  | "endDate"
  | "status";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const EmployeeGoals: React.FC = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<EmployeeGoal[]>(sampleGoals);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<EmployeeGoal | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [goalFormData, setGoalFormData] = useState({
    employee: "",
    goalType: "",
    title: "",
    description: "",
    target: 0,
    progress: 0,
    startDate: "",
    endDate: "",
    status: "Not Started" as
      | "Not Started"
      | "In Progress"
      | "Completed"
      | "Overdue",
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
          g.title.toLowerCase().includes(q) ||
          g.employee.toLowerCase().includes(q) ||
          g.goalType.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((g) => g.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "target" || sortField === "progress") {
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
  }, [goals, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredGoals.length / perPage);
  const paginatedGoals = filteredGoals.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetGoalForm = () => {
    setGoalFormData({
      employee: "",
      goalType: "",
      title: "",
      description: "",
      target: 0,
      progress: 0,
      startDate: "",
      endDate: "",
      status: "Not Started",
    });
  };

  const openCreateModal = () => {
    resetGoalForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (goal: EmployeeGoal) => {
    setSelectedGoal(goal);
    setGoalFormData({
      employee: goal.employee,
      goalType: goal.goalType,
      title: goal.title,
      description: goal.description,
      target: goal.target,
      progress: goal.progress,
      startDate: goal.startDate,
      endDate: goal.endDate,
      status: goal.status,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (goal: EmployeeGoal) => {
    setSelectedGoal(goal);
    setShowViewModal(true);
  };

  const openDeleteModal = (goal: EmployeeGoal) => {
    setSelectedGoal(goal);
    setShowDeleteModal(true);
  };

  const calculateProgress = (target: number, current: number): number => {
    if (target === 0) return 0;
    return Math.round((current / target) * 100);
  };

  const handleSaveGoal = () => {
    if (!goalFormData.employee) {
      showToast("Please select an employee", "info");
      return;
    }
    if (!goalFormData.goalType) {
      showToast("Please select goal type", "info");
      return;
    }
    if (!goalFormData.title) {
      showToast("Please enter title", "info");
      return;
    }
    if (!goalFormData.startDate) {
      showToast("Please select start date", "info");
      return;
    }
    if (!goalFormData.endDate) {
      showToast("Please select end date", "info");
      return;
    }
    if (goalFormData.startDate > goalFormData.endDate) {
      showToast("Start date cannot be after end date", "error");
      return;
    }

    const progress = calculateProgress(
      goalFormData.target,
      goalFormData.progress,
    );

    if (isEditing && selectedGoal) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === selectedGoal.id
            ? {
                ...g,
                employee: goalFormData.employee,
                goalType: goalFormData.goalType,
                title: goalFormData.title,
                description: goalFormData.description,
                target: goalFormData.target,
                progress: progress,
                startDate: goalFormData.startDate,
                endDate: goalFormData.endDate,
                status: goalFormData.status,
              }
            : g,
        ),
      );
      showToast("Goal updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newGoal: EmployeeGoal = {
        id: Date.now().toString(),
        employee: goalFormData.employee,
        goalType: goalFormData.goalType,
        title: goalFormData.title,
        description: goalFormData.description,
        target: goalFormData.target,
        progress: progress,
        startDate: goalFormData.startDate,
        endDate: goalFormData.endDate,
        status: goalFormData.status,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Not Started":
        return "bg-gray-100 text-gray-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-3 h-3" />;
      case "In Progress":
        return <TrendingUp className="w-3 h-3" />;
      case "Not Started":
        return <Clock className="w-3 h-3" />;
      case "Overdue":
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
              {isEditing ? "Edit Employee Goal" : "Create Employee Goal"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update goal information"
                : "Add a new employee goal"}
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
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee *
            </label>
            <select
              value={goalFormData.employee}
              onChange={(e) =>
                setGoalFormData({ ...goalFormData, employee: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal Type *
            </label>
            <select
              value={goalFormData.goalType}
              onChange={(e) =>
                setGoalFormData({ ...goalFormData, goalType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">Select goal type</option>
              {goalTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={goalFormData.title}
              onChange={(e) =>
                setGoalFormData({ ...goalFormData, title: e.target.value })
              }
              placeholder="Enter goal title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
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
              placeholder="Enter goal description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={goalFormData.startDate}
                onChange={(e) =>
                  setGoalFormData({
                    ...goalFormData,
                    startDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={goalFormData.endDate}
                onChange={(e) =>
                  setGoalFormData({ ...goalFormData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target *
              </label>
              <input
                type="number"
                min={0}
                value={goalFormData.target || ""}
                onChange={(e) =>
                  setGoalFormData({
                    ...goalFormData,
                    target: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={goalFormData.progress || ""}
                onChange={(e) =>
                  setGoalFormData({
                    ...goalFormData,
                    progress: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Employee Goal Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedGoal?.title}
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
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Title</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedGoal.title}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedGoal.status)}`}
              >
                {getStatusIcon(selectedGoal.status)}
                {selectedGoal.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Employee</p>
                <p className="text-sm text-gray-600">{selectedGoal.employee}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Goal Type</p>
                <p className="text-sm text-gray-600">{selectedGoal.goalType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Target</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatNumber(selectedGoal.target)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-sm font-medium text-blue-600">
                  {selectedGoal.progress}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedGoal.startDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">End Date</p>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedGoal.endDate)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-600">
                  {selectedGoal.description}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Overall Progress</span>
                <span className="text-xs font-medium">
                  {selectedGoal.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
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
            Edit
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
            <span className="font-semibold">{selectedGoal?.title}</span>? This
            action cannot be undone.
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
            onClick={() => navigate("/performance")}
            className="hover:text-gray-700"
          >
            Performance
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Employee Goals</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Employee Goals
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
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
                placeholder="Search goals..."
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
                  <button
                    onClick={() => {
                      setStatusFilter("All");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Not Started");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Not Started
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("In Progress");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Completed");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Overdue");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Overdue
                  </button>
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
                <SortHeader field="title" label="Title" />
                <SortHeader field="employee" label="Employee" />
                <SortHeader field="goalType" label="Goal Type" />
                <SortHeader field="target" label="Target" />
                <SortHeader field="progress" label="Progress" />
                <SortHeader field="startDate" label="Start Date" />
                <SortHeader field="endDate" label="End Date" />
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
                    {goal.title}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {goal.employee}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{goal.goalType}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatNumber(goal.target)}
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
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(goal.startDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(goal.endDate)}
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
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(goal)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(goal)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
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
                    colSpan={9}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No employee goals found.缓解{" "}
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
              if (totalPages <= 5) pageNumber = i + 1;
              else if (currentPage <= 3) pageNumber = i + 1;
              else if (currentPage >= totalPages - 2)
                pageNumber = totalPages - 4 + i;
              else pageNumber = currentPage - 2 + i;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 text-sm rounded-md flex items-center justify-center ${currentPage === pageNumber ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
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
