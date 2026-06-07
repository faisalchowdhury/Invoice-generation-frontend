/**
 * File: src/pages/purchase/PurchaseInvoices.tsx
 * Complete Purchase Invoices page with list view, create/edit form, filters, pagination
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
  Settings,
  Mail,
  FileText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PurchaseItem {
  id: string;
  product: string;
  qty: number;
  unitPrice: number;
  discountPercent: number;
  tax: number;
  total: number;
}

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  balance: number;
  status: "Draft" | "Paid" | "Posted" | "Partial";
  warehouse: string;
  paymentTerms: string;
  notes: string;
  syncToCalendar: boolean;
  items: PurchaseItem[];
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleInvoices: PurchaseInvoice[] = [
  {
    id: "1",
    invoiceNumber: "PI-2026-02-016",
    vendor: "Tech Solutions Inc",
    invoiceDate: "2026-05-28",
    dueDate: "2026-06-15",
    subtotal: 2045.0,
    tax: 729.0,
    totalAmount: 2774.0,
    balance: 2774.0,
    status: "Draft",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    items: [
      {
        id: "i1",
        product: "Server Hardware",
        qty: 2,
        unitPrice: 1022.5,
        discountPercent: 0,
        tax: 364.5,
        total: 2045,
      },
    ],
  },
  {
    id: "2",
    invoiceNumber: "PI-2026-02-015",
    vendor: "Sam Supplier",
    invoiceDate: "2026-05-20",
    dueDate: "2026-06-05",
    subtotal: 1800.0,
    tax: 420.0,
    totalAmount: 2220.0,
    balance: 0.0,
    status: "Paid",
    warehouse: "Warehouse B",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    items: [
      {
        id: "i1",
        product: "Office Supplies",
        qty: 100,
        unitPrice: 18,
        discountPercent: 0,
        tax: 420,
        total: 1800,
      },
    ],
  },
  {
    id: "3",
    invoiceNumber: "PI-2026-02-014",
    vendor: "Alex Vendor",
    invoiceDate: "2026-05-10",
    dueDate: "2026-05-25",
    subtotal: 1150.0,
    tax: 345.0,
    totalAmount: 1495.0,
    balance: 1495.0,
    status: "Posted",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    items: [
      {
        id: "i1",
        product: "Electronics Components",
        qty: 50,
        unitPrice: 23,
        discountPercent: 0,
        tax: 345,
        total: 1150,
      },
    ],
  },
  {
    id: "4",
    invoiceNumber: "PI-2026-02-013",
    vendor: "Elite Vendors Group",
    invoiceDate: "2026-05-01",
    dueDate: "2026-05-15",
    subtotal: 3300.0,
    tax: 666.0,
    totalAmount: 3966.0,
    balance: 3966.0,
    status: "Draft",
    warehouse: "Warehouse B",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    items: [
      {
        id: "i1",
        product: "Raw Materials",
        qty: 100,
        unitPrice: 33,
        discountPercent: 0,
        tax: 666,
        total: 3300,
      },
    ],
  },
  {
    id: "5",
    invoiceNumber: "PI-2026-02-012",
    vendor: "Prime Materials Ltd",
    invoiceDate: "2026-04-20",
    dueDate: "2026-05-05",
    subtotal: 2100.0,
    tax: 945.0,
    totalAmount: 3045.0,
    balance: 3045.0,
    status: "Posted",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    items: [
      {
        id: "i1",
        product: "Construction Materials",
        qty: 30,
        unitPrice: 70,
        discountPercent: 0,
        tax: 945,
        total: 2100,
      },
    ],
  },
  {
    id: "6",
    invoiceNumber: "PI-2026-02-011",
    vendor: "Global Supplies Co",
    invoiceDate: "2026-04-10",
    dueDate: "2026-04-25",
    subtotal: 660.0,
    tax: 146.4,
    totalAmount: 806.4,
    balance: 406.4,
    status: "Partial",
    warehouse: "Warehouse B",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    items: [
      {
        id: "i1",
        product: "Stationery Items",
        qty: 200,
        unitPrice: 3.3,
        discountPercent: 0,
        tax: 146.4,
        total: 660,
      },
    ],
  },
  {
    id: "7",
    invoiceNumber: "PI-2026-02-010",
    vendor: "Tech Solutions Inc",
    invoiceDate: "2026-04-02",
    dueDate: "2026-04-15",
    subtotal: 650.0,
    tax: 177.0,
    totalAmount: 827.0,
    balance: 0.0,
    status: "Paid",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    items: [
      {
        id: "i1",
        product: "Network Cables",
        qty: 50,
        unitPrice: 13,
        discountPercent: 0,
        tax: 177,
        total: 650,
      },
    ],
  },
  {
    id: "8",
    invoiceNumber: "PI-2026-02-009",
    vendor: "Sam Supplier",
    invoiceDate: "2026-03-25",
    dueDate: "2026-04-10",
    subtotal: 1400.0,
    tax: 387.0,
    totalAmount: 1787.0,
    balance: 1787.0,
    status: "Draft",
    warehouse: "Warehouse B",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    items: [
      {
        id: "i1",
        product: "Furniture",
        qty: 10,
        unitPrice: 140,
        discountPercent: 0,
        tax: 387,
        total: 1400,
      },
    ],
  },
  {
    id: "9",
    invoiceNumber: "PI-2026-02-008",
    vendor: "Alex Vendor",
    invoiceDate: "2026-03-12",
    dueDate: "2026-04-01",
    subtotal: 390.0,
    tax: 81.0,
    totalAmount: 471.0,
    balance: 471.0,
    status: "Posted",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    items: [
      {
        id: "i1",
        product: "Tool Set",
        qty: 5,
        unitPrice: 78,
        discountPercent: 0,
        tax: 81,
        total: 390,
      },
    ],
  },
];

const vendors = [
  "Tech Solutions Inc",
  "Sam Supplier",
  "Alex Vendor",
  "Elite Vendors Group",
  "Prime Materials Ltd",
  "Global Supplies Co",
];
const warehouses = ["Main Warehouse", "Warehouse B", "Warehouse C"];
const products = [
  { name: "Server Hardware", price: 1022.5 },
  { name: "Office Supplies", price: 18 },
  { name: "Electronics Components", price: 23 },
  { name: "Raw Materials", price: 33 },
  { name: "Construction Materials", price: 70 },
  { name: "Stationery Items", price: 3.3 },
  { name: "Network Cables", price: 13 },
  { name: "Furniture", price: 140 },
  { name: "Tool Set", price: 78 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "invoiceNumber"
  | "vendor"
  | "invoiceDate"
  | "dueDate"
  | "subtotal"
  | "tax"
  | "totalAmount"
  | "balance"
  | "status";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────

export const PurchaseInvoices: React.FC = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<PurchaseInvoice[]>(sampleInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("invoiceNumber");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<PurchaseInvoice | null>(
    null,
  );

  // Form state
  const [formInvoiceDate, setFormInvoiceDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [formDueDate, setFormDueDate] = useState("");
  const [formVendor, setFormVendor] = useState("");
  const [formWarehouse, setFormWarehouse] = useState("");
  const [formPaymentTerms, setFormPaymentTerms] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formSyncCalendar, setFormSyncCalendar] = useState(false);
  const [formItems, setFormItems] = useState<PurchaseItem[]>([
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

  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.vendor.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((inv) => inv.status === statusFilter);
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
  }, [invoices, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredInvoices.length / perPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Status Badge — matches existing pattern ───────────────────────────────

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      case "Paid":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Posted":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Partial":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const canEdit = (status: string) => status === "Draft";
  const canDelete = (status: string) => status === "Draft";

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const recalcItem = (item: PurchaseItem): PurchaseItem => {
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

  const updateItem = (id: string, field: keyof PurchaseItem, value: any) => {
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
    setFormInvoiceDate(new Date().toISOString().split("T")[0]);
    setFormDueDate("");
    setFormVendor("");
    setFormWarehouse("");
    setFormPaymentTerms("");
    setFormNotes("");
    setFormSyncCalendar(false);
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
    setEditingInvoice(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice: PurchaseInvoice) => {
    setEditingInvoice(invoice);
    setFormInvoiceDate(invoice.invoiceDate);
    setFormDueDate(invoice.dueDate);
    setFormVendor(invoice.vendor);
    setFormWarehouse(invoice.warehouse);
    setFormPaymentTerms(invoice.paymentTerms);
    setFormNotes(invoice.notes);
    setFormSyncCalendar(invoice.syncToCalendar);
    setFormItems(
      invoice.items.length > 0
        ? invoice.items
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
    setShowForm(true);
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      showToast("Invoice deleted!", "success");
    }
  };

  const handleSaveInvoice = () => {
    if (!formVendor) {
      showToast("Please select a vendor", "info");
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

    if (isEditing && editingInvoice) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === editingInvoice.id
            ? {
                ...inv,
                invoiceDate: formInvoiceDate,
                dueDate: formDueDate,
                vendor: formVendor,
                warehouse: formWarehouse,
                paymentTerms: formPaymentTerms,
                notes: formNotes,
                syncToCalendar: formSyncCalendar,
                items: formItems,
                subtotal: formSubtotal,
                tax: formTax,
                totalAmount: formTotal,
                balance: formTotal,
              }
            : inv,
        ),
      );
      showToast("Invoice updated!", "success");
    } else {
      const newInvoice: PurchaseInvoice = {
        id: Date.now().toString(),
        invoiceNumber: `PI-2026-02-${String(invoices.length + 1).padStart(3, "0")}`,
        vendor: formVendor,
        invoiceDate: formInvoiceDate,
        dueDate: formDueDate,
        subtotal: formSubtotal,
        tax: formTax,
        totalAmount: formTotal,
        balance: formTotal,
        status: "Draft",
        warehouse: formWarehouse,
        paymentTerms: formPaymentTerms,
        notes: formNotes,
        syncToCalendar: formSyncCalendar,
        items: formItems,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
      showToast("Invoice created!", "success");
    }
    setShowForm(false);
    resetForm();
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
              onClick={() => navigate("/purchase/purchase-invoice")}
              className="hover:text-gray-700"
            >
              Purchase Invoices
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">
              {isEditing ? "Edit Purchase Invoice" : "Create Purchase Invoice"}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Purchase Invoice" : "Create Purchase Invoice"}
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
          {/* Purchase Invoice Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-semibold text-gray-900">
                Purchase Invoice Details
              </h3>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formInvoiceDate}
                    onChange={(e) => setFormInvoiceDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor <span className="text-red-500">*</span>
                </label>
                <select
                  value={formVendor}
                  onChange={(e) => setFormVendor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v} value={v}>
                      {v}
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
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={formPaymentTerms}
                  onChange={(e) => setFormPaymentTerms(e.target.value)}
                  placeholder="e.g., Net 30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm resize-y"
                />
              </div>
            </div>

            {/* Sync Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFormSyncCalendar(!formSyncCalendar)}
                className={`relative w-11 h-6 rounded-full transition-colors ${formSyncCalendar ? "bg-gray-900" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formSyncCalendar ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
              <span className="text-sm text-gray-700">
                Sync to Google Calendar
              </span>
            </div>
          </div>

          {/* Purchase Invoice Items Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <h3 className="text-base font-semibold text-gray-900">
                  Purchase Invoice Items
                </h3>
              </div>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-sm border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                      Product <span className="text-red-500">*</span>
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-20">
                      Qty <span className="text-red-500">*</span>
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-28">
                      Unit Price <span className="text-red-500">*</span>
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
                      <td className="px-2 py-3">
                        <select
                          value={item.product}
                          onChange={(e) =>
                            updateItem(item.id, "product", e.target.value)
                          }
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p.name} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-3">
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
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </td>
                      <td className="px-2 py-3">
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
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </td>
                      <td className="px-2 py-3">
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
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-600">
                        {item.tax > 0 ? fmtCurrency(item.tax) : "No tax"}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-900">
                        {fmtCurrency(item.total)}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Summary */}
            <div className="flex justify-end mt-6">
              <div className="w-full sm:w-72">
                <h4 className="text-base font-semibold text-gray-900 mb-3">
                  Invoice Summary
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
                    <span className="text-base font-semibold text-gray-900">
                      {fmtCurrency(formTotal)}
                    </span>
                  </div>
                </div>
              </div>
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
              onClick={() => {
                showToast("Saved as draft", "success");
                setShowForm(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              Save as Draft
            </button>
            <button
              onClick={handleSaveInvoice}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Save & Send
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
          <span className="text-gray-900 font-medium">Purchase Invoices</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Purchase Invoices
          </h2>
          <button
            onClick={handleCreate}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Invoice"
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
                placeholder="Search by invoice number..."
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
                  {["All", "Draft", "Paid", "Posted", "Partial"].map((st) => (
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

      {/* Table / Grid */}
      <div className="flex-1 overflow-auto">
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1000px]">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <SortHeader field="invoiceNumber" label="Invoice Number" />
                  <SortHeader field="vendor" label="Vendor" />
                  <SortHeader field="invoiceDate" label="Invoice Date" />
                  <SortHeader field="dueDate" label="Due Date" />
                  <SortHeader field="subtotal" label="Subtotal" />
                  <SortHeader field="tax" label="Tax" />
                  <SortHeader field="totalAmount" label="Total Amount" />
                  <SortHeader field="balance" label="Balance" />
                  <SortHeader field="status" label="Status" />
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <button
                        onClick={() => handleEditInvoice(inv)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="px-3 py-4 text-gray-900">{inv.vendor}</td>
                    <td className="px-3 py-4 text-gray-600">
                      {inv.invoiceDate}
                    </td>
                    <td className="px-3 py-4 text-gray-600">{inv.dueDate}</td>
                    <td className="px-3 py-4 text-gray-900">
                      {fmtCurrency(inv.subtotal)}
                    </td>
                    <td className="px-3 py-4 text-gray-900">
                      {fmtCurrency(inv.tax)}
                    </td>
                    <td className="px-3 py-4 text-gray-900">
                      {fmtCurrency(inv.totalAmount)}
                    </td>
                    <td className="px-3 py-4 text-gray-900">
                      {fmtCurrency(inv.balance)}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(inv.status)}`}
                      >
                        {inv.status}
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
                        {canEdit(inv.status) && (
                          <>
                            <button
                              onClick={() => showToast("Saving...", "info")}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditInvoice(inv)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {canDelete(inv.status) && (
                          <button
                            onClick={() => handleDeleteInvoice(inv.id)}
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
                {paginatedInvoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-3 py-12 text-center text-gray-500"
                    >
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={() => handleEditInvoice(inv)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {inv.invoiceNumber}
                  </button>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(inv.status)}`}
                  >
                    {inv.status}
                  </span>
                </div>
                <div className="text-sm text-gray-900 mb-1">{inv.vendor}</div>
                <div className="text-xs text-gray-500 mb-3">
                  {inv.invoiceDate} → {inv.dueDate}
                </div>
                <div className="flex items-center justify-between mb-3 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {fmtCurrency(inv.totalAmount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Balance</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {fmtCurrency(inv.balance)}
                    </div>
                  </div>
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
                  {canEdit(inv.status) && (
                    <button
                      onClick={() => handleEditInvoice(inv)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete(inv.status) && (
                    <button
                      onClick={() => handleDeleteInvoice(inv.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {paginatedInvoices.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No invoices found.
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
            {filteredInvoices.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredInvoices.length)} of{" "}
            {filteredInvoices.length} results
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
