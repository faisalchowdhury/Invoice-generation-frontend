/**
 * File: src/pages/accounting/VendorPayments.tsx
 * Complete Vendor Payments Management page with list view, create/edit modal, and details modal
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
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  FileText,
  CreditCard,
  Landmark,
  Receipt,
  Link as LinkIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InvoiceAllocation {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceTotal: number;
  allocatedAmount: number;
}

interface DebitNoteAllocation {
  id: string;
  debitNoteNumber: string;
  applicationDate: string;
  appliedAmount: number;
}

interface VendorPayment {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  vendor: string;
  bankAccount: string;
  bankAccountNumber: string;
  amount: number;
  status: "pending" | "cleared" | "cancelled";
  referenceNumber: string;
  notes: string;
  invoiceAllocations: InvoiceAllocation[];
  debitNoteAllocations: DebitNoteAllocation[];
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const samplePayments: VendorPayment[] = [
  {
    id: "1",
    paymentNumber: "VP-2026-01-013",
    paymentDate: "2026-01-20",
    vendor: "Global Supplies Co",
    bankAccount: "Business Checking Account",
    bankAccountNumber: "1234567890",
    amount: 527.8,
    status: "cancelled",
    referenceNumber: "CHQ-4040",
    notes: "Combined invoice & note application.",
    invoiceAllocations: [
      {
        id: "inv1",
        invoiceNumber: "PI-2026-01-004",
        invoiceDate: "2026-02-05",
        invoiceTotal: 1859.0,
        allocatedAmount: 859.0,
      },
    ],
    debitNoteAllocations: [
      {
        id: "dn1",
        debitNoteNumber: "DN-2026-01-003",
        applicationDate: "2026-01-20",
        appliedAmount: 331.2,
      },
    ],
    createdAt: "2026-01-20",
  },
  {
    id: "2",
    paymentNumber: "VP-2026-01-012",
    paymentDate: "2026-01-20",
    vendor: "Sam Supplier",
    bankAccount: "Savings Account",
    bankAccountNumber: "9876543210",
    amount: 1110.0,
    status: "cleared",
    referenceNumber: "CHQ-4039",
    notes: "Monthly supplier payment",
    invoiceAllocations: [],
    debitNoteAllocations: [],
    createdAt: "2026-01-20",
  },
  {
    id: "3",
    paymentNumber: "VP-2026-01-011",
    paymentDate: "2026-01-20",
    vendor: "Alex Vendor",
    bankAccount: "Business Checking Account",
    bankAccountNumber: "1234567890",
    amount: 2000.0,
    status: "pending",
    referenceNumber: "CHQ-4038",
    notes: "Partial payment for invoice PI-2026-01-003",
    invoiceAllocations: [],
    debitNoteAllocations: [],
    createdAt: "2026-01-20",
  },
  {
    id: "4",
    paymentNumber: "VP-2026-01-010",
    paymentDate: "2026-01-19",
    vendor: "Global Supplies Co",
    bankAccount: "Equipment Loan Account",
    bankAccountNumber: "1111222233",
    amount: 572.0,
    status: "cleared",
    referenceNumber: "CHQ-4037",
    notes: "",
    invoiceAllocations: [],
    debitNoteAllocations: [],
    createdAt: "2026-01-19",
  },
  {
    id: "5",
    paymentNumber: "VP-2026-01-009",
    paymentDate: "2026-01-19",
    vendor: "Tech Solutions Inc",
    bankAccount: "Credit Line Account",
    bankAccountNumber: "5555666677",
    amount: 1733.0,
    status: "cleared",
    referenceNumber: "CHQ-4036",
    notes: "Payment for technical services",
    invoiceAllocations: [],
    debitNoteAllocations: [],
    createdAt: "2026-01-19",
  },
  {
    id: "6",
    paymentNumber: "VP-2026-01-008",
    paymentDate: "2026-01-18",
    vendor: "Sam Supplier",
    bankAccount: "Savings Account",
    bankAccountNumber: "9876543210",
    amount: 2349.0,
    status: "pending",
    referenceNumber: "CHQ-4035",
    notes: "",
    invoiceAllocations: [],
    debitNoteAllocations: [],
    createdAt: "2026-01-18",
  },
  {
    id: "7",
    paymentNumber: "VP-2026-01-007",
    paymentDate: "2026-01-17",
    vendor: "Alex Vendor",
    bankAccount: "Business Checking Account",
    bankAccountNumber: "1234567890",
    amount: 2015.0,
    status: "cancelled",
    referenceNumber: "CHQ-4034",
    notes: "Payment cancelled due to discrepancy",
    invoiceAllocations: [],
    debitNoteAllocations: [],
    createdAt: "2026-01-17",
  },
  {
    id: "8",
    paymentNumber: "VP-2026-01-006",
    paymentDate: "2026-01-16",
    vendor: "Elite Vendors Group",
    bankAccount: "Business Checking Account",
    bankAccountNumber: "1234567890",
    amount: 652.0,
    status: "cleared",
    referenceNumber: "CHQ-4033",
    notes: "",
    invoiceAllocations: [],
    debitNoteAllocations: [],
    createdAt: "2026-01-16",
  },
  {
    id: "9",
    paymentNumber: "VP-2026-01-005",
    paymentDate: "2026-01-15",
    vendor: "Prime Materials Ltd",
    bankAccount: "Equipment Loan Account",
    bankAccountNumber: "1111222233",
    amount: 772.5,
    status: "cleared",
    referenceNumber: "CHQ-4032",
    notes: "",
    invoiceAllocations: [],
    debitNoteAllocations: [],
    createdAt: "2026-01-15",
  },
];

const vendors = [
  "Global Supplies Co",
  "Sam Supplier",
  "Alex Vendor",
  "Tech Solutions Inc",
  "Elite Vendors Group",
  "Prime Materials Ltd",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "paymentNumber"
  | "paymentDate"
  | "vendor"
  | "bankAccount"
  | "amount"
  | "status";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const VendorPayments: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<VendorPayment[]>(samplePayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("paymentDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<VendorPayment | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split("T")[0],
    vendor: "",
    bankAccount: "",
    amount: 0,
    referenceNumber: "",
    notes: "",
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

  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.paymentNumber.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q) ||
          p.referenceNumber.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
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
  }, [payments, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredPayments.length / perPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({
      paymentDate: new Date().toISOString().split("T")[0],
      vendor: "",
      bankAccount: "",
      amount: 0,
      referenceNumber: "",
      notes: "",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (payment: VendorPayment) => {
    setSelectedPayment(payment);
    setFormData({
      paymentDate: payment.paymentDate,
      vendor: payment.vendor,
      bankAccount: payment.bankAccount,
      amount: payment.amount,
      referenceNumber: payment.referenceNumber,
      notes: payment.notes,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (payment: VendorPayment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const openDeleteModal = (payment: VendorPayment) => {
    setSelectedPayment(payment);
    setShowDeleteModal(true);
  };

  const handleSavePayment = () => {
    if (!formData.vendor) {
      showToast("Please select a vendor", "info");
      return;
    }
    if (!formData.bankAccount) {
      showToast("Please select a bank account", "info");
      return;
    }
    if (formData.amount <= 0) {
      showToast("Please enter a valid amount", "info");
      return;
    }

    const selectedBank = bankAccounts.find(
      (b) => b.name === formData.bankAccount,
    );

    if (isEditing && selectedPayment) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedPayment.id
            ? {
                ...p,
                paymentDate: formData.paymentDate,
                vendor: formData.vendor,
                bankAccount: formData.bankAccount,
                bankAccountNumber: selectedBank?.number || "",
                amount: formData.amount,
                referenceNumber: formData.referenceNumber,
                notes: formData.notes,
              }
            : p,
        ),
      );
      showToast("Payment updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newPayment: VendorPayment = {
        id: Date.now().toString(),
        paymentNumber: `VP-${new Date().toISOString().split("T")[0]}-${String(payments.length + 1).padStart(3, "0")}`,
        paymentDate: formData.paymentDate,
        vendor: formData.vendor,
        bankAccount: formData.bankAccount,
        bankAccountNumber: selectedBank?.number || "",
        amount: formData.amount,
        status: "pending",
        referenceNumber: formData.referenceNumber,
        notes: formData.notes,
        invoiceAllocations: [],
        debitNoteAllocations: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPayments((prev) => [newPayment, ...prev]);
      showToast("Payment created successfully!", "success");
      setShowCreateModal(false);
    }
    resetForm();
  };

  const handleDeletePayment = () => {
    if (selectedPayment) {
      setPayments((prev) => prev.filter((p) => p.id !== selectedPayment.id));
      showToast("Payment deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedPayment(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cleared":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cleared":
        return <CheckCircle className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "cancelled":
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
              {isEditing ? "Edit Vendor Payment" : "Create Vendor Payment"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update payment information"
                : "Record a new vendor payment"}
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
                Payment Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentDate: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.vendor}
                onChange={(e) =>
                  setFormData({ ...formData, vendor: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor} value={vendor}>
                    {vendor}
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
                Payment Amount <span className="text-red-500">*</span>
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
                value={formData.referenceNumber}
                onChange={(e) =>
                  setFormData({ ...formData, referenceNumber: e.target.value })
                }
                placeholder="e.g., CHQ-0000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                placeholder="Additional notes..."
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
            onClick={handleSavePayment}
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedPayment?.paymentNumber}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {selectedPayment && (
          <div className="p-6">
            {/* Payment Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Payment Number</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedPayment.paymentNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment Date</p>
                  <p className="text-sm text-gray-600">
                    {selectedPayment.paymentDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Vendor</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedPayment.vendor}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bank Account</p>
                  <p className="text-sm text-gray-600">
                    {selectedPayment.bankAccount} (
                    {selectedPayment.bankAccountNumber})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment Amount</p>
                  <p className="text-lg font-bold text-blue-600">
                    {fmtCurrency(selectedPayment.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}
                  >
                    {getStatusIcon(selectedPayment.status)}
                    {selectedPayment.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reference Number</p>
                  <p className="text-sm text-gray-600">
                    {selectedPayment.referenceNumber || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created Date</p>
                  <p className="text-sm text-gray-600">
                    {selectedPayment.createdAt}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedPayment.notes && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    {selectedPayment.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Invoice Allocations */}
            {selectedPayment.invoiceAllocations.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Invoice Allocations
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                          Invoice Number
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                          Invoice Date
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Invoice Total
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Allocated Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedPayment.invoiceAllocations.map((inv) => (
                        <tr key={inv.id}>
                          <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                            {inv.invoiceNumber}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {inv.invoiceDate}
                          </td>
                          <td className="px-4 py-2 text-right text-gray-900">
                            {fmtCurrency(inv.invoiceTotal)}
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-gray-900">
                            {fmtCurrency(inv.allocatedAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-2 text-right font-semibold text-gray-900"
                        >
                          Total Payment:
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-blue-600">
                          {fmtCurrency(selectedPayment.amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Debit Note History */}
            {selectedPayment.debitNoteAllocations.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Debit Note History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                          Debit Note Number
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                          Application Date
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Applied Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedPayment.debitNoteAllocations.map((dn) => (
                        <tr key={dn.id}>
                          <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                            {dn.debitNoteNumber}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {dn.applicationDate}
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-gray-900">
                            {fmtCurrency(dn.appliedAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-2 text-right font-semibold text-gray-900"
                        >
                          Total Applied Debit Note:
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-blue-600">
                          {fmtCurrency(
                            selectedPayment.debitNoteAllocations.reduce(
                              (sum, dn) => sum + dn.appliedAmount,
                              0,
                            ),
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* No allocations message */}
            {selectedPayment.invoiceAllocations.length === 0 &&
              selectedPayment.debitNoteAllocations.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No invoice allocations or debit note history available
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
          {selectedPayment?.status === "pending" && (
            <button
              onClick={() => {
                setShowViewModal(false);
                if (selectedPayment) openEditModal(selectedPayment);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Payment
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
            Delete Payment
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedPayment?.paymentNumber}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeletePayment}
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
          <span className="text-gray-900 font-medium">Vendor Payments</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Vendor Payments
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Payment"
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
                placeholder="Search payments..."
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
                  {["All", "pending", "cleared", "cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setStatusFilter(st);
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${statusFilter === st ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}`}
                    >
                      {st.charAt(0).toUpperCase() + st.slice(1)}
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
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="paymentNumber" label="Payment Number" />
                <SortHeader field="paymentDate" label="Payment Date" />
                <SortHeader field="vendor" label="Vendor" />
                <SortHeader field="bankAccount" label="Bank Account" />
                <SortHeader field="amount" label="Amount" />
                <SortHeader field="status" label="Status" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(payment)}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-blue-600 hover:underline">
                      {payment.paymentNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {payment.paymentDate}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-900">{payment.vendor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {payment.bankAccount}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fmtCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                    >
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(payment)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === "pending" && (
                        <button
                          onClick={() => openEditModal(payment)}
                          className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(payment)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedPayments.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No payments found.
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
            {filteredPayments.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredPayments.length)} of{" "}
            {filteredPayments.length} results
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
