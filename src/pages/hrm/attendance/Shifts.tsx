/**
 * File: src/pages/hrm/Shifts.tsx
 * Complete Shifts Management page with list view, create/edit modal, and delete confirmation
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
  Moon,
  Sun,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Shift {
  id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  isNightShift: boolean;
  createdBy: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleShifts: Shift[] = [
  {
    id: "1",
    shiftName: "Morning Shift",
    startTime: "09:00",
    endTime: "17:00",
    breakStartTime: "13:00",
    breakEndTime: "14:00",
    isNightShift: false,
    createdBy: "Company",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    shiftName: "Evening Shift",
    startTime: "14:00",
    endTime: "22:00",
    breakStartTime: "18:00",
    breakEndTime: "19:00",
    isNightShift: false,
    createdBy: "Company",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    shiftName: "Night Shift",
    startTime: "22:00",
    endTime: "06:00",
    breakStartTime: "02:00",
    breakEndTime: "03:00",
    isNightShift: true,
    createdBy: "Company",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    shiftName: "Early Morning Shift",
    startTime: "06:00",
    endTime: "14:00",
    breakStartTime: "10:00",
    breakEndTime: "11:00",
    isNightShift: false,
    createdBy: "Company",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    shiftName: "Flexible Shift",
    startTime: "10:00",
    endTime: "18:00",
    breakStartTime: "14:00",
    breakEndTime: "15:00",
    isNightShift: false,
    createdBy: "Company",
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    shiftName: "Weekend Shift",
    startTime: "08:00",
    endTime: "16:00",
    breakStartTime: "12:00",
    breakEndTime: "13:00",
    isNightShift: false,
    createdBy: "Company",
    createdAt: "2024-01-01",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SortField =
  | "shiftName"
  | "startTime"
  | "endTime"
  | "isNightShift"
  | "createdBy";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Shifts: React.FC = () => {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<Shift[]>(sampleShifts);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("shiftName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [shiftFormData, setShiftFormData] = useState({
    shiftName: "",
    startTime: "09:00",
    endTime: "17:00",
    breakStartTime: "13:00",
    breakEndTime: "14:00",
    isNightShift: false,
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

  const filteredShifts = useMemo(() => {
    let result = [...shifts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.shiftName.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "isNightShift") {
        aVal = a.isNightShift ? 1 : 0;
        bVal = b.isNightShift ? 1 : 0;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [shifts, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filteredShifts.length / perPage);
  const paginatedShifts = filteredShifts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetShiftForm = () => {
    setShiftFormData({
      shiftName: "",
      startTime: "09:00",
      endTime: "17:00",
      breakStartTime: "13:00",
      breakEndTime: "14:00",
      isNightShift: false,
    });
  };

  const openCreateModal = () => {
    resetShiftForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (shift: Shift) => {
    setSelectedShift(shift);
    setShiftFormData({
      shiftName: shift.shiftName,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakStartTime: shift.breakStartTime,
      breakEndTime: shift.breakEndTime,
      isNightShift: shift.isNightShift,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openDeleteModal = (shift: Shift) => {
    setSelectedShift(shift);
    setShowDeleteModal(true);
  };

  const handleSaveShift = () => {
    if (!shiftFormData.shiftName) {
      showToast("Please enter shift name", "info");
      return;
    }
    if (!shiftFormData.startTime) {
      showToast("Please select start time", "info");
      return;
    }
    if (!shiftFormData.endTime) {
      showToast("Please select end time", "info");
      return;
    }

    if (isEditing && selectedShift) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === selectedShift.id
            ? {
                ...s,
                shiftName: shiftFormData.shiftName,
                startTime: shiftFormData.startTime,
                endTime: shiftFormData.endTime,
                breakStartTime: shiftFormData.breakStartTime,
                breakEndTime: shiftFormData.breakEndTime,
                isNightShift: shiftFormData.isNightShift,
              }
            : s,
        ),
      );
      showToast("Shift updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newShift: Shift = {
        id: Date.now().toString(),
        shiftName: shiftFormData.shiftName,
        startTime: shiftFormData.startTime,
        endTime: shiftFormData.endTime,
        breakStartTime: shiftFormData.breakStartTime,
        breakEndTime: shiftFormData.breakEndTime,
        isNightShift: shiftFormData.isNightShift,
        createdBy: "Company",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setShifts((prev) => [newShift, ...prev]);
      showToast("Shift created successfully!", "success");
      setShowCreateModal(false);
    }
    resetShiftForm();
  };

  const handleDeleteShift = () => {
    if (selectedShift) {
      setShifts((prev) => prev.filter((s) => s.id !== selectedShift.id));
      showToast("Shift deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedShift(null);
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "-";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
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
              {isEditing ? "Edit Shift" : "Create Shift"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing ? "Update shift information" : "Add a new shift"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetShiftForm();
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
                Shift Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={shiftFormData.shiftName}
                onChange={(e) =>
                  setShiftFormData({
                    ...shiftFormData,
                    shiftName: e.target.value,
                  })
                }
                placeholder="Enter Shift Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={shiftFormData.startTime}
                onChange={(e) =>
                  setShiftFormData({
                    ...shiftFormData,
                    startTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={shiftFormData.endTime}
                onChange={(e) =>
                  setShiftFormData({
                    ...shiftFormData,
                    endTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Break Start Time
              </label>
              <input
                type="time"
                value={shiftFormData.breakStartTime}
                onChange={(e) =>
                  setShiftFormData({
                    ...shiftFormData,
                    breakStartTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Break End Time
              </label>
              <input
                type="time"
                value={shiftFormData.breakEndTime}
                onChange={(e) =>
                  setShiftFormData({
                    ...shiftFormData,
                    breakEndTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shiftFormData.isNightShift}
                  onChange={(e) =>
                    setShiftFormData({
                      ...shiftFormData,
                      isNightShift: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Is Night Shift</span>
              </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetShiftForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveShift}
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
            Delete Shift
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedShift?.shiftName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteShift}
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
            onClick={() => navigate("/hrm")}
            className="hover:text-gray-700"
          >
            HRM
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Shifts</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Manage Shifts</h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Shift"
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
                placeholder="Search Shifts..."
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
                      Night Shift
                    </span>
                  </div>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    Yes
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    No
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
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="shiftName" label="Shift Name" />
                <SortHeader field="startTime" label="Start Time" />
                <SortHeader field="endTime" label="End Time" />
                <SortHeader field="isNightShift" label="Night Shift" />
                <SortHeader field="createdBy" label="Created By" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedShifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {shift.shiftName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatTime(shift.startTime)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatTime(shift.endTime)}
                  </td>
                  <td className="px-4 py-3">
                    {shift.isNightShift ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Moon className="w-3 h-3" />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Sun className="w-3 h-3" />
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{shift.createdBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(shift)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(shift)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedShifts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No shifts found.
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
            {filteredShifts.length === 0 ? 0 : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredShifts.length)} of{" "}
            {filteredShifts.length} results
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
