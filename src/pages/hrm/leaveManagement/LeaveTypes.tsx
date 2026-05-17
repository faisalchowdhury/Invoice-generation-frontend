/**
 * File: src/pages/hrm/LeaveTypes.tsx
 * Complete Leave Types Management page with list view, create/edit modal, and details modal
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/toast";
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
  CheckCircle,
  AlertCircle,
  Palette,
  FileText,
  User,
  Clock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaveType {
  id: string;
  name: string;
  maxDaysPerYear: number;
  isPaid: boolean;
  color: string;
  description: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleLeaveTypes: LeaveType[] = [
  {
    id: "1",
    name: "Annual Leave",
    maxDaysPerYear: 21,
    isPaid: true,
    color: "#10B981",
    description: "Yearly vacation leave for employees to rest and recharge.",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Sick Leave",
    maxDaysPerYear: 10,
    isPaid: true,
    color: "#3B82F6",
    description: "Leave for illness or medical appointments.",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Maternity Leave",
    maxDaysPerYear: 90,
    isPaid: true,
    color: "#EC4899",
    description: "Leave for new mothers after childbirth.",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Paternity Leave",
    maxDaysPerYear: 15,
    isPaid: true,
    color: "#06B6D4",
    description: "Leave for new fathers after childbirth.",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "Personal Leave",
    maxDaysPerYear: 5,
    isPaid: false,
    color: "#F59E0B",
    description: "Leave for personal matters and emergencies.",
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "Bereavement Leave",
    maxDaysPerYear: 3,
    isPaid: true,
    color: "#6B7280",
    description: "Leave for mourning the loss of a family member.",
    createdAt: "2024-01-01",
  },
  {
    id: "7",
    name: "Study Leave",
    maxDaysPerYear: 30,
    isPaid: false,
    color: "#8B5CF6",
    description: "Leave for educational pursuits and examinations.",
    createdAt: "2024-01-01",
  },
  {
    id: "8",
    name: "Emergency Leave",
    maxDaysPerYear: 2,
    isPaid: true,
    color: "#EF4444",
    description: "Leave for unexpected urgent situations.",
    createdAt: "2024-01-01",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SortField = "name" | "maxDaysPerYear" | "isPaid";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const LeaveTypes: React.FC = () => {
  const navigate = useNavigate();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(sampleLeaveTypes);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [paidFilter, setPaidFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [leaveTypeFormData, setLeaveTypeFormData] = useState({
    name: "",
    maxDaysPerYear: 0,
    isPaid: true,
    color: "#10B981",
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

  const filteredLeaveTypes = useMemo(() => {
    let result = [...leaveTypes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((l) => l.name.toLowerCase().includes(q));
    }

    if (paidFilter !== "All") {
      result = result.filter((l) => l.isPaid === (paidFilter === "Paid"));
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "maxDaysPerYear") {
        aVal = a.maxDaysPerYear;
        bVal = b.maxDaysPerYear;
      }
      if (sortField === "isPaid") {
        aVal = a.isPaid ? 1 : 0;
        bVal = b.isPaid ? 1 : 0;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [leaveTypes, searchQuery, paidFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredLeaveTypes.length / perPage);
  const paginatedLeaveTypes = filteredLeaveTypes.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetLeaveTypeForm = () => {
    setLeaveTypeFormData({
      name: "",
      maxDaysPerYear: 0,
      isPaid: true,
      color: "#10B981",
      description: "",
    });
  };

  const openCreateModal = () => {
    resetLeaveTypeForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setLeaveTypeFormData({
      name: leaveType.name,
      maxDaysPerYear: leaveType.maxDaysPerYear,
      isPaid: leaveType.isPaid,
      color: leaveType.color,
      description: leaveType.description,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setShowViewModal(true);
  };

  const openDeleteModal = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setShowDeleteModal(true);
  };

  const handleSaveLeaveType = () => {
    if (!leaveTypeFormData.name) {
      showToast("Please enter leave type name", "info");
      return;
    }
    if (leaveTypeFormData.maxDaysPerYear <= 0) {
      showToast("Please enter valid max days per year", "info");
      return;
    }

    if (isEditing && selectedLeaveType) {
      setLeaveTypes((prev) =>
        prev.map((l) =>
          l.id === selectedLeaveType.id
            ? {
                ...l,
                name: leaveTypeFormData.name,
                maxDaysPerYear: leaveTypeFormData.maxDaysPerYear,
                isPaid: leaveTypeFormData.isPaid,
                color: leaveTypeFormData.color,
                description: leaveTypeFormData.description,
              }
            : l,
        ),
      );
      showToast("Leave type updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newLeaveType: LeaveType = {
        id: Date.now().toString(),
        name: leaveTypeFormData.name,
        maxDaysPerYear: leaveTypeFormData.maxDaysPerYear,
        isPaid: leaveTypeFormData.isPaid,
        color: leaveTypeFormData.color,
        description: leaveTypeFormData.description,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setLeaveTypes((prev) => [newLeaveType, ...prev]);
      showToast("Leave type created successfully!", "success");
      setShowCreateModal(false);
    }
    resetLeaveTypeForm();
  };

  const handleDeleteLeaveType = () => {
    if (selectedLeaveType) {
      setLeaveTypes((prev) =>
        prev.filter((l) => l.id !== selectedLeaveType.id),
      );
      showToast("Leave type deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedLeaveType(null);
    }
  };

  const getPaidStatusColor = (isPaid: boolean) => {
    return isPaid
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  };

  const getPaidStatusIcon = (isPaid: boolean) => {
    return isPaid ? (
      <CheckCircle className="w-3 h-3" />
    ) : (
      <AlertCircle className="w-3 h-3" />
    );
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
              {isEditing ? "Edit Leave Type" : "Create Leave Type"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update leave type information"
                : "Add a new leave type"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetLeaveTypeForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={leaveTypeFormData.name}
              onChange={(e) =>
                setLeaveTypeFormData({
                  ...leaveTypeFormData,
                  name: e.target.value,
                })
              }
              placeholder="Enter Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Days Per Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              value={leaveTypeFormData.maxDaysPerYear || ""}
              onChange={(e) =>
                setLeaveTypeFormData({
                  ...leaveTypeFormData,
                  maxDaysPerYear: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={leaveTypeFormData.isPaid}
                onChange={(e) =>
                  setLeaveTypeFormData({
                    ...leaveTypeFormData,
                    isPaid: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Is Paid</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={leaveTypeFormData.color}
                onChange={(e) =>
                  setLeaveTypeFormData({
                    ...leaveTypeFormData,
                    color: e.target.value,
                  })
                }
                className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={leaveTypeFormData.color}
                onChange={(e) =>
                  setLeaveTypeFormData({
                    ...leaveTypeFormData,
                    color: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={leaveTypeFormData.description}
              onChange={(e) =>
                setLeaveTypeFormData({
                  ...leaveTypeFormData,
                  description: e.target.value,
                })
              }
              rows={3}
              placeholder="Enter Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetLeaveTypeForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveLeaveType}
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
              Leave Type Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedLeaveType?.name}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {selectedLeaveType && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: selectedLeaveType.color + "20" }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: selectedLeaveType.color }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedLeaveType.name}
                </p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPaidStatusColor(selectedLeaveType.isPaid)}`}
                >
                  {getPaidStatusIcon(selectedLeaveType.isPaid)}
                  {selectedLeaveType.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Max Days Per Year</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedLeaveType.maxDaysPerYear} days
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Color</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedLeaveType.color }}
                  />
                  <p className="text-sm text-gray-600">
                    {selectedLeaveType.color}
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-600">
                  {selectedLeaveType.description || "-"}
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
              if (selectedLeaveType) openEditModal(selectedLeaveType);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Leave Type
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
            Delete Leave Type
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedLeaveType?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteLeaveType}
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
          <span className="text-gray-900 font-medium">Leave Types</span>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Leave Types
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
                placeholder="Search Leave Types..."
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
                      Paid Status
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setPaidFilter("All");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setPaidFilter("Paid");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => {
                      setPaidFilter("Unpaid");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Unpaid
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="name" label="Name" />
                <SortHeader field="maxDaysPerYear" label="Max Days Per Year" />
                <SortHeader field="isPaid" label="Is Paid" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedLeaveTypes.map((leaveType) => (
                <tr
                  key={leaveType.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(leaveType)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: leaveType.color }}
                      />
                      <span className="font-medium text-gray-900">
                        {leaveType.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {leaveType.maxDaysPerYear} days
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPaidStatusColor(leaveType.isPaid)}`}
                    >
                      {getPaidStatusIcon(leaveType.isPaid)}
                      {leaveType.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(leaveType)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(leaveType)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(leaveType)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedLeaveTypes.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No leave types found.
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
            {filteredLeaveTypes.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredLeaveTypes.length)} of{" "}
            {filteredLeaveTypes.length} results
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
