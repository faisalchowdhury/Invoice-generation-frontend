/**
 * File: src/pages/items/Product.tsx
 * Products catalog — list, create/edit modal, view & delete modals.
 *
 * Backed by the product API:
 *   GET    /product/all              -> list (paginated envelope)
 *   GET    /product/single/:id       -> one product (View modal)
 *   POST   /product/create           -> create
 *   PATCH  /product/update/:id        -> update
 *   DELETE /product/delete/:id        -> delete (assumed — not in the provided spec)
 *
 * `category` and `tax` are stored as ids and resolved from /category/all and
 * /tax/all. Per the API contract the create body sends `category` as a NAME and
 * the update body omits category/tax, so those two fields are editable on create
 * but read-only on edit.
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { api } from "../../lib/api/client";
import { ApiError } from "../../lib/api/ApiError";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  X,
  Box,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  categoryId: string;
  taxId: string;
  sku: string;
  unitType: string;
  quantity: number;
  image: string;
  buyPrice: number;
  buyPriceTax: number;
  sellPrice: number;
  sellPriceTax: number;
  currency: string;
  onHandStock: number;
  committedStock: number;
  availableForSale: number;
  toBeInvoiced: number;
  toBeBilled: number;
  description: string;
}

interface ApiProduct {
  _id: string;
  productName?: string;
  category?: string;
  tax?: string;
  sku?: string;
  unitType?: string;
  quantity?: number;
  image?: string;
  pricing?: {
    buyPrice?: number;
    buyPriceTax?: number;
    sellPrice?: number;
    sellPriceTax?: number;
    currency?: string;
  };
  stock?: {
    onHandStock?: number;
    committedStock?: number;
    availableForSale?: number;
    toBeInvoiced?: number;
    toBeBilled?: number;
  };
  description?: string;
}
interface ApiCategory {
  _id: string;
  category: string;
}
interface ApiTax {
  _id: string;
  name: string;
  rate: number;
}

const UNIT_TYPES = ["piece", "box", "pack", "kg", "litre", "set"];
const CURRENCIES = ["USD", "EUR", "GBP", "BDT"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const money = (n: number) =>
  `$${(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
const errMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.message ? err.message : fallback;

const stockBadge = (p: Product) => {
  if (p.availableForSale <= 0)
    return { label: "Out of Stock", cls: "bg-red-100 text-red-700 border border-red-200" };
  if (p.availableForSale < 25)
    return { label: "Low Stock", cls: "bg-orange-100 text-orange-700 border border-orange-200" };
  return { label: "In Stock", cls: "bg-green-100 text-green-700 border border-green-200" };
};

const mapApiProduct = (p: ApiProduct): Product => ({
  id: p._id,
  name: p.productName ?? "",
  categoryId: p.category ?? "",
  taxId: p.tax ?? "",
  sku: p.sku ?? "",
  unitType: p.unitType ?? "piece",
  quantity: p.quantity ?? 1,
  image: p.image ?? "",
  buyPrice: p.pricing?.buyPrice ?? 0,
  buyPriceTax: p.pricing?.buyPriceTax ?? 0,
  sellPrice: p.pricing?.sellPrice ?? 0,
  sellPriceTax: p.pricing?.sellPriceTax ?? 0,
  currency: p.pricing?.currency ?? "USD",
  onHandStock: p.stock?.onHandStock ?? 0,
  committedStock: p.stock?.committedStock ?? 0,
  availableForSale: p.stock?.availableForSale ?? 0,
  toBeInvoiced: p.stock?.toBeInvoiced ?? 0,
  toBeBilled: p.stock?.toBeBilled ?? 0,
  description: p.description ?? "",
});

interface FormState {
  categoryName: string; // create sends a name; read-only on edit
  taxId: string;
  name: string;
  sku: string;
  unitType: string;
  quantity: number;
  image: string;
  buyPrice: number;
  buyPriceTax: number;
  sellPrice: number;
  sellPriceTax: number;
  currency: string;
  onHandStock: number;
  committedStock: number;
  toBeInvoiced: number;
  toBeBilled: number;
  description: string;
}

const emptyForm: FormState = {
  categoryName: "",
  taxId: "",
  name: "",
  sku: "",
  unitType: "piece",
  quantity: 1,
  image: "",
  buyPrice: 0,
  buyPriceTax: 0,
  sellPrice: 0,
  sellPriceTax: 0,
  currency: "USD",
  onHandStock: 0,
  committedStock: 0,
  toBeInvoiced: 0,
  toBeBilled: 0,
  description: "",
};

type SortField = "name" | "sku" | "buyPrice" | "sellPrice" | "availableForSale";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────

export const Product: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Option sources
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [taxes, setTaxes] = useState<ApiTax[]>([]);

  // Create/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  // View / Delete
  const [showView, setShowView] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Lookup maps ───────────────────────────────────────────────────────────
  const categoryNameById = useMemo(() => {
    const m: Record<string, string> = {};
    categories.forEach((c) => (m[c._id] = c.category));
    return m;
  }, [categories]);
  const taxNameById = useMemo(() => {
    const m: Record<string, string> = {};
    taxes.forEach((t) => (m[t._id] = `${t.name} (${t.rate}%)`));
    return m;
  }, [taxes]);

  const categoryLabel = (p: Product) => categoryNameById[p.categoryId] || "—";

  // ─── Data loading ──────────────────────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<ApiProduct[]>("/product/all", {
        params: { page: 1, limit: 1000 },
      });
      setProducts(Array.isArray(data) ? data.map(mapApiProduct) : []);
    } catch (err) {
      const m = errMessage(err, "Couldn't load products.");
      setLoadError(m);
      showToast(m, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOptions = useCallback(async () => {
    try {
      const [c, t] = await Promise.allSettled([
        api.get<ApiCategory[]>("/category/all"),
        api.get<ApiTax[]>("/tax/all"),
      ]);
      if (c.status === "fulfilled" && Array.isArray(c.value)) setCategories(c.value);
      if (t.status === "fulfilled" && Array.isArray(t.value)) setTaxes(t.value);
    } catch {
      /* dropdowns degrade gracefully */
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadOptions();
  }, [loadProducts, loadOptions]);

  // unique category names present on the products, for the filter
  const filterCategories = useMemo(() => {
    const names = new Set<string>();
    products.forEach((p) => {
      const n = categoryNameById[p.categoryId];
      if (n) names.add(n);
    });
    return ["All", ...Array.from(names)];
  }, [products, categoryNameById]);

  // ─── Sorting / filtering ───────────────────────────────────────────────────
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          categoryLabel(p).toLowerCase().includes(q),
      );
    }
    if (categoryFilter !== "All")
      result = result.filter((p) => categoryNameById[p.categoryId] === categoryFilter);
    result.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchQuery, categoryFilter, sortField, sortDir, categoryNameById]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const availableForSale = Math.max(0, form.onHandStock - form.committedStock);

  // ─── CRUD ──────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      categoryName: categoryNameById[p.categoryId] || "",
      taxId: p.taxId,
      name: p.name,
      sku: p.sku,
      unitType: p.unitType,
      quantity: p.quantity,
      image: p.image,
      buyPrice: p.buyPrice,
      buyPriceTax: p.buyPriceTax,
      sellPrice: p.sellPrice,
      sellPriceTax: p.sellPriceTax,
      currency: p.currency,
      onHandStock: p.onHandStock,
      committedStock: p.committedStock,
      toBeInvoiced: p.toBeInvoiced,
      toBeBilled: p.toBeBilled,
      description: p.description,
    });
    setIsEditing(true);
    setEditingId(p.id);
    setShowModal(true);
  };

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Please enter a product name", "info");
    if (!form.sku.trim()) return showToast("Please enter a SKU", "info");
    if (!isEditing && !form.categoryName.trim())
      return showToast("Please select a category", "info");

    const base = {
      productName: form.name.trim(),
      sku: form.sku.trim(),
      unitType: form.unitType,
      quantity: form.quantity,
      image: form.image.trim(),
      pricing: {
        buyPrice: form.buyPrice,
        buyPriceTax: form.buyPriceTax,
        sellPrice: form.sellPrice,
        sellPriceTax: form.sellPriceTax,
        currency: form.currency,
      },
      stock: {
        onHandStock: form.onHandStock,
        committedStock: form.committedStock,
        availableForSale,
        toBeInvoiced: form.toBeInvoiced,
        toBeBilled: form.toBeBilled,
      },
      description: form.description.trim(),
    };

    setSaving(true);
    try {
      if (isEditing && editingId) {
        // Update contract omits category/tax.
        await api.patch(`/product/update/${editingId}`, base);
        showToast("Product updated!", "success");
      } else {
        // Create sends category as a name (+ optional tax id).
        await api.post("/product/create", {
          ...base,
          category: form.categoryName.trim(),
          ...(form.taxId ? { tax: form.taxId } : {}),
        });
        showToast("Product created!", "success");
      }
      setShowModal(false);
      await loadProducts();
    } catch (err) {
      showToast(errMessage(err, "Couldn't save product."), "error");
    } finally {
      setSaving(false);
    }
  };

  const openView = async (p: Product) => {
    setViewProduct(p);
    setShowView(true);
    setViewLoading(true);
    try {
      const data = await api.get<ApiProduct>(`/product/single/${p.id}`);
      if (data) setViewProduct(mapApiProduct(data));
    } catch (err) {
      showToast(errMessage(err, "Couldn't load product details."), "error");
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/product/delete/${toDelete.id}`);
      showToast("Product deleted!", "success");
      setShowDelete(false);
      setToDelete(null);
      await loadProducts();
    } catch (err) {
      showToast(errMessage(err, "Couldn't delete product."), "error");
    } finally {
      setDeleting(false);
    }
  };

  // ─── Sort Header ───────────────────────────────────────────────────────────
  const SortHeader: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
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
          <span className="text-gray-900 font-medium">Products</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Manage Products</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Your product catalog, pricing and stock levels
            </p>
          </div>
          <button
            onClick={openCreate}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Product"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-3">
            <div className="text-xs text-blue-600 font-medium">Total Products</div>
            <div className="text-xl font-bold text-blue-700">{products.length}</div>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-green-50 to-emerald-50 p-3">
            <div className="text-xs text-green-600 font-medium">In Stock</div>
            <div className="text-xl font-bold text-green-700">
              {products.filter((p) => p.availableForSale > 0).length}
            </div>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-orange-50 to-amber-50 p-3">
            <div className="text-xs text-orange-600 font-medium">Low / Out</div>
            <div className="text-xl font-bold text-orange-700">
              {products.filter((p) => p.availableForSale < 25).length}
            </div>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-purple-50 to-pink-50 p-3">
            <div className="text-xs text-purple-600 font-medium">Categories</div>
            <div className="text-xl font-bold text-purple-700">{filterCategories.length - 1}</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, category or SKU..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => loadProducts()}
              className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Refresh
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
                <span className="text-gray-700">{categoryFilter === "All" ? "Category" : categoryFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showFilters && (
                <div className="absolute right-0 top-10 w-52 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 max-h-64 overflow-y-auto">
                  <div className="px-3 pb-1.5 mb-1 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">Category</span>
                  </div>
                  {filterCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                        categoryFilter === cat ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"
                      }`}
                    >
                      {cat}
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
                <SortHeader field="name" label="Product" />
                <SortHeader field="sku" label="SKU" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Unit</th>
                <SortHeader field="buyPrice" label="Buy Price" />
                <SortHeader field="sellPrice" label="Sell Price" />
                <SortHeader field="availableForSale" label="Available" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Loading products…</span>
                    </div>
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-red-600">
                    {loadError}
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                paginated.map((p) => {
                  const badge = stockBadge(p);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <span className="text-purple-600 text-sm font-semibold">
                                {p.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => openView(p)}
                            className="font-medium text-gray-900 hover:text-blue-600 truncate text-left"
                          >
                            {p.name}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.sku}</td>
                      <td className="px-4 py-3 text-gray-600">{categoryLabel(p)}</td>
                      <td className="px-4 py-3 text-gray-600">{p.unitType}</td>
                      <td className="px-4 py-3 text-gray-600">{money(p.buyPrice)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{money(p.sellPrice)}</td>
                      <td className="px-4 py-3 text-gray-900">{p.availableForSale}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openView(p)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setToDelete(p);
                              setShowDelete(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to{" "}
            {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} results
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
                  currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {isEditing ? "Edit Product" : "Create Product"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isEditing ? "Update product information" : "Add a new product to your catalog"}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="Enter product name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => setField("sku", e.target.value)}
                      placeholder="e.g., WM-001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category {!isEditing && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      value={form.categoryName}
                      onChange={(e) => setField("categoryName", e.target.value)}
                      disabled={isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c.category}>
                          {c.category}
                        </option>
                      ))}
                    </select>
                    {isEditing && (
                      <p className="text-xs text-gray-400 mt-1">Category can't be changed after creation.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
                    <select
                      value={form.taxId}
                      onChange={(e) => setField("taxId", e.target.value)}
                      disabled={isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">No tax</option>
                      {taxes.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name} ({t.rate}%)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                    <select
                      value={form.unitType}
                      onChange={(e) => setField("unitType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {UNIT_TYPES.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={form.quantity}
                      onChange={(e) => setField("quantity", parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setField("image", e.target.value)}
                      placeholder="https://…"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                      placeholder="Short description..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Pricing</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buy Price</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.buyPrice}
                      onChange={(e) => setField("buyPrice", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buy Price Tax</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.buyPriceTax}
                      onChange={(e) => setField("buyPriceTax", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setField("currency", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sell Price</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.sellPrice}
                      onChange={(e) => setField("sellPrice", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sell Price Tax</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.sellPriceTax}
                      onChange={(e) => setField("sellPriceTax", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Stock</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">On-hand</label>
                    <input
                      type="number"
                      min={0}
                      value={form.onHandStock}
                      onChange={(e) => setField("onHandStock", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Committed</label>
                    <input
                      type="number"
                      min={0}
                      value={form.committedStock}
                      onChange={(e) => setField("committedStock", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                    <input
                      type="number"
                      value={availableForSale}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To be Invoiced</label>
                    <input
                      type="number"
                      min={0}
                      value={form.toBeInvoiced}
                      onChange={(e) => setField("toBeInvoiced", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To be Billed</label>
                    <input
                      type="number"
                      min={0}
                      value={form.toBeBilled}
                      onChange={(e) => setField("toBeBilled", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center gap-2 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving…" : isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showView && viewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
              <button onClick={() => setShowView(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
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
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center overflow-hidden">
                      {viewProduct.image ? (
                        <img
                          src={viewProduct.image}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <Box className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{viewProduct.name}</h3>
                      <p className="text-xs text-gray-500">
                        {categoryNameById[viewProduct.categoryId] || "—"} · SKU: {viewProduct.sku}
                        {viewProduct.taxId && taxNameById[viewProduct.taxId]
                          ? ` · Tax: ${taxNameById[viewProduct.taxId]}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">On Hand</p>
                      <p className="text-sm font-semibold text-gray-900">{viewProduct.onHandStock}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Committed</p>
                      <p className="text-sm font-semibold text-orange-600">{viewProduct.committedStock}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Available</p>
                      <p className="text-sm font-semibold text-green-600">{viewProduct.availableForSale}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Unit</p>
                      <p className="text-sm font-semibold text-gray-900">{viewProduct.unitType}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-100 rounded-md p-4">
                      <div className="text-xs text-gray-500 mb-1">Buy Price</div>
                      <div className="text-xl font-bold text-gray-900">{money(viewProduct.buyPrice)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Tax {money(viewProduct.buyPriceTax)} · {viewProduct.currency}
                      </div>
                    </div>
                    <div className="border border-gray-100 rounded-md p-4">
                      <div className="text-xs text-gray-500 mb-1">Sell Price</div>
                      <div className="text-xl font-bold text-blue-600">{money(viewProduct.sellPrice)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Margin:{" "}
                        {viewProduct.sellPrice > 0
                          ? Math.round(((viewProduct.sellPrice - viewProduct.buyPrice) / viewProduct.sellPrice) * 100)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-900">{viewProduct.description || "—"}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowView(false);
                  openEdit(viewProduct);
                }}
                disabled={viewLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Edit Product
              </button>
              <button
                onClick={() => setShowView(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && toDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{toDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {deleting ? "Deleting…" : "Delete"}
                </button>
                <button
                  onClick={() => setShowDelete(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
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
