/**
 * File: src/pages/accounting/DebitNotes.tsx
 * Complete Debit Notes Management page with list view, create/edit modal, and details modal
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
  FileText,
  User,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DebitNoteItem {
  id: string;
  product: string;
  sku: string;
  qty: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
}

interface DebitNoteApplication {
  id: string;
  paymentNumber: string;
  appliedAmount: number;
  date: string;
}

interface DebitNote {
  id: string;
  debitNoteNumber: string;
  purchaseReturn: string;
  vendor: string;
  vendorEmail: string;
  date: string;
  reason: string;
  totalAmount: number;
  balance: number;
  status: "Draft" | "Approved" | "Applied" | "Cancelled";
  approvedBy: string;
  items: DebitNoteItem[];
  applications: DebitNoteApplication[];
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleDebitNotes: DebitNote[] = [
  {
    id: "1",
    debitNoteNumber: "DN-2026-01-001",
    purchaseReturn: "PR-2026-01-002",
    vendor: "Tech Solutions Inc",
    vendorEmail: "contact@techsolutions.com",
    date: "2026-01-20",
    reason: "Purchase return - wrong_item",
    totalAmount: 767.0,
    balance: 0.0,
    status: "Applied",
    approvedBy: "Company",
    items: [
      {
        id: "i1",
        product: "Laptop",
        sku: "ELEC-PROD-001",
        qty: 1,
        unitPrice: 650.0,
        discountPercent: 0,
        taxPercent: 18.0,
        taxAmount: 117.0,
        total: 767.0,
      },
    ],
    applications: [
      {
        id: "a1",
        paymentNumber: "VP-2026-01-003",
        appliedAmount: 500.0,
        date: "2026-01-13",
      },
      {
        id: "a2",
        paymentNumber: "VP-2026-01-009",
        appliedAmount: 267.0,
        date: "2026-01-19",
      },
    ],
    createdAt: "2026-01-20",
  },
  {
    id: "2",
    debitNoteNumber: "DN-2026-01-002",
    purchaseReturn: "PR-2026-01-013",
    vendor: "Elite Vendors Group",
    vendorEmail: "sales@elitevendors.com",
    date: "2026-01-20",
    reason: "Defective products",
    totalAmount: 759.0,
    balance: 759.0,
    status: "Approved",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "3",
    debitNoteNumber: "DN-2026-01-003",
    purchaseReturn: "PR-2026-01-003",
    vendor: "Global Supplies Co",
    vendorEmail: "info@globalsupplies.com",
    date: "2026-01-20",
    reason: "Quality issues",
    totalAmount: 1300.0,
    balance: -187.2,
    status: "Applied",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "4",
    debitNoteNumber: "DN-2026-01-004",
    purchaseReturn: "PR-2026-01-012",
    vendor: "Global Supplies Co",
    vendorEmail: "info@globalsupplies.com",
    date: "2026-01-20",
    reason: "Shortage in delivery",
    totalAmount: 31.2,
    balance: 31.2,
    status: "Draft",
    approvedBy: "",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "5",
    debitNoteNumber: "DN-2026-01-005",
    purchaseReturn: "PR-2026-01-010",
    vendor: "Sam Supplier",
    vendorEmail: "orders@samSupplier.com",
    date: "2026-01-20",
    reason: "Wrong items shipped",
    totalAmount: 261.0,
    balance: 261.0,
    status: "Approved",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "6",
    debitNoteNumber: "DN-2026-01-006",
    purchaseReturn: "PR-2026-01-009",
    vendor: "Alex Vendor",
    vendorEmail: "sales@alexvendor.com",
    date: "2026-01-20",
    reason: "Damaged goods",
    totalAmount: 208.0,
    balance: 0.0,
    status: "Applied",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "7",
    debitNoteNumber: "DN-2026-01-007",
    purchaseReturn: "PR-2026-01-008",
    vendor: "Prime Materials Ltd",
    vendorEmail: "contact@primematerials.com",
    date: "2026-01-20",
    reason: "Incorrect pricing",
    totalAmount: 227.5,
    balance: 0.0,
    status: "Applied",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "8",
    debitNoteNumber: "DN-2026-01-008",
    purchaseReturn: "PR-2026-01-007",
    vendor: "Global Supplies Co",
    vendorEmail: "info@globalsupplies.com",
    date: "2026-01-20",
    reason: "Missing items",
    totalAmount: 156.0,
    balance: 156.0,
    status: "Draft",
    approvedBy: "",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "9",
    debitNoteNumber: "DN-2026-01-009",
    purchaseReturn: "PR-2026-01-005",
    vendor: "Sam Supplier",
    vendorEmail: "orders@samSupplier.com",
    date: "2026-01-20",
    reason: "Late delivery penalty",
    totalAmount: 174.0,
    balance: 174.0,
    status: "Approved",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
];

const vendors = [
  "Tech Solutions Inc",
  "Elite Vendors Group",
  "Global Supplies Co",
  "Sam Supplier",
  "Alex Vendor",
  "Prime Materials Ltd",
];

const purchaseReturns = [
  "PR-2026-01-002",
  "PR-2026-01-013",
  "PR-2026-01-003",
  "PR-2026-01-012",
  "PR-2026-01-010",
  "PR-2026-01-009",
  "PR-2026-01-008",
  "PR-2026-01-007",
  "PR-2026-01-005",
];

const reasons = [
  "Purchase return - wrong_item",
  "Defective products",
  "Quality issues",
  "Shortage in delivery",
  "Wrong items shipped",
  "Damaged goods",
  "Incorrect pricing",
  "Missing items",
  "Late delivery penalty",
];

const products = [
  { name: "Laptop", sku: "ELEC-PROD-001", price: 650.0 },
  { name: "Monitor", sku: "ELEC-PROD-002", price: 350.0 },
  { name: "Keyboard", sku: "ELEC-PROD-003", price: 80.0 },
  { name: "Mouse", sku: "ELEC-PROD-004", price: 25.0 },
  { name: "Printer", sku: "ELEC-PROD-005", price: 410.0 },
];

const statuses = ["Draft", "Approved", "Applied", "Cancelled"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "debitNoteNumber"
  | "purchaseReturn"
  | "vendor"
  | "date"
  | "totalAmount"
  | "balance"
  | "status"
  | "approvedBy";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const AccountsDebitNotes: React.FC = () => {
  const navigate = useNavigate();
  const [debitNotes, setDebitNotes] = useState<DebitNote[]>(sampleDebitNotes);
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
  const [selectedDebitNote, setSelectedDebitNote] = useState<DebitNote | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    purchaseReturn: "",
    vendor: "",
    reason: "",
    notes: "",
  });

  const [formItems, setFormItems] = useState<DebitNoteItem[]>([
    {
      id: "new-1",
      product: "",
      sku: "",
      qty: 1,
      unitPrice: 0,
      discountPercent: 0,
      taxPercent: 18,
      taxAmount: 0,
      total: 0,
    },
  ]);

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

  const filteredDebitNotes = useMemo(() => {
    let result = [...debitNotes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (dn) =>
          dn.debitNoteNumber.toLowerCase().includes(q) ||
          dn.purchaseReturn.toLowerCase().includes(q) ||
          dn.vendor.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((dn) => dn.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "totalAmount") {
        aVal = a.totalAmount;
        bVal = b.totalAmount;
      }
      if (sortField === "balance") {
        aVal = a.balance;
        bVal = b.balance;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [debitNotes, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredDebitNotes.length / perPage);
  const paginatedDebitNotes = filteredDebitNotes.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const recalcItem = (item: DebitNoteItem): DebitNoteItem => {
    const subtotal = item.qty * item.unitPrice;
    const discountAmt = subtotal * (item.discountPercent / 100);
    const afterDiscount = subtotal - discountAmt;
    const taxAmt = afterDiscount * (item.taxPercent / 100);
    return {
      ...item,
      taxAmount: Math.round(taxAmt * 100) / 100,
      total: Math.round((afterDiscount + taxAmt) * 100) / 100,
    };
  };

  const updateItem = (id: string, field: keyof DebitNoteItem, value: any) => {
    setFormItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "product") {
          const found = products.find((p) => p.name === value);
          if (found) {
            updated.sku = found.sku;
            updated.unitPrice = found.price;
          }
        }
        return recalcItem(updated);
      }),
    );
  };

  const addItem = () => {
    setFormItems((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        product: "",
        sku: "",
        qty: 1,
        unitPrice: 0,
        discountPercent: 0,
        taxPercent: 18,
        taxAmount: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setFormItems((prev) =>
      prev.length <= 1 ? prev : prev.filter((i) => i.id !== id),
    );
  };

  const formSubtotal = formItems.reduce(
    (sum, i) => sum + i.qty * i.unitPrice,
    0,
  );
  const formDiscount = formItems.reduce(
    (sum, i) => sum + i.qty * i.unitPrice * (i.discountPercent / 100),
    0,
  );
  const formTax = formItems.reduce((sum, i) => sum + i.taxAmount, 0);
  const formTotal = formSubtotal - formDiscount + formTax;

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      purchaseReturn: "",
      vendor: "",
      reason: "",
      notes: "",
    });
    setFormItems([
      {
        id: "new-1",
        product: "",
        sku: "",
        qty: 1,
        unitPrice: 0,
        discountPercent: 0,
        taxPercent: 18,
        taxAmount: 0,
        total: 0,
      },
    ]);
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (debitNote: DebitNote) => {
    setSelectedDebitNote(debitNote);
    setFormData({
      date: debitNote.date,
      purchaseReturn: debitNote.purchaseReturn,
      vendor: debitNote.vendor,
      reason: debitNote.reason,
      notes: "",
    });
    setFormItems(
      debitNote.items.length > 0
        ? debitNote.items
        : [
            {
              id: "new-1",
              product: "",
              sku: "",
              qty: 1,
              unitPrice: 0,
              discountPercent: 0,
              taxPercent: 18,
              taxAmount: 0,
              total: 0,
            },
          ],
    );
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (debitNote: DebitNote) => {
    setSelectedDebitNote(debitNote);
    setShowViewModal(true);
  };

  const openDeleteModal = (debitNote: DebitNote) => {
    setSelectedDebitNote(debitNote);
    setShowDeleteModal(true);
  };

  const handleSaveDebitNote = () => {
    if (!formData.vendor) {
      showToast("Please select a vendor", "info");
      return;
    }
    if (!formData.purchaseReturn) {
      showToast("Please select a purchase return", "info");
      return;
    }
    if (!formData.reason) {
      showToast("Please enter a reason", "info");
      return;
    }

    const vendorObj = vendors.find((v) => v === formData.vendor);

    if (isEditing && selectedDebitNote) {
      setDebitNotes((prev) =>
        prev.map((dn) =>
          dn.id === selectedDebitNote.id
            ? {
                ...dn,
                date: formData.date,
                purchaseReturn: formData.purchaseReturn,
                vendor: formData.vendor,
                reason: formData.reason,
                totalAmount: formTotal,
                items: formItems,
              }
            : dn,
        ),
      );
      showToast("Debit note updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newDebitNote: DebitNote = {
        id: Date.now().toString(),
        debitNoteNumber: `DN-${new Date().toISOString().split("T")[0]}-${String(debitNotes.length + 1).padStart(3, "0")}`,
        purchaseReturn: formData.purchaseReturn,
        vendor: formData.vendor,
        vendorEmail: `${formData.vendor.toLowerCase().replace(/\s/g, "")}@example.com`,
        date: formData.date,
        reason: formData.reason,
        totalAmount: formTotal,
        balance: formTotal,
        status: "Draft",
        approvedBy: "",
        items: formItems,
        applications: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setDebitNotes((prev) => [newDebitNote, ...prev]);
      showToast("Debit note created successfully!", "success");
      setShowCreateModal(false);
    }
    resetForm();
  };

  const handleDeleteDebitNote = () => {
    if (selectedDebitNote) {
      setDebitNotes((prev) =>
        prev.filter((dn) => dn.id !== selectedDebitNote.id),
      );
      showToast("Debit note deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedDebitNote(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
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
      case "Applied":
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Debit Note" : "Create Debit Note"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update debit note information"
                : "Create a new debit note"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
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
                Purchase Return <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.purchaseReturn}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseReturn: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Purchase Return</option>
                {purchaseReturns.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
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
                Reason <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Reason</option>
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
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

          {/* Debit Note Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gray-500" />
                <h3 className="text-base font-semibold text-gray-900">
                  Debit Note Items
                </h3>
              </div>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-48">
                      Product
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-20">
                      Qty
                    </th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600 w-28">
                      Unit Price
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-24">
                      Discount %
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-24">
                      Tax %
                    </th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600 w-28">
                      Total
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-16">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="px-2 py-2">
                        <select
                          value={item.product}
                          onChange={(e) =>
                            updateItem(item.id, "product", e.target.value)
                          }
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="">Select product</option>
                          {products.map((p) => (
                            <option key={p.name} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        {item.sku && (
                          <p className="text-xs text-gray-400 mt-1">
                            SKU: {item.sku}
                          </p>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "qty",
                              Math.max(1, parseInt(e.target.value) || 1),
                            )
                          }
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "unitPrice",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.discountPercent}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "discountPercent",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.taxPercent}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "taxPercent",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 py-2 text-right font-medium text-gray-900">
                        {fmtCurrency(item.total)}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end mt-6">
              <div className="w-full sm:w-80">
                <h4 className="text-base font-semibold text-gray-900 mb-3">
                  Debit Note Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {fmtCurrency(formSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-red-500">
                      -{fmtCurrency(formDiscount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">
                      {fmtCurrency(formTax)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-base font-semibold text-blue-600">
                      {fmtCurrency(formTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              {formItems.length} {formItems.length === 1 ? "item" : "items"}{" "}
              added
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
            onClick={handleSaveDebitNote}
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
              Debit Note Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedDebitNote?.debitNoteNumber}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {selectedDebitNote && (
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">VENDOR</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDebitNote.vendor}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedDebitNote.vendorEmail}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDebitNote.status)}`}
                >
                  {getStatusIcon(selectedDebitNote.status)}
                  {selectedDebitNote.status}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm text-gray-900">
                  {selectedDebitNote.date}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reason</p>
                <p className="text-sm text-gray-900">
                  {selectedDebitNote.reason}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Purchase Return</p>
                <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                  {selectedDebitNote.purchaseReturn}
                </p>
              </div>
            </div>

            {/* Items Table */}
            {selectedDebitNote.items.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Debit Note Items
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                          Product
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Discount
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Tax
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedDebitNote.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">
                            <p className="font-medium text-gray-900">
                              {item.product}
                            </p>
                            <p className="text-xs text-gray-400">
                              SKU: {item.sku}
                            </p>
                          </td>
                          <td className="px-4 py-2 text-center text-gray-600">
                            {item.qty}
                          </td>
                          <td className="px-4 py-2 text-right text-gray-600">
                            {fmtCurrency(item.unitPrice)}
                          </td>
                          <td className="px-4 py-2 text-right text-red-500">
                            {item.discountPercent}%
                          </td>
                          <td className="px-4 py-2 text-right text-gray-600">
                            {item.taxPercent}% ({fmtCurrency(item.taxAmount)})
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-gray-900">
                            {fmtCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td colSpan={5} className="px-4 py-2 text-right">
                          Subtotal
                        </td>
                        <td className="px-4 py-2 text-right">
                          {fmtCurrency(
                            selectedDebitNote.items.reduce(
                              (sum, i) => sum + i.qty * i.unitPrice,
                              0,
                            ),
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="px-4 py-2 text-right">
                          Tax
                        </td>
                        <td className="px-4 py-2 text-right">
                          {fmtCurrency(
                            selectedDebitNote.items.reduce(
                              (sum, i) => sum + i.taxAmount,
                              0,
                            ),
                          )}
                        </td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td
                          colSpan={5}
                          className="px-4 py-2 text-right font-bold"
                        >
                          Total Debit Amount
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-blue-600">
                          {fmtCurrency(selectedDebitNote.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Applied Amount:</span>{" "}
                    {fmtCurrency(
                      selectedDebitNote.totalAmount - selectedDebitNote.balance,
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500">Balance Amount:</span>{" "}
                    <span
                      className={
                        selectedDebitNote.balance !== 0
                          ? "text-red-500"
                          : "text-green-600"
                      }
                    >
                      {fmtCurrency(Math.abs(selectedDebitNote.balance))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Applications */}
            {selectedDebitNote.applications.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Applications
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                          Payment
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                          Applied Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDebitNote.applications.map((app) => (
                        <tr key={app.id}>
                          <td className="px-4 py-2 text-blue-600">
                            {app.paymentNumber}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {fmtCurrency(app.appliedAmount)}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {app.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-2 text-right font-bold"
                        >
                          Total Applied Amount
                        </td>
                        <td className="px-4 py-2 text-right font-bold">
                          {fmtCurrency(
                            selectedDebitNote.applications.reduce(
                              (sum, a) => sum + a.appliedAmount,
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
          </div>
        )}

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowViewModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          {selectedDebitNote?.status !== "Applied" && (
            <button
              onClick={() => {
                setShowViewModal(false);
                if (selectedDebitNote) openEditModal(selectedDebitNote);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Debit Note
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
            Delete Debit Note
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedDebitNote?.debitNoteNumber}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteDebitNote}
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
            onClick={() => navigate("/accounting")}
            className="hover:text-gray-700"
          >
            Accounting
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Debit Notes</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Debit Notes
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
                placeholder="Search by debit note number..."
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
                  {["All", "Draft", "Approved", "Applied", "Cancelled"].map(
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

      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="debitNoteNumber" label="Debit Note Number" />
                <SortHeader field="purchaseReturn" label="Purchase Return" />
                <SortHeader field="vendor" label="Vendor" />
                <SortHeader field="date" label="Date" />
                <SortHeader field="totalAmount" label="Total Amount" />
                <SortHeader field="balance" label="Balance" />
                <SortHeader field="status" label="Status" />
                <SortHeader field="approvedBy" label="Approved By" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedDebitNotes.map((dn) => (
                <tr
                  key={dn.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(dn)}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-blue-600 hover:underline">
                      {dn.debitNoteNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {dn.purchaseReturn}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-900">{dn.vendor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{dn.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fmtCurrency(dn.totalAmount)}
                  </td>
                  <td
                    className="px-4 py-3 font-medium"
                    style={{
                      color:
                        dn.balance < 0
                          ? "#16a34a"
                          : dn.balance > 0
                            ? "#dc2626"
                            : "#374151",
                    }}
                  >
                    {fmtCurrency(Math.abs(dn.balance))}
                    {dn.balance < 0 && " (Overpaid)"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dn.status)}`}
                    >
                      {getStatusIcon(dn.status)}
                      {dn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {dn.approvedBy || "-"}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(dn)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {dn.status !== "Applied" && (
                        <button
                          onClick={() => openEditModal(dn)}
                          className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(dn)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedDebitNotes.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No debit notes found.
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
            {filteredDebitNotes.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredDebitNotes.length)} of{" "}
            {filteredDebitNotes.length} results
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
