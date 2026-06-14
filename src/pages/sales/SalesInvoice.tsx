/**
 * File: src/pages/sales/SalesInvoice.tsx
 * Sales Invoices page — list, create/edit form, view modal, delete.
 *
 * Backed by the invoice API:
 *   GET    /invoice/all?page=&limit=  -> list (paginated envelope)
 *   GET    /invoice/single/:id        -> one invoice (View modal)
 *   POST   /invoice/create            -> create
 *   PATCH  /invoice/edit/:id          -> update (partial allowed)
 *   DELETE /invoice/delete/:id        -> delete
 *
 * customer_id arrives populated in the list (string id in single), warehouse_id
 * and product[].product_id are raw ids — names are resolved from:
 *   /customer/all              -> customers
 *   /purchase/warehouses/all   -> warehouses
 *   /product/all               -> products
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
  Settings,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InvoiceItem {
  id: string;
  productId: string;
  qty: number;
  unitPrice: number; // rate
  discountPercent: number;
  taxPercent: number;
  amount: number; // line subtotal (excl. tax)
}

interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: string;
  warehouseId: string;
  invoiceDate: string; // yyyy-mm-dd
  dueDate: string; // yyyy-mm-dd
  subTitle: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paidAmount: number;
  balance: number;
  deposit: number;
  shippingCost: number;
  inlineDiscount: number;
  discountBeforeTax: number;
  status: string;
  items: InvoiceItem[];
}

/* ---- Raw API shapes ---- */
interface ApiCustomerRef {
  _id: string;
  name?: string;
  email?: string;
}
interface ApiInvoiceItem {
  product_id: string;
  quantity: number;
  rate: number;
  tax: number;
  discount: number;
  amount: number;
}
interface ApiInvoice {
  _id: string;
  customer_id?: ApiCustomerRef | string | null;
  warehouse_id?: string | null;
  invoice_number: string;
  date: string;
  due_date: string;
  sub_title?: string;
  discount_before_tax?: number;
  product?: ApiInvoiceItem[];
  service?: unknown[];
  status?: string;
  sub_total?: number;
  deposit?: number;
  discount?: number;
  shipping_cost?: number;
  inline_discount?: number;
  tax?: number;
  total?: number;
  paid_amount?: number;
  balance_amount?: number;
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
interface ApiProduct {
  _id: string;
  productName?: string;
  name?: string;
  sku?: string;
  pricing?: { sellPrice?: number; buyPrice?: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = (val || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const num = (v: string | number) => Number(v) || 0;
const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : "");
const errMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.message ? err.message : fallback;

const customerRefId = (ref: ApiCustomerRef | string | null | undefined) =>
  typeof ref === "object" && ref ? ref._id : (ref ?? "");
const customerRefName = (ref: ApiCustomerRef | string | null | undefined) =>
  typeof ref === "object" && ref ? (ref.name ?? "") : "";
const customerLabel = (c: ApiCustomer): string =>
  c.name ??
  c.customerName ??
  [c.firstName, c.lastName].filter(Boolean).join(" ") ??
  c.email ??
  c._id;
const productLabel = (p: ApiProduct): string =>
  p.productName ?? p.name ?? p._id;

const mapApiInvoice = (inv: ApiInvoice): SalesInvoice => ({
  id: inv._id,
  invoiceNumber: inv.invoice_number ?? "",
  customerId: customerRefId(inv.customer_id),
  customer: customerRefName(inv.customer_id),
  warehouseId: inv.warehouse_id ?? "",
  invoiceDate: toDateInput(inv.date),
  dueDate: toDateInput(inv.due_date),
  subTitle: inv.sub_title ?? "",
  subtotal: inv.sub_total ?? 0,
  tax: inv.tax ?? 0,
  discount: inv.discount ?? 0,
  total: inv.total ?? 0,
  paidAmount: inv.paid_amount ?? 0,
  balance: inv.balance_amount ?? 0,
  deposit: inv.deposit ?? 0,
  shippingCost: inv.shipping_cost ?? 0,
  inlineDiscount: inv.inline_discount ?? 0,
  discountBeforeTax: inv.discount_before_tax ?? 0,
  status: inv.status ?? "Draft",
  items: (inv.product ?? []).map((it, idx) => ({
    id: `item-${idx}`,
    productId: it.product_id,
    qty: it.quantity ?? 0,
    unitPrice: it.rate ?? 0,
    discountPercent: it.discount ?? 0,
    taxPercent: it.tax ?? 0,
    amount: it.amount ?? 0,
  })),
});

const newItem = (): InvoiceItem => ({
  id: `new-${Math.random().toString(36).slice(2)}`,
  productId: "",
  qty: 1,
  unitPrice: 0,
  discountPercent: 0,
  taxPercent: 0,
  amount: 0,
});

type SortField =
  | "invoiceNumber"
  | "customer"
  | "invoiceDate"
  | "dueDate"
  | "subtotal"
  | "tax"
  | "total"
  | "balance"
  | "status";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS = ["Draft", "Open", "Partial", "Paid"];

// ─── Component ────────────────────────────────────────────────────────────────

export const SalesInvoice: React.FC = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // View modal
  const [showView, setShowView] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<SalesInvoice | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Delete modal
  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState<SalesInvoice | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Option sources
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [warehouses, setWarehouses] = useState<ApiWarehouse[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    customerId: "",
    warehouseId: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    subTitle: "",
    status: "Draft",
    deposit: 0,
    discount: 0,
    shippingCost: 0,
    inlineDiscount: 0,
    discountBeforeTax: 0,
  });
  const [formItems, setFormItems] = useState<InvoiceItem[]>([newItem()]);

  // ─── Lookup maps ───────────────────────────────────────────────────────────
  const customerNameById = useMemo(() => {
    const m: Record<string, string> = {};
    customers.forEach((c) => (m[c._id] = customerLabel(c)));
    return m;
  }, [customers]);
  const warehouseNameById = useMemo(() => {
    const m: Record<string, string> = {};
    warehouses.forEach((w) => (m[w._id] = (w.name ?? "").trim()));
    return m;
  }, [warehouses]);
  const productNameById = useMemo(() => {
    const m: Record<string, string> = {};
    products.forEach((p) => (m[p._id] = productLabel(p)));
    return m;
  }, [products]);

  const displayCustomer = (inv: SalesInvoice) =>
    inv.customer || customerNameById[inv.customerId] || "—";

  // ─── Data loading ──────────────────────────────────────────────────────────
  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<ApiInvoice[]>("/invoice/all", {
        params: { page: 1, limit: 1000 },
      });
      setInvoices(Array.isArray(data) ? data.map(mapApiInvoice) : []);
    } catch (err) {
      const message = errMessage(err, "Couldn't load invoices.");
      setLoadError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOptions = useCallback(async () => {
    try {
      const [c, w, p] = await Promise.allSettled([
        api.get<ApiCustomer[]>("/customer/all", {
          params: { page: 1, limit: 1000 },
        }),
        api.get<ApiWarehouse[]>("/purchase/warehouses/all", {
          params: { page: 1, limit: 1000 },
        }),
        api.get<ApiProduct[]>("/product/all", {
          params: { page: 1, limit: 1000 },
        }),
      ]);
      if (c.status === "fulfilled" && Array.isArray(c.value))
        setCustomers(c.value);
      if (w.status === "fulfilled" && Array.isArray(w.value))
        setWarehouses(w.value);
      if (p.status === "fulfilled" && Array.isArray(p.value))
        setProducts(p.value);
    } catch {
      /* dropdowns degrade gracefully */
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
          displayCustomer(inv).toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((inv) => inv.status === statusFilter);
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
    invoices,
    searchQuery,
    statusFilter,
    sortField,
    sortDir,
    customerNameById,
  ]);

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
      case "Open":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Partial":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const recalcAmount = (item: InvoiceItem): number => {
    const base = item.qty * item.unitPrice;
    return round2(base - base * (item.discountPercent / 100));
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setFormItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value } as InvoiceItem;
        if (field === "productId") {
          const found = products.find((p) => p._id === value);
          const price = found?.pricing?.sellPrice ?? found?.pricing?.buyPrice;
          if (typeof price === "number") updated.unitPrice = price;
        }
        updated.amount = recalcAmount(updated);
        return updated;
      }),
    );
  };

  const addItem = () => setFormItems((prev) => [...prev, newItem()]);
  const removeItem = (id: string) =>
    setFormItems((prev) =>
      prev.length <= 1 ? prev : prev.filter((i) => i.id !== id),
    );

  // Summary
  const formSubtotal = round2(
    formItems.reduce(
      (sum, i) =>
        sum +
        (i.qty * i.unitPrice - i.qty * i.unitPrice * (i.discountPercent / 100)),
      0,
    ),
  );
  const formDiscount = round2(
    formItems.reduce(
      (sum, i) => sum + i.qty * i.unitPrice * (i.discountPercent / 100),
      0,
    ),
  );
  const formTax = round2(
    formItems.reduce((sum, i) => {
      const base = i.qty * i.unitPrice;
      const taxable = base - base * (i.discountPercent / 100);
      return sum + taxable * (i.taxPercent / 100);
    }, 0),
  );
  const formTotal = round2(
    formSubtotal +
      formTax +
      num(formData.shippingCost) -
      num(formData.discount) -
      num(formData.inlineDiscount) -
      num(formData.discountBeforeTax),
  );

  const resetForm = () => {
    setFormData({
      customerId: "",
      warehouseId: "",
      invoiceNumber: `INV-${String(Math.floor(Math.random() * 900) + 100)}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      subTitle: "",
      status: "Draft",
      deposit: 0,
      discount: 0,
      shippingCost: 0,
      inlineDiscount: 0,
      discountBeforeTax: 0,
    });
    setFormItems([newItem()]);
    setEditingId(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditInvoice = (inv: SalesInvoice) => {
    setEditingId(inv.id);
    setFormData({
      customerId: inv.customerId,
      warehouseId: inv.warehouseId,
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate,
      subTitle: inv.subTitle,
      status: inv.status,
      deposit: inv.deposit,
      discount: inv.discount,
      shippingCost: inv.shippingCost,
      inlineDiscount: inv.inlineDiscount,
      discountBeforeTax: inv.discountBeforeTax,
    });
    setFormItems(
      inv.items.length > 0 ? inv.items.map((i) => ({ ...i })) : [newItem()],
    );
    setIsEditing(true);
    setShowForm(true);
  };

  // ─── View (single) ─────────────────────────────────────────────────────────
  const openView = async (inv: SalesInvoice) => {
    setViewInvoice(inv);
    setShowView(true);
    setViewLoading(true);
    try {
      const data = await api.get<ApiInvoice>(`/invoice/single/${inv.id}`);
      if (data) setViewInvoice(mapApiInvoice(data));
    } catch (err) {
      showToast(errMessage(err, "Couldn't load invoice details."), "error");
    } finally {
      setViewLoading(false);
    }
  };

  // ─── Create / Update ───────────────────────────────────────────────────────
  const handleSaveInvoice = async () => {
    if (!formData.customerId)
      return showToast("Please select a customer", "info");
    if (!formData.warehouseId)
      return showToast("Please select a warehouse", "info");
    if (!formData.invoiceNumber.trim())
      return showToast("Please enter an invoice number", "info");
    const items = formItems.filter((i) => i.productId);
    if (items.length === 0)
      return showToast("Please add at least one product", "info");

    const payload = {
      customer_id: formData.customerId,
      warehouse_id: formData.warehouseId,
      invoice_number: formData.invoiceNumber.trim(),
      date: formData.invoiceDate,
      due_date: formData.dueDate,
      sub_title: formData.subTitle,
      discount_before_tax: num(formData.discountBeforeTax),
      status: formData.status,
      deposit: num(formData.deposit),
      discount: num(formData.discount),
      shipping_cost: num(formData.shippingCost),
      inline_discount: num(formData.inlineDiscount),
      tax: formTax,
      sub_total: formSubtotal,
      total: formTotal,
      product: items.map((i) => ({
        product_id: i.productId,
        quantity: i.qty,
        rate: i.unitPrice,
        tax: i.taxPercent,
        discount: i.discountPercent,
        amount: recalcAmount(i),
      })),
      service: [],
    };

    setSaving(true);
    try {
      if (isEditing && editingId) {
        await api.post(`/invoice/edit/${editingId}`, payload);
        showToast("Invoice updated!", "success");
      } else {
        await api.post("/invoice/create", payload);
        showToast("Invoice created!", "success");
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

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/invoice/delete/${toDelete.id}`);
      showToast("Invoice deleted!", "success");
      setShowDelete(false);
      setToDelete(null);
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
              Sales Invoice
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">
              {isEditing ? "Edit Sales Invoice" : "Create Sales Invoice"}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Sales Invoice" : "Create Sales Invoice"}
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
              <Calendar className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-semibold text-gray-900">
                Sales Invoice Details
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
                    value={formData.invoiceDate}
                    onChange={(e) =>
                      setFormData({ ...formData, invoiceDate: e.target.value })
                    }
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
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) =>
                    setFormData({ ...formData, customerId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {customerLabel(c)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.warehouseId}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouseId: e.target.value })
                  }
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceNumber: e.target.value })
                  }
                  placeholder="INV-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subTitle: e.target.value })
                  }
                  placeholder="e.g., Test"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <h3 className="text-base font-semibold text-gray-900">
                  Sales Invoice Items
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

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-sm border-collapse min-w-[760px]">
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
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-28">
                      Amount
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
                          className="w-full min-w-[150px] px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>
                              {productLabel(p)}
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
                      <td className="px-2 py-3 text-sm text-gray-900">
                        {fmtCurrency(item.amount)}
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

            {/* Additional charges */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {(
                [
                  ["shippingCost", "Shipping Cost"],
                  ["discount", "Discount"],
                  ["inlineDiscount", "Inline Discount"],
                  ["discountBeforeTax", "Discount Before Tax"],
                  ["deposit", "Deposit"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [key]: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              ))}
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
                    <span className="text-gray-600">Item Discount</span>
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
              disabled={saving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveInvoice}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving
                ? "Saving…"
                : isEditing
                  ? "Update Invoice"
                  : "Create Invoice"}
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
          <span className="text-gray-900 font-medium">Sales Invoices</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Sales Invoices
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
                placeholder="Search by invoice number or customer..."
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
                  {["All", ...STATUS_OPTIONS].map((st) => (
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
            <span className="text-sm">Loading invoices…</span>
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
                  <SortHeader field="invoiceDate" label="Invoice Date" />
                  <SortHeader field="dueDate" label="Due Date" />
                  <SortHeader field="subtotal" label="Subtotal" />
                  <SortHeader field="tax" label="Tax" />
                  <SortHeader field="total" label="Total Amount" />
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
                        onClick={() => openView(inv)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="px-3 py-4 text-gray-900">
                      {displayCustomer(inv)}
                    </td>
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
                      {fmtCurrency(inv.total)}
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
                          onClick={() => openView(inv)}
                          className="p-1.5 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
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
                          onClick={() => handleEditInvoice(inv)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setToDelete(inv);
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
                    onClick={() => openView(inv)}
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
                <div className="text-sm text-gray-900 mb-1">
                  {displayCustomer(inv)}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  {inv.invoiceDate} → {inv.dueDate}
                </div>
                <div className="flex items-center justify-between mb-3 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {fmtCurrency(inv.total)}
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
                    onClick={() => openView(inv)}
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
                  <button
                    onClick={() => handleEditInvoice(inv)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setToDelete(inv);
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
                  {viewInvoice.invoiceNumber || "Sales Invoice"}
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
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="text-sm text-gray-900">
                        {displayCustomer(viewInvoice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Warehouse</p>
                      <p className="text-sm text-gray-900">
                        {warehouseNameById[viewInvoice.warehouseId] ||
                          viewInvoice.warehouseId ||
                          "—"}
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
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500">Subtitle</p>
                      <p className="text-sm text-gray-900">
                        {viewInvoice.subTitle || "—"}
                      </p>
                    </div>
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
                            Qty
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Rate
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Disc %
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Tax %
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {viewInvoice.items.map((it) => (
                          <tr key={it.id}>
                            <td className="px-3 py-2 text-gray-900">
                              {productNameById[it.productId] || it.productId}
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
                              {it.taxPercent}%
                            </td>
                            <td className="px-3 py-2 text-right text-gray-900">
                              {fmtCurrency(it.amount)}
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
                          {fmtCurrency(viewInvoice.total)}
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
              {!viewLoading && (
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
                Delete Invoice
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{toDelete.invoiceNumber}</span>?
                This action cannot be undone.
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
