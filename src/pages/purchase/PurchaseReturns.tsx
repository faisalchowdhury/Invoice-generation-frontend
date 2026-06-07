/**
 * File: src/pages/purchase/PurchaseReturns.tsx
 * Complete Purchase Returns page with list view, create/edit form, filters, pagination
 * Based on existing SalesInvoices pattern — matching exact color codes and design style
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Save,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  Filter,
  List,
  LayoutGrid,
  ArrowLeft,
  RefreshCw,
  Check,
  Mail,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReturnItem {
  id: string;
  product: string;
  qty: number;
  unitPrice: number;
  total: number;
}

interface PurchaseReturn {
  id: string;
  returnNumber: string;
  vendor: string;
  warehouse: string;
  returnDate: string;
  totalAmount: number;
  items: ReturnItem[];
  status: "Draft" | "Completed" | "Approved" | "Rejected";
  originalInvoice: string;
  returnReason: string;
  notes: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleReturns: PurchaseReturn[] = [
  {
    id: "1",
    returnNumber: "PR-2026-02-011",
    vendor: "Alex Vendor",
    warehouse: "Central Distribution Center",
    returnDate: "2026-05-25",
    totalAmount: 78.0,
    items: [{ id: "i1", product: "Shoes", qty: 2, unitPrice: 39, total: 78 }],
    status: "Approved",
    originalInvoice: "PI-2026-02-015",
    returnReason: "Defective",
    notes: "",
  },
  {
    id: "2",
    returnNumber: "PR-2026-02-010",
    vendor: "Prime Materials Ltd",
    warehouse: "Texas Distribution Point",
    returnDate: "2026-05-05",
    totalAmount: 108.75,
    items: [
      {
        id: "i1",
        product: "Car Batteries",
        qty: 1,
        unitPrice: 108.75,
        total: 108.75,
      },
    ],
    status: "Completed",
    originalInvoice: "PI-2026-02-014",
    returnReason: "Defective",
    notes: "",
  },
  {
    id: "3",
    returnNumber: "PR-2026-02-009",
    vendor: "Global Supplies Co",
    warehouse: "Midwest Regional Warehouse",
    returnDate: "2026-04-15",
    totalAmount: 23.4,
    items: [
      {
        id: "i1",
        product: "Soft Drink",
        qty: 30,
        unitPrice: 0.78,
        total: 23.4,
      },
    ],
    status: "Draft",
    originalInvoice: "PI-2026-02-013",
    returnReason: "Damaged",
    notes: "",
  },
  {
    id: "4",
    returnNumber: "PR-2026-02-008",
    vendor: "Tech Solutions Inc",
    warehouse: "West Coast Storage Facility",
    returnDate: "2026-04-05",
    totalAmount: 65.0,
    items: [{ id: "i1", product: "Rice", qty: 20, unitPrice: 3.25, total: 65 }],
    status: "Approved",
    originalInvoice: "PI-2026-02-012",
    returnReason: "Wrong Item",
    notes: "",
  },
  {
    id: "5",
    returnNumber: "PR-2026-02-007",
    vendor: "Alex Vendor",
    warehouse: "Central Distribution Center",
    returnDate: "2026-03-20",
    totalAmount: 35.1,
    items: [
      { id: "i1", product: "Shampoo", qty: 3, unitPrice: 11.7, total: 35.1 },
    ],
    status: "Completed",
    originalInvoice: "PI-2026-02-011",
    returnReason: "Defective",
    notes: "",
  },
  {
    id: "6",
    returnNumber: "PR-2026-02-006",
    vendor: "Quality Parts Corp",
    warehouse: "Northeast Storage Complex",
    returnDate: "2026-03-15",
    totalAmount: 59.0,
    items: [
      {
        id: "i1",
        product: "Resistance Band",
        qty: 5,
        unitPrice: 11.8,
        total: 59,
      },
    ],
    status: "Draft",
    originalInvoice: "PI-2026-02-010",
    returnReason: "Wrong Item",
    notes: "",
  },
  {
    id: "7",
    returnNumber: "PR-2026-02-005",
    vendor: "Elite Vendors Group",
    warehouse: "Florida Fulfillment Center",
    returnDate: "2026-03-10",
    totalAmount: 59.0,
    items: [
      { id: "i1", product: "Wall Decor", qty: 2, unitPrice: 29.5, total: 59 },
    ],
    status: "Approved",
    originalInvoice: "PI-2026-02-009",
    returnReason: "Damaged",
    notes: "",
  },
  {
    id: "8",
    returnNumber: "PR-2026-02-004",
    vendor: "Prime Materials Ltd",
    warehouse: "Texas Distribution Point",
    returnDate: "2026-02-28",
    totalAmount: 130.5,
    items: [
      { id: "i1", product: "Stapler", qty: 20, unitPrice: 6.525, total: 130.5 },
    ],
    status: "Completed",
    originalInvoice: "PI-2026-02-008",
    returnReason: "Defective",
    notes: "",
  },
  {
    id: "9",
    returnNumber: "PR-2026-02-003",
    vendor: "Tech Solutions Inc",
    warehouse: "West Coast Storage Facility",
    returnDate: "2026-02-22",
    totalAmount: 354.0,
    items: [
      { id: "i1", product: "Smart TV", qty: 1, unitPrice: 354, total: 354 },
    ],
    status: "Draft",
    originalInvoice: "PI-2026-02-007",
    returnReason: "Defective",
    notes: "",
  },
];

const vendors = [
  "Alex Vendor",
  "Prime Materials Ltd",
  "Global Supplies Co",
  "Tech Solutions Inc",
  "Quality Parts Corp",
  "Elite Vendors Group",
  "Sam Supplier",
];
const warehouses = [
  "Central Distribution Center",
  "Texas Distribution Point",
  "Midwest Regional Warehouse",
  "West Coast Storage Facility",
  "Northeast Storage Complex",
  "Florida Fulfillment Center",
  "Main Warehouse",
];
const invoices = [
  "PI-2026-02-018",
  "PI-2026-02-017",
  "PI-2026-02-016",
  "PI-2026-02-015",
  "PI-2026-02-014",
  "PI-2026-02-013",
  "PI-2026-02-012",
  "PI-2026-02-011",
  "PI-2026-02-010",
  "PI-2026-02-009",
];
const returnReasons = [
  "Defective",
  "Wrong Item",
  "Damaged",
  "Not as Described",
  "Expired",
  "Other",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "returnNumber"
  | "vendor"
  | "warehouse"
  | "returnDate"
  | "totalAmount"
  | "items"
  | "status";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────

export const PurchaseReturns: React.FC = () => {
  const navigate = useNavigate();

  const [returns, setReturns] = useState<PurchaseReturn[]>(sampleReturns);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("returnNumber");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReturn, setEditingReturn] = useState<PurchaseReturn | null>(
    null,
  );

  // Form state
  const [formReturnDate, setFormReturnDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [formOriginalInvoice, setFormOriginalInvoice] = useState("");
  const [formWarehouse, setFormWarehouse] = useState("");
  const [formReturnReason, setFormReturnReason] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formVendor, setFormVendor] = useState("");
  const [formItems, setFormItems] = useState<ReturnItem[]>([]);

  // Helper to get vendor from invoice (mock)
  const getVendorFromInvoice = (invoiceNumber: string) => {
    const invoiceVendorMap: Record<string, string> = {
      "PI-2026-02-018": "Tech Solutions Inc",
      "PI-2026-02-017": "Sam Supplier",
      "PI-2026-02-016": "Alex Vendor",
      "PI-2026-02-015": "Elite Vendors Group",
      "PI-2026-02-014": "Prime Materials Ltd",
      "PI-2026-02-013": "Global Supplies Co",
      "PI-2026-02-012": "Tech Solutions Inc",
      "PI-2026-02-011": "Sam Supplier",
      "PI-2026-02-010": "Alex Vendor",
      "PI-2026-02-009": "Prime Materials Ltd",
    };
    return invoiceVendorMap[invoiceNumber] || "";
  };

  // Handle invoice selection
  const handleInvoiceChange = (invoiceNumber: string) => {
    setFormOriginalInvoice(invoiceNumber);
    const vendor = getVendorFromInvoice(invoiceNumber);
    setFormVendor(vendor);

    // Mock items from invoice
    if (invoiceNumber) {
      const mockItems: ReturnItem[] = [
        {
          id: `item-${Date.now()}`,
          product: "Sample Product",
          qty: 1,
          unitPrice: 100,
          total: 100,
        },
      ];
      setFormItems(mockItems);
    } else {
      setFormItems([]);
    }
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

  const filteredReturns = useMemo(() => {
    let result = [...returns];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (ret) =>
          ret.returnNumber.toLowerCase().includes(q) ||
          ret.vendor.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((ret) => ret.status === statusFilter);
    }
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (sortField === "items") {
        aVal = a.items.length;
        bVal = b.items.length;
      }
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [returns, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredReturns.length / perPage);
  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Status Badge — matches existing pattern ───────────────────────────────

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Approved":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const canEdit = (status: string) => status === "Draft";
  const canDelete = (status: string) => status === "Draft";

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormReturnDate(new Date().toISOString().split("T")[0]);
    setFormOriginalInvoice("");
    setFormWarehouse("");
    setFormReturnReason("");
    setFormNotes("");
    setFormVendor("");
    setFormItems([]);
    setEditingReturn(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditReturn = (returnItem: PurchaseReturn) => {
    setEditingReturn(returnItem);
    setFormReturnDate(returnItem.returnDate);
    setFormOriginalInvoice(returnItem.originalInvoice);
    setFormWarehouse(returnItem.warehouse);
    setFormReturnReason(returnItem.returnReason);
    setFormNotes(returnItem.notes);
    setFormVendor(returnItem.vendor);
    setFormItems(returnItem.items);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteReturn = (id: string) => {
    if (confirm("Are you sure you want to delete this return?")) {
      setReturns((prev) => prev.filter((ret) => ret.id !== id));
      showToast("Return deleted!", "success");
    }
  };

  const handleSaveReturn = () => {
    if (!formOriginalInvoice) {
      showToast("Please select an original invoice", "info");
      return;
    }
    if (!formWarehouse) {
      showToast("Please select a warehouse", "info");
      return;
    }
    if (!formReturnReason) {
      showToast("Please select a return reason", "info");
      return;
    }

    const totalAmount = formItems.reduce((sum, i) => sum + i.total, 0);

    if (isEditing && editingReturn) {
      setReturns((prev) =>
        prev.map((ret) =>
          ret.id === editingReturn.id
            ? {
                ...ret,
                returnDate: formReturnDate,
                originalInvoice: formOriginalInvoice,
                warehouse: formWarehouse,
                returnReason: formReturnReason,
                notes: formNotes,
                vendor: formVendor,
                items: formItems,
                totalAmount: totalAmount,
              }
            : ret,
        ),
      );
      showToast("Return updated!", "success");
    } else {
      const newReturn: PurchaseReturn = {
        id: Date.now().toString(),
        returnNumber: `PR-2026-02-${String(returns.length + 1).padStart(3, "0")}`,
        vendor: formVendor,
        warehouse: formWarehouse,
        returnDate: formReturnDate,
        totalAmount: totalAmount,
        items: formItems,
        status: "Draft",
        originalInvoice: formOriginalInvoice,
        returnReason: formReturnReason,
        notes: formNotes,
      };
      setReturns((prev) => [newReturn, ...prev]);
      showToast("Return created!", "success");
    }
    setShowForm(false);
    resetForm();
  };

  // Format items for display
  const formatItems = (items: ReturnItem[]) => {
    return items.map((i) => `${i.product} ×${i.qty}`).join(", ");
  };

  // ─── Sort Header ────────────────────────────────────────────────────────────

  const SortHeader: React.FC<{ field: SortField; label: string }> = ({
    field,
    label,
  }) => (
    <th
      className="px-3 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer select-none hover:bg-gray-50 whitespace-nowrap"
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
  // CREATE / EDIT FORM VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  if (showForm) {
    return (
      <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
        {/* Breadcrumb */}
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
              onClick={() => navigate("/purchase/purchase-returns")}
              className="hover:text-gray-700"
            >
              Purchase Returns
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">
              {isEditing ? "Edit Purchase Return" : "Create Purchase Return"}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Purchase Return" : "Create Purchase Return"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Purchase Return Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <RefreshCw className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-semibold text-gray-900">
                Purchase Return Details
              </h3>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formReturnDate}
                    onChange={(e) => setFormReturnDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Invoice <span className="text-red-500">*</span>
                </label>
                <select
                  value={formOriginalInvoice}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="">Select Invoice</option>
                  {invoices.map((inv) => (
                    <option key={inv} value={inv}>
                      {inv}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  value={formWarehouse}
                  onChange={(e) => setFormWarehouse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={formReturnReason}
                  onChange={(e) => setFormReturnReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="">Select Reason</option>
                  {returnReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm resize-y"
              />
            </div>

            {/* Selected Items Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700">
                    {formItems.length}{" "}
                    {formItems.length === 1 ? "item" : "items"} selected for
                    return
                  </span>
                </div>
                {formItems.length > 0 && (
                  <div className="text-sm font-medium text-gray-900">
                    Total:{" "}
                    {fmtCurrency(
                      formItems.reduce((sum, i) => sum + i.total, 0),
                    )}
                  </div>
                )}
              </div>
              {formItems.length > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  {formItems.map((item, idx) => (
                    <span key={item.id}>
                      {item.product} ×{item.qty}
                      {idx < formItems.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pb-6">
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveReturn}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate("/")}
            className="hover:text-gray-700"
          >
            Dashboard
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Purchase Returns</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Purchase Returns
          </h2>
          <button
            onClick={handleCreate}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Return"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by return number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => showToast("Search applied", "info")}
              className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Search
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* View toggle */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Per Page */}
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

            {/* Filters */}
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
                  {["All", "Draft", "Completed", "Approved", "Rejected"].map(
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

      {/* Table / Grid */}
      <div className="flex-1 overflow-auto">
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1000px]">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <SortHeader field="returnNumber" label="Return Number" />
                  <SortHeader field="vendor" label="Vendor" />
                  <SortHeader field="warehouse" label="Warehouse" />
                  <SortHeader field="returnDate" label="Return Date" />
                  <SortHeader field="totalAmount" label="Total Amount" />
                  <SortHeader field="items" label="Items" />
                  <SortHeader field="status" label="Status" />
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <button
                        onClick={() => handleEditReturn(ret)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {ret.returnNumber}
                      </button>
                    </td>
                    <td className="px-3 py-4 text-gray-900">{ret.vendor}</td>
                    <td className="px-3 py-4 text-gray-600">{ret.warehouse}</td>
                    <td className="px-3 py-4 text-gray-600">
                      {ret.returnDate}
                    </td>
                    <td className="px-3 py-4 text-gray-900">
                      {fmtCurrency(ret.totalAmount)}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex flex-col">
                        {ret.items.map((item, idx) => (
                          <span key={item.id} className="text-xs text-gray-600">
                            {item.product} ×{item.qty}
                            {idx < ret.items.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(ret.status)}`}
                      >
                        {ret.status}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => showToast("Email sent", "success")}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            showToast("Downloading PDF...", "info")
                          }
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            showToast("Opening preview...", "info")
                          }
                          className="p-1.5 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit(ret.status) && (
                          <>
                            <button
                              onClick={() => showToast("Saving...", "info")}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditReturn(ret)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {canDelete(ret.status) && (
                          <button
                            onClick={() => handleDeleteReturn(ret.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedReturns.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-12 text-center text-gray-500"
                    >
                      No returns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedReturns.map((ret) => (
              <div
                key={ret.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={() => handleEditReturn(ret)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {ret.returnNumber}
                  </button>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(ret.status)}`}
                  >
                    {ret.status}
                  </span>
                </div>
                <div className="text-sm text-gray-900 mb-1">{ret.vendor}</div>
                <div className="text-xs text-gray-500 mb-3">
                  {ret.returnDate} • {ret.warehouse}
                </div>
                <div className="flex items-center justify-between mb-3 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">Total Amount</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {fmtCurrency(ret.totalAmount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Items</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {ret.items.length}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  {formatItems(ret.items)}
                </div>
                <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => showToast("Email sent", "success")}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast("Downloading PDF...", "info")}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast("Opening preview...", "info")}
                    className="p-1.5 text-yellow-500 hover:text-yellow-600 rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {canEdit(ret.status) && (
                    <button
                      onClick={() => handleEditReturn(ret)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete(ret.status) && (
                    <button
                      onClick={() => handleDeleteReturn(ret.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {paginatedReturns.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No returns found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {filteredReturns.length === 0 ? 0 : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredReturns.length)} of{" "}
            {filteredReturns.length} results
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm rounded-md flex items-center justify-center ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
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
    </div>
  );
};
