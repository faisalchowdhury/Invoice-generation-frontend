/**
 * File: src/pages/sales/SalesInvoiceReturns.tsx
 * Sales (Invoice) Returns — list, create/edit form, view modal, approve & delete.
 *
 * Backed by the invoice-return API:
 *   GET    /invoice-return/all?page=&limit=  -> list (paginated envelope)
 *   GET    /invoice-return/single/:id        -> one return (View modal)
 *   POST   /invoice-return/create            -> create (status: Returned)
 *   PATCH  /invoice-return/edit/:id          -> update
 *   PATCH  /invoice-return/approve/:id       -> approve (auto-creates a draft credit note)
 *   DELETE /invoice-return/delete/:id        -> delete
 *
 * A return references a whole sales invoice (no line items). invoice_id and
 * warehouse_id arrive populated; the invoice's customer_id is a raw id resolved
 * from /customer/all. Invoices come from /invoice/all, warehouses from
 * /purchase/warehouses/all.
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
  Eye,
  X,
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
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SalesReturn {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  warehouseId: string;
  warehouse: string;
  warehouseCity: string;
  returnDate: string; // yyyy-mm-dd
  returnReason: string;
  notes: string;
  status: string; // "Returned" | "Approved" | ...
  creditNoteId: string;
  invoiceTotal: number;
}

/* ---- Raw API shapes ---- */
interface ApiInvoiceRef {
  _id: string;
  invoice_number?: string;
  customer_id?: string | { _id: string } | null;
  total?: number;
}
interface ApiWarehouseRef {
  _id: string;
  name?: string;
  city?: string;
}
interface ApiReturn {
  _id: string;
  invoice_id?: ApiInvoiceRef | string | null;
  warehouse_id?: ApiWarehouseRef | string | null;
  return_date: string;
  return_reason?: string;
  notes?: string;
  status?: string;
  credit_note_id?: string;
}
interface ApiInvoiceOption {
  _id: string;
  invoice_number: string;
  warehouse_id?: string | null;
  customer_id?: string | { _id: string; name?: string } | null;
  total?: number;
}
interface ApiCustomer {
  _id: string;
  name?: string;
  customerName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}
interface ApiWarehouse {
  _id: string;
  name?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = (val || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : "");
const errMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.message ? err.message : fallback;

const refId = (ref: { _id: string } | string | null | undefined): string =>
  typeof ref === "object" && ref ? ref._id : (ref ?? "");
const customerLabel = (c: ApiCustomer): string =>
  c.name ??
  c.customerName ??
  [c.firstName, c.lastName].filter(Boolean).join(" ") ??
  c.email ??
  c._id;

const mapApiReturn = (r: ApiReturn): SalesReturn => {
  const inv = r.invoice_id;
  const wh = r.warehouse_id;
  return {
    id: r._id,
    invoiceId: refId(inv),
    invoiceNumber:
      typeof inv === "object" && inv ? (inv.invoice_number ?? "") : "",
    customerId:
      typeof inv === "object" && inv ? refId(inv.customer_id ?? "") : "",
    warehouseId: refId(wh),
    warehouse: typeof wh === "object" && wh ? (wh.name ?? "").trim() : "",
    warehouseCity: typeof wh === "object" && wh ? (wh.city ?? "") : "",
    returnDate: toDateInput(r.return_date),
    returnReason: r.return_reason ?? "",
    notes: r.notes ?? "",
    status: r.status ?? "Returned",
    creditNoteId: r.credit_note_id ?? "",
    invoiceTotal: typeof inv === "object" && inv ? (inv.total ?? 0) : 0,
  };
};

const returnReasons = [
  "Defective",
  "Wrong Item",
  "Size Mismatch",
  "Damaged",
  "Not as Described",
  "Other",
];

type SortField =
  | "invoiceNumber"
  | "customer"
  | "warehouse"
  | "returnDate"
  | "returnReason"
  | "status";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────

export const SalesInvoiceReturns: React.FC = () => {
  const navigate = useNavigate();

  const [returns, setReturns] = useState<SalesReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("returnDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Option sources
  const [invoiceOptions, setInvoiceOptions] = useState<ApiInvoiceOption[]>([]);
  const [warehouses, setWarehouses] = useState<ApiWarehouse[]>([]);
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);

  // View modal
  const [showView, setShowView] = useState(false);
  const [viewReturn, setViewReturn] = useState<SalesReturn | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Delete modal
  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState<SalesReturn | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formReturnDate, setFormReturnDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [formInvoiceId, setFormInvoiceId] = useState("");
  const [formWarehouseId, setFormWarehouseId] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // ─── Lookup maps ───────────────────────────────────────────────────────────
  const customerNameById = useMemo(() => {
    const m: Record<string, string> = {};
    customers.forEach((c) => (m[c._id] = customerLabel(c)));
    return m;
  }, [customers]);

  const invoiceCustomerById = useMemo(() => {
    const m: Record<string, string> = {};
    invoiceOptions.forEach((i) => (m[i._id] = refId(i.customer_id ?? "")));
    return m;
  }, [invoiceOptions]);

  const displayCustomer = (ret: SalesReturn) => {
    const custId = ret.customerId || invoiceCustomerById[ret.invoiceId] || "";
    return customerNameById[custId] || "—";
  };

  // ─── Data loading ──────────────────────────────────────────────────────────
  const loadReturns = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<ApiReturn[]>("/invoice-return/all", {
        params: { page: 1, limit: 1000 },
      });
      setReturns(Array.isArray(data) ? data.map(mapApiReturn) : []);
    } catch (err) {
      const message = errMessage(err, "Couldn't load invoice returns.");
      setLoadError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOptions = useCallback(async () => {
    try {
      const [inv, wh, cust] = await Promise.allSettled([
        api.get<ApiInvoiceOption[]>("/invoice/all", {
          params: { page: 1, limit: 1000 },
        }),
        api.get<ApiWarehouse[]>("/purchase/warehouses/all", {
          params: { page: 1, limit: 1000 },
        }),
        api.get<ApiCustomer[]>("/customer/all", {
          params: { page: 1, limit: 1000 },
        }),
      ]);
      if (inv.status === "fulfilled" && Array.isArray(inv.value))
        setInvoiceOptions(inv.value);
      if (wh.status === "fulfilled" && Array.isArray(wh.value))
        setWarehouses(wh.value);
      if (cust.status === "fulfilled" && Array.isArray(cust.value))
        setCustomers(cust.value);
    } catch {
      /* dropdowns degrade gracefully */
    }
  }, []);

  useEffect(() => {
    loadReturns();
    loadOptions();
  }, [loadReturns, loadOptions]);

  // Pick an invoice -> default its warehouse.
  const handleInvoiceChange = (invoiceId: string) => {
    setFormInvoiceId(invoiceId);
    const inv = invoiceOptions.find((i) => i._id === invoiceId);
    if (inv?.warehouse_id) setFormWarehouseId(inv.warehouse_id);
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
          ret.invoiceNumber.toLowerCase().includes(q) ||
          ret.returnReason.toLowerCase().includes(q) ||
          displayCustomer(ret).toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((ret) => ret.status === statusFilter);
    }
    result.sort((a, b) => {
      let aVal: string | number =
        sortField === "customer"
          ? displayCustomer(a)
          : (a[sortField] as string | number);
      let bVal: string | number =
        sortField === "customer"
          ? displayCustomer(b)
          : (b[sortField] as string | number);
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    returns,
    searchQuery,
    statusFilter,
    sortField,
    sortDir,
    customerNameById,
    invoiceCustomerById,
  ]);

  const totalPages = Math.ceil(filteredReturns.length / perPage);
  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Status Badge ───────────────────────────────────────────────────────────

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Returned":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      case "Approved":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const canApprove = (status: string) => status === "Returned";
  const canEdit = (status: string) => status === "Returned";

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormReturnDate(new Date().toISOString().split("T")[0]);
    setFormInvoiceId("");
    setFormWarehouseId("");
    setFormReason("");
    setFormNotes("");
    setEditingId(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditReturn = (ret: SalesReturn) => {
    if (!canEdit(ret.status)) {
      showToast("Only returns awaiting approval can be edited.", "info");
      return;
    }
    setEditingId(ret.id);
    setFormReturnDate(ret.returnDate);
    setFormInvoiceId(ret.invoiceId);
    setFormWarehouseId(ret.warehouseId);
    setFormReason(ret.returnReason);
    setFormNotes(ret.notes);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSaveReturn = async () => {
    if (!formReturnDate) return showToast("Please select a return date", "info");
    if (!formInvoiceId)
      return showToast("Please select an original invoice", "info");
    if (!formWarehouseId) return showToast("Please select a warehouse", "info");
    if (!formReason) return showToast("Please select a return reason", "info");

    const payload = {
      invoice_id: formInvoiceId,
      warehouse_id: formWarehouseId,
      return_date: formReturnDate,
      return_reason: formReason,
      notes: formNotes,
    };

    setSaving(true);
    try {
      if (isEditing && editingId) {
        await api.patch(`/invoice-return/edit/${editingId}`, payload);
        showToast("Invoice return updated!", "success");
      } else {
        await api.post("/invoice-return/create", payload);
        showToast("Invoice return created!", "success");
      }
      setShowForm(false);
      resetForm();
      await loadReturns();
    } catch (err) {
      showToast(errMessage(err, "Couldn't save invoice return."), "error");
    } finally {
      setSaving(false);
    }
  };

  // ─── View (single) ─────────────────────────────────────────────────────────
  const openView = async (ret: SalesReturn) => {
    setViewReturn(ret);
    setShowView(true);
    setViewLoading(true);
    try {
      const data = await api.get<ApiReturn>(`/invoice-return/single/${ret.id}`);
      if (data) setViewReturn(mapApiReturn(data));
    } catch (err) {
      showToast(errMessage(err, "Couldn't load return details."), "error");
    } finally {
      setViewLoading(false);
    }
  };

  // ─── Approve ───────────────────────────────────────────────────────────────
  const handleApprove = async (ret: SalesReturn) => {
    setProcessingId(ret.id);
    try {
      await api.patch(`/invoice-return/approve/${ret.id}`);
      showToast("Return approved; draft credit note created.", "success");
      await loadReturns();
    } catch (err) {
      showToast(errMessage(err, "Couldn't approve return."), "error");
    } finally {
      setProcessingId(null);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/invoice-return/delete/${toDelete.id}`);
      showToast("Invoice return deleted!", "success");
      setShowDelete(false);
      setToDelete(null);
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
              Sales Returns
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">
              {isEditing ? "Edit Sales Return" : "Create Sales Return"}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Sales Return" : "Create Sales Return"}
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
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <RefreshCw className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-semibold text-gray-900">
                Sales Return Details
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
                  value={formInvoiceId}
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
                  {returnReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
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
              {saving ? "Saving…" : isEditing ? "Update" : "Create"}
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
          <span className="text-gray-900 font-medium">Sales Returns</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Sales Returns
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
                placeholder="Search by invoice, customer or reason..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-72 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                  {["All", "Returned", "Approved", "Completed", "Rejected"].map(
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
            <span className="text-sm">Loading invoice returns…</span>
          </div>
        ) : loadError ? (
          <div className="py-16 text-center text-sm text-red-600">
            {loadError}
          </div>
        ) : viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <SortHeader field="invoiceNumber" label="Invoice Number" />
                  <SortHeader field="customer" label="Customer" />
                  <SortHeader field="warehouse" label="Warehouse" />
                  <SortHeader field="returnDate" label="Return Date" />
                  <SortHeader field="returnReason" label="Reason" />
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
                        onClick={() => openView(ret)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {ret.invoiceNumber || "—"}
                      </button>
                    </td>
                    <td className="px-3 py-4 text-gray-900">
                      {displayCustomer(ret)}
                    </td>
                    <td className="px-3 py-4 text-gray-600">
                      {ret.warehouse || "—"}
                    </td>
                    <td className="px-3 py-4 text-gray-600">
                      {ret.returnDate}
                    </td>
                    <td className="px-3 py-4 text-gray-600">
                      {ret.returnReason || "—"}
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
                          onClick={() => openView(ret)}
                          className="p-1.5 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canApprove(ret.status) && (
                          <button
                            onClick={() => handleApprove(ret)}
                            disabled={processingId === ret.id}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded disabled:opacity-50"
                            title="Approve (creates credit note)"
                          >
                            {processingId === ret.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleEditReturn(ret)}
                          disabled={!canEdit(ret.status)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                          title={
                            canEdit(ret.status)
                              ? "Edit"
                              : "Approved returns can't be edited"
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setToDelete(ret);
                            setShowDelete(true);
                          }}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
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
                      colSpan={7}
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
                    onClick={() => openView(ret)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {ret.invoiceNumber || "Return"}
                  </button>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(ret.status)}`}
                  >
                    {ret.status}
                  </span>
                </div>
                <div className="text-sm text-gray-900 mb-1">
                  {displayCustomer(ret)}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  {ret.returnDate} • {ret.warehouse || "—"}
                </div>
                <div className="flex items-center justify-between mb-3 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">Reason</div>
                    <div className="text-sm font-medium text-gray-900">
                      {ret.returnReason || "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Invoice Total</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {fmtCurrency(ret.invoiceTotal)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => openView(ret)}
                    className="p-1.5 text-yellow-500 hover:text-yellow-600 rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {canApprove(ret.status) && (
                    <button
                      onClick={() => handleApprove(ret)}
                      disabled={processingId === ret.id}
                      className="p-1.5 text-blue-500 hover:text-blue-700 rounded disabled:opacity-50"
                      title="Approve (creates credit note)"
                    >
                      {processingId === ret.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleEditReturn(ret)}
                    disabled={!canEdit(ret.status)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                    title={
                      canEdit(ret.status)
                        ? "Edit"
                        : "Approved returns can't be edited"
                    }
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setToDelete(ret);
                      setShowDelete(true);
                    }}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded"
                    title="Delete"
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Return · {viewReturn.invoiceNumber || "Invoice"}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Invoice Number</p>
                    <p className="text-sm text-gray-900">
                      {viewReturn.invoiceNumber || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="text-sm text-gray-900">
                      {displayCustomer(viewReturn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Warehouse</p>
                    <p className="text-sm text-gray-900">
                      {viewReturn.warehouse || "—"}
                      {viewReturn.warehouseCity
                        ? ` (${viewReturn.warehouseCity})`
                        : ""}
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
                      {viewReturn.returnReason || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Invoice Total</p>
                    <p className="text-sm text-gray-900">
                      {fmtCurrency(viewReturn.invoiceTotal)}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500">Notes</p>
                    <p className="text-sm text-gray-900">
                      {viewReturn.notes || "—"}
                    </p>
                  </div>
                  {viewReturn.creditNoteId && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500">Credit Note</p>
                      <p className="text-sm text-gray-900">
                        {viewReturn.creditNoteId}
                      </p>
                    </div>
                  )}
                </div>
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
              {!viewLoading && canEdit(viewReturn.status) && (
                <button
                  onClick={() => {
                    setShowView(false);
                    handleEditReturn(viewReturn);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm inline-flex items-center gap-2"
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
      {showDelete && toDelete && (
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
                Are you sure you want to delete this return for{" "}
                <span className="font-semibold">
                  {toDelete.invoiceNumber || "this invoice"}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {deleting ? "Deleting…" : "Delete"}
                </button>
                <button
                  onClick={() => setShowDelete(false)}
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
