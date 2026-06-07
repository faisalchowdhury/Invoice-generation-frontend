/**
 * File: src/pages/hrm/LeaveApplications.tsx
 * Complete Leave Applications Management page with list view, create/edit modal, and details modal
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

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
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Download,
  Paperclip,
  Send,
  CheckSquare,
  XCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { showToast } from "@/utils/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaveApplication {
  id: string;
  employee: string;
  leaveType: string;
  leaveTypePaid: boolean;
  startDate: string;
  endDate: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  appliedOn: string;
  approvedBy: string;
  approvedAt: string;
  reason: string;
  approverComment: string;
  attachment: string;
  syncToCalendar: boolean;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleLeaveApplications: LeaveApplication[] = [
  {
    id: "1",
    employee: "Daniel Thompson",
    leaveType: "Personal Leave",
    leaveTypePaid: false,
    startDate: "2025-10-09",
    endDate: "2025-10-13",
    days: 3,
    status: "Rejected",
    appliedOn: "2026-01-19",
    approvedBy: "HR Manager",
    approvedAt: "2026-01-20",
    reason: "Personal vacation and relaxation time needed",
    approverComment: "Insufficient documentation provided",
    attachment: "leave-application.png",
    syncToCalendar: false,
    createdAt: "2026-01-19",
  },
  {
    id: "2",
    employee: "Daniel Thompson",
    leaveType: "Paternity Leave",
    leaveTypePaid: true,
    startDate: "2025-10-13",
    endDate: "2025-10-13",
    days: 1,
    status: "Pending",
    appliedOn: "2026-01-19",
    approvedBy: "",
    approvedAt: "",
    reason: "New child birth",
    approverComment: "",
    attachment: "",
    syncToCalendar: false,
    createdAt: "2026-01-19",
  },
  {
    id: "3",
    employee: "Daniel Thompson",
    leaveType: "Bereavement Leave",
    leaveTypePaid: true,
    startDate: "2025-10-17",
    endDate: "2025-10-20",
    days: 2,
    status: "Approved",
    appliedOn: "2026-01-19",
    approvedBy: "HR Manager",
    approvedAt: "2026-01-20",
    reason: "Family member passed away",
    approverComment: "Approved as per policy",
    attachment: "",
    syncToCalendar: false,
    createdAt: "2026-01-19",
  },
  {
    id: "4",
    employee: "Matthew Clark",
    leaveType: "Study Leave",
    leaveTypePaid: false,
    startDate: "2025-10-01",
    endDate: "2025-10-01",
    days: 1,
    status: "Approved",
    appliedOn: "2026-01-19",
    approvedBy: "HR Manager",
    approvedAt: "2026-01-20",
    reason: "Exam preparation",
    approverComment: "Approved",
    attachment: "",
    syncToCalendar: false,
    createdAt: "2026-01-19",
  },
  {
    id: "5",
    employee: "Matthew Clark",
    leaveType: "Personal Leave",
    leaveTypePaid: false,
    startDate: "2025-10-06",
    endDate: "2025-10-07",
    days: 2,
    status: "Rejected",
    appliedOn: "2026-01-19",
    approvedBy: "HR Manager",
    approvedAt: "2026-01-20",
    reason: "Personal matters",
    approverComment: "Request denied due to workload",
    attachment: "",
    syncToCalendar: false,
    createdAt: "2026-01-19",
  },
  {
    id: "6",
    employee: "Matthew Clark",
    leaveType: "Study Leave",
    leaveTypePaid: false,
    startDate: "2025-10-09",
    endDate: "2025-10-13",
    days: 3,
    status: "Pending",
    appliedOn: "2026-01-19",
    approvedBy: "",
    approvedAt: "",
    reason: "Final exams preparation",
    approverComment: "",
    attachment: "",
    syncToCalendar: false,
    createdAt: "2026-01-19",
  },
  {
    id: "7",
    employee: "Matthew Clark",
    leaveType: "Bereavement Leave",
    leaveTypePaid: true,
    startDate: "2025-10-13",
    endDate: "2025-10-13",
    days: 1,
    status: "Approved",
    appliedOn: "2026-01-19",
    approvedBy: "HR Manager",
    approvedAt: "2026-01-20",
    reason: "Grandfather passed away",
    approverComment: "Approved. My condolences.",
    attachment: "",
    syncToCalendar: false,
    createdAt: "2026-01-19",
  },
  {
    id: "8",
    employee: "Matthew Clark",
    leaveType: "Emergency Leave",
    leaveTypePaid: true,
    startDate: "2025-10-17",
    endDate: "2025-10-20",
    days: 2,
    status: "Rejected",
    appliedOn: "2026-01-19",
    approvedBy: "HR Manager",
    approvedAt: "2026-01-20",
    reason: "Child illness and need to provide care",
    approverComment: "Request rejected - insufficient notice",
    attachment: "",
    syncToCalendar: false,
    createdAt: "2026-01-19",
  },
];

const employees = [
  "Daniel Thompson",
  "Matthew Clark",
  "John Smith",
  "Michael Brown",
  "David Wilson",
  "Robert Taylor",
  "James Garcia",
  "Christopher Lee",
  "Anthony Walker",
  "Mark Allen",
];

const leaveTypes = [
  { name: "Annual Leave", paid: true, maxDays: 21 },
  { name: "Sick Leave", paid: true, maxDays: 10 },
  { name: "Maternity Leave", paid: true, maxDays: 90 },
  { name: "Paternity Leave", paid: true, maxDays: 15 },
  { name: "Personal Leave", paid: false, maxDays: 5 },
  { name: "Bereavement Leave", paid: true, maxDays: 3 },
  { name: "Study Leave", paid: false, maxDays: 30 },
  { name: "Emergency Leave", paid: true, maxDays: 2 },
];

const statuses = ["Pending", "Approved", "Rejected", "Cancelled"];

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

const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

type SortField =
  | "employee"
  | "leaveType"
  | "startDate"
  | "endDate"
  | "days"
  | "status"
  | "appliedOn";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const LeaveApplications: React.FC = () => {
  const navigate = useNavigate();
  const [leaveApplications, setLeaveApplications] = useState<
    LeaveApplication[]
  >(sampleLeaveApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("appliedOn");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<LeaveApplication | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [leaveFormData, setLeaveFormData] = useState({
    employee: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    attachment: null as File | null,
    syncToCalendar: false,
  });

  // Leave balance state for selected employee and leave type
  const [leaveBalance, setLeaveBalance] = useState({
    total: 0,
    used: 0,
    available: 0,
    requesting: 0,
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

  const filteredApplications = useMemo(() => {
    let result = [...leaveApplications];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.employee.toLowerCase().includes(q) ||
          a.leaveType.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((a) => a.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "days") {
        aVal = a.days;
        bVal = b.days;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [leaveApplications, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredApplications.length / perPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const updateLeaveBalance = (
    employee: string,
    leaveType: string,
    startDate: string,
    endDate: string,
  ) => {
    const leaveTypeObj = leaveTypes.find((lt) => lt.name === leaveType);
    if (!leaveTypeObj) return;

    const requestingDays =
      startDate && endDate ? calculateDays(startDate, endDate) : 0;
    const usedDays = leaveApplications
      .filter(
        (a) =>
          a.employee === employee &&
          a.leaveType === leaveType &&
          a.status === "Approved",
      )
      .reduce((sum, a) => sum + a.days, 0);

    setLeaveBalance({
      total: leaveTypeObj.maxDays,
      used: usedDays,
      available: leaveTypeObj.maxDays - usedDays,
      requesting: requestingDays,
    });
  };

  const handleEmployeeChange = (employee: string) => {
    setLeaveFormData({ ...leaveFormData, employee, leaveType: "" });
    updateLeaveBalance(employee, "", "", "");
  };

  const handleLeaveTypeChange = (leaveType: string) => {
    setLeaveFormData({ ...leaveFormData, leaveType });
    updateLeaveBalance(
      leaveFormData.employee,
      leaveType,
      leaveFormData.startDate,
      leaveFormData.endDate,
    );
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setLeaveFormData({ ...leaveFormData, startDate, endDate });
    updateLeaveBalance(
      leaveFormData.employee,
      leaveFormData.leaveType,
      startDate,
      endDate,
    );
  };

  const resetLeaveForm = () => {
    setLeaveFormData({
      employee: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      attachment: null,
      syncToCalendar: false,
    });
    setLeaveBalance({ total: 0, used: 0, available: 0, requesting: 0 });
  };

  const openCreateModal = () => {
    resetLeaveForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (application: LeaveApplication) => {
    setSelectedApplication(application);
    setLeaveFormData({
      employee: application.employee,
      leaveType: application.leaveType,
      startDate: application.startDate,
      endDate: application.endDate,
      reason: application.reason,
      attachment: null,
      syncToCalendar: application.syncToCalendar,
    });
    updateLeaveBalance(
      application.employee,
      application.leaveType,
      application.startDate,
      application.endDate,
    );
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (application: LeaveApplication) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };

  const openDeleteModal = (application: LeaveApplication) => {
    setSelectedApplication(application);
    setShowDeleteModal(true);
  };

  const handleStatusUpdate = (
    id: string,
    newStatus: "Approved" | "Rejected",
  ) => {
    setLeaveApplications((prev) =>
      prev.map((a: any) =>
        a.id === id
          ? {
              ...a,
              status: newStatus,
              approvedBy: "HR Manager",
              approvedAt: "Pending",
              approverComment:
                newStatus === "Rejected" ? "Request denied" : "Approved",
            }
          : a,
      ),
    );
    showToast(
      `Leave application ${newStatus.toLowerCase()} successfully!`,
      "success",
    );
  };

  const handleSaveLeaveApplication = () => {
    if (!leaveFormData.employee) {
      showToast("Please select an employee", "info");
      return;
    }
    if (!leaveFormData.leaveType) {
      showToast("Please select a leave type", "info");
      return;
    }
    if (!leaveFormData.startDate) {
      showToast("Please select start date", "info");
      return;
    }
    if (!leaveFormData.endDate) {
      showToast("Please select end date", "info");
      return;
    }
    if (!leaveFormData.reason) {
      showToast("Please enter a reason", "info");
      return;
    }

    const days = calculateDays(leaveFormData.startDate, leaveFormData.endDate);
    const leaveTypeObj = leaveTypes.find(
      (lt) => lt.name === leaveFormData.leaveType,
    );

    if (days > leaveBalance.available && leaveBalance.available > 0) {
      showToast(
        `Requested days (${days}) exceed available balance (${leaveBalance.available})`,
        "error",
      );
      return;
    }

    if (isEditing && selectedApplication) {
      setLeaveApplications((prev) =>
        prev.map((a) =>
          a.id === selectedApplication.id
            ? {
                ...a,
                employee: leaveFormData.employee,
                leaveType: leaveFormData.leaveType,
                leaveTypePaid: leaveTypeObj?.paid || false,
                startDate: leaveFormData.startDate,
                endDate: leaveFormData.endDate,
                days: days,
                reason: leaveFormData.reason,
                syncToCalendar: leaveFormData.syncToCalendar,
              }
            : a,
        ),
      );
      showToast("Leave application updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newApplication: LeaveApplication = {
        id: Date.now().toString(),
        employee: leaveFormData.employee,
        leaveType: leaveFormData.leaveType,
        leaveTypePaid: leaveTypeObj?.paid || false,
        startDate: leaveFormData.startDate,
        endDate: leaveFormData.endDate,
        days: days,
        status: "Pending",
        appliedOn: new Date().toISOString().split("T")[0],
        approvedBy: "",
        approvedAt: "",
        reason: leaveFormData.reason,
        approverComment: "",
        attachment: "",
        syncToCalendar: leaveFormData.syncToCalendar,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setLeaveApplications((prev) => [newApplication, ...prev]);
      showToast("Leave application created successfully!", "success");
      setShowCreateModal(false);
    }
    resetLeaveForm();
  };

  const handleDeleteLeaveApplication = () => {
    if (selectedApplication) {
      setLeaveApplications((prev) =>
        prev.filter((a) => a.id !== selectedApplication.id),
      );
      showToast("Leave application deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedApplication(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-3 h-3" />;
      case "Pending":
        return <Clock className="w-3 h-3" />;
      case "Rejected":
        return <XCircle className="w-3 h-3" />;
      case "Cancelled":
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
              {isEditing
                ? "Edit Leave Application"
                : "Create Leave Application"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update leave application"
                : "Submit a new leave request"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetLeaveForm();
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
              value={leaveFormData.employee}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type *
            </label>
            <select
              value={leaveFormData.leaveType}
              onChange={(e) => handleLeaveTypeChange(e.target.value)}
              disabled={!leaveFormData.employee}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100"
            >
              <option value="">
                {leaveFormData.employee
                  ? "Select Leave Type"
                  : "Select Employee first"}
              </option>
              {leaveTypes.map((lt) => (
                <option key={lt.name} value={lt.name}>
                  {lt.name} {lt.paid ? "(Paid)" : "(Unpaid)"}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={leaveFormData.startDate}
                onChange={(e) =>
                  handleDateChange(e.target.value, leaveFormData.endDate)
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
                value={leaveFormData.endDate}
                onChange={(e) =>
                  handleDateChange(leaveFormData.startDate, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          {leaveBalance.total > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <p className="text-xs font-medium text-gray-500">Leave Balance</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{leaveBalance.total} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used:</span>
                <span className="font-medium text-orange-600">
                  {leaveBalance.used} days
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium text-green-600">
                  {leaveBalance.available} days
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Requesting:</span>
                <span className="font-medium text-blue-600">
                  {leaveBalance.requesting} days
                </span>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason *
            </label>
            <textarea
              value={leaveFormData.reason}
              onChange={(e) =>
                setLeaveFormData({ ...leaveFormData, reason: e.target.value })
              }
              rows={3}
              placeholder="Enter Reason"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={leaveFormData.syncToCalendar}
                onChange={(e) =>
                  setLeaveFormData({
                    ...leaveFormData,
                    syncToCalendar: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Sync to Google Calendar
              </span>
            </label>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetLeaveForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveLeaveApplication}
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
              Leave Application Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedApplication?.employee}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {selectedApplication && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Leave Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedApplication.leaveType}{" "}
                  {selectedApplication.leaveTypePaid ? "(Paid)" : "(Unpaid)"}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}
              >
                {getStatusIcon(selectedApplication.status)}
                {selectedApplication.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedApplication.startDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">End Date</p>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedApplication.endDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Days</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedApplication.days} days
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Applied On</p>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedApplication.appliedOn)}
                </p>
              </div>
            </div>
            {selectedApplication.status !== "Pending" && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="text-xs font-medium text-gray-500">
                  Approval Details
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Approved By:</span>
                  <span className="font-medium">
                    {selectedApplication.approvedBy || "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Approved At:</span>
                  <span className="font-medium">
                    {formatDate(selectedApplication.approvedAt) || "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Comment:</span>
                  <span className="font-medium">
                    {selectedApplication.approverComment || "-"}
                  </span>
                </div>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Reason</p>
              <p className="text-sm text-gray-600">
                {selectedApplication.reason}
              </p>
            </div>
            {selectedApplication.attachment && (
              <div>
                <p className="text-xs text-gray-500">Attachment</p>
                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  <Paperclip className="w-4 h-4" />
                  {selectedApplication.attachment}
                </button>
              </div>
            )}
          </div>
        )}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between gap-3">
          <div className="flex gap-2">
            {selectedApplication?.status === "Pending" && (
              <>
                <button
                  onClick={() => {
                    if (selectedApplication)
                      handleStatusUpdate(selectedApplication.id, "Approved");
                    setShowViewModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <CheckSquare className="w-4 h-4 inline mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    if (selectedApplication)
                      handleStatusUpdate(selectedApplication.id, "Rejected");
                    setShowViewModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Reject
                </button>
              </>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowViewModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowViewModal(false);
                if (selectedApplication) openEditModal(selectedApplication);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
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
            Delete Leave Application
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete this leave application for{" "}
            <span className="font-semibold">
              {selectedApplication?.employee}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteLeaveApplication}
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
            onClick={() => navigate("/hrm")}
            className="hover:text-gray-700"
          >
            HRM
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Leave Applications</span>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Leave Applications
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
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
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setStatusFilter(st);
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
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
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="employee" label="Employee" />
                <SortHeader field="leaveType" label="Leave Type" />
                <SortHeader field="startDate" label="Start Date" />
                <SortHeader field="endDate" label="End Date" />
                <SortHeader field="days" label="Days" />
                <SortHeader field="status" label="Status" />
                <SortHeader field="appliedOn" label="Applied On" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Document
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedApplications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(app)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {app.employee}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span>{app.leaveType}</span>
                    <span className="ml-1 text-xs text-gray-400">
                      {app.leaveTypePaid ? "(Paid)" : "(Unpaid)"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(app.startDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(app.endDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{app.days}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}
                    >
                      {getStatusIcon(app.status)}
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(app.appliedOn)}
                  </td>
                  <td className="px-4 py-3">
                    {app.attachment ? (
                      <Paperclip className="w-4 h-4 text-gray-400" />
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(app)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(app)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(app)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedApplications.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No leave applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {filteredApplications.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredApplications.length)} of{" "}
            {filteredApplications.length} results
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
      {(showCreateModal || showEditModal) && <CreateEditModal />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};
