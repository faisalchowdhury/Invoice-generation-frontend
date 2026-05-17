/**
 * File: src/pages/accounting/Expenses.tsx
 * Complete Expenses Management page with list view, create/edit modal, and details modal
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
  Receipt,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Expense {
  id: string;
  expenseNumber: string;
  expenseDate: string;
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

const sampleExpenses: Expense[] = [
  {
    id: "1",
    expenseNumber: "EXP-2026-01-013",
    expenseDate: "2026-04-15",
    category: "Office Supplies",
    bankAccount: "Equipment Loan Account",
    chartOfAccount: "Office Supplies",
    chartOfAccountCode: "5310",
    amount: 500.0,
    reference: "EXP-APR-011",
    description: "Bulk purchase of office stationery",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-04-15",
  },
  {
    id: "2",
    expenseNumber: "EXP-2026-01-012",
    expenseDate: "2026-04-04",
    category: "Marketing",
    bankAccount: "Savings Account",
    chartOfAccount: "Marketing Expense",
    chartOfAccountCode: "5320",
    amount: 1300.0,
    reference: "EXP-APR-002",
    description: "Digital marketing campaign",
    status: "Approved",
    approvedBy: "Company",
    createdAt: "2026-04-04",
  },
  {
    id: "3",
    expenseNumber: "EXP-2026-01-011",
    expenseDate: "2026-03-31",
    category: "Utilities",
    bankAccount: "Business Checking Account",
    chartOfAccount: "Utilities Expense",
    chartOfAccountCode: "5400",
    amount: 210.0,
    reference: "EXP-MAR-001",
    description: "Electricity bill for March",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-03-31",
  },
  {
    id: "4",
    expenseNumber: "EXP-2026-01-010",
    expenseDate: "2026-03-21",
    category: "Travel",
    bankAccount: "Equipment Loan Account",
    chartOfAccount: "Travel Expense",
    chartOfAccountCode: "5330",
    amount: 450.0,
    reference: "EXP-MAR-010",
    description: "Flight tickets for business trip",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-03-21",
  },
  {
    id: "5",
    expenseNumber: "EXP-2026-01-009",
    expenseDate: "2026-03-10",
    category: "Rent",
    bankAccount: "Business Checking Account",
    chartOfAccount: "Rent Expense",
    chartOfAccountCode: "5300",
    amount: 2500.0,
    reference: "EXP-MAR-009",
    description: "Advance payment for February warehouse rent.",
    status: "Draft",
    approvedBy: "",
    createdAt: "2026-03-10",
  },
  {
    id: "6",
    expenseNumber: "EXP-2026-01-008",
    expenseDate: "2026-03-02",
    category: "Office Supplies",
    bankAccount: "Savings Account",
    chartOfAccount: "Office Supplies",
    chartOfAccountCode: "5310",
    amount: 85.0,
    reference: "EXP-MAR-008",
    description: "Printer cartridges",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-03-02",
  },
  {
    id: "7",
    expenseNumber: "EXP-2026-01-007",
    expenseDate: "2026-02-25",
    category: "Utilities",
    bankAccount: "Business Checking Account",
    chartOfAccount: "Utilities Expense",
    chartOfAccountCode: "5400",
    amount: 120.5,
    reference: "EXP-FEB-007",
    description: "Water bill",
    status: "Approved",
    approvedBy: "Company",
    createdAt: "2026-02-25",
  },
  {
    id: "8",
    expenseNumber: "EXP-2026-01-006",
    expenseDate: "2026-02-17",
    category: "Marketing",
    bankAccount: "Credit Line Account",
    chartOfAccount: "Marketing Expense",
    chartOfAccountCode: "5320",
    amount: 850.0,
    reference: "EXP-FEB-006",
    description: "Public relations and press release distribution.",
    status: "Draft",
    approvedBy: "",
    createdAt: "2026-02-17",
  },
  {
    id: "9",
    expenseNumber: "EXP-2026-01-005",
    expenseDate: "2026-02-11",
    category: "Travel",
    bankAccount: "Savings Account",
    chartOfAccount: "Travel Expense",
    chartOfAccountCode: "5330",
    amount: 300.0,
    reference: "EXP-FEB-005",
    description: "Hotel accommodation",
    status: "Posted",
    approvedBy: "Company",
    createdAt: "2026-02-11",
  },
];

const categories = [
  "Office Supplies",
  "Marketing",
  "Utilities",
  "Travel",
  "Rent",
  "Salaries",
  "Insurance",
  "Maintenance",
  "Software",
  "Training",
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
  { code: "5300", name: "Rent Expense" },
  { code: "5310", name: "Office Supplies" },
  { code: "5320", name: "Marketing Expense" },
  { code: "5330", name: "Travel Expense" },
  { code: "5400", name: "Utilities Expense" },
  { code: "5410", name: "Salaries Expense" },
  { code: "5420", name: "Insurance Expense" },
  { code: "5430", name: "Maintenance Expense" },
  { code: "5440", name: "Software Expense" },
  { code: "5450", name: "Training Expense" },
];

const statuses = ["Draft", "Approved", "Posted", "Cancelled"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "expenseNumber"
  | "expenseDate"
  | "category"
  | "bankAccount"
  | "chartOfAccount"
  | "amount"
  | "reference"
  | "status"
  | "approvedBy";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Expense: React.FC = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("expenseDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    expenseDate: new Date().toISOString().split("T")[0],
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

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.expenseNumber.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.reference.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((e) => e.status === statusFilter);
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
  }, [expenses, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredExpenses.length / perPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({
      expenseDate: new Date().toISOString().split("T")[0],
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

  const openEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setFormData({
      expenseDate: expense.expenseDate,
      category: expense.category,
      bankAccount: expense.bankAccount,
      chartOfAccount: expense.chartOfAccount,
      amount: expense.amount,
      reference: expense.reference,
      description: expense.description,
      status: expense.status,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowViewModal(true);
  };

  const openDeleteModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowDeleteModal(true);
  };

  const getChartOfAccountDisplay = (code: string, name: string) => {
    return `${code} - ${name}`;
  };

  const handleSaveExpense = () => {
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

    if (isEditing && selectedExpense) {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === selectedExpense.id
            ? {
                ...e,
                expenseDate: formData.expenseDate,
                category: formData.category,
                bankAccount: formData.bankAccount,
                chartOfAccount: formData.chartOfAccount,
                chartOfAccountCode: chartOfAccountObj?.code || "",
                amount: formData.amount,
                reference: formData.reference,
                description: formData.description,
                status: formData.status,
                approvedBy:
                  formData.status === "Posted" ? "Company" : e.approvedBy,
              }
            : e,
        ),
      );
      showToast("Expense updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newExpense: Expense = {
        id: Date.now().toString(),
        expenseNumber: `EXP-${new Date().toISOString().split("T")[0]}-${String(expenses.length + 1).padStart(3, "0")}`,
        expenseDate: formData.expenseDate,
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
      setExpenses((prev) => [newExpense, ...prev]);
      showToast("Expense created successfully!", "success");
      setShowCreateModal(false);
    }
    resetForm();
  };

  const handleDeleteExpense = () => {
    if (selectedExpense) {
      setExpenses((prev) => prev.filter((e) => e.id !== selectedExpense.id));
      showToast("Expense deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedExpense(null);
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
              {isEditing ? "Edit Expense" : "Create Expense"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update expense information"
                : "Record a new expense transaction"}
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
                Expense Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.expenseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expenseDate: e.target.value })
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
                placeholder="e.g., EXP-001"
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
            onClick={handleSaveExpense}
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
              Expense Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedExpense?.expenseNumber}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {selectedExpense && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500">Expense Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedExpense.expenseNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm text-gray-600">
                  {selectedExpense.category}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Chart of Account</p>
                <p className="text-sm text-gray-600">
                  {getChartOfAccountDisplay(
                    selectedExpense.chartOfAccountCode,
                    selectedExpense.chartOfAccount,
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-lg font-bold text-red-600">
                  {fmtCurrency(selectedExpense.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedExpense.status)}`}
                >
                  {getStatusIcon(selectedExpense.status)}
                  {selectedExpense.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reference Number</p>
                <p className="text-sm text-gray-600">
                  {selectedExpense.reference || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expense Date</p>
                <p className="text-sm text-gray-600">
                  {selectedExpense.expenseDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Bank Account</p>
                <p className="text-sm text-gray-600">
                  {selectedExpense.bankAccount}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-600">
                  {selectedExpense.description || "-"}
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
          {selectedExpense?.status !== "Posted" && (
            <button
              onClick={() => {
                setShowViewModal(false);
                if (selectedExpense) openEditModal(selectedExpense);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Expense
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
            Delete Expense
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedExpense?.expenseNumber}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteExpense}
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
          <span className="text-gray-900 font-medium">Expenses</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Expenses
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Expense"
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
                placeholder="Search expenses..."
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
                <SortHeader field="expenseNumber" label="Expense Number" />
                <SortHeader field="expenseDate" label="Date" />
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
              {paginatedExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(expense)}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-blue-600 hover:underline">
                      {expense.expenseNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {expense.expenseDate}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-900">{expense.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {expense.bankAccount}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {getChartOfAccountDisplay(
                      expense.chartOfAccountCode,
                      expense.chartOfAccount,
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-red-600">
                    {fmtCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-gray-600">
                    {expense.reference || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}
                    >
                      {getStatusIcon(expense.status)}
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {expense.approvedBy || "-"}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(expense)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {expense.status !== "Posted" && (
                        <button
                          onClick={() => openEditModal(expense)}
                          className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(expense)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No expenses found.
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
            {filteredExpenses.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredExpenses.length)} of{" "}
            {filteredExpenses.length} results
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
