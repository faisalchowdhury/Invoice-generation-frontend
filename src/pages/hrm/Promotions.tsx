/**
 * File: src/pages/hrm/Promotions.tsx
 * Complete Promotions Management page with list view, create/edit modal, and details modal
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
  Building2,
  Briefcase,
  FileText,
  Upload,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Promotion {
  id: string;
  employee: string;
  currentBranch: string;
  currentDepartment: string;
  currentDesignation: string;
  newBranch: string;
  newDepartment: string;
  newDesignation: string;
  effectiveDate: string;
  reason: string;
  document: string;
  approvedBy: string;
  approvedAt: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected";
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const samplePromotions: Promotion[] = [
  {
    id: "1",
    employee: "Mark Allen",
    currentBranch: "Customer Service Center",
    currentDepartment: "Legal & Compliance",
    currentDesignation: "Senior Associate",
    newBranch: "Main Office",
    newDepartment: "Sales & Marketing",
    newDesignation: "Senior Analyst",
    effectiveDate: "2025-12-20",
    reason:
      "Outstanding community engagement representing company values and building positive public relations.",
    document: "promotion_letter_mark.pdf",
    approvedBy: "Mega Distributors",
    approvedAt: "2025-12-15",
    status: "Approved",
    createdAt: "2025-12-10",
  },
  {
    id: "2",
    employee: "Anthony Walker",
    currentBranch: "Customer Service Center",
    currentDepartment: "Legal & Compliance",
    currentDesignation: "Associate",
    newBranch: "Regional Office",
    newDepartment: "Legal & Compliance",
    newDesignation: "Senior Associate",
    effectiveDate: "2025-12-15",
    reason:
      "Demonstrated expertise in emerging technologies and successful implementation of innovative solutions.",
    document: "promotion_letter_anthony.pdf",
    approvedBy: "HR Manager",
    approvedAt: "2025-12-10",
    status: "Approved",
    createdAt: "2025-12-05",
  },
  {
    id: "3",
    employee: "Matthew Clark",
    currentBranch: "South Branch",
    currentDepartment: "Finance & Accounting",
    currentDesignation: "Team Lead",
    newBranch: "Regional Office",
    newDepartment: "Finance & Accounting",
    newDesignation: "Assistant Manager",
    effectiveDate: "2025-12-10",
    reason: "Exceptional leadership skills and consistent performance",
    document: "promotion_letter_matthew.pdf",
    approvedBy: "Finance Director",
    approvedAt: "2025-12-05",
    status: "Approved",
    createdAt: "2025-12-01",
  },
  {
    id: "4",
    employee: "Daniel Thompson",
    currentBranch: "Downtown Branch",
    currentDepartment: "Quality Assurance",
    currentDesignation: "Analyst",
    newBranch: "Downtown Branch",
    newDepartment: "Quality Assurance",
    newDesignation: "Senior Analyst",
    effectiveDate: "2025-12-05",
    reason: "Outstanding quality metrics and process improvements",
    document: "promotion_letter_daniel.pdf",
    approvedBy: "QA Manager",
    approvedAt: "2025-11-30",
    status: "Approved",
    createdAt: "2025-11-25",
  },
  {
    id: "5",
    employee: "Christopher Lee",
    currentBranch: "South Branch",
    currentDepartment: "Finance & Accounting",
    currentDesignation: "Director",
    newBranch: "Regional Office",
    newDepartment: "Finance & Accounting",
    newDesignation: "Senior Director",
    effectiveDate: "2025-11-30",
    reason: "Strategic financial planning and leadership",
    document: "promotion_letter_christopher.pdf",
    approvedBy: "CEO",
    approvedAt: "2025-11-25",
    status: "Completed",
    createdAt: "2025-11-20",
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
  "Regional Office",
  "Sales Office",
  "North Branch",
  "South Branch",
  "Downtown Branch",
  "Customer Service Center",
  "Main Office",
];

const departments: Record<string, string[]> = {
  "Regional Office": [
    "Finance & Accounting",
    "Human Resources",
    "Administration",
    "IT",
  ],
  "Sales Office": ["Sales", "Marketing", "Customer Service"],
  "North Branch": ["Operations", "Procurement", "Logistics"],
  "South Branch": ["Finance & Accounting", "Sales", "Support"],
  "Downtown Branch": ["Quality Assurance", "Legal & Compliance", "Facilities"],
  "Customer Service Center": [
    "Customer Support",
    "Technical Support",
    "Legal & Compliance",
  ],
  "Main Office": ["Executive", "Sales & Marketing", "Corporate Affairs"],
};

const designations: Record<string, string[]> = {
  "Finance & Accounting": [
    "Accountant",
    "Senior Accountant",
    "Finance Manager",
    "Director",
    "Assistant Manager",
    "Team Lead",
    "Senior Director",
  ],
  "Human Resources": [
    "HR Officer",
    "HR Manager",
    "Recruiter",
    "Training Coordinator",
  ],
  Sales: [
    "Sales Executive",
    "Senior Sales Executive",
    "Sales Manager",
    "Director",
  ],
  Marketing: ["Marketing Executive", "Marketing Manager", "Brand Manager"],
  "Customer Service": [
    "Support Associate",
    "Senior Consultant",
    "Team Lead",
    "Manager",
  ],
  Operations: ["Operations Analyst", "Operations Manager", "Coordinator"],
  Procurement: ["Procurement Officer", "Analyst", "Manager"],
  Logistics: ["Logistics Coordinator", "Supply Chain Analyst", "Manager"],
  IT: ["IT Support", "System Administrator", "Developer", "IT Manager"],
  "Quality Assurance": [
    "QA Analyst",
    "Senior QA",
    "QA Manager",
    "Executive",
    "Senior Analyst",
  ],
  "Legal & Compliance": [
    "Legal Officer",
    "Compliance Officer",
    "Manager",
    "Associate",
    "Senior Associate",
  ],
  "Technical Support": [
    "Support Engineer",
    "Senior Support Engineer",
    "Team Lead",
  ],
  Executive: ["Executive", "Senior Executive", "Director", "VP"],
  "Sales & Marketing": [
    "Coordinator",
    "Specialist",
    "Manager",
    "Senior Analyst",
  ],
  "Corporate Affairs": ["Officer", "Manager", "Director"],
};

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
  | "currentDesignation"
  | "newDesignation"
  | "effectiveDate"
  | "status";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Promotions: React.FC = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>(samplePromotions);
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
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [promotionFormData, setPromotionFormData] = useState({
    employee: "",
    currentBranch: "",
    currentDepartment: "",
    currentDesignation: "",
    newBranch: "",
    newDepartment: "",
    newDesignation: "",
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

  const filteredPromotions = useMemo(() => {
    let result = [...promotions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.employee.toLowerCase().includes(q) ||
          p.currentDesignation.toLowerCase().includes(q) ||
          p.newDesignation.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [promotions, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredPromotions.length / perPage);
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const handleCurrentBranchChange = (branch: string) => {
    setPromotionFormData({
      ...promotionFormData,
      currentBranch: branch,
      currentDepartment: "",
      currentDesignation: "",
    });
  };

  const handleCurrentDepartmentChange = (department: string) => {
    setPromotionFormData({
      ...promotionFormData,
      currentDepartment: department,
      currentDesignation: "",
    });
  };

  const handleNewBranchChange = (branch: string) => {
    setPromotionFormData({
      ...promotionFormData,
      newBranch: branch,
      newDepartment: "",
      newDesignation: "",
    });
  };

  const handleNewDepartmentChange = (department: string) => {
    setPromotionFormData({
      ...promotionFormData,
      newDepartment: department,
      newDesignation: "",
    });
  };

  const handleEmployeeChange = (employee: string) => {
    // In a real app, you would fetch the employee's current details
    setPromotionFormData({
      ...promotionFormData,
      employee: employee,
      currentBranch: "Customer Service Center",
      currentDepartment: "Legal & Compliance",
      currentDesignation: "Associate",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPromotionFormData({
        ...promotionFormData,
        document: e.target.files[0],
        documentName: e.target.files[0].name,
      });
    }
  };

  const resetPromotionForm = () => {
    setPromotionFormData({
      employee: "",
      currentBranch: "",
      currentDepartment: "",
      currentDesignation: "",
      newBranch: "",
      newDepartment: "",
      newDesignation: "",
      effectiveDate: "",
      reason: "",
      document: null,
      documentName: "",
    });
  };

  const openCreateModal = () => {
    resetPromotionForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setPromotionFormData({
      employee: promotion.employee,
      currentBranch: promotion.currentBranch,
      currentDepartment: promotion.currentDepartment,
      currentDesignation: promotion.currentDesignation,
      newBranch: promotion.newBranch,
      newDepartment: promotion.newDepartment,
      newDesignation: promotion.newDesignation,
      effectiveDate: promotion.effectiveDate,
      reason: promotion.reason,
      document: null,
      documentName: promotion.document,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowViewModal(true);
  };

  const openDeleteModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowDeleteModal(true);
  };

  const handleSavePromotion = () => {
    if (!promotionFormData.employee) {
      showToast("Please select an employee", "info");
      return;
    }
    if (!promotionFormData.currentBranch) {
      showToast("Please select current branch", "info");
      return;
    }
    if (!promotionFormData.currentDepartment) {
      showToast("Please select current department", "info");
      return;
    }
    if (!promotionFormData.currentDesignation) {
      showToast("Please select current designation", "info");
      return;
    }
    if (!promotionFormData.newBranch) {
      showToast("Please select new branch", "info");
      return;
    }
    if (!promotionFormData.newDepartment) {
      showToast("Please select new department", "info");
      return;
    }
    if (!promotionFormData.newDesignation) {
      showToast("Please select new designation", "info");
      return;
    }
    if (!promotionFormData.effectiveDate) {
      showToast("Please select effective date", "info");
      return;
    }
    if (!promotionFormData.reason) {
      showToast("Please enter reason for promotion", "info");
      return;
    }

    if (isEditing && selectedPromotion) {
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === selectedPromotion.id
            ? {
                ...p,
                employee: promotionFormData.employee,
                currentBranch: promotionFormData.currentBranch,
                currentDepartment: promotionFormData.currentDepartment,
                currentDesignation: promotionFormData.currentDesignation,
                newBranch: promotionFormData.newBranch,
                newDepartment: promotionFormData.newDepartment,
                newDesignation: promotionFormData.newDesignation,
                effectiveDate: promotionFormData.effectiveDate,
                reason: promotionFormData.reason,
                document: promotionFormData.documentName || p.document,
              }
            : p,
        ),
      );
      showToast("Promotion updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newPromotion: Promotion = {
        id: Date.now().toString(),
        employee: promotionFormData.employee,
        currentBranch: promotionFormData.currentBranch,
        currentDepartment: promotionFormData.currentDepartment,
        currentDesignation: promotionFormData.currentDesignation,
        newBranch: promotionFormData.newBranch,
        newDepartment: promotionFormData.newDepartment,
        newDesignation: promotionFormData.newDesignation,
        effectiveDate: promotionFormData.effectiveDate,
        reason: promotionFormData.reason,
        document: promotionFormData.documentName || "",
        approvedBy: "",
        approvedAt: "",
        status: "Pending",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPromotions((prev) => [newPromotion, ...prev]);
      showToast("Promotion created successfully!", "success");
      setShowCreateModal(false);
    }
    resetPromotionForm();
  };

  const handleDeletePromotion = () => {
    if (selectedPromotion) {
      setPromotions((prev) =>
        prev.filter((p) => p.id !== selectedPromotion.id),
      );
      showToast("Promotion deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedPromotion(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Rejected":
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
      case "Pending":
        return <AlertCircle className="w-3 h-3" />;
      case "Rejected":
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
    const availableCurrentDepartments = promotionFormData.currentBranch
      ? departments[promotionFormData.currentBranch] || []
      : [];
    const availableCurrentDesignations = promotionFormData.currentDepartment
      ? designations[promotionFormData.currentDepartment] || []
      : [];
    const availableNewDepartments = promotionFormData.newBranch
      ? departments[promotionFormData.newBranch] || []
      : [];
    const availableNewDesignations = promotionFormData.newDepartment
      ? designations[promotionFormData.newDepartment] || []
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
                {isEditing ? "Edit Promotion" : "Create Promotion"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {isEditing
                  ? "Update promotion information"
                  : "Add a new promotion"}
              </p>
            </div>
            <button
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                resetPromotionForm();
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
                value={promotionFormData.employee}
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

            <div className="border-t border-gray-200 pt-3">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Current Position
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Branch *
                  </label>
                  <select
                    value={promotionFormData.currentBranch}
                    onChange={(e) => handleCurrentBranchChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="">Select Current Branch</option>
                    {branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Department *
                  </label>
                  <select
                    value={promotionFormData.currentDepartment}
                    onChange={(e) =>
                      handleCurrentDepartmentChange(e.target.value)
                    }
                    disabled={!promotionFormData.currentBranch}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100"
                  >
                    <option value="">
                      {promotionFormData.currentBranch
                        ? "Select Current Department"
                        : "Select Branch first"}
                    </option>
                    {availableCurrentDepartments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Designation *
                  </label>
                  <select
                    value={promotionFormData.currentDesignation}
                    onChange={(e) =>
                      setPromotionFormData({
                        ...promotionFormData,
                        currentDesignation: e.target.value,
                      })
                    }
                    disabled={!promotionFormData.currentDepartment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100"
                  >
                    <option value="">
                      {promotionFormData.currentDepartment
                        ? "Select Current Designation"
                        : "Select Department first"}
                    </option>
                    {availableCurrentDesignations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                New Position
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Branch *
                  </label>
                  <select
                    value={promotionFormData.newBranch}
                    onChange={(e) => handleNewBranchChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="">Select New Branch</option>
                    {branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Department *
                  </label>
                  <select
                    value={promotionFormData.newDepartment}
                    onChange={(e) => handleNewDepartmentChange(e.target.value)}
                    disabled={!promotionFormData.newBranch}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100"
                  >
                    <option value="">
                      {promotionFormData.newBranch
                        ? "Select New Department"
                        : "Select Branch first"}
                    </option>
                    {availableNewDepartments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Designation *
                  </label>
                  <select
                    value={promotionFormData.newDesignation}
                    onChange={(e) =>
                      setPromotionFormData({
                        ...promotionFormData,
                        newDesignation: e.target.value,
                      })
                    }
                    disabled={!promotionFormData.newDepartment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100"
                  >
                    <option value="">
                      {promotionFormData.newDepartment
                        ? "Select New Designation"
                        : "Select Department first"}
                    </option>
                    {availableNewDesignations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date *
              </label>
              <input
                type="date"
                value={promotionFormData.effectiveDate}
                onChange={(e) =>
                  setPromotionFormData({
                    ...promotionFormData,
                    effectiveDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason *
              </label>
              <textarea
                value={promotionFormData.reason}
                onChange={(e) =>
                  setPromotionFormData({
                    ...promotionFormData,
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
                {promotionFormData.documentName && (
                  <span className="text-sm text-green-600">
                    {promotionFormData.documentName}
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
                resetPromotionForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePromotion}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ViewModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Promotion Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedPromotion?.employee}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {selectedPromotion && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedPromotion.employee}
                </p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPromotion.status)}`}
                >
                  {getStatusIcon(selectedPromotion.status)}
                  {selectedPromotion.status}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Career Progression
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Previous Position
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedPromotion.currentDesignation}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedPromotion.currentDepartment}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedPromotion.currentBranch}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-500 mb-1">Current Position</p>
                  <p className="text-sm font-medium text-blue-900">
                    {selectedPromotion.newDesignation}
                  </p>
                  <p className="text-xs text-blue-600">
                    {selectedPromotion.newDepartment}
                  </p>
                  <p className="text-xs text-blue-600">
                    {selectedPromotion.newBranch}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Effective Date</p>
              <p className="text-sm text-gray-900">
                {formatDate(selectedPromotion.effectiveDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reason for Promotion</p>
              <p className="text-sm text-gray-600">
                {selectedPromotion.reason}
              </p>
            </div>
            {selectedPromotion.approvedBy && (
              <div>
                <p className="text-xs text-gray-500">Approved By</p>
                <p className="text-sm text-gray-900">
                  {selectedPromotion.approvedBy}
                </p>
              </div>
            )}
            {selectedPromotion.document && (
              <div>
                <p className="text-xs text-gray-500">Document</p>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  {selectedPromotion.document}
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
              if (selectedPromotion) openEditModal(selectedPromotion);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Promotion
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
            Delete Promotion
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete this promotion for{" "}
            <span className="font-semibold">{selectedPromotion?.employee}</span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeletePromotion}
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
          <span className="text-gray-900 font-medium">Promotions</span>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Promotions
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
                placeholder="Search Promotions..."
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
                      setStatusFilter("Completed");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Completed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="employee" label="Employee" />
                <SortHeader
                  field="currentDesignation"
                  label="Previous Position"
                />
                <SortHeader field="newDesignation" label="New Position" />
                <SortHeader field="effectiveDate" label="Effective Date" />
                <SortHeader field="status" label="Status" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedPromotions.map((promotion) => (
                <tr
                  key={promotion.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(promotion)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {promotion.employee}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-900">
                        {promotion.currentDesignation}
                      </p>
                      <p className="text-xs text-gray-400">
                        {promotion.currentDepartment}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        {promotion.newDesignation}
                      </p>
                      <p className="text-xs text-gray-400">
                        {promotion.newDepartment}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(promotion.effectiveDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(promotion.status)}`}
                    >
                      {getStatusIcon(promotion.status)}
                      {promotion.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(promotion)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(promotion)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(promotion)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedPromotions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No promotions found.
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
            {filteredPromotions.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredPromotions.length)} of{" "}
            {filteredPromotions.length} results
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
