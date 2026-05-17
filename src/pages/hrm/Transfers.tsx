/**
 * File: src/pages/hrm/EmployeeTransfers.tsx
 * Complete Employee Transfers Management page with list view, create/edit modal, and details modal
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
  User,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRightLeft,
  Building2,
  Briefcase,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmployeeTransfer {
  id: string;
  employee: string;
  fromBranch: string;
  fromDepartment: string;
  fromDesignation: string;
  toBranch: string;
  toDepartment: string;
  toDesignation: string;
  effectiveDate: string;
  reason: string;
  document: string;
  status: "Pending" | "Approved" | "In progress" | "Cancelled" | "Completed";
  approvedBy: string;
  approvedAt: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleTransfers: EmployeeTransfer[] = [
  {
    id: "1",
    employee: "Mark Allen",
    fromBranch: "Customer Service Center",
    fromDepartment: "Customer Support",
    fromDesignation: "Senior Associate",
    toBranch: "North Branch",
    toDepartment: "Procurement",
    toDesignation: "Senior Analyst",
    effectiveDate: "2026-01-24",
    reason:
      "Emergency response planning requiring experienced personnel to establish crisis management protocols.",
    document: "",
    status: "In progress",
    approvedBy: "",
    approvedAt: "",
    createdAt: "2026-01-20",
  },
  {
    id: "2",
    employee: "Anthony Walker",
    fromBranch: "Customer Service Center",
    fromDepartment: "Legal & Compliance",
    fromDesignation: "Associate",
    toBranch: "Sales Office",
    toDepartment: "Sales",
    toDesignation: "Sales Executive",
    effectiveDate: "2026-01-19",
    reason: "Cross-functional skill development and career growth opportunity.",
    document: "",
    status: "Pending",
    approvedBy: "",
    approvedAt: "",
    createdAt: "2026-01-15",
  },
  {
    id: "3",
    employee: "Matthew Clark",
    fromBranch: "Customer Service Center",
    fromDepartment: "Technical Support",
    fromDesignation: "Support Engineer",
    toBranch: "Regional Office",
    toDepartment: "IT",
    toDesignation: "System Administrator",
    effectiveDate: "2026-01-10",
    reason: "Technical expertise needed for infrastructure upgrade project.",
    document: "",
    status: "Approved",
    approvedBy: "Emily Davis",
    approvedAt: "2026-01-12",
    createdAt: "2026-01-05",
  },
  {
    id: "4",
    employee: "Daniel Thompson",
    fromBranch: "Sales Office",
    fromDepartment: "Customer Service",
    fromDesignation: "Team Lead",
    toBranch: "Main Office",
    toDepartment: "Sales & Marketing",
    toDesignation: "Manager",
    effectiveDate: "2026-01-09",
    reason: "Leadership expansion and team restructuring.",
    document: "",
    status: "In progress",
    approvedBy: "",
    approvedAt: "",
    createdAt: "2026-01-04",
  },
  {
    id: "5",
    employee: "Christopher Lee",
    fromBranch: "Sales Office",
    fromDepartment: "Marketing",
    fromDesignation: "Marketing Executive",
    toBranch: "Corporate Headquarters",
    toDepartment: "Brand Management",
    toDesignation: "Brand Manager",
    effectiveDate: "2025-12-31",
    reason: "Corporate branding initiative requiring experienced personnel.",
    document: "",
    status: "In progress",
    approvedBy: "",
    approvedAt: "",
    createdAt: "2025-12-28",
  },
  {
    id: "6",
    employee: "James Garcia",
    fromBranch: "Sales Office",
    fromDepartment: "Customer Service",
    fromDesignation: "Senior Consultant",
    toBranch: "Customer Service Center",
    toDepartment: "Technical Support",
    toDesignation: "Team Lead",
    effectiveDate: "2025-12-25",
    reason: "Technical support team expansion and skill enhancement.",
    document: "",
    status: "Approved",
    approvedBy: "Michelle Hall",
    approvedAt: "2025-12-27",
    createdAt: "2025-12-22",
  },
  {
    id: "7",
    employee: "Robert Taylor",
    fromBranch: "Regional Office",
    fromDepartment: "Finance & Accounting",
    fromDesignation: "Analyst",
    toBranch: "Customer Service Center",
    toDepartment: "Operations",
    toDesignation: "Operations Analyst",
    effectiveDate: "2025-12-30",
    reason: "Process improvement initiative and operational excellence.",
    document: "",
    status: "In progress",
    approvedBy: "",
    approvedAt: "",
    createdAt: "2025-12-26",
  },
  {
    id: "8",
    employee: "David Wilson",
    fromBranch: "Regional Office",
    fromDepartment: "Human Resources",
    fromDesignation: "HR Officer",
    toBranch: "East Branch",
    toDepartment: "Administration",
    toDesignation: "Admin Manager",
    effectiveDate: "2025-12-23",
    reason: "Branch administration strengthening requirement.",
    document: "",
    status: "Cancelled",
    approvedBy: "",
    approvedAt: "",
    createdAt: "2025-12-20",
  },
  {
    id: "9",
    employee: "Michael Brown",
    fromBranch: "Regional Office",
    fromDepartment: "Finance & Accounting",
    fromDesignation: "Assistant Manager",
    toBranch: "North Branch",
    toDepartment: "Procurement",
    toDesignation: "Manager",
    effectiveDate: "2025-12-13",
    reason: "Procurement department restructuring and leadership gap.",
    document: "",
    status: "In progress",
    approvedBy: "",
    approvedAt: "",
    createdAt: "2025-12-10",
  },
];

const employees = [
  "Mark Allen",
  "Anthony Walker",
  "Matthew Clark",
  "Daniel Thompson",
  "Christopher Lee",
  "James Garcia",
  "Robert Taylor",
  "David Wilson",
  "Michael Brown",
  "John Smith",
];

const branches = [
  "Customer Service Center",
  "Sales Office",
  "Regional Office",
  "Main Office",
  "North Branch",
  "South Branch",
  "East Branch",
  "West Branch",
  "Corporate Headquarters",
];

const departments: Record<string, string[]> = {
  "Customer Service Center": [
    "Customer Support",
    "Technical Support",
    "Legal & Compliance",
    "Operations",
  ],
  "Sales Office": ["Sales", "Marketing", "Customer Service"],
  "Regional Office": [
    "Finance & Accounting",
    "Human Resources",
    "IT",
    "Administration",
  ],
  "Main Office": ["Sales & Marketing", "Corporate Affairs", "Executive"],
  "North Branch": ["Procurement", "Logistics", "Warehouse"],
  "South Branch": ["Finance & Accounting", "Sales", "Support"],
  "East Branch": ["Administration", "Facilities", "Security"],
  "West Branch": ["Operations", "Quality", "Maintenance"],
  "Corporate Headquarters": ["Brand Management", "Strategy", "Legal"],
};

const designations: Record<string, string[]> = {
  "Customer Support": ["Associate", "Senior Associate", "Team Lead", "Manager"],
  "Technical Support": [
    "Support Engineer",
    "Senior Support Engineer",
    "Team Lead",
    "Manager",
  ],
  "Legal & Compliance": [
    "Legal Officer",
    "Compliance Officer",
    "Manager",
    "Associate",
  ],
  Operations: ["Operations Analyst", "Operations Manager", "Coordinator"],
  Sales: ["Sales Executive", "Senior Sales Executive", "Sales Manager"],
  Marketing: ["Marketing Executive", "Marketing Manager", "Brand Manager"],
  "Customer Service": ["Support Associate", "Senior Consultant", "Team Lead"],
  "Finance & Accounting": [
    "Accountant",
    "Senior Accountant",
    "Finance Manager",
    "Analyst",
    "Assistant Manager",
  ],
  "Human Resources": ["HR Officer", "HR Manager", "Recruiter"],
  IT: ["IT Support", "System Administrator", "Developer", "IT Manager"],
  Administration: ["Admin Officer", "Admin Manager", "Coordinator"],
  Procurement: ["Procurement Officer", "Analyst", "Manager"],
  Logistics: ["Logistics Coordinator", "Supply Chain Analyst", "Manager"],
  "Sales & Marketing": ["Coordinator", "Specialist", "Manager"],
  "Brand Management": ["Brand Executive", "Brand Manager", "Director"],
  Strategy: ["Strategy Analyst", "Strategy Manager", "Director"],
};

const statuses = [
  "Pending",
  "Approved",
  "In progress",
  "Cancelled",
  "Completed",
];

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

type SortField =
  | "employee"
  | "transferPath"
  | "status"
  | "effectiveDate"
  | "approvedBy";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const EmployeeTransfers: React.FC = () => {
  const navigate = useNavigate();
  const [transfers, setTransfers] =
    useState<EmployeeTransfer[]>(sampleTransfers);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("effectiveDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<EmployeeTransfer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // Form state
  const [transferFormData, setTransferFormData] = useState({
    employee: "",
    toBranch: "",
    toDepartment: "",
    toDesignation: "",
    effectiveDate: "",
    reason: "",
    document: null as File | null,
    documentName: "",
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

  const filteredTransfers = useMemo(() => {
    let result = [...transfers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.employee.toLowerCase().includes(q) ||
          t.reason.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((t) => t.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal = (a as any)[sortField];
      let bVal = (b as any)[sortField];

      if (sortField === "transferPath") {
        aVal = `${a.fromBranch} to ${a.toBranch}`;
        bVal = `${b.fromBranch} to ${b.toBranch}`;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [transfers, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredTransfers.length / perPage);
  const paginatedTransfers = filteredTransfers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTransferFormData({
        ...transferFormData,
        document: e.target.files[0],
        documentName: e.target.files[0].name,
      });
    }
  };

  const resetTransferForm = () => {
    setTransferFormData({
      employee: "",
      toBranch: "",
      toDepartment: "",
      toDesignation: "",
      effectiveDate: "",
      reason: "",
      document: null,
      documentName: "",
    });
  };

  const openCreateModal = () => {
    resetTransferForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (transfer: EmployeeTransfer) => {
    setSelectedTransfer(transfer);
    setTransferFormData({
      employee: transfer.employee,
      toBranch: transfer.toBranch,
      toDepartment: transfer.toDepartment,
      toDesignation: transfer.toDesignation,
      effectiveDate: transfer.effectiveDate,
      reason: transfer.reason,
      document: null,
      documentName: transfer.document,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (transfer: EmployeeTransfer) => {
    setSelectedTransfer(transfer);
    setShowViewModal(true);
  };

  const openStatusModal = (transfer: EmployeeTransfer) => {
    setSelectedTransfer(transfer);
    setNewStatus(transfer.status);
    setShowStatusModal(true);
  };

  const openDeleteModal = (transfer: EmployeeTransfer) => {
    setSelectedTransfer(transfer);
    setShowDeleteModal(true);
  };

  const handleStatusUpdate = () => {
    if (selectedTransfer && newStatus) {
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === selectedTransfer.id
            ? {
                ...t,
                status: newStatus as any,
                approvedBy:
                  newStatus === "Approved" ? "HR Manager" : t.approvedBy,
                approvedAt:
                  newStatus === "Approved"
                    ? new Date().toISOString().split("T")[0]
                    : t.approvedAt,
              }
            : t,
        ),
      );
      showToast(`Transfer status updated to ${newStatus}!`, "success");
      setShowStatusModal(false);
    }
  };

  const handleSaveTransfer = () => {
    if (!transferFormData.employee) {
      showToast("Please select an employee", "info");
      return;
    }
    if (!transferFormData.toBranch) {
      showToast("Please select to branch", "info");
      return;
    }
    if (!transferFormData.toDepartment) {
      showToast("Please select to department", "info");
      return;
    }
    if (!transferFormData.toDesignation) {
      showToast("Please select to designation", "info");
      return;
    }
    if (!transferFormData.effectiveDate) {
      showToast("Please select effective date", "info");
      return;
    }

    // Find current employee details (in a real app, fetch from API)
    const currentDetails = {
      fromBranch: "Customer Service Center",
      fromDepartment: "Customer Support",
      fromDesignation: "Senior Associate",
    };

    if (isEditing && selectedTransfer) {
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === selectedTransfer.id
            ? {
                ...t,
                employee: transferFormData.employee,
                toBranch: transferFormData.toBranch,
                toDepartment: transferFormData.toDepartment,
                toDesignation: transferFormData.toDesignation,
                effectiveDate: transferFormData.effectiveDate,
                reason: transferFormData.reason,
                document: transferFormData.documentName || t.document,
              }
            : t,
        ),
      );
      showToast("Transfer updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newTransfer: EmployeeTransfer = {
        id: Date.now().toString(),
        employee: transferFormData.employee,
        fromBranch: currentDetails.fromBranch,
        fromDepartment: currentDetails.fromDepartment,
        fromDesignation: currentDetails.fromDesignation,
        toBranch: transferFormData.toBranch,
        toDepartment: transferFormData.toDepartment,
        toDesignation: transferFormData.toDesignation,
        effectiveDate: transferFormData.effectiveDate,
        reason: transferFormData.reason,
        document: transferFormData.documentName || "",
        status: "Pending",
        approvedBy: "",
        approvedAt: "",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTransfers((prev) => [newTransfer, ...prev]);
      showToast("Transfer created successfully!", "success");
      setShowCreateModal(false);
    }
    resetTransferForm();
  };

  const handleDeleteTransfer = () => {
    if (selectedTransfer) {
      setTransfers((prev) => prev.filter((t) => t.id !== selectedTransfer.id));
      showToast("Transfer deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedTransfer(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "In progress":
        return "bg-yellow-100 text-yellow-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-3 h-3" />;
      case "Completed":
        return <CheckCircle className="w-3 h-3" />;
      case "In progress":
        return <Clock className="w-3 h-3" />;
      case "Pending":
        return <AlertCircle className="w-3 h-3" />;
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

  const CreateEditModal = () => {
    const availableDepartments = transferFormData.toBranch
      ? departments[transferFormData.toBranch] || []
      : [];
    const availableDesignations = transferFormData.toDepartment
      ? designations[transferFormData.toDepartment] || []
      : [];

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditing
                  ? "Edit Employee Transfer"
                  : "Create Employee Transfer"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {isEditing
                  ? "Update transfer information"
                  : "Add a new employee transfer"}
              </p>
            </div>
            <button
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                resetTransferForm();
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
                value={transferFormData.employee}
                onChange={(e) =>
                  setTransferFormData({
                    ...transferFormData,
                    employee: e.target.value,
                  })
                }
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
                To Branch *
              </label>
              <select
                value={transferFormData.toBranch}
                onChange={(e) =>
                  setTransferFormData({
                    ...transferFormData,
                    toBranch: e.target.value,
                    toDepartment: "",
                    toDesignation: "",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select To Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Department *
              </label>
              <select
                value={transferFormData.toDepartment}
                onChange={(e) =>
                  setTransferFormData({
                    ...transferFormData,
                    toDepartment: e.target.value,
                    toDesignation: "",
                  })
                }
                disabled={!transferFormData.toBranch}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100"
              >
                <option value="">
                  {transferFormData.toBranch
                    ? "Select To Department"
                    : "Select Branch first"}
                </option>
                {availableDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Designation *
              </label>
              <select
                value={transferFormData.toDesignation}
                onChange={(e) =>
                  setTransferFormData({
                    ...transferFormData,
                    toDesignation: e.target.value,
                  })
                }
                disabled={!transferFormData.toDepartment}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100"
              >
                <option value="">
                  {transferFormData.toDepartment
                    ? "Select To Designation"
                    : "Select Department first"}
                </option>
                {availableDesignations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date *
              </label>
              <input
                type="date"
                value={transferFormData.effectiveDate}
                onChange={(e) =>
                  setTransferFormData({
                    ...transferFormData,
                    effectiveDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                value={transferFormData.reason}
                onChange={(e) =>
                  setTransferFormData({
                    ...transferFormData,
                    reason: e.target.value,
                  })
                }
                rows={3}
                placeholder="Enter Reason"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.png,.docx"
                  className="hidden"
                  id="document-upload"
                />
                <button
                  onClick={() =>
                    document.getElementById("document-upload")?.click()
                  }
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  Browse
                </button>
                {transferFormData.documentName && (
                  <span className="text-sm text-green-600">
                    {transferFormData.documentName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                resetTransferForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTransfer}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StatusModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Update Transfer Status
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedTransfer?.employee}
            </p>
          </div>
          <button
            onClick={() => setShowStatusModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
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
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowStatusModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleStatusUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Status
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
              Transfer Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedTransfer?.employee}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {selectedTransfer && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Employee</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTransfer.employee}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTransfer.status)}`}
              >
                {getStatusIcon(selectedTransfer.status)}
                {selectedTransfer.status}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Transfer Path</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  {selectedTransfer.fromBranch}
                </span>
                <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-blue-600">
                  {selectedTransfer.toBranch}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                From: {selectedTransfer.fromDepartment} -{" "}
                {selectedTransfer.fromDesignation}
                <br />
                To: {selectedTransfer.toDepartment} -{" "}
                {selectedTransfer.toDesignation}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Effective Date</p>
              <p className="text-sm text-gray-600">
                {formatDate(selectedTransfer.effectiveDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reason</p>
              <p className="text-sm text-gray-600">{selectedTransfer.reason}</p>
            </div>
            {selectedTransfer.approvedBy && (
              <div>
                <p className="text-xs text-gray-500">Approved By</p>
                <p className="text-sm text-gray-600">
                  {selectedTransfer.approvedBy}
                </p>
              </div>
            )}
            {selectedTransfer.document && (
              <div>
                <p className="text-xs text-gray-500">Document</p>
                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  <FileText className="w-4 h-4" />
                  {selectedTransfer.document}
                </button>
              </div>
            )}
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
              if (selectedTransfer) openEditModal(selectedTransfer);
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
            Delete Transfer
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete this transfer for{" "}
            <span className="font-semibold">{selectedTransfer?.employee}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteTransfer}
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
          <span className="text-gray-900 font-medium">Employee Transfers</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Employee Transfers
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
                placeholder="Search by employee name or reason..."
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
                      setStatusFilter("Pending");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Approved");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("In progress");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    In progress
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Cancelled");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Cancelled
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
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="employee" label="Employee Name" />
                <SortHeader field="transferPath" label="Transfer Path" />
                <SortHeader field="status" label="Status" />
                <SortHeader field="effectiveDate" label="Effective Date" />
                <SortHeader field="approvedBy" label="Approved By" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Document
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedTransfers.map((transfer) => (
                <tr
                  key={transfer.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(transfer)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {transfer.employee}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {transfer.fromBranch} → {transfer.toBranch}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}
                    >
                      {getStatusIcon(transfer.status)}
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(transfer.effectiveDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {transfer.approvedBy || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {transfer.document ? (
                      <FileText className="w-4 h-4 text-blue-500" />
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
                        onClick={() => openViewModal(transfer)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(transfer)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openStatusModal(transfer)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 rounded hover:bg-purple-50"
                        title="Update Status"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(transfer)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedTransfers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No transfers found.
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
            {filteredTransfers.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredTransfers.length)} of{" "}
            {filteredTransfers.length} results
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

      {/* Modals */}
      {(showCreateModal || showEditModal) && <CreateEditModal />}
      {showStatusModal && <StatusModal />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};
