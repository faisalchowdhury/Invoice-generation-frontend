/**
 * File: src/pages/purchase/PurchaseReturns.tsx
 * Purchase Returns page — list, create form, view modal, approve / complete / delete.
 *
 * Backed by the purchase/returns API:
 *   GET    /purchase/returns/all?page=&limit=   -> list (paginated envelope)
 *   GET    /purchase/returns/single/:id         -> one return (View modal)
 *   POST   /purchase/returns/create             -> create (status: draft)
 *   PATCH  /purchase/returns/approve/:id         -> approve (auto-creates a debit note)
 *   PATCH  /purchase/returns/complete/:id        -> complete
 *   DELETE /purchase/returns/delete/:id          -> delete (draft only)
 *
 * A return is raised against a posted purchase invoice. Selecting the original
 * invoice (GET /purchase/invoices/single/:id) supplies the vendor, warehouse and
 * the returnable line items (each carries its original_invoice_item_id).
 * Warehouses come from /purchase/warehouses/all; invoices from
 * /purchase/invoices/all.
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { api } from "../../lib/api/client";
import { ApiError } from "../../lib/api/ApiError";
import {
  Search,
  Plus,
  Trash2,
  Download,
  Eye,
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
  CheckCheck,
  Loader2,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReturnItem {
  id: string;
  productId: string;
  product: string;
  sku: string;
  invoiceItemId: string; // original_invoice_item_id
  originalQty: number;
  qty: number; // return_quantity
  unitPrice: number;
  total: number;
}

interface PurchaseReturn {
  id: string;
  returnNumber: string;
  vendorId: string;
  vendor: string;
  warehouseId: string;
  warehouse: string;
  originalInvoiceId: string;
  originalInvoice: string;
  returnDate: string; // yyyy-mm-dd
  reason: string;
  notes: string;
  status: string; // "Draft" | "Approved" | "Completed" | "Rejected"
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  debitNoteId: string;
  items: ReturnItem[];
}

/* ---- Raw API shapes ---- */
interface ApiRef {
  _id: string;
  name?: string;
  productName?: string;
  sku?: string;
  invoice_number?: string;
}
interface ApiReturnItem {
  _id?: string;
  product_id: ApiRef | string;
  original_invoice_item_id?: string;
  original_quantity?: number;
  return_quantity?: number;
  unit_price?: number;
  total_amount?: number;
}
interface ApiReturn {
  _id: string;
  return_number: string;
  return_date: string;
  vendor_id: ApiRef | string;
  warehouse_id: ApiRef | string;
  original_invoice_id: ApiRef | string;
  reason?: string;
  notes?: string;
  status?: string;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  debit_note_id?: string;
  items: ApiReturnItem[];
}
interface ApiInvoiceItem {
  _id?: string;
  product_id: ApiRef | string;
  quantity?: number;
  unit_price?: number;
}
interface ApiInvoice {
  _id: string;
  invoice_number: string;
  status?: string;
  vendor_id: ApiRef | string;
  warehouse_id: ApiRef | string;
  items: ApiInvoiceItem[];
}
interface ApiWarehouse {
  _id: string;
  name: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = (val || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : "");
const titleCase = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
const errMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.message ? err.message : fallback;

const refName = (ref: ApiRef | string | undefined): string =>
  typeof ref === "object" && ref
    ? ref.name ?? ref.productName ?? ref.invoice_number ?? ""
    : "";
const refId = (ref: ApiRef | string | undefined): string =>
  typeof ref === "object" && ref ? ref._id : (ref ?? "");

const reasonLabel = (r: string) =>
  r
    ? r
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "—";

const mapApiReturn = (r: ApiReturn): PurchaseReturn => ({
  id: r._id,
  returnNumber: r.return_number ?? "",
  vendorId: refId(r.vendor_id),
  vendor: refName(r.vendor_id),
  warehouseId: refId(r.warehouse_id),
  warehouse: refName(r.warehouse_id),
  originalInvoiceId: refId(r.original_invoice_id),
  originalInvoice: refName(r.original_invoice_id),
  returnDate: toDateInput(r.return_date),
  reason: r.reason ?? "",
  notes: r.notes ?? "",
  status: titleCase(r.status) || "Draft",
  subtotal: r.subtotal ?? 0,
  tax: r.tax_amount ?? 0,
  discount: r.discount_amount ?? 0,
  totalAmount: r.total_amount ?? 0,
  debitNoteId: r.debit_note_id ?? "",
  items: (r.items ?? []).map((it, idx) => ({
    id: it._id ?? `item-${idx}`,
    productId: refId(it.product_id),
    product: refName(it.product_id),
    sku: typeof it.product_id === "object" ? (it.product_id.sku ?? "") : "",
    invoiceItemId: it.original_invoice_item_id ?? "",
    originalQty: it.original_quantity ?? 0,
    qty: it.return_quantity ?? 0,
    unitPrice: it.unit_price ?? 0,
    total: it.total_amount ?? 0,
  })),
});

const returnReasons = [
  { value: "defective", label: "Defective" },
  { value: "damaged", label: "Damaged" },
  { value: "wrong_item", label: "Wrong Item" },
  { value: "not_as_described", label: "Not as Described" },
  { value: "expired", label: "Expired" },
  { value: "other", label: "Other" },
];

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

  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("returnNumber");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Dropdown sources
  const [invoiceOptions, setInvoiceOptions] = useState<ApiInvoice[]>([]);
  const [warehouses, setWarehouses] = useState<ApiWarehouse[]>([]);

  // View modal
  const [showView, setShowView] = useState(false);
  const [viewReturn, setViewReturn] = useState<PurchaseReturn | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [returnToDelete, setReturnToDelete] = useState<PurchaseReturn | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formReturnDate, setFormReturnDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [formOriginalInvoiceId, setFormOriginalInvoiceId] = useState("");
  const [formVendorId, setFormVendorId] = useState("");
  const [formVendorName, setFormVendorName] = useState("");
  const [formWarehouseId, setFormWarehouseId] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formItems, setFormItems] = useState<ReturnItem[]>([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  // ─── Data loading ────────────────────────────────────────────────────────

  const loadReturns = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<ApiReturn[]>("/purchase/returns/all", {
        params: { page: 1, limit: 1000 },
      });
      setReturns(Array.isArray(data) ? data.map(mapApiReturn) : []);
    } catch (err) {
      const message = errMessage(err, "Couldn't load purchase returns.");
      setLoadError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOptions = useCallback(async () => {
    try {
      const [inv, wh] = await Promise.allSettled([
        api.get<ApiInvoice[]>("/purchase/invoices/all", {
          params: { page: 1, limit: 1000 },
        }),
        api.get<ApiWarehouse[]>("/purchase/warehouses/all", {
          params: { page: 1, limit: 1000 },
        }),
      ]);
      if (inv.status === "fulfilled" && Array.isArray(inv.value)) {
        // Returns are raised against posted invoices.
        setInvoiceOptions(
          inv.value.filter(
            (i) => (i.status ?? "").toLowerCase() === "posted",
          ),
        );
      }
      if (wh.status === "fulfilled" && Array.isArray(wh.value))
        setWarehouses(wh.value);
    } catch {
      /* dropdowns degrade gracefully */
    }
  }, []);

  useEffect(() => {
    loadReturns();
    loadOptions();
  }, [loadReturns, loadOptions]);

  // When an original invoice is picked, pull its vendor / warehouse / items.
  const handleInvoiceChange = async (invoiceId: string) => {
    setFormOriginalInvoiceId(invoiceId);
    setFormVendorId("");
    setFormVendorName("");
    setFormItems([]);
    if (!invoiceId) return;
    setInvoiceLoading(true);
    try {
      const inv = await api.get<ApiInvoice>(
        `/purchase/invoices/single/${invoiceId}`,
      );
      setFormVendorId(refId(inv.vendor_id));
      setFormVendorName(refName(inv.vendor_id));
      setFormWarehouseId(refId(inv.warehouse_id));
      setFormItems(
        (inv.items ?? []).map((it, idx) => ({
          id: it._id ?? `item-${idx}`,
          productId: refId(it.product_id),
          product: refName(it.product_id),
          sku:
            typeof it.product_id === "object" ? (it.product_id.sku ?? "") : "",
          invoiceItemId: it._id ?? "",
          originalQty: it.quantity ?? 0,
          qty: 0,
          unitPrice: it.unit_price ?? 0,
          total: 0,
        })),
      );
    } catch (err) {
      showToast(errMessage(err, "Couldn't load invoice items."), "error");
    } finally {
      setInvoiceLoading(false);
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
      let aVal: string | number;
      let bVal: string | number;
      if (sortField === "items") {
        aVal = a.items.length;
        bVal = b.items.length;
      } else {
        aVal = a[sortField] as string | number;
        bVal = b[sortField] as string | number;
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

  // ─── Status Badge ───────────────────────────────────────────────────────────

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

  const canApprove = (status: string) => status === "Draft";
  const canComplete = (status: string) => status === "Approved";
  const canDelete = (status: string) => status === "Draft";

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const updateItemQty = (id: string, qty: number) => {
    setFormItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty, total: round2(qty * item.unitPrice) }
          : item,
      ),
    );
  };

  const formTotal = formItems.reduce((sum, i) => sum + i.total, 0);

  const resetForm = () => {
    setFormReturnDate(new Date().toISOString().split("T")[0]);
    setFormOriginalInvoiceId("");
    setFormVendorId("");
    setFormVendorName("");
    setFormWarehouseId("");
    setFormReason("");
    setFormNotes("");
    setFormItems([]);
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSaveReturn = async () => {
    if (!formReturnDate) return showToast("Please select a return date", "info");
    if (!formOriginalInvoiceId)
      return showToast("Please select an original invoice", "info");
    if (!formWarehouseId) return showToast("Please select a warehouse", "info");
    if (!formReason) return showToast("Please select a return reason", "info");
    const itemsToReturn = formItems.filter((i) => i.qty > 0);
    if (itemsToReturn.length === 0)
      return showToast("Set a return quantity on at least one item", "info");

    const payload = {
      return_date: formReturnDate,
      vendor_id: formVendorId,
      warehouse_id: formWarehouseId,
      original_invoice_id: formOriginalInvoiceId,
      reason: formReason,
      notes: formNotes,
      items: itemsToReturn.map((i) => ({
        product_id: i.productId,
        original_invoice_item_id: i.invoiceItemId,
        return_quantity: i.qty,
        unit_price: i.unitPrice,
      })),
    };

    setSaving(true);
    try {
      await api.post("/purchase/returns/create", payload);
      showToast("Purchase return created!", "success");
      setShowForm(false);
      resetForm();
      await loadReturns();
    } catch (err) {
      showToast(errMessage(err, "Couldn't create purchase return."), "error");
    } finally {
      setSaving(false);
    }
  };

  // ─── View (single) ──────────────────────────────────────────────────────────

  const handleViewReturn = async (ret: PurchaseReturn) => {
    setViewReturn(ret);
    setShowView(true);
    setViewLoading(true);
    try {
      const data = await api.get<ApiReturn>(
        `/purchase/returns/single/${ret.id}`,
      );
      if (data) setViewReturn(mapApiReturn(data));
    } catch (err) {
      showToast(errMessage(err, "Couldn't load return details."), "error");
    } finally {
      setViewLoading(false);
    }
  };

  // ─── Approve / Complete / Delete ─────────────────────────────────────────

  const handleApprove = async (ret: PurchaseReturn) => {
    setProcessingId(ret.id);
    try {
      await api.patch(`/purchase/returns/approve/${ret.id}`);
      showToast("Return approved. Debit note created automatically.", "success");
      await loadReturns();
    } catch (err) {
      showToast(errMessage(err, "Couldn't approve return."), "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (ret: PurchaseReturn) => {
    setProcessingId(ret.id);
    try {
      await api.patch(`/purchase/returns/complete/${ret.id}`);
      showToast("Purchase return completed!", "success");
      await loadReturns();
    } catch (err) {
      showToast(errMessage(err, "Couldn't complete return."), "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteReturn = async () => {
    if (!returnToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/purchase/returns/delete/${returnToDelete.id}`);
      showToast("Purchase return deleted!", "success");
      setShowDeleteModal(false);
      setReturnToDelete(null);
      await loadReturns();
    } catch (err) {
      showToast(errMessage(err, "Couldn't delete return."), "error");
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
  // CREATE FORM VIEW
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
              Purchase Returns
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">
              Create Purchase Return
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Create Purchase Return
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
          {/* Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <RefreshCw className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-semibold text-gray-900">
                Purchase Return Details
              </h3>
            </div>

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
                  value={formOriginalInvoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="">Select Invoice</option>
                  {invoiceOptions.map((inv) => (
                    <option key={inv._id} value={inv._id}>
                      {inv.invoice_number}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor
                </label>
                <input
                  type="text"
                  value={formVendorName}
                  readOnly
                  placeholder="Auto-filled from invoice"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-700"
                />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="">Select Reason</option>
                  {returnReasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
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

          {/* Items Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Check className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-semibold text-gray-900">
                Items to Return
              </h3>
            </div>

            {invoiceLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading invoice items…</span>
              </div>
            ) : formItems.length === 0 ? (
              <div className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-200 rounded-lg">
                Select an original invoice to load its items.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full text-sm border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                          Product
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-28">
                          Invoiced Qty
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-28">
                          Return Qty
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-28">
                          Unit Price
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-28">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="px-2 py-3 text-gray-900">
                            {item.product}
                            {item.sku ? (
                              <span className="text-gray-400"> ({item.sku})</span>
                            ) : null}
                          </td>
                          <td className="px-2 py-3 text-gray-600">
                            {item.originalQty}
                          </td>
                          <td className="px-2 py-3">
                            <input
                              type="number"
                              min={0}
                              value={item.qty}
                              onChange={(e) =>
                                updateItemQty(
                                  item.id,
                                  Math.max(0, parseInt(e.target.value) || 0),
                                )
                              }
                              className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          </td>
                          <td className="px-2 py-3 text-gray-700">
                            {fmtCurrency(item.unitPrice)}
                          </td>
                          <td className="px-2 py-3 text-gray-900">
                            {fmtCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-4">
                  <div className="text-sm font-semibold text-gray-900">
                    Total: {fmtCurrency(formTotal)}
                  </div>
                </div>
              </>
            )}
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
              onClick={handleSaveReturn}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Creating…" : "Create"}
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
                placeholder="Search by return number or vendor..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => loadReturns()}
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
                  {["All", "Draft", "Approved", "Completed", "Rejected"].map(
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
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading purchase returns…</span>
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
                        onClick={() => handleViewReturn(ret)}
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
                          onClick={() => handleViewReturn(ret)}
                          className="p-1.5 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast("Downloading PDF...", "info")}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {canApprove(ret.status) && (
                          <button
                            onClick={() => handleApprove(ret)}
                            disabled={processingId === ret.id}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded disabled:opacity-50"
                            title="Approve (creates debit note)"
                          >
                            {processingId === ret.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        {canComplete(ret.status) && (
                          <button
                            onClick={() => handleComplete(ret)}
                            disabled={processingId === ret.id}
                            className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded disabled:opacity-50"
                            title="Mark Completed"
                          >
                            {processingId === ret.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCheck className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setReturnToDelete(ret);
                            setShowDeleteModal(true);
                          }}
                          disabled={!canDelete(ret.status)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-400"
                          title={
                            canDelete(ret.status)
                              ? "Delete"
                              : "Only draft returns can be deleted"
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={() => handleViewReturn(ret)}
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
                <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleViewReturn(ret)}
                    className="p-1.5 text-yellow-500 hover:text-yellow-600 rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast("Downloading PDF...", "info")}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {canApprove(ret.status) && (
                    <button
                      onClick={() => handleApprove(ret)}
                      disabled={processingId === ret.id}
                      className="p-1.5 text-blue-500 hover:text-blue-700 rounded disabled:opacity-50"
                      title="Approve (creates debit note)"
                    >
                      {processingId === ret.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  {canComplete(ret.status) && (
                    <button
                      onClick={() => handleComplete(ret)}
                      disabled={processingId === ret.id}
                      className="p-1.5 text-green-500 hover:text-green-700 rounded disabled:opacity-50"
                      title="Mark Completed"
                    >
                      {processingId === ret.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCheck className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setReturnToDelete(ret);
                      setShowDeleteModal(true);
                    }}
                    disabled={!canDelete(ret.status)}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-red-400"
                    title={
                      canDelete(ret.status)
                        ? "Delete"
                        : "Only draft returns can be deleted"
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

      {/* View Return Modal */}
      {showView && viewReturn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {viewReturn.returnNumber || "Purchase Return"}
                </h2>
                <span
                  className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${getStatusColor(viewReturn.status)}`}
                >
                  {viewReturn.status}
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
                        {viewReturn.vendor || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Warehouse</p>
                      <p className="text-sm text-gray-900">
                        {viewReturn.warehouse || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Original Invoice</p>
                      <p className="text-sm text-gray-900">
                        {viewReturn.originalInvoice || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Return Date</p>
                      <p className="text-sm text-gray-900">
                        {viewReturn.returnDate || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reason</p>
                      <p className="text-sm text-gray-900">
                        {reasonLabel(viewReturn.reason)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Notes</p>
                      <p className="text-sm text-gray-900">
                        {viewReturn.notes || "—"}
                      </p>
                    </div>
                    {viewReturn.debitNoteId && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-500">Debit Note</p>
                        <p className="text-sm text-gray-900">
                          {viewReturn.debitNoteId}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
                    <table className="w-full text-sm min-w-[560px]">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                            Product
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Return Qty
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Unit Price
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {viewReturn.items.map((it) => (
                          <tr key={it.id}>
                            <td className="px-3 py-2 text-gray-900">
                              {it.product}
                              {it.sku ? (
                                <span className="text-gray-400"> ({it.sku})</span>
                              ) : null}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700">
                              {it.qty}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700">
                              {fmtCurrency(it.unitPrice)}
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
                          {fmtCurrency(viewReturn.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-red-500">
                          -{fmtCurrency(viewReturn.discount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">
                          {fmtCurrency(viewReturn.tax)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="font-semibold text-gray-900">
                          {fmtCurrency(viewReturn.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              {!viewLoading && canApprove(viewReturn.status) && (
                <button
                  onClick={() => {
                    setShowView(false);
                    handleApprove(viewReturn);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              )}
              {!viewLoading && canComplete(viewReturn.status) && (
                <button
                  onClick={() => {
                    setShowView(false);
                    handleComplete(viewReturn);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm inline-flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Complete
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
      {showDeleteModal && returnToDelete && (
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
                Delete Return
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {returnToDelete.returnNumber}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteReturn}
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
