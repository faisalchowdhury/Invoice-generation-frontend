/**
 * File: src/pages/purchase/PurchaseInvoice.tsx
 * Purchase Invoices page — list, create/edit form, view modal, post & delete.
 *
 * Backed by the purchase/invoices API:
 *   GET    /purchase/invoices/all?page=&limit=   -> list (paginated envelope)
 *   GET    /purchase/invoices/single/:id         -> one invoice (View modal)
 *   POST   /purchase/invoices/create             -> create (status: draft)
 *   PATCH  /purchase/invoices/edit/:id           -> update (draft only)
 *   PATCH  /purchase/invoices/post/:id           -> post (draft -> posted)
 *   DELETE /purchase/invoices/delete/:id         -> delete (not allowed once posted)
 *
 * Form dropdowns are loaded from:
 *   /user/all-user-for-company?role=vendor       -> vendors (vendor_id = user _id)
 *   /purchase/warehouses/all                     -> warehouses
 *   /product/all                                 -> products
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { api } from "../../lib/api/client";
import { ApiError } from "../../lib/api/ApiError";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Send,
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
  Loader2,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PurchaseItem {
  id: string;
  productId: string;
  product: string;
  sku: string;
  qty: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  taxName: string;
  tax: number; // computed tax amount (display)
  total: number; // computed line total incl. tax (display)
}

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendor: string;
  warehouseId: string;
  warehouse: string;
  invoiceDate: string; // yyyy-mm-dd
  dueDate: string; // yyyy-mm-dd
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: string; // "Draft" | "Posted" | "Paid" | "Partial"
  paymentTerms: string;
  notes: string;
  items: PurchaseItem[];
}

/* ---- Raw API shapes ---- */
interface ApiRef {
  _id: string;
  name?: string;
  productName?: string;
  sku?: string;
  email?: string;
}
interface ApiInvoiceItem {
  _id?: string;
  product_id: ApiRef | string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  discount_amount?: number;
  tax_percentage?: number;
  tax_amount?: number;
  total_amount?: number;
  taxes?: { tax_name: string; tax_rate: number }[];
}
interface ApiInvoice {
  _id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  vendor_id: ApiRef | string;
  warehouse_id: ApiRef | string;
  items: ApiInvoiceItem[];
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  paid_amount?: number;
  balance_amount?: number;
  status?: string;
  payment_terms?: string;
  notes?: string;
}
interface ApiVendor {
  _id: string;
  name: string;
  email?: string;
}
interface ApiWarehouse {
  _id: string;
  name: string;
}
interface ApiProduct {
  _id: string;
  productName?: string;
  name?: string;
  sku?: string;
  buyPrice?: number;
  buy_price?: number;
  unit_price?: number;
  sellPrice?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = (val || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** ISO datetime -> yyyy-mm-dd (safe for <input type="date"> and display). */
const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : "");

const titleCase = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

const errMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.message ? err.message : fallback;

const refName = (ref: ApiRef | string | undefined): string =>
  typeof ref === "object" && ref
    ? ref.name ?? ref.productName ?? ""
    : "";
const refId = (ref: ApiRef | string | undefined): string =>
  typeof ref === "object" && ref ? ref._id : (ref ?? "");

const mapApiInvoice = (inv: ApiInvoice): PurchaseInvoice => ({
  id: inv._id,
  invoiceNumber: inv.invoice_number ?? "",
  vendorId: refId(inv.vendor_id),
  vendor: refName(inv.vendor_id),
  warehouseId: refId(inv.warehouse_id),
  warehouse: refName(inv.warehouse_id),
  invoiceDate: toDateInput(inv.invoice_date),
  dueDate: toDateInput(inv.due_date),
  subtotal: inv.subtotal ?? 0,
  tax: inv.tax_amount ?? 0,
  discount: inv.discount_amount ?? 0,
  totalAmount: inv.total_amount ?? 0,
  paidAmount: inv.paid_amount ?? 0,
  balance: inv.balance_amount ?? 0,
  status: titleCase(inv.status) || "Draft",
  paymentTerms: inv.payment_terms ?? "",
  notes: inv.notes ?? "",
  items: (inv.items ?? []).map((it, idx) => ({
    id: it._id ?? `item-${idx}`,
    productId: refId(it.product_id),
    product: refName(it.product_id),
    sku: typeof it.product_id === "object" ? (it.product_id.sku ?? "") : "",
    qty: it.quantity ?? 0,
    unitPrice: it.unit_price ?? 0,
    discountPercent: it.discount_percentage ?? 0,
    taxPercent: it.tax_percentage ?? 0,
    taxName: it.taxes?.[0]?.tax_name ?? "VAT",
    tax: it.tax_amount ?? 0,
    total: it.total_amount ?? 0,
  })),
});

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

const emptyItem = (): PurchaseItem => ({
  id: `new-${Math.random().toString(36).slice(2)}`,
  productId: "",
  product: "",
  sku: "",
  qty: 1,
  unitPrice: 0,
  discountPercent: 0,
  taxPercent: 0,
  taxName: "VAT",
  tax: 0,
  total: 0,
});

// ─── Component ────────────────────────────────────────────────────────────────

export const PurchaseInvoices: React.FC = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Dropdown option sources
  const [vendors, setVendors] = useState<ApiVendor[]>([]);
  const [warehouses, setWarehouses] = useState<ApiWarehouse[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);

  // View modal
  const [showView, setShowView] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<PurchaseInvoice | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] =
    useState<PurchaseInvoice | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formInvoiceDate, setFormInvoiceDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [formDueDate, setFormDueDate] = useState("");
  const [formVendorId, setFormVendorId] = useState("");
  const [formWarehouseId, setFormWarehouseId] = useState("");
  const [formPaymentTerms, setFormPaymentTerms] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formItems, setFormItems] = useState<PurchaseItem[]>([emptyItem()]);

  // ─── Data loading ────────────────────────────────────────────────────────

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<ApiInvoice[]>("/purchase/invoices/all", {
        params: { page: 1, limit: 1000 },
      });
      setInvoices(Array.isArray(data) ? data.map(mapApiInvoice) : []);
    } catch (err) {
      const message = errMessage(err, "Couldn't load purchase invoices.");
      setLoadError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Vendors / warehouses / products for the form selects. Failures are
  // non-fatal — the relevant dropdown just stays empty.
  const loadOptions = useCallback(async () => {
    try {
      const [v, w, p] = await Promise.allSettled([
        api.get<ApiVendor[]>("/user/all-user-for-company", {
          params: { role: "vendor" },
        }),
        api.get<ApiWarehouse[]>("/purchase/warehouses/all", {
          params: { page: 1, limit: 1000 },
        }),
        api.get<ApiProduct[]>("/product/all", {
          params: { page: 1, limit: 1000 },
        }),
      ]);
      if (v.status === "fulfilled" && Array.isArray(v.value))
        setVendors(v.value);
      if (w.status === "fulfilled" && Array.isArray(w.value))
        setWarehouses(w.value);
      if (p.status === "fulfilled" && Array.isArray(p.value))
        setProducts(p.value);
    } catch {
      /* ignore — dropdowns degrade gracefully */
    }
  }, []);

  useEffect(() => {
    loadInvoices();
    loadOptions();
  }, [loadInvoices, loadOptions]);

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
      let aVal: string | number = a[sortField] as string | number;
      let bVal: string | number = b[sortField] as string | number;
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

  // ─── Status Badge ───────────────────────────────────────────────────────────

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
  const canDelete = (status: string) => status !== "Posted";
  const canPost = (status: string) => status === "Draft";

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const recalcItem = (item: PurchaseItem): PurchaseItem => {
    const base = item.qty * item.unitPrice;
    const discountAmt = base * (item.discountPercent / 100);
    const taxable = base - discountAmt;
    const taxAmt = taxable * (item.taxPercent / 100);
    return {
      ...item,
      tax: round2(taxAmt),
      total: round2(taxable + taxAmt),
    };
  };

  const updateItem = (
    id: string,
    field: keyof PurchaseItem,
    value: string | number,
  ) => {
    setFormItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value } as PurchaseItem;
        if (field === "productId") {
          const found = products.find((p) => p._id === value);
          if (found) {
            updated.product = found.productName ?? found.name ?? "";
            updated.sku = found.sku ?? "";
            const price =
              found.buyPrice ??
              found.buy_price ??
              found.unit_price ??
              found.sellPrice;
            if (typeof price === "number") updated.unitPrice = price;
          }
        }
        return recalcItem(updated);
      }),
    );
  };

  const addItem = () => setFormItems((prev) => [...prev, emptyItem()]);

  const removeItem = (id: string) =>
    setFormItems((prev) =>
      prev.length <= 1 ? prev : prev.filter((i) => i.id !== id),
    );

  const formSubtotal = formItems.reduce(
    (sum, i) => sum + i.qty * i.unitPrice,
    0,
  );
  const formDiscount = formItems.reduce(
    (sum, i) => sum + i.qty * i.unitPrice * (i.discountPercent / 100),
    0,
  );
  const formTax = formItems.reduce((sum, i) => sum + i.tax, 0);
  const formTotal = formSubtotal - formDiscount + formTax;

  const resetForm = () => {
    setFormInvoiceDate(new Date().toISOString().split("T")[0]);
    setFormDueDate("");
    setFormVendorId("");
    setFormWarehouseId("");
    setFormPaymentTerms("");
    setFormNotes("");
    setFormItems([emptyItem()]);
    setEditingInvoice(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice: PurchaseInvoice) => {
    if (!canEdit(invoice.status)) {
      showToast("Only draft invoices can be edited.", "info");
      return;
    }
    setEditingInvoice(invoice);
    setFormInvoiceDate(invoice.invoiceDate);
    setFormDueDate(invoice.dueDate);
    setFormVendorId(invoice.vendorId);
    setFormWarehouseId(invoice.warehouseId);
    setFormPaymentTerms(invoice.paymentTerms);
    setFormNotes(invoice.notes);
    setFormItems(
      invoice.items.length > 0
        ? invoice.items.map((i) => ({ ...i }))
        : [emptyItem()],
    );
    setIsEditing(true);
    setShowForm(true);
  };

  // ─── View (single) ──────────────────────────────────────────────────────────

  const handleViewInvoice = async (invoice: PurchaseInvoice) => {
    setViewInvoice(invoice);
    setShowView(true);
    setViewLoading(true);
    try {
      const data = await api.get<ApiInvoice>(
        `/purchase/invoices/single/${invoice.id}`,
      );
      if (data) setViewInvoice(mapApiInvoice(data));
    } catch (err) {
      showToast(errMessage(err, "Couldn't load invoice details."), "error");
    } finally {
      setViewLoading(false);
    }
  };

  // ─── Create / Update (optionally then Post) ─────────────────────────────────

  const buildPayload = () => ({
    invoice_date: formInvoiceDate,
    due_date: formDueDate,
    vendor_id: formVendorId,
    warehouse_id: formWarehouseId,
    payment_terms: formPaymentTerms,
    notes: formNotes,
    items: formItems.map((i) => ({
      product_id: i.productId,
      quantity: i.qty,
      unit_price: i.unitPrice,
      discount_percentage: i.discountPercent,
      tax_percentage: i.taxPercent,
      taxes: i.taxPercent > 0 ? [{ tax_name: i.taxName, tax_rate: i.taxPercent }] : [],
    })),
  });

  const handleSaveInvoice = async (postAfter: boolean) => {
    if (!formInvoiceDate) return showToast("Please select an invoice date", "info");
    if (!formDueDate) return showToast("Please select a due date", "info");
    if (!formVendorId) return showToast("Please select a vendor", "info");
    if (!formWarehouseId) return showToast("Please select a warehouse", "info");
    if (!formItems.some((i) => i.productId))
      return showToast("Please add at least one product", "info");

    const payload = buildPayload();
    setSaving(true);
    try {
      let invoiceId: string;
      if (isEditing && editingInvoice) {
        const updated = await api.patch<ApiInvoice>(
          `/purchase/invoices/edit/${editingInvoice.id}`,
          payload,
        );
        invoiceId = updated?._id ?? editingInvoice.id;
        showToast("Invoice updated!", "success");
      } else {
        const created = await api.post<ApiInvoice>(
          "/purchase/invoices/create",
          payload,
        );
        invoiceId = created._id;
        showToast("Invoice created!", "success");
      }

      if (postAfter && invoiceId) {
        await api.patch(`/purchase/invoices/post/${invoiceId}`);
        showToast("Invoice posted!", "success");
      }

      setShowForm(false);
      resetForm();
      await loadInvoices();
    } catch (err) {
      showToast(errMessage(err, "Couldn't save invoice."), "error");
    } finally {
      setSaving(false);
    }
  };

  // ─── Post (status update) ─────────────────────────────────────────────────

  const handlePostInvoice = async (invoice: PurchaseInvoice) => {
    setProcessingId(invoice.id);
    try {
      await api.patch(`/purchase/invoices/post/${invoice.id}`);
      showToast("Invoice posted!", "success");
      await loadInvoices();
    } catch (err) {
      showToast(errMessage(err, "Couldn't post invoice."), "error");
    } finally {
      setProcessingId(null);
    }
  };

  // ─── Delete ─────────────────────────────────────────────────────────────────

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/purchase/invoices/delete/${invoiceToDelete.id}`);
      showToast("Invoice deleted!", "success");
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
      await loadInvoices();
    } catch (err) {
      showToast(errMessage(err, "Couldn't delete invoice."), "error");
    } finally {
      setDeleting(false);
    }
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
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
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
                  value={formVendorId}
                  onChange={(e) => setFormVendorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                      {v.email ? ` (${v.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  value={formWarehouseId}
                  onChange={(e) => setFormWarehouseId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w._id} value={w._id}>
                      {(w.name ?? "").trim()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 */}
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
              <table className="w-full text-sm border-collapse min-w-[820px]">
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
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-20">
                      Tax %
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-24">
                      Tax Amt
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
                          value={item.productId}
                          onChange={(e) =>
                            updateItem(item.id, "productId", e.target.value)
                          }
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.productName ?? p.name}
                              {p.sku ? ` (${p.sku})` : ""}
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
                      <td className="px-2 py-3">
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
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-600">
                        {item.tax > 0 ? fmtCurrency(item.tax) : "—"}
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
                    <span className="text-gray-900">{fmtCurrency(formTax)}</span>
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
              disabled={saving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveInvoice(false)}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save as Draft
            </button>
            <button
              onClick={() => handleSaveInvoice(true)}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save &amp; Post
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
          <button onClick={() => navigate("/")} className="hover:text-gray-700">
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
                placeholder="Search by invoice number or vendor..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => loadInvoices()}
              className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Refresh
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
                  {["All", "Draft", "Posted", "Paid", "Partial"].map((st) => (
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
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading purchase invoices…</span>
          </div>
        ) : loadError ? (
          <div className="py-16 text-center text-sm text-red-600">
            {loadError}
          </div>
        ) : viewMode === "list" ? (
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
                        onClick={() => handleViewInvoice(inv)}
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
                          onClick={() => handleViewInvoice(inv)}
                          className="p-1.5 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast("Email sent", "success")}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast("Downloading PDF...", "info")}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {canPost(inv.status) && (
                          <button
                            onClick={() => handlePostInvoice(inv)}
                            disabled={processingId === inv.id}
                            className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded disabled:opacity-50"
                            title="Post Invoice"
                          >
                            {processingId === inv.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleEditInvoice(inv)}
                          disabled={!canEdit(inv.status)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                          title={
                            canEdit(inv.status)
                              ? "Edit"
                              : "Only draft invoices can be edited"
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setInvoiceToDelete(inv);
                            setShowDeleteModal(true);
                          }}
                          disabled={!canDelete(inv.status)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-400"
                          title={
                            canDelete(inv.status)
                              ? "Delete"
                              : "Posted invoices can't be deleted"
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={() => handleViewInvoice(inv)}
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
                    onClick={() => handleViewInvoice(inv)}
                    className="p-1.5 text-yellow-500 hover:text-yellow-600 rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
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
                  {canPost(inv.status) && (
                    <button
                      onClick={() => handlePostInvoice(inv)}
                      disabled={processingId === inv.id}
                      className="p-1.5 text-green-500 hover:text-green-700 rounded disabled:opacity-50"
                      title="Post Invoice"
                    >
                      {processingId === inv.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleEditInvoice(inv)}
                    disabled={!canEdit(inv.status)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                    title={
                      canEdit(inv.status)
                        ? "Edit"
                        : "Only draft invoices can be edited"
                    }
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setInvoiceToDelete(inv);
                      setShowDeleteModal(true);
                    }}
                    disabled={!canDelete(inv.status)}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-red-400"
                    title={
                      canDelete(inv.status)
                        ? "Delete"
                        : "Posted invoices can't be deleted"
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

      {/* View Invoice Modal */}
      {showView && viewInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {viewInvoice.invoiceNumber || "Purchase Invoice"}
                </h2>
                <span
                  className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${getStatusColor(viewInvoice.status)}`}
                >
                  {viewInvoice.status}
                </span>
              </div>
              <button
                onClick={() => setShowView(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {viewLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading details…</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500">Vendor</p>
                      <p className="text-sm text-gray-900">
                        {viewInvoice.vendor || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Warehouse</p>
                      <p className="text-sm text-gray-900">
                        {viewInvoice.warehouse || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Invoice Date</p>
                      <p className="text-sm text-gray-900">
                        {viewInvoice.invoiceDate || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="text-sm text-gray-900">
                        {viewInvoice.dueDate || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Payment Terms</p>
                      <p className="text-sm text-gray-900">
                        {viewInvoice.paymentTerms || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Notes</p>
                      <p className="text-sm text-gray-900">
                        {viewInvoice.notes || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
                    <table className="w-full text-sm min-w-[640px]">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                            Product
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Qty
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Unit Price
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Disc %
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Tax
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {viewInvoice.items.map((it) => (
                          <tr key={it.id}>
                            <td className="px-3 py-2 text-gray-900">
                              {it.product}
                              {it.sku ? (
                                <span className="text-gray-400">
                                  {" "}
                                  ({it.sku})
                                </span>
                              ) : null}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700">
                              {it.qty}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700">
                              {fmtCurrency(it.unitPrice)}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700">
                              {it.discountPercent}%
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700">
                              {fmtCurrency(it.tax)}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-900">
                              {fmtCurrency(it.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-full sm:w-72 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">
                          {fmtCurrency(viewInvoice.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-red-500">
                          -{fmtCurrency(viewInvoice.discount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">
                          {fmtCurrency(viewInvoice.tax)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="font-semibold text-gray-900">
                          {fmtCurrency(viewInvoice.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid</span>
                        <span className="text-gray-900">
                          {fmtCurrency(viewInvoice.paidAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance</span>
                        <span className="text-gray-900">
                          {fmtCurrency(viewInvoice.balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              {!viewLoading && canPost(viewInvoice.status) && (
                <button
                  onClick={() => {
                    setShowView(false);
                    handlePostInvoice(viewInvoice);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post Invoice
                </button>
              )}
              {!viewLoading && canEdit(viewInvoice.status) && (
                <button
                  onClick={() => {
                    setShowView(false);
                    handleEditInvoice(viewInvoice);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
              <button
                onClick={() => setShowView(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && invoiceToDelete && (
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
                Delete Invoice
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {invoiceToDelete.invoiceNumber}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteInvoice}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {deleting ? "Deleting…" : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
