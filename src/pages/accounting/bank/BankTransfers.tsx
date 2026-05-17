/**
 * File: src/pages/accounting/BankTransfers.tsx
 * Complete Bank Transfers Management page with list view, create/edit modal, and details modal
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
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRightLeft,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
} from "lucide-react";
import { showToast } from "@/utils/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  currentBalance: number;
}

interface BankTransfer {
  id: string;
  transferNumber: string;
  date: string;
  fromAccountId: string;
  fromAccountName: string;
  fromAccountNumber: string;
  toAccountId: string;
  toAccountName: string;
  toAccountNumber: string;
  amount: number;
  transferCharges: number;
  totalAmount: number;
  referenceNumber: string;
  description: string;
  status: "Pending" | "Completed" | "Cancelled";
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleAccounts: BankAccount[] = [
  {
    id: "1",
    name: "Business Checking Account",
    accountNumber: "1234567890",
    currentBalance: 1079790.99,
  },
  {
    id: "2",
    name: "Savings Account",
    accountNumber: "9876543210",
    currentBalance: 1371847.72,
  },
  {
    id: "3",
    name: "Credit Line Account",
    accountNumber: "5555666677",
    currentBalance: 2541388.94,
  },
  {
    id: "4",
    name: "Equipment Loan Account",
    accountNumber: "1111222233",
    currentBalance: 3023473.35,
  },
  {
    id: "5",
    name: "Petty Cash Account",
    accountNumber: "7777888899",
    currentBalance: 85000.0,
  },
];

const sampleTransfers: BankTransfer[] = [
  {
    id: "1",
    transferNumber: "BT-2026-01-015",
    date: "2026-04-28",
    fromAccountId: "3",
    fromAccountName: "Credit Line Account",
    fromAccountNumber: "5555666677",
    toAccountId: "1",
    toAccountName: "Business Checking Account",
    toAccountNumber: "1234567890",
    amount: 80000.0,
    transferCharges: 30.0,
    totalAmount: 80030.0,
    referenceNumber: "BT-015",
    description: "Working capital allocation.",
    status: "Pending",
    createdAt: "2026-01-20",
  },
  {
    id: "2",
    transferNumber: "BT-2026-01-014",
    date: "2026-04-25",
    fromAccountId: "2",
    fromAccountName: "Savings Account",
    fromAccountNumber: "9876543210",
    toAccountId: "1",
    toAccountName: "Business Checking Account",
    toAccountNumber: "1234567890",
    amount: 15000.0,
    transferCharges: 0,
    totalAmount: 15000.0,
    referenceNumber: "BT-014",
    description: "Monthly transfer for operational expenses",
    status: "Completed",
    createdAt: "2026-01-19",
  },
  {
    id: "3",
    transferNumber: "BT-2026-01-013",
    date: "2026-04-20",
    fromAccountId: "1",
    fromAccountName: "Business Checking Account",
    fromAccountNumber: "1234567890",
    toAccountId: "3",
    toAccountName: "Credit Line Account",
    toAccountNumber: "5555666677",
    amount: 50000.0,
    transferCharges: 0,
    totalAmount: 50000.0,
    referenceNumber: "BT-013",
    description: "Credit line repayment",
    status: "Completed",
    createdAt: "2026-01-18",
  },
  {
    id: "4",
    transferNumber: "BT-2026-01-012",
    date: "2026-04-15",
    fromAccountId: "4",
    fromAccountName: "Equipment Loan Account",
    fromAccountNumber: "1111222233",
    toAccountId: "1",
    toAccountName: "Business Checking Account",
    toAccountNumber: "1234567890",
    amount: 250000.0,
    transferCharges: 50.0,
    totalAmount: 250050.0,
    referenceNumber: "BT-012",
    description: "Loan disbursement for equipment purchase",
    status: "Pending",
    createdAt: "2026-01-17",
  },
  {
    id: "5",
    transferNumber: "BT-2026-01-011",
    date: "2026-04-08",
    fromAccountId: "2",
    fromAccountName: "Savings Account",
    fromAccountNumber: "9876543210",
    toAccountId: "1",
    toAccountName: "Business Checking Account",
    toAccountNumber: "1234567890",
    amount: 10000.0,
    transferCharges: 0,
    totalAmount: 10000.0,
    referenceNumber: "BT-011",
    description: "Emergency fund transfer",
    status: "Completed",
    createdAt: "2026-01-16",
  },
  {
    id: "6",
    transferNumber: "BT-2026-01-010",
    date: "2026-04-02",
    fromAccountId: "1",
    fromAccountName: "Business Checking Account",
    fromAccountNumber: "1234567890",
    toAccountId: "2",
    toAccountName: "Savings Account",
    toAccountNumber: "9876543210",
    amount: 45000.0,
    transferCharges: 0,
    totalAmount: 45000.0,
    referenceNumber: "BT-010",
    description: "Savings deposit",
    status: "Completed",
    createdAt: "2026-01-15",
  },
  {
    id: "7",
    transferNumber: "BT-2026-01-009",
    date: "2026-03-25",
    fromAccountId: "3",
    fromAccountName: "Credit Line Account",
    fromAccountNumber: "5555666677",
    toAccountId: "2",
    toAccountName: "Savings Account",
    toAccountNumber: "9876543210",
    amount: 100000.0,
    transferCharges: 25.0,
    totalAmount: 100025.0,
    referenceNumber: "BT-009",
    description: "Investment transfer",
    status: "Completed",
    createdAt: "2026-01-14",
  },
  {
    id: "8",
    transferNumber: "BT-2026-01-008",
    date: "2026-03-18",
    fromAccountId: "1",
    fromAccountName: "Business Checking Account",
    fromAccountNumber: "1234567890",
    toAccountId: "4",
    toAccountName: "Equipment Loan Account",
    toAccountNumber: "1111222233",
    amount: 15000.0,
    transferCharges: 0,
    totalAmount: 15000.0,
    referenceNumber: "BT-008",
    description: "Equipment loan payment",
    status: "Pending",
    createdAt: "2026-01-13",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "transferNumber"
  | "date"
  | "fromAccount"
  | "toAccount"
  | "amount"
  | "status";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const BankTransfers: React.FC = () => {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<BankTransfer[]>(sampleTransfers);
  const [accounts] = useState<BankAccount[]>(sampleAccounts);
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
  const [selectedTransfer, setSelectedTransfer] = useState<BankTransfer | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    fromAccountId: "",
    toAccountId: "",
    amount: 0,
    transferCharges: 0,
    referenceNumber: "",
    description: "",
  });

  // Get account details by ID
  const getAccountById = (id: string) => {
    return accounts.find((a) => a.id === id);
  };

  // Get from account balance
  const getFromAccountBalance = () => {
    const account = getAccountById(formData.fromAccountId);
    return account?.currentBalance || 0;
  };

  // Check if amount exceeds balance
  const isAmountExceedingBalance = () => {
    const balance = getFromAccountBalance();
    return formData.amount > balance;
  };

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
          t.transferNumber.toLowerCase().includes(q) ||
          t.referenceNumber.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((t) => t.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case "transferNumber":
          aVal = a.transferNumber;
          bVal = b.transferNumber;
          break;
        case "date":
          aVal = a.date;
          bVal = b.date;
          break;
        case "fromAccount":
          aVal = a.fromAccountName;
          bVal = b.fromAccountName;
          break;
        case "toAccount":
          aVal = a.toAccountName;
          bVal = b.toAccountName;
          break;
        case "amount":
          aVal = a.amount;
          bVal = b.amount;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = a[sortField as keyof BankTransfer];
          bVal = b[sortField as keyof BankTransfer];
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

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      fromAccountId: "",
      toAccountId: "",
      amount: 0,
      transferCharges: 0,
      referenceNumber: "",
      description: "",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (transfer: BankTransfer) => {
    setSelectedTransfer(transfer);
    setFormData({
      date: transfer.date,
      fromAccountId: transfer.fromAccountId,
      toAccountId: transfer.toAccountId,
      amount: transfer.amount,
      transferCharges: transfer.transferCharges,
      referenceNumber: transfer.referenceNumber,
      description: transfer.description,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (transfer: BankTransfer) => {
    setSelectedTransfer(transfer);
    setShowViewModal(true);
  };

  const openDeleteModal = (transfer: BankTransfer) => {
    setSelectedTransfer(transfer);
    setShowDeleteModal(true);
  };

  const handleSaveTransfer = () => {
    if (!formData.fromAccountId) {
      showToast("Please select from account", "info");
      return;
    }
    if (!formData.toAccountId) {
      showToast("Please select to account", "info");
      return;
    }
    if (formData.fromAccountId === formData.toAccountId) {
      showToast("From account and to account cannot be the same", "info");
      return;
    }
    if (formData.amount <= 0) {
      showToast("Please enter a valid amount", "info");
      return;
    }
    if (isAmountExceedingBalance()) {
      showToast("Amount exceeds available balance", "error");
      return;
    }

    const fromAccount = getAccountById(formData.fromAccountId);
    const toAccount = getAccountById(formData.toAccountId);
    const totalAmount = formData.amount + formData.transferCharges;

    if (isEditing && selectedTransfer) {
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === selectedTransfer.id
            ? {
                ...t,
                date: formData.date,
                fromAccountId: formData.fromAccountId,
                fromAccountName: fromAccount?.name || "",
                fromAccountNumber: fromAccount?.accountNumber || "",
                toAccountId: formData.toAccountId,
                toAccountName: toAccount?.name || "",
                toAccountNumber: toAccount?.accountNumber || "",
                amount: formData.amount,
                transferCharges: formData.transferCharges,
                totalAmount: totalAmount,
                referenceNumber: formData.referenceNumber,
                description: formData.description,
              }
            : t,
        ),
      );
      showToast("Bank transfer updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newTransfer: BankTransfer = {
        id: Date.now().toString(),
        transferNumber: `BT-${new Date().toISOString().split("T")[0]}-${String(transfers.length + 1).padStart(3, "0")}`,
        date: formData.date,
        fromAccountId: formData.fromAccountId,
        fromAccountName: fromAccount?.name || "",
        fromAccountNumber: fromAccount?.accountNumber || "",
        toAccountId: formData.toAccountId,
        toAccountName: toAccount?.name || "",
        toAccountNumber: toAccount?.accountNumber || "",
        amount: formData.amount,
        transferCharges: formData.transferCharges,
        totalAmount: totalAmount,
        referenceNumber: formData.referenceNumber,
        description: formData.description,
        status: "Pending",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTransfers((prev) => [newTransfer, ...prev]);
      showToast("Bank transfer created successfully!", "success");
      setShowCreateModal(false);
    }
    resetForm();
  };

  const handleDeleteTransfer = () => {
    if (selectedTransfer) {
      setTransfers((prev) => prev.filter((t) => t.id !== selectedTransfer.id));
      showToast("Bank transfer deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedTransfer(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-3 h-3" />;
      case "Pending":
        return <Clock className="w-3 h-3" />;
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
              {isEditing ? "Edit Bank Transfer" : "Create Bank Transfer"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update bank transfer information"
                : "Transfer funds between bank accounts"}
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
                Transfer Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
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
                value={formData.referenceNumber}
                onChange={(e) =>
                  setFormData({ ...formData, referenceNumber: e.target.value })
                }
                placeholder="e.g., BT-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Account <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.fromAccountId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fromAccountId: e.target.value,
                    toAccountId: "",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.accountNumber}) -{" "}
                    {fmtCurrency(account.currentBalance)}
                  </option>
                ))}
              </select>
              {formData.fromAccountId && (
                <p className="text-xs text-gray-500 mt-1">
                  Available Balance: {fmtCurrency(getFromAccountBalance())}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Account <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.toAccountId}
                onChange={(e) =>
                  setFormData({ ...formData, toAccountId: e.target.value })
                }
                disabled={!formData.fromAccountId}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Account</option>
                {accounts
                  .filter((a) => a.id !== formData.fromAccountId)
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.accountNumber})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transfer Amount <span className="text-red-500">*</span>
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
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    isAmountExceedingBalance() && formData.amount > 0
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {isAmountExceedingBalance() && formData.amount > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Amount exceeds available balance
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transfer Charges
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.transferCharges || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transferCharges: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
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

          {/* Summary */}
          {(formData.amount > 0 || formData.transferCharges > 0) && (
            <div className="border-t border-gray-200 pt-4 mt-2">
              <h3 className="font-medium text-gray-900 mb-3">
                Transfer Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Transfer Amount</span>
                  <span className="text-sm font-medium text-gray-900">
                    {fmtCurrency(formData.amount)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Transfer Charges
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {fmtCurrency(formData.transferCharges)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-base font-semibold text-blue-600">
                    {fmtCurrency(formData.amount + formData.transferCharges)}
                  </span>
                </div>
              </div>
            </div>
          )}
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
            onClick={handleSaveTransfer}
            disabled={isAmountExceedingBalance()}
            className={`px-4 py-2 rounded-md text-white ${
              isAmountExceedingBalance()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
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
              Bank Transfer Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedTransfer?.transferNumber}
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
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500">Transfer Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTransfer.transferNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Transfer Date</p>
                <p className="text-sm text-gray-600">{selectedTransfer.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">From Account</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTransfer.fromAccountName}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedTransfer.fromAccountNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">To Account</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTransfer.toAccountName}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedTransfer.toAccountNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Transfer Amount</p>
                <p className="text-sm font-semibold text-gray-900">
                  {fmtCurrency(selectedTransfer.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Transfer Charges</p>
                <p className="text-sm text-gray-600">
                  {fmtCurrency(selectedTransfer.transferCharges)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="text-sm font-semibold text-blue-600">
                  {fmtCurrency(selectedTransfer.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTransfer.status)}`}
                >
                  {getStatusIcon(selectedTransfer.status)}
                  {selectedTransfer.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reference Number</p>
                <p className="text-sm text-gray-600">
                  {selectedTransfer.referenceNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm text-gray-600">
                  {selectedTransfer.createdAt}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-600">
                  {selectedTransfer.description || "-"}
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
              if (selectedTransfer) openEditModal(selectedTransfer);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Transfer
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
            Delete Bank Transfer
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedTransfer?.transferNumber}
            </span>
            ? This action cannot be undone.
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
            onClick={() => navigate("/accounting")}
            className="hover:text-gray-700"
          >
            Accounting
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/accounting/banking")}
            className="hover:text-gray-700"
          >
            Banking
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Bank Transfers</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Bank Transfers
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Bank Transfer"
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
                placeholder="Search by transfer number or reference..."
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
                  {["All", "Pending", "Completed", "Cancelled"].map((st) => (
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
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="transferNumber" label="Transfer Number" />
                <SortHeader field="date" label="Date" />
                <SortHeader field="fromAccount" label="From Account" />
                <SortHeader field="toAccount" label="To Account" />
                <SortHeader field="amount" label="Amount" />
                <SortHeader field="status" label="Status" />
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
                    <span className="font-medium text-blue-600 hover:underline">
                      {transfer.transferNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{transfer.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-900">
                        {transfer.fromAccountName}
                      </span>
                      <span className="text-gray-400 text-xs">
                        ({transfer.fromAccountNumber})
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-900">
                        {transfer.toAccountName}
                      </span>
                      <span className="text-gray-400 text-xs">
                        ({transfer.toAccountNumber})
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fmtCurrency(transfer.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}
                    >
                      {getStatusIcon(transfer.status)}
                      {transfer.status}
                    </span>
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
                    No bank transfers found.
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
