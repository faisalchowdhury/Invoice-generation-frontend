/**
 * File: src/pages/items/Services.tsx
 * Services catalog — list, create/edit modal, view & delete modals.
 *
 * Backed by the service API:
 *   GET    /service/all   -> list (paginated envelope)
 *   GET    /service/:id   -> one service (View modal)
 *   POST   /service/create
 *   PATCH  /service/:id   -> update (full body)
 *   DELETE /service/:id   -> delete (assumed — not in the provided spec)
 *
 * `taxes` is an array of tax names (resolved from /tax/all); sac / hsn /
 * serviceStock / productStock are boolean flags.
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
  Wrench,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
  id: string;
  name: string;
  unitType: string;
  quantity: number;
  rate: number;
  taxes: string[];
  currency: string;
  description: string;
  serviceStock: boolean;
  sac: boolean;
  productStock: boolean;
  hsn: boolean;
}

interface ApiService {
  _id: string;
  serviceName?: string;
  unitType?: string;
  quantity?: number;
  rate?: number;
  taxes?: string[];
  currency?: string;
  description?: string;
  serviceStock?: boolean;
  sac?: boolean;
  productStock?: boolean;
  hsn?: boolean;
}
interface ApiTax {
  _id: string;
  name: string;
  rate: number;
}

const UNIT_TYPES = ["hour", "day", "week", "month", "fixed"];
const CURRENCIES = ["USD", "EUR", "GBP", "BDT"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const money = (n: number) =>
  `$${(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
const errMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.message ? err.message : fallback;

const mapApiService = (s: ApiService): Service => ({
  id: s._id,
  name: s.serviceName ?? "",
  unitType: s.unitType ?? "hour",
  quantity: s.quantity ?? 1,
  rate: s.rate ?? 0,
  taxes: Array.isArray(s.taxes) ? s.taxes : [],
  currency: s.currency ?? "USD",
  description: s.description ?? "",
  serviceStock: !!s.serviceStock,
  sac: !!s.sac,
  productStock: !!s.productStock,
  hsn: !!s.hsn,
});

interface FormState {
  name: string;
  unitType: string;
  quantity: number;
  rate: number;
  taxes: string[];
  currency: string;
  description: string;
  serviceStock: boolean;
  sac: boolean;
  productStock: boolean;
  hsn: boolean;
}

const emptyForm: FormState = {
  name: "",
  unitType: "hour",
  quantity: 1,
  rate: 0,
  taxes: [],
  currency: "USD",
  description: "",
  serviceStock: false,
  sac: false,
  productStock: false,
  hsn: false,
};

type SortField = "name" | "unitType" | "quantity" | "rate";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────

export const Services: React.FC = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [unitFilter, setUnitFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [taxes, setTaxes] = useState<ApiTax[]>([]);

  // Create/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  // View / Delete modals
  const [showView, setShowView] = useState(false);
  const [viewService, setViewService] = useState<Service | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const unitTypes = useMemo(
    () => ["All", ...Array.from(new Set(services.map((s) => s.unitType).filter(Boolean)))],
    [services],
  );

  // ─── Data loading ──────────────────────────────────────────────────────────
  const loadServices = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<ApiService[]>("/service/all", {
        params: { page: 1, limit: 1000 },
      });
      setServices(Array.isArray(data) ? data.map(mapApiService) : []);
    } catch (err) {
      const m = errMessage(err, "Couldn't load services.");
      setLoadError(m);
      showToast(m, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTaxes = useCallback(async () => {
    try {
      const data = await api.get<ApiTax[]>("/tax/all");
      if (Array.isArray(data)) setTaxes(data);
    } catch {
      /* tax options degrade gracefully */
    }
  }, []);

  useEffect(() => {
    loadServices();
    loadTaxes();
  }, [loadServices, loadTaxes]);

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
    let result = [...services];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.taxes.join(" ").toLowerCase().includes(q),
      );
    }
    if (unitFilter !== "All") result = result.filter((s) => s.unitType === unitFilter);
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
  }, [services, searchQuery, unitFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ─── CRUD ──────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setForm({
      name: s.name,
      unitType: s.unitType,
      quantity: s.quantity,
      rate: s.rate,
      taxes: [...s.taxes],
      currency: s.currency,
      description: s.description,
      serviceStock: s.serviceStock,
      sac: s.sac,
      productStock: s.productStock,
      hsn: s.hsn,
    });
    setIsEditing(true);
    setEditingId(s.id);
    setShowModal(true);
  };

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleTax = (name: string) =>
    setForm((prev) => ({
      ...prev,
      taxes: prev.taxes.includes(name)
        ? prev.taxes.filter((t) => t !== name)
        : [...prev.taxes, name],
    }));

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Please enter a service name", "info");
    if (!form.rate || form.rate <= 0) return showToast("Please enter a valid rate", "info");

    const payload = {
      serviceName: form.name.trim(),
      unitType: form.unitType,
      quantity: form.quantity,
      rate: form.rate,
      taxes: form.taxes,
      currency: form.currency,
      description: form.description.trim(),
      serviceStock: form.serviceStock,
      sac: form.sac,
      productStock: form.productStock,
      hsn: form.hsn,
    };

    setSaving(true);
    try {
      if (isEditing && editingId) {
        await api.patch(`/service/${editingId}`, payload);
        showToast("Service updated!", "success");
      } else {
        await api.post("/service/create", payload);
        showToast("Service created!", "success");
      }
      setShowModal(false);
      await loadServices();
    } catch (err) {
      showToast(errMessage(err, "Couldn't save service."), "error");
    } finally {
      setSaving(false);
    }
  };

  const openView = async (s: Service) => {
    setViewService(s);
    setShowView(true);
    setViewLoading(true);
    try {
      const data = await api.get<ApiService>(`/service/${s.id}`);
      if (data) setViewService(mapApiService(data));
    } catch (err) {
      showToast(errMessage(err, "Couldn't load service details."), "error");
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/service/${toDelete.id}`);
      showToast("Service deleted!", "success");
      setShowDelete(false);
      setToDelete(null);
      await loadServices();
    } catch (err) {
      showToast(errMessage(err, "Couldn't delete service."), "error");
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

  // ─── Toggle row ────────────────────────────────────────────────────────────
  const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({
    label,
    value,
    onChange,
  }) => (
    <label className="flex items-center justify-between gap-3 px-3 py-2 border border-gray-200 rounded-md">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-blue-600" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </label>
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
          <span className="text-gray-900 font-medium">Services</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Manage Services</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Service offerings, rates and tax configuration
            </p>
          </div>
          <button
            onClick={openCreate}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Service"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-3">
            <div className="text-xs text-blue-600 font-medium">Total Services</div>
            <div className="text-xl font-bold text-blue-700">{services.length}</div>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-green-50 to-emerald-50 p-3">
            <div className="text-xs text-green-600 font-medium">Avg. Rate</div>
            <div className="text-xl font-bold text-green-700">
              {money(services.length ? services.reduce((s, v) => s + v.rate, 0) / services.length : 0)}
            </div>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-purple-50 to-pink-50 p-3">
            <div className="text-xs text-purple-600 font-medium">Unit Types</div>
            <div className="text-xl font-bold text-purple-700">{unitTypes.length - 1}</div>
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
                placeholder="Search by name or tax..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => loadServices()}
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
                <span className="text-gray-700">{unitFilter === "All" ? "Unit" : unitFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showFilters && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 max-h-64 overflow-y-auto">
                  <div className="px-3 pb-1.5 mb-1 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">Unit Type</span>
                  </div>
                  {unitTypes.map((u) => (
                    <button
                      key={u}
                      onClick={() => {
                        setUnitFilter(u);
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                        unitFilter === u ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"
                      }`}
                    >
                      {u}
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
          <table className="w-full text-sm min-w-[860px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="name" label="Service" />
                <SortHeader field="unitType" label="Unit" />
                <SortHeader field="quantity" label="Qty" />
                <SortHeader field="rate" label="Rate" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Taxes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Flags</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Loading services…</span>
                    </div>
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-red-600">
                    {loadError}
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No services found.
                  </td>
                </tr>
              ) : (
                paginated.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-sm font-semibold">
                            {s.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => openView(s)}
                            className="font-medium text-gray-900 hover:text-blue-600 truncate block text-left"
                          >
                            {s.name}
                          </button>
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {s.description || "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.unitType}</td>
                    <td className="px-4 py-3 text-gray-600">{s.quantity}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {money(s.rate)}
                      <span className="text-xs text-gray-400"> /{s.unitType}</span>
                    </td>
                    <td className="px-4 py-3">
                      {s.taxes.length ? (
                        <div className="flex flex-wrap gap-1">
                          {s.taxes.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.serviceStock && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
                            Stock
                          </span>
                        )}
                        {s.sac && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
                            SAC
                          </span>
                        )}
                        {s.hsn && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            HSN
                          </span>
                        )}
                        {s.productStock && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-700">
                            Prod
                          </span>
                        )}
                        {!s.serviceStock && !s.sac && !s.hsn && !s.productStock && (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openView(s)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setToDelete(s);
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
                ))
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
                  {isEditing ? "Edit Service" : "Create Service"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isEditing ? "Update service information" : "Add a new service to your catalog"}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Enter service name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => setField("quantity", parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.rate}
                    onChange={(e) => setField("rate", parseFloat(e.target.value) || 0)}
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

              {/* Taxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taxes</label>
                {taxes.length === 0 ? (
                  <p className="text-sm text-gray-400">No taxes available.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {taxes.map((t) => {
                      const active = form.taxes.includes(t.name);
                      return (
                        <button
                          key={t._id}
                          type="button"
                          onClick={() => toggleTax(t.name)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                            active
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {t.name} ({t.rate}%)
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Flags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Toggle
                    label="Service Stock"
                    value={form.serviceStock}
                    onChange={(v) => setField("serviceStock", v)}
                  />
                  <Toggle
                    label="Product Stock"
                    value={form.productStock}
                    onChange={(v) => setField("productStock", v)}
                  />
                  <Toggle label="SAC" value={form.sac} onChange={(v) => setField("sac", v)} />
                  <Toggle label="HSN" value={form.hsn} onChange={(v) => setField("hsn", v)} />
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
      {showView && viewService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Service Details</h2>
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
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{viewService.name}</h3>
                      <p className="text-xs text-gray-500">{viewService.description || "—"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Rate</p>
                      <p className="text-lg font-bold text-blue-600">{money(viewService.rate)}</p>
                      <p className="text-xs text-gray-500">per {viewService.unitType}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Unit</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{viewService.unitType}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Qty</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{viewService.quantity}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Currency</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{viewService.currency}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Taxes</p>
                    {viewService.taxes.length ? (
                      <div className="flex flex-wrap gap-1">
                        {viewService.taxes.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-900">—</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Options</p>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                      <span>Service Stock: <b>{viewService.serviceStock ? "Yes" : "No"}</b></span>
                      <span>· Product Stock: <b>{viewService.productStock ? "Yes" : "No"}</b></span>
                      <span>· SAC: <b>{viewService.sac ? "Yes" : "No"}</b></span>
                      <span>· HSN: <b>{viewService.hsn ? "Yes" : "No"}</b></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowView(false);
                  openEdit(viewService);
                }}
                disabled={viewLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Edit Service
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Service</h3>
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
