/**
 * File: src/pages/accounting/Revenues.tsx
 * Complete Revenues Management page with list view, create/edit modal, and details modal
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
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  Tag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Revenue {
  id: string;
  revenueNumber: string;
  revenueDate: string;
  category: string;
  bankAccount: string;
  chartOfAccount: string;
  chartOfAccountCode: string;
  amount: number;
  reference: string;
  description: string;
  status: "Draft" | "Approved" | "Posted" | "Cancelled";
  approvedBy: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleRevenues: Revenue[] = [
  {
    id: "1",
    revenueNumber: "REV-2026-01-018",
    revenueDate: "2026-04-27",
    category: "Product Sales",
    bankAccount: "Equipment Loan Account",
    chartOfAccount: "Sales Revenue",
    chartOfAccountCode: "4100",
    amount: 20000.0,
    reference: "CORR-FIX-001",
    description: "Major Infrastructure Contract (Deficit Clearance).",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-04-27",
  },
  {
    id: "2",
    revenueNumber: "REV-2026-01-017",
    revenueDate: "2026-04-21",
    category: "Consulting Fees",
    bankAccount: "Credit Line Account",
    chartOfAccount: "Service Revenue",
    chartOfAccountCode: "4200",
    amount: 50000.0,
    reference: "CORR-FIX-003",
    description: "Strategic Partnership Funding.",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-04-21",
  },
  {
    id: "3",
    revenueNumber: "REV-2026-01-016",
    revenueDate: "2026-04-17",
    category: "Service Income",
    bankAccount: "Business Checking Account",
    chartOfAccount: "Sales Revenue",
    chartOfAccountCode: "4100",
    amount: 1400.0,
    reference: "REV-APR-031",
    description: "Monthly service retainer fee",
    status: "Approved",
    approvedBy: "Company",
    createdAt: "2026-04-17",
  },
  {
    id: "4",
    revenueNumber: "REV-2026-01-015",
    revenueDate: "2026-04-10",
    category: "Consulting Fees",
    bankAccount: "Savings Account",
    chartOfAccount: "Commission Income",
    chartOfAccountCode: "4110",
    amount: 890.0,
    reference: "REV-APR-011",
    description: "Consulting commission",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-04-10",
  },
  {
    id: "5",
    revenueNumber: "REV-2026-01-014",
    revenueDate: "2026-04-02",
    category: "Interest Income",
    bankAccount: "Equipment Loan Account",
    chartOfAccount: "Rental Income",
    chartOfAccountCode: "4120",
    amount: 2000.0,
    reference: "REV-APR-004",
    description: "Quarterly interest earnings",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-04-02",
  },
  {
    id: "6",
    revenueNumber: "REV-2026-01-013",
    revenueDate: "2026-03-27",
    category: "Subscription Revenue",
    bankAccount: "Credit Line Account",
    chartOfAccount: "Maintenance Income",
    chartOfAccountCode: "4130",
    amount: 1200.0,
    reference: "REV-MAR-012",
    description: "Monthly subscription renewals",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-03-27",
  },
  {
    id: "7",
    revenueNumber: "REV-2026-01-012",
    revenueDate: "2026-03-15",
    category: "Consulting Fees",
    bankAccount: "Business Checking Account",
    chartOfAccount: "Service Revenue",
    chartOfAccountCode: "4200",
    amount: 2200.0,
    reference: "REV-MAR-028",
    description: "Workflow optimization consulting.",
    status: "Draft",
    approvedBy: "",
    createdAt: "2026-03-15",
  },
  {
    id: "8",
    revenueNumber: "REV-2026-01-011",
    revenueDate: "2026-03-07",
    category: "Interest Income",
    bankAccount: "Savings Account",
    chartOfAccount: "Training Income",
    chartOfAccountCode: "4140",
    amount: 350.0,
    reference: "REV-MAR-027",
    description: "Training program revenue",
    status: "Approved",
    approvedBy: "Company",
    createdAt: "2026-03-07",
  },
  {
    id: "9",
    revenueNumber: "REV-2026-01-010",
    revenueDate: "2026-03-02",
    category: "Subscription Revenue",
    bankAccount: "Credit Line Account",
    chartOfAccount: "Consulting Revenue",
    chartOfAccountCode: "4030",
    amount: 2400.0,
    reference: "REV-MAR-026",
    description: "Consulting services retainer",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-03-02",
  },
];

const categories = [
  "Product Sales",
  "Consulting Fees",
  "Service Income",
  "Interest Income",
  "Subscription Revenue",
  "Rental Income",
  "Commission Income",
  "Maintenance Income",
  "Training Income",
];

const bankAccounts = [
  {
    name: "Business Checking Account",
    number: "1234567890",
    balance: 1079790.99,
  },
  { name: "Savings Account", number: "9876543210", balance: 1371847.72 },
  { name: "Credit Line Account", number: "5555666677", balance: 2541388.94 },
  { name: "Equipment Loan Account", number: "1111222233", balance: 3023473.35 },
];

const chartOfAccounts = [
  { code: "4100", name: "Sales Revenue" },
  { code: "4110", name: "Commission Income" },
  { code: "4120", name: "Rental Income" },
  { code: "4130", name: "Maintenance Income" },
  { code: "4140", name: "Training Income" },
  { code: "4200", name: "Service Revenue" },
  { code: "4300", name: "Other Income" },
  { code: "4030", name: "Consulting Revenue" },
];

const statuses = ["Draft", "Approved", "Posted", "Cancelled"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "revenueNumber"
  | "revenueDate"
  | "category"
  | "bankAccount"
  | "chartOfAccount"
  | "amount"
  | "reference"
  | "status"
  | "approvedBy";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Revenues: React.FC = () => {
  const navigate = useNavigate();
  const [revenues, setRevenues] = useState<Revenue[]>(sampleRevenues);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("revenueDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    revenueDate: new Date().toISOString().split("T")[0],
    category: "",
    bankAccount: "",
    chartOfAccount: "",
    amount: 0,
    reference: "",
    description: "",
    status: "Draft" as "Draft" | "Approved" | "Posted" | "Cancelled",
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

  const filteredRevenues = useMemo(() => {
    let result = [...revenues];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.revenueNumber.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.reference.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((r) => r.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "amount") {
        aVal = a.amount;
        bVal = b.amount;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [revenues, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredRevenues.length / perPage);
  const paginatedRevenues = filteredRevenues.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({
      revenueDate: new Date().toISOString().split("T")[0],
      category: "",
      bankAccount: "",
      chartOfAccount: "",
      amount: 0,
      reference: "",
      description: "",
      status: "Draft",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (revenue: Revenue) => {
    setSelectedRevenue(revenue);
    setFormData({
      revenueDate: revenue.revenueDate,
      category: revenue.category,
      bankAccount: revenue.bankAccount,
      chartOfAccount: revenue.chartOfAccount,
      amount: revenue.amount,
      reference: revenue.reference,
      description: revenue.description,
      status: revenue.status,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (revenue: Revenue) => {
    setSelectedRevenue(revenue);
    setShowViewModal(true);
  };

  const openDeleteModal = (revenue: Revenue) => {
    setSelectedRevenue(revenue);
    setShowDeleteModal(true);
  };

  const getChartOfAccountDisplay = (code: string, name: string) => {
    return `${code} - ${name}`;
  };

  const handleSaveRevenue = () => {
    if (!formData.category) {
      showToast("Please select a category", "info");
      return;
    }
    if (!formData.bankAccount) {
      showToast("Please select a bank account", "info");
      return;
    }
    if (!formData.chartOfAccount) {
      showToast("Please select a chart of account", "info");
      return;
    }
    if (formData.amount <= 0) {
      showToast("Please enter a valid amount", "info");
      return;
    }

    const chartOfAccountObj = chartOfAccounts.find(
      (c) => c.name === formData.chartOfAccount,
    );

    if (isEditing && selectedRevenue) {
      setRevenues((prev) =>
        prev.map((r) =>
          r.id === selectedRevenue.id
            ? {
                ...r,
                revenueDate: formData.revenueDate,
                category: formData.category,
                bankAccount: formData.bankAccount,
                chartOfAccount: formData.chartOfAccount,
                chartOfAccountCode: chartOfAccountObj?.code || "",
                amount: formData.amount,
                reference: formData.reference,
                description: formData.description,
                status: formData.status,
                approvedBy:
                  formData.status === "Posted" ? "Company" : r.approvedBy,
              }
            : r,
        ),
      );
      showToast("Revenue updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newRevenue: Revenue = {
        id: Date.now().toString(),
        revenueNumber: `REV-${new Date().toISOString().split("T")[0]}-${String(revenues.length + 1).padStart(3, "0")}`,
        revenueDate: formData.revenueDate,
        category: formData.category,
        bankAccount: formData.bankAccount,
        chartOfAccount: formData.chartOfAccount,
        chartOfAccountCode: chartOfAccountObj?.code || "",
        amount: formData.amount,
        reference: formData.reference,
        description: formData.description,
        status: formData.status,
        approvedBy: formData.status === "Posted" ? "Company" : "",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRevenues((prev) => [newRevenue, ...prev]);
      showToast("Revenue created successfully!", "success");
      setShowCreateModal(false);
    }
    resetForm();
  };

  const handleDeleteRevenue = () => {
    if (selectedRevenue) {
      setRevenues((prev) => prev.filter((r) => r.id !== selectedRevenue.id));
      showToast("Revenue deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedRevenue(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Posted":
        return "bg-green-100 text-green-700";
      case "Approved":
        return "bg-blue-100 text-blue-700";
      case "Draft":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Posted":
        return <CheckCircle className="w-3 h-3" />;
      case "Approved":
        return <AlertCircle className="w-3 h-3" />;
      case "Draft":
        return <Clock className="w-3 h-3" />;
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

  // ─── Modals ─────────────────────────────────────────────────────────────────

  const CreateEditModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Revenue" : "Create Revenue"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update revenue information"
                : "Record a new revenue transaction"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
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
                Revenue Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.revenueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, revenueDate: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
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
                Bank Account <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bankAccount}
                onChange={(e) =>
                  setFormData({ ...formData, bankAccount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Bank Account</option>
                {bankAccounts.map((account) => (
                  <option key={account.name} value={account.name}>
                    {account.name} ({account.number}) -{" "}
                    {fmtCurrency(account.balance)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart of Account <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.chartOfAccount}
                onChange={(e) =>
                  setFormData({ ...formData, chartOfAccount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Chart of Account</option>
                {chartOfAccounts.map((account) => (
                  <option key={account.code} value={account.name}>
                    {account.code} - {account.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
                placeholder="e.g., INV-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRevenue}
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
              Revenue Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedRevenue?.revenueNumber}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {selectedRevenue && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500">Revenue Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedRevenue.revenueNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm text-gray-600">
                  {selectedRevenue.category}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Chart of Account</p>
                <p className="text-sm text-gray-600">
                  {getChartOfAccountDisplay(
                    selectedRevenue.chartOfAccountCode,
                    selectedRevenue.chartOfAccount,
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRevenue.status)}`}
                >
                  {getStatusIcon(selectedRevenue.status)}
                  {selectedRevenue.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Approved By</p>
                <p className="text-sm text-gray-600">
                  {selectedRevenue.approvedBy || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-600">
                  {selectedRevenue.description || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Revenue Date</p>
                <p className="text-sm text-gray-600">
                  {selectedRevenue.revenueDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Bank Account</p>
                <p className="text-sm text-gray-600">
                  {selectedRevenue.bankAccount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-lg font-bold text-blue-600">
                  {fmtCurrency(selectedRevenue.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reference Number</p>
                <p className="text-sm text-gray-600">
                  {selectedRevenue.reference || "-"}
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
          {selectedRevenue?.status !== "Posted" && (
            <button
              onClick={() => {
                setShowViewModal(false);
                if (selectedRevenue) openEditModal(selectedRevenue);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Revenue
            </button>
          )}
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
            Delete Revenue
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedRevenue?.revenueNumber}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteRevenue}
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
            onClick={() => navigate("/accounting")}
            className="hover:text-gray-700"
          >
            Accounting
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Revenues</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Revenues
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Revenue"
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
                placeholder="Search revenues..."
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
                  {["All", "Draft", "Approved", "Posted", "Cancelled"].map(
                    (st) => (
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
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="revenueNumber" label="Revenue Number" />
                <SortHeader field="revenueDate" label="Date" />
                <SortHeader field="category" label="Category" />
                <SortHeader field="bankAccount" label="Bank Account" />
                <SortHeader field="chartOfAccount" label="Chart of Account" />
                <SortHeader field="amount" label="Amount" />
                <SortHeader field="reference" label="Reference" />
                <SortHeader field="status" label="Status" />
                <SortHeader field="approvedBy" label="Approved By" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedRevenues.map((revenue) => (
                <tr
                  key={revenue.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(revenue)}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-blue-600 hover:underline">
                      {revenue.revenueNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {revenue.revenueDate}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-900">{revenue.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {revenue.bankAccount}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {getChartOfAccountDisplay(
                      revenue.chartOfAccountCode,
                      revenue.chartOfAccount,
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-600">
                    {fmtCurrency(revenue.amount)}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-gray-600">
                    {revenue.reference || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(revenue.status)}`}
                    >
                      {getStatusIcon(revenue.status)}
                      {revenue.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {revenue.approvedBy || "-"}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(revenue)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {revenue.status !== "Posted" && (
                        <button
                          onClick={() => openEditModal(revenue)}
                          className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(revenue)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedRevenues.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No revenues found.
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
            {filteredRevenues.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredRevenues.length)} of{" "}
            {filteredRevenues.length} results
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
