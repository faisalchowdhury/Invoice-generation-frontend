/**
 * File: src/pages/sales/Quotations.tsx
 * Complete Quotations Management page with list view, create/edit modal, filters, pagination
 * Based on existing pattern — matching exact color codes and design style
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
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
  Calendar,
  Package,
  DollarSign,
  Percent,
  FileText,
  Send,
  Eye,
  Download,
  Printer,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuotationItem {
  id: string;
  product: string;
  qty: number;
  unitPrice: number;
  discountPercent: number;
  tax: number;
  total: number;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  customer: string;
  quotationDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired";
  warehouse: string;
  paymentTerms: string;
  notes: string;
  items: QuotationItem[];
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleQuotations: Quotation[] = [
  {
    id: "1",
    quotationNumber: "QT-2026-02-024",
    customer: "Strategic Consulting",
    quotationDate: "2026-02-09",
    dueDate: "2026-02-23",
    subtotal: 3.99,
    tax: 0.52,
    totalAmount: 4.51,
    status: "Draft",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 15",
    notes: "",
    items: [],
  },
  {
    id: "2",
    quotationNumber: "QT-2026-01-023",
    customer: "Jennifer Martinez",
    quotationDate: "2026-01-22",
    dueDate: "2026-02-05",
    subtotal: 63.99,
    tax: 7.61,
    totalAmount: 71.6,
    status: "Draft",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 15",
    notes: "",
    items: [],
  },
  {
    id: "3",
    quotationNumber: "QT-2026-01-022",
    customer: "Quality Solutions Inc",
    quotationDate: "2026-01-12",
    dueDate: "2026-01-26",
    subtotal: 18.99,
    tax: 2.25,
    totalAmount: 21.24,
    status: "Sent",
    warehouse: "East Coast Hub",
    paymentTerms: "Net 30",
    notes: "",
    items: [],
  },
  {
    id: "4",
    quotationNumber: "QT-2025-11-021",
    customer: "Prime Services Co",
    quotationDate: "2025-11-23",
    dueDate: "2025-12-07",
    subtotal: 160.0,
    tax: 14.24,
    totalAmount: 174.24,
    status: "Rejected",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    items: [],
  },
  {
    id: "5",
    quotationNumber: "QT-2025-11-020",
    customer: "Lisa Anderson",
    quotationDate: "2025-11-18",
    dueDate: "2025-12-02",
    subtotal: 191.98,
    tax: 20.65,
    totalAmount: 212.63,
    status: "Sent",
    warehouse: "West Coast Hub",
    paymentTerms: "Net 15",
    notes: "",
    items: [],
  },
  {
    id: "6",
    quotationNumber: "QT-2025-11-018",
    customer: "Future Tech Ltd",
    quotationDate: "2025-11-08",
    dueDate: "2025-11-22",
    subtotal: 274.99,
    tax: 21.47,
    totalAmount: 296.46,
    status: "Draft",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    items: [],
  },
  {
    id: "7",
    quotationNumber: "QT-2025-11-017",
    customer: "Elite Enterprises",
    quotationDate: "2025-11-03",
    dueDate: "2025-11-17",
    subtotal: 18.99,
    tax: 2.95,
    totalAmount: 21.94,
    status: "Rejected",
    warehouse: "East Coast Hub",
    paymentTerms: "Net 15",
    notes: "",
    items: [],
  },
  {
    id: "8",
    quotationNumber: "QT-2025-10-016",
    customer: "Dynamic Solutions",
    quotationDate: "2025-10-29",
    dueDate: "2025-11-12",
    subtotal: 369.99,
    tax: 28.27,
    totalAmount: 398.26,
    status: "Sent",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    items: [],
  },
];

const customers = [
  "Strategic Consulting",
  "Jennifer Martinez",
  "Quality Solutions Inc",
  "Prime Services Co",
  "Lisa Anderson",
  "Future Tech Ltd",
  "Elite Enterprises",
  "Dynamic Solutions",
  "Tech Innovations Inc",
  "Smart Systems Corp",
];

const warehouses = [
  "Main Warehouse",
  "East Coast Hub",
  "West Coast Hub",
  "Central Warehouse",
];
const products = [
  { name: "Laptop Pro", price: 1200 },
  { name: "Wireless Mouse", price: 25 },
  { name: "Mechanical Keyboard", price: 80 },
  { name: "USB-C Hub", price: 45 },
  { name: 'Monitor 27"', price: 350 },
  { name: "Webcam HD", price: 60 },
  { name: "Headphones", price: 90 },
  { name: "External SSD", price: 150 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "quotationNumber"
  | "customer"
  | "quotationDate"
  | "dueDate"
  | "subtotal"
  | "tax"
  | "totalAmount"
  | "status";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────

export const Quotations: React.FC = () => {
  const navigate = useNavigate();

  const [quotations, setQuotations] = useState<Quotation[]>(sampleQuotations);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("quotationNumber");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(
    null,
  );

  // Form state
  const [formQuotationDate, setFormQuotationDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [formDueDate, setFormDueDate] = useState("");
  const [formCustomer, setFormCustomer] = useState("");
  const [formWarehouse, setFormWarehouse] = useState("");
  const [formPaymentTerms, setFormPaymentTerms] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formItems, setFormItems] = useState<QuotationItem[]>([
    {
      id: "new-1",
      product: "",
      qty: 1,
      unitPrice: 0,
      discountPercent: 0,
      tax: 0,
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

  const filteredQuotations = useMemo(() => {
    let result = [...quotations];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (qtn) =>
          qtn.quotationNumber.toLowerCase().includes(q) ||
          qtn.customer.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((qtn) => qtn.status === statusFilter);
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
  }, [quotations, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredQuotations.length / perPage);
  const paginatedQuotations = filteredQuotations.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Status Badge ───────────────────────────────────────────────────────────

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      case "Sent":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Accepted":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      case "Expired":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <FileText className="w-3 h-3" />;
      case "Sent":
        return <Send className="w-3 h-3" />;
      case "Accepted":
        return <CheckCircle className="w-3 h-3" />;
      case "Rejected":
        return <X className="w-3 h-3" />;
      case "Expired":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Check if overdue
  const isOverdue = (dueDate: string, status: string) => {
    if (status === "Accepted" || status === "Rejected") return false;
    const today = new Date().toISOString().split("T")[0];
    return dueDate < today;
  };

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const recalcItem = (item: QuotationItem): QuotationItem => {
    const subtotal = item.qty * item.unitPrice;
    const discountAmt = subtotal * (item.discountPercent / 100);
    const afterDiscount = subtotal - discountAmt;
    const taxAmt = afterDiscount * 0.18;
    return {
      ...item,
      tax: Math.round(taxAmt * 100) / 100,
      total: Math.round(afterDiscount * 100) / 100,
    };
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setFormItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "product") {
          const found = products.find((p) => p.name === value);
          if (found) updated.unitPrice = found.price;
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
        qty: 1,
        unitPrice: 0,
        discountPercent: 0,
        tax: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setFormItems((prev) =>
      prev.length <= 1 ? prev : prev.filter((i) => i.id !== id),
    );
  };

  const formSubtotal = formItems.reduce((sum, i) => sum + i.total, 0);
  const formDiscount = formItems.reduce((sum, i) => {
    const sub = i.qty * i.unitPrice;
    return sum + sub * (i.discountPercent / 100);
  }, 0);
  const formTax = formItems.reduce((sum, i) => sum + i.tax, 0);
  const formTotal = formSubtotal + formTax;

  const resetForm = () => {
    setFormQuotationDate(new Date().toISOString().split("T")[0]);
    setFormDueDate("");
    setFormCustomer("");
    setFormWarehouse("");
    setFormPaymentTerms("");
    setFormNotes("");
    setFormItems([
      {
        id: "new-1",
        product: "",
        qty: 1,
        unitPrice: 0,
        discountPercent: 0,
        tax: 0,
        total: 0,
      },
    ]);
    setEditingQuotation(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setFormQuotationDate(quotation.quotationDate);
    setFormDueDate(quotation.dueDate);
    setFormCustomer(quotation.customer);
    setFormWarehouse(quotation.warehouse);
    setFormPaymentTerms(quotation.paymentTerms);
    setFormNotes(quotation.notes);
    setFormItems(
      quotation.items.length > 0
        ? quotation.items
        : [
            {
              id: "new-1",
              product: "",
              qty: 1,
              unitPrice: 0,
              discountPercent: 0,
              tax: 0,
              total: 0,
            },
          ],
    );
    setIsEditing(true);
    setShowModal(true);
  };

  const openDeleteModal = (quotation: Quotation) => {
    setQuotationToDelete(quotation);
    setShowDeleteModal(true);
  };

  const handleSaveQuotation = () => {
    if (!formCustomer) {
      showToast("Please select a customer", "info");
      return;
    }
    if (!formDueDate) {
      showToast("Please select a due date", "info");
      return;
    }
    if (!formWarehouse) {
      showToast("Please select a warehouse", "info");
      return;
    }

    if (isEditing && editingQuotation) {
      setQuotations((prev) =>
        prev.map((q) =>
          q.id === editingQuotation.id
            ? {
                ...q,
                quotationDate: formQuotationDate,
                dueDate: formDueDate,
                customer: formCustomer,
                warehouse: formWarehouse,
                paymentTerms: formPaymentTerms,
                notes: formNotes,
                items: formItems,
                subtotal: formSubtotal,
                tax: formTax,
                totalAmount: formTotal,
              }
            : q,
        ),
      );
      showToast("Quotation updated successfully!", "success");
    } else {
      const newQuotation: Quotation = {
        id: Date.now().toString(),
        quotationNumber: `QT-${new Date().toISOString().split("T")[0]}-${String(quotations.length + 1).padStart(3, "0")}`,
        customer: formCustomer,
        quotationDate: formQuotationDate,
        dueDate: formDueDate,
        subtotal: formSubtotal,
        tax: formTax,
        totalAmount: formTotal,
        status: "Draft",
        warehouse: formWarehouse,
        paymentTerms: formPaymentTerms,
        notes: formNotes,
        items: formItems,
      };
      setQuotations((prev) => [newQuotation, ...prev]);
      showToast("Quotation created successfully!", "success");
    }
    setShowModal(false);
    resetForm();
  };

  const handleDeleteQuotation = () => {
    if (quotationToDelete) {
      setQuotations((prev) =>
        prev.filter((q) => q.id !== quotationToDelete.id),
      );
      showToast("Quotation deleted successfully!", "success");
      setShowDeleteModal(false);
      setQuotationToDelete(null);
    }
  };

  const handleSendQuotation = (quotation: Quotation) => {
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quotation.id && q.status === "Draft"
          ? { ...q, status: "Sent" as const }
          : q,
      ),
    );
    showToast(
      `Quotation ${quotation.quotationNumber} sent to customer!`,
      "success",
    );
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
  // CREATE/EDIT MODAL
  // ═══════════════════════════════════════════════════════════════════════════

  const QuotationModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Quotation" : "Create Quotation"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update quotation information"
                : "Create a new quotation for customer"}
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Quotation Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-semibold text-gray-900">
                Quotation Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quotation Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formQuotationDate}
                    onChange={(e) => setFormQuotationDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  value={formCustomer}
                  onChange={(e) => setFormCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={formPaymentTerms}
                  onChange={(e) => setFormPaymentTerms(e.target.value)}
                  placeholder="e.g., Net 30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
                />
              </div>
            </div>
          </div>

          {/* Quotation Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <h3 className="text-base font-semibold text-gray-900">
                  Quotation Items
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
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                      Product *
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-20">
                      Qty *
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-28">
                      Unit Price *
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-24">
                      Discount %
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-24">
                      Tax
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-28">
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
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-600">
                        {item.tax > 0 ? fmtCurrency(item.tax) : "No tax"}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-900 font-medium">
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

            {/* Quotation Summary */}
            <div className="flex justify-end mt-6">
              <div className="w-full sm:w-72">
                <h4 className="text-base font-semibold text-gray-900 mb-3">
                  Quotation Summary
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

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveQuotation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? "Save Changes" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Delete Modal
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
            Delete Quotation
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {quotationToDelete?.quotationNumber}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteQuotation}
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
          <span className="text-gray-900 font-medium">Quotations</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Quotations
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Quotation"
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
                placeholder="Search by quotation number..."
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
                  {[
                    "All",
                    "Draft",
                    "Sent",
                    "Accepted",
                    "Rejected",
                    "Expired",
                  ].map((st) => (
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
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="quotationNumber" label="Quotation Number" />
                <SortHeader field="customer" label="Customer" />
                <SortHeader field="quotationDate" label="Quotation Date" />
                <SortHeader field="dueDate" label="Due Date" />
                <SortHeader field="subtotal" label="Subtotal" />
                <SortHeader field="tax" label="Tax" />
                <SortHeader field="totalAmount" label="Total Amount" />
                <SortHeader field="status" label="Status" />
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedQuotations.map((qtn) => (
                <tr key={qtn.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <button
                      onClick={() => openEditModal(qtn)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {qtn.quotationNumber}
                    </button>
                  </td>
                  <td className="px-3 py-4 text-gray-900">{qtn.customer}</td>
                  <td className="px-3 py-4 text-gray-600">
                    {qtn.quotationDate}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={
                        isOverdue(qtn.dueDate, qtn.status) &&
                        qtn.status !== "Accepted"
                          ? "text-red-500 font-medium"
                          : "text-gray-600"
                      }
                    >
                      {qtn.dueDate}
                      {isOverdue(qtn.dueDate, qtn.status) &&
                        qtn.status !== "Accepted" &&
                        " (Overdue)"}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-gray-900">
                    {fmtCurrency(qtn.subtotal)}
                  </td>
                  <td className="px-3 py-4 text-gray-900">
                    {fmtCurrency(qtn.tax)}
                  </td>
                  <td className="px-3 py-4 text-gray-900 font-medium">
                    {fmtCurrency(qtn.totalAmount)}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(qtn.status)}`}
                    >
                      {getStatusIcon(qtn.status)}
                      {qtn.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(qtn)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {qtn.status === "Draft" && (
                        <button
                          onClick={() => handleSendQuotation(qtn)}
                          className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                          title="Send"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(qtn)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedQuotations.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-12 text-center text-gray-500"
                  >
                    No quotations found.
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
            {filteredQuotations.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredQuotations.length)} of{" "}
            {filteredQuotations.length} results
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

      {/* Modals */}
      {showModal && <QuotationModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};
