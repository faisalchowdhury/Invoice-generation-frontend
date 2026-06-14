/**
 * File: src/pages/goal/Goals.tsx
 * Goals — list, create/edit modal, view, activate, delete.
 *
 * Endpoints (under /goal):
 *   GET    goals?page=&limit=
 *   GET    goals/:id
 *   POST   goals
 *   PUT    goals/:id
 *   POST   goals/activate/:id
 *   DELETE goals/:id
 *
 * category_id -> /goal/categories ; account_id -> /account/chart-of-accounts/all
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
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Target,
  Rocket,
  Loader2,
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  goalType: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
  priority: string;
  status: string;
  accountId: string;
  accountLabel: string;
  progress: number;
}
interface ApiCategoryRef { _id: string; category_name?: string }
interface ApiAccountRef { _id: string; account_code?: string; account_name?: string }
interface ApiGoal {
  _id: string;
  goal_name?: string;
  goal_description?: string;
  category_id?: string | ApiCategoryRef | null;
  goal_type?: string;
  target_amount?: number;
  current_amount?: number;
  start_date?: string;
  target_date?: string;
  priority?: string;
  status?: string;
  account_id?: string | ApiAccountRef | null;
  progress_percentage?: number;
}
interface Named { _id: string; category_name?: string; account_name?: string; account_code?: string }

const GOAL_TYPES = ["savings", "debt_reduction", "expense_reduction"];
const PRIORITIES = ["low", "medium", "high", "critical"];
const STATUSES = ["draft", "active", "paused", "completed", "cancelled"];

const errMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.message ? err.message : fallback;
const refId = (v: any): string => (typeof v === "object" && v ? v._id : (v ?? ""));
const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : "");
const money = (n: number) =>
  `$${(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
const pretty = (s: string) => s.replace(/_/g, " ");

const mapApi = (g: ApiGoal): Goal => {
  const target = g.target_amount ?? 0;
  const current = g.current_amount ?? 0;
  const cat = g.category_id;
  const acc = g.account_id;
  return {
    id: g._id,
    name: g.goal_name ?? "",
    description: g.goal_description ?? "",
    categoryId: refId(cat),
    categoryName: typeof cat === "object" && cat ? (cat.category_name ?? "") : "",
    goalType: g.goal_type ?? "",
    targetAmount: target,
    currentAmount: current,
    startDate: toDateInput(g.start_date),
    targetDate: toDateInput(g.target_date),
    priority: (g.priority ?? "medium").toLowerCase(),
    status: (g.status ?? "draft").toLowerCase(),
    accountId: refId(acc),
    accountLabel:
      typeof acc === "object" && acc
        ? [acc.account_code, acc.account_name].filter(Boolean).join(" · ")
        : "",
    progress: g.progress_percentage ?? (target > 0 ? Math.round((current / target) * 100) : 0),
  };
};

const emptyForm = {
  goal_name: "",
  goal_description: "",
  category_id: "",
  goal_type: "savings",
  target_amount: 0,
  start_date: new Date().toISOString().split("T")[0],
  target_date: "",
  priority: "high",
  account_id: "",
  status: "draft",
};

const statusColor = (s: string) => {
  switch (s) {
    case "active": return "bg-blue-100 text-blue-700";
    case "completed": return "bg-green-100 text-green-700";
    case "paused": return "bg-yellow-100 text-yellow-700";
    case "cancelled": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};
const priorityColor = (p: string) => {
  switch (p) {
    case "critical": return "bg-red-100 text-red-700";
    case "high": return "bg-orange-100 text-orange-700";
    case "medium": return "bg-blue-100 text-blue-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export const Goals: React.FC = () => {
  const navigate = useNavigate();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Named[]>([]);
  const [accounts, setAccounts] = useState<Named[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [showView, setShowView] = useState(false);
  const [viewGoal, setViewGoal] = useState<Goal | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState<Goal | null>(null);
  const [deleting, setDeleting] = useState(false);

  const goalCategory = (g: Goal) =>
    g.categoryName || categories.find((c) => c._id === g.categoryId)?.category_name || "—";

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<ApiGoal[]>("/goal/goals", { params: { page: 1, limit: 1000 } });
      setGoals(Array.isArray(data) ? data.map(mapApi) : []);
    } catch (err) {
      const m = errMessage(err, "Couldn't load goals.");
      setLoadError(m);
      showToast(m, "error");
    } finally {
      setLoading(false);
    }
  }, []);
  const loadOptions = useCallback(async () => {
    const [c, a] = await Promise.allSettled([
      api.get<Named[]>("/goal/categories", { params: { page: 1, limit: 1000 } }),
      api.get<Named[]>("/account/chart-of-accounts/all", { params: { page: 1, limit: 1000 } }),
    ]);
    if (c.status === "fulfilled" && Array.isArray(c.value)) setCategories(c.value);
    if (a.status === "fulfilled" && Array.isArray(a.value)) setAccounts(a.value);
  }, []);

  useEffect(() => { load(); loadOptions(); }, [load, loadOptions]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return goals;
    const q = searchQuery.toLowerCase();
    return goals.filter((g) => g.name.toLowerCase().includes(q) || goalCategory(g).toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals, searchQuery, categories]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const canActivate = (s: string) => s === "draft";

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (g: Goal) => {
    setForm({
      goal_name: g.name,
      goal_description: g.description,
      category_id: g.categoryId,
      goal_type: g.goalType || "savings",
      target_amount: g.targetAmount,
      start_date: g.startDate,
      target_date: g.targetDate,
      priority: g.priority || "high",
      account_id: g.accountId,
      status: g.status,
    });
    setEditingId(g.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.goal_name.trim()) return showToast("Please enter a goal name", "info");
    if (!form.category_id) return showToast("Please select a category", "info");
    if (!form.target_amount || form.target_amount <= 0) return showToast("Enter a valid target amount", "info");
    setSaving(true);
    try {
      const base = {
        goal_name: form.goal_name.trim(),
        goal_description: form.goal_description,
        category_id: form.category_id,
        goal_type: form.goal_type,
        target_amount: form.target_amount,
        start_date: form.start_date,
        target_date: form.target_date,
        priority: form.priority,
        account_id: form.account_id || undefined,
      };
      if (editingId) await api.put(`/goal/goals/${editingId}`, { ...base, status: form.status });
      else await api.post("/goal/goals", base);
      showToast(`Goal ${editingId ? "updated" : "created"}!`, "success");
      setShowModal(false);
      await load();
    } catch (err) {
      showToast(errMessage(err, "Couldn't save goal."), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (g: Goal) => {
    setProcessingId(g.id);
    try {
      await api.post(`/goal/goals/activate/${g.id}`);
      showToast("Goal activated!", "success");
      await load();
    } catch (err) {
      showToast(errMessage(err, "Couldn't activate goal."), "error");
    } finally {
      setProcessingId(null);
    }
  };

  const openView = async (g: Goal) => {
    setViewGoal(g);
    setShowView(true);
    setViewLoading(true);
    try {
      const data = await api.get<ApiGoal>(`/goal/goals/${g.id}`);
      if (data) setViewGoal(mapApi(data));
    } catch (err) {
      showToast(errMessage(err, "Couldn't load goal details."), "error");
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/goal/goals/${toDelete.id}`);
      showToast("Goal deleted!", "success");
      setShowDelete(false);
      setToDelete(null);
      await load();
    } catch (err) {
      showToast(errMessage(err, "Couldn't delete goal."), "error");
    } finally {
      setDeleting(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white";

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-gray-700">Dashboard</button>
          <span>›</span><span className="text-gray-900 font-medium">Goals</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Financial Goals</h2>
            <p className="text-sm text-gray-500 mt-0.5">Track savings and reduction targets</p>
          </div>
          <button onClick={openCreate} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700" title="Create Goal"><Plus className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by name or category..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <button onClick={() => load()} className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Refresh</button>
          </div>
          <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
            <option value={5}>5 per page</option><option value={10}>10 per page</option><option value={25}>25 per page</option><option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[960px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Goal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Target</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 w-40">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-16"><div className="flex items-center justify-center gap-2 text-gray-500"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading…</span></div></td></tr>
              ) : loadError ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-red-600">{loadError}</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">No goals found.</td></tr>
              ) : (
                paginated.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button onClick={() => openView(g)} className="flex items-center gap-2 text-left">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-blue-600 hover:underline">{g.name}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{goalCategory(g)}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{pretty(g.goalType) || "—"}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{money(g.targetAmount)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, g.progress))}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{Math.round(g.progress)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${priorityColor(g.priority)}`}>{g.priority}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(g.status)}`}>{g.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openView(g)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" title="View"><Eye className="w-4 h-4" /></button>
                        {canActivate(g.status) && (
                          <button onClick={() => handleActivate(g)} disabled={processingId === g.id} className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg disabled:opacity-50" title="Activate">{processingId === g.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}</button>
                        )}
                        <button onClick={() => openEdit(g)} className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setToDelete(g); setShowDelete(true); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} results</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /><span className="hidden sm:inline">Previous</span></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (<button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 text-sm rounded-md flex items-center justify-center ${currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>{page}</button>))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"><span className="hidden sm:inline">Next</span><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? "Edit Goal" : "Create Goal"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Goal Name *</label><input className={inputCls} value={form.goal_name} onChange={(e) => setForm({ ...form, goal_name: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={2} className={inputCls} value={form.goal_description} onChange={(e) => setForm({ ...form, goal_description: e.target.value })} /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select className={inputCls} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => (<option key={c._id} value={c._id}>{c.category_name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
                <select className={inputCls} value={form.goal_type} onChange={(e) => setForm({ ...form, goal_type: e.target.value })}>
                  {GOAL_TYPES.map((t) => (<option key={t} value={t} className="capitalize">{pretty(t)}</option>))}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Target Amount *</label><input type="number" min={0} step="0.01" className={inputCls} value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: parseFloat(e.target.value) || 0 })} /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className={inputCls} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITIES.map((p) => (<option key={p} value={p} className="capitalize">{p}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="date" className={`${inputCls} pl-10`} value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="date" className={`${inputCls} pl-10`} value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} /></div>
              </div>
              <div className={editingId ? "" : "sm:col-span-2"}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Linked Account</label>
                <select className={inputCls} value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })}>
                  <option value="">Select account</option>
                  {accounts.map((a) => (<option key={a._id} value={a._id}>{a.account_code} · {a.account_name}</option>))}
                </select>
              </div>
              {editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => (<option key={s} value={s} className="capitalize">{s}</option>))}
                  </select>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} disabled={saving} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm disabled:opacity-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center gap-2 disabled:opacity-50">{saving && <Loader2 className="w-4 h-4 animate-spin" />}{editingId ? "Save Changes" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {showView && viewGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{viewGoal.name}</h2>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(viewGoal.status)}`}>{viewGoal.status}</span>
              </div>
              <button onClick={() => setShowView(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6">
              {viewLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-gray-500"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading…</span></div>
              ) : (
                <div className="space-y-5">
                  <p className="text-sm text-gray-600">{viewGoal.description || "—"}</p>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{money(viewGoal.currentAmount)} / {money(viewGoal.targetAmount)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, viewGoal.progress))}%` }} /></div>
                    <div className="text-right text-xs text-gray-500 mt-1">{Math.round(viewGoal.progress)}%</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-xs text-gray-500">Category</p><p className="text-gray-900">{goalCategory(viewGoal)}</p></div>
                    <div><p className="text-xs text-gray-500">Type</p><p className="text-gray-900 capitalize">{pretty(viewGoal.goalType) || "—"}</p></div>
                    <div><p className="text-xs text-gray-500">Priority</p><p className="text-gray-900 capitalize">{viewGoal.priority}</p></div>
                    <div><p className="text-xs text-gray-500">Linked Account</p><p className="text-gray-900">{viewGoal.accountLabel || accounts.find((a) => a._id === viewGoal.accountId)?.account_name || "—"}</p></div>
                    <div><p className="text-xs text-gray-500">Target Date</p><p className="text-gray-900">{viewGoal.targetDate || "—"}</p></div>
                    <div><p className="text-xs text-gray-500">Start Date</p><p className="text-gray-900">{viewGoal.startDate || "—"}</p></div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              {!viewLoading && canActivate(viewGoal.status) && (
                <button onClick={() => { setShowView(false); handleActivate(viewGoal); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center justify-center gap-2"><Rocket className="w-4 h-4" />Activate</button>
              )}
              <button onClick={() => { setShowView(false); openEdit(viewGoal); }} disabled={viewLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Edit</button>
              <button onClick={() => setShowView(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {showDelete && toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"><Trash2 className="w-8 h-8 text-red-600" /></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Goal</h3>
              <p className="text-gray-500 mb-6">Delete <span className="font-semibold">{toDelete.name}</span>? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 inline-flex items-center justify-center gap-2 disabled:opacity-50">{deleting && <Loader2 className="w-4 h-4 animate-spin" />}{deleting ? "Deleting…" : "Delete"}</button>
                <button onClick={() => setShowDelete(false)} disabled={deleting} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
