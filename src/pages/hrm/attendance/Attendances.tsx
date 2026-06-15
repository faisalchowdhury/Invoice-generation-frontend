/**
 * File: src/pages/hrm/Attendance.tsx
 * Complete Attendance Management page with list view, create/edit modal, and details modal
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { showToast } from "@/utils/toast";
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
  Clock,
  CheckCircle,
  AlertCircle,
  Sun,
} from "lucide-react";
import { useResourceData } from "@/hooks/useResourceData";
import { attendanceHooks, employeeHooks, attendanceApi, type Attendance as ApiAttendance } from "@/services/hrm";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AttendanceRow {
  id: string;
  employeeName: string;
  date: string;
  shift: string;
  clockIn: string;
  clockOut: string;
  totalHour: number;
  breakHour: number;
  overtime: number;
  status: "Present" | "Absent" | "Half Day" | "Late" | "Holiday";
  notes: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleAttendancesSeed: ApiAttendance[] = [
  { id: "1", employee_id: "Anthony Walker", shift_id: "Early Morning Shift", date: "2025-10-31", status: "absent" },
  { id: "2", employee_id: "Mark Allen", shift_id: "Flexible Shift", date: "2025-10-31", status: "present", clock_in: "2025-10-31T11:00", clock_out: "2025-10-31T19:30" },
  { id: "3", employee_id: "David Wilson", shift_id: "Flexible Shift", date: "2025-10-28", status: "present", clock_in: "2025-10-28T18:00", clock_out: "2025-10-28T19:30" },
  { id: "4", employee_id: "Michael Brown", shift_id: "Early Morning Shift", date: "2025-10-28", status: "absent" },
  { id: "5", employee_id: "John Smith", shift_id: "Early Morning Shift", date: "2025-10-28", status: "late" },
  { id: "6", employee_id: "Mark Allen", shift_id: "Flexible Shift", date: "2025-10-27", status: "present", clock_in: "2025-10-27T10:00", clock_out: "2025-10-27T18:00" },
  { id: "7", employee_id: "Anthony Walker", shift_id: "Early Morning Shift", date: "2025-10-27", status: "present", clock_in: "2025-10-27T06:00", clock_out: "2025-10-27T15:30" },
  { id: "8", employee_id: "Matthew Clark", shift_id: "Early Morning Shift", date: "2025-10-27", status: "present", clock_in: "2025-10-27T06:00", clock_out: "2025-10-27T14:00" },
  { id: "9", employee_id: "Daniel Thompson", shift_id: "Evening Shift", date: "2025-10-27", status: "present", clock_in: "2025-10-27T14:00", clock_out: "2025-10-27T22:00" },
];

const employees = [
  "Anthony Walker",
  "Mark Allen",
  "David Wilson",
  "Michael Brown",
  "John Smith",
  "Matthew Clark",
  "Daniel Thompson",
  "Christopher Lee",
  "Robert Taylor",
  "James Garcia",
];

const statuses = ["Present", "Absent", "Half Day", "Late", "Holiday"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return "-";
  const date = new Date(dateTimeStr);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


type SortField =
  | "employeeName"
  | "date"
  | "shift"
  | "clockIn"
  | "clockOut"
  | "totalHour"
  | "status";
type SortDir = "asc" | "desc";

// ─── API mapping helpers ──────────────────────────────────────────────────────

const titleCaseStatus = (s: string): AttendanceRow["status"] => {
  const map: Record<string, AttendanceRow["status"]> = {
    present: "Present", absent: "Absent", late: "Late",
    "half day": "Half Day", "half-day": "Half Day", holiday: "Holiday",
  };
  return map[(s ?? "").toLowerCase()] ?? "Absent";
};

const refName = (v: any): string =>
  v && typeof v === "object" ? v.name ?? v.employee_id ?? "" : String(v ?? "");

function mapFromApiAttendance(p: any): AttendanceRow {
  const clockIn = p.clock_in ?? p.clockIn ?? "";
  const clockOut = p.clock_out ?? p.clockOut ?? "";
  const shift = typeof (p.shift_id) === "object"
    ? (p.shift_id?.shift_name ?? p.shift_id?.name ?? "")
    : (p.shift_id ?? p.shift ?? "");
  const totalHour = Number(p.total_hours ?? p.totalHour ?? 0);
  return {
    id: String(p.id ?? p._id ?? ""),
    employeeName: refName(p.employee_id ?? p.employee) || "",
    date: (p.date ?? "").slice(0, 10),
    shift,
    clockIn,
    clockOut,
    totalHour,
    breakHour: Number(p.break_hours ?? p.breakHour ?? 0),
    overtime: Number(p.overtime_hours ?? p.overtime ?? 0),
    status: titleCaseStatus(p.status ?? "absent"),
    notes: p.notes ?? "",
    createdAt: (p.createdAt ?? p.created_at ?? "").slice(0, 10),
  };
}

// ─── Main Component ──────────────────────────────────────────────────────────

export const Attendances: React.FC = () => {
  const navigate = useNavigate();
  const { items: rawAttendances, create, update, remove, refetch } = useResourceData(attendanceHooks, {
    seed: sampleAttendancesSeed,
    params: { page: 1, limit: 100 },
  });
  const attendances = useMemo(() => rawAttendances.map(mapFromApiAttendance), [rawAttendances]);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<AttendanceRow | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [attendanceFormData, setAttendanceFormData] = useState({
    employeeName: "",
    date: new Date().toISOString().split("T")[0],
    clockIn: "",
    clockOut: "",
    notes: "",
    shiftId: "",
  });

  // Employee and shift options from API
  const employeeQuery = employeeHooks.useList({ page: 1, limit: 100 }, { retry: 0 });
  const employeeOptions = useMemo(
    () => (employeeQuery.data ?? []).map((e: any) => {
      const name = typeof e.user_id === "object" ? (e.user_id?.name ?? "") : (e.user_id ?? e.name ?? "");
      return { id: String(e.id ?? e._id ?? ""), name };
    }),
    [employeeQuery.data],
  );
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

  const filteredAttendances = useMemo(() => {
    let result = [...attendances];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) => a.employeeName.toLowerCase().includes(q) || a.date.includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((a) => a.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "totalHour") {
        aVal = a.totalHour;
        bVal = b.totalHour;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [attendances, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredAttendances.length / perPage);
  const paginatedAttendances = filteredAttendances.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetAttendanceForm = () => {
    setAttendanceFormData({
      employeeName: "",
      date: new Date().toISOString().split("T")[0],
      clockIn: "",
      clockOut: "",
      notes: "",
      shiftId: "",
    });
  };

  const openCreateModal = () => {
    resetAttendanceForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const handleClockInOut = async () => {
    try {
      await attendanceApi.clockInOut();
      showToast("Clock in/out recorded!", "success");
      refetch();
    } catch {
      showToast("Clock action failed.", "error");
    }
  };

  const openEditModal = (attendance: AttendanceRow) => {
    setSelectedAttendance(attendance);
    setAttendanceFormData({
      employeeName: attendance.employeeName,
      date: attendance.date,
      clockIn: attendance.clockIn,
      clockOut: attendance.clockOut,
      notes: attendance.notes,
      shiftId: attendance.shift,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (attendance: AttendanceRow) => {
    setSelectedAttendance(attendance);
    setShowViewModal(true);
  };

  const openDeleteModal = (attendance: AttendanceRow) => {
    setSelectedAttendance(attendance);
    setShowDeleteModal(true);
  };

  const handleSaveAttendance = async () => {
    if (!attendanceFormData.employeeName) {
      showToast("Please select an employee", "info");
      return;
    }
    if (!attendanceFormData.date) {
      showToast("Please select a date", "info");
      return;
    }
    if (!attendanceFormData.clockIn) {
      showToast("Please select clock in time", "info");
      return;
    }

    const payload = {
      employee_id: attendanceFormData.employeeName,
      shift_id: attendanceFormData.shiftId || undefined,
      date: attendanceFormData.date,
      status: "present" as const,
    };

    try {
      if (isEditing && selectedAttendance) {
        await update(selectedAttendance.id, { status: payload.status });
        showToast("Attendance updated successfully!", "success");
        setShowEditModal(false);
      } else {
        await create(payload);
        showToast("Attendance created successfully!", "success");
        setShowCreateModal(false);
      }
      resetAttendanceForm();
    } catch {
      showToast("Could not save attendance. Please try again.", "error");
    }
  };

  const handleDeleteAttendance = async () => {
    if (selectedAttendance) {
      try {
        await remove(selectedAttendance.id);
        showToast("Attendance deleted successfully!", "success");
      } catch {
        showToast("Could not delete attendance.", "error");
      }
      setShowDeleteModal(false);
      setSelectedAttendance(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      case "Half Day":
        return "bg-yellow-100 text-yellow-700";
      case "Late":
        return "bg-orange-100 text-orange-700";
      case "Holiday":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="w-3 h-3" />;
      case "Absent":
        return <X className="w-3 h-3" />;
      case "Half Day":
        return <Clock className="w-3 h-3" />;
      case "Late":
        return <AlertCircle className="w-3 h-3" />;
      case "Holiday":
        return <Sun className="w-3 h-3" />;
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
              {isEditing ? "Edit Attendance" : "Create Attendance"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update attendance information"
                : "Record a new attendance"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetAttendanceForm();
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
              value={attendanceFormData.employeeName}
              onChange={(e) =>
                setAttendanceFormData({
                  ...attendanceFormData,
                  employeeName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">Select Employee</option>
              {employeeOptions.length > 0
                ? employeeOptions.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))
                : employees.map((emp) => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={attendanceFormData.date}
              onChange={(e) =>
                setAttendanceFormData({
                  ...attendanceFormData,
                  date: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clock In Time *
            </label>
            <input
              type="datetime-local"
              value={attendanceFormData.clockIn}
              onChange={(e) =>
                setAttendanceFormData({
                  ...attendanceFormData,
                  clockIn: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clock Out Time
            </label>
            <input
              type="datetime-local"
              value={attendanceFormData.clockOut}
              onChange={(e) =>
                setAttendanceFormData({
                  ...attendanceFormData,
                  clockOut: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={attendanceFormData.notes}
              onChange={(e) =>
                setAttendanceFormData({
                  ...attendanceFormData,
                  notes: e.target.value,
                })
              }
              rows={3}
              placeholder="Enter notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetAttendanceForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAttendance}
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
              Attendance Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedAttendance?.employeeName}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {selectedAttendance && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Employee Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedAttendance.employeeName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Shift</p>
                <p className="text-sm text-gray-600">
                  {selectedAttendance.shift}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm text-gray-600">
                  {selectedAttendance.date}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAttendance.status)}`}
                >
                  {getStatusIcon(selectedAttendance.status)}
                  {selectedAttendance.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Clock In Time</p>
                <p className="text-sm text-gray-600">
                  {formatDateTime(selectedAttendance.clockIn)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Clock Out Time</p>
                <p className="text-sm text-gray-600">
                  {selectedAttendance.clockOut
                    ? formatDateTime(selectedAttendance.clockOut)
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Break Hours</p>
                <p className="text-sm text-gray-600">
                  {selectedAttendance.breakHour.toFixed(2)}h
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Overtime Hours</p>
                <p className="text-sm text-gray-600">
                  {selectedAttendance.overtime.toFixed(2)}h
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Hours</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedAttendance.totalHour.toFixed(2)}h
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Overtime Amount</p>
                <p className="text-sm font-medium text-green-600">
                  {fmtCurrency(selectedAttendance.overtime * 25)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Notes</p>
                <p className="text-sm text-gray-600">
                  {selectedAttendance.notes || "-"}
                </p>
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
              if (selectedAttendance) openEditModal(selectedAttendance);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Attendance
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
            Delete Attendance
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete this attendance record for{" "}
            <span className="font-semibold">
              {selectedAttendance?.employeeName}
            </span>{" "}
            on <span className="font-semibold">{selectedAttendance?.date}</span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteAttendance}
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
          <span className="text-gray-900 font-medium">Attendance</span>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Attendances
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClockInOut}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Clock In/Out
            </button>
            <button
              onClick={openCreateModal}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name or date..."
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
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="employeeName" label="Employee Name" />
                <SortHeader field="date" label="Date" />
                <SortHeader field="shift" label="Shift" />
                <SortHeader field="clockIn" label="Clock In" />
                <SortHeader field="clockOut" label="Clock Out" />
                <SortHeader field="totalHour" label="Total Hour" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Break Hour
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Overtime
                </th>
                <SortHeader field="status" label="Status" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedAttendances.map((att) => (
                <tr
                  key={att.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(att)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {att.employeeName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{att.date}</td>
                  <td className="px-4 py-3 text-gray-600">{att.shift}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDateTime(att.clockIn)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {att.clockOut ? formatDateTime(att.clockOut) : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {att.totalHour.toFixed(2)}h
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {att.breakHour.toFixed(2)}h
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {att.overtime.toFixed(2)}h
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(att.status)}`}
                    >
                      {getStatusIcon(att.status)}
                      {att.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(att)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(att)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(att)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedAttendances.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No attendance records found.
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
            {filteredAttendances.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredAttendances.length)} of{" "}
            {filteredAttendances.length} results
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
