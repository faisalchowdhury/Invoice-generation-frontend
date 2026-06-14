/**
 * File: src/pages/goal/Contributions.tsx
 * Goal Contributions — list (optional goal filter), create/edit modal, delete.
 *
 * Endpoints (under /goal):
 *   GET    contributions?goal_id=&contribution_date=
 *   POST   contributions
 *   PUT    contributions/:id
 *   DELETE contributions/:id
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { api } from "../../lib/api/client";
import { ApiError } from "../../lib/api/ApiError";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Calendar,
  PiggyBank,
  Loader2,
} from "lucide-react";

interface Contribution {
  id: string;
  goalId: string;
  date: string;
  amount: number;
  type: string;
  notes: string;
}
interface ApiContribution {
  _id: string;
  goal_id?: string | { _id: string; goal_name?: string };
  contribution_date?: string;
  contribution_amount?: number;
  contribution_type?: string;
  notes?: string;
}
interface ApiGoal { _id: string; goal_name?: string }

const TYPES = ["manual", "automatic"];
const errMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.message ? err.message : fallback;
const refId = (v: any): string => (typeof v === "object" && v ? v._id : (v ?? ""));
const refGoalName = (v: any): string => (typeof v === "object" && v ? (v.goal_name ?? "") : "");
const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : "");
const money = (n: number) =>
  `$${(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const mapApi = (c: ApiContribution): Contribution => ({
  id: c._id,
  goalId: refId(c.goal_id),
  date: toDateInput(c.contribution_date),
  amount: c.contribution_amount ?? 0,
  type: (c.contribution_type ?? "manual").toLowerCase(),
  notes: c.notes ?? "",
});

export const Contributions: React.FC = () => {
  const navigate = useNavigate();

  const [goals, setGoals] = useState<ApiGoal[]>([]);
  const [goalNames, setGoalNames] = useState<Record<string, string>>({});
  const [selectedGoal, setSelectedGoal] = useState("");
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    goal_id: "",
    contribution_date: new Date().toISOString().split("T")[0],
    contribution_amount: 0,
    contribution_type: "manual",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState<Contribution | null>(null);
  const [deleting, setDeleting] = useState(false);

  const goalName = (id: string) => goalNames[id] || id || "—";

  const loadGoals = useCallback(async () => {
    try {
      const data = await api.get<ApiGoal[]>("/goal/goals", { params: { page: 1, limit: 1000 } });
      if (Array.isArray(data)) {
        setGoals(data);
        const m: Record<string, string> = {};
        data.forEach((g) => (m[g._id] = g.goal_name ?? ""));
        setGoalNames((prev) => ({ ...m, ...prev }));
      }
    } catch {
      /* degrade */
    }
  }, []);

  const load = useCallback(async (goalId: string) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<ApiContribution[]>("/goal/contributions", {
        params: goalId ? { goal_id: goalId } : {},
      });
      const mapped = Array.isArray(data) ? data.map(mapApi) : [];
      setContributions(mapped);
      const names: Record<string, string> = {};
      (Array.isArray(data) ? data : []).forEach((c) => {
        const nm = refGoalName(c.goal_id);
        if (nm) names[refId(c.goal_id)] = nm;
      });
      if (Object.keys(names).length) setGoalNames((prev) => ({ ...prev, ...names }));
    } catch (err) {
      const m = errMessage(err, "Couldn't load contributions.");
      setLoadError(m);
      showToast(m, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGoals(); }, [loadGoals]);
  useEffect(() => { load(selectedGoal); }, [selectedGoal, load]);

  const sorted = useMemo(() => [...contributions].sort((a, b) => b.date.localeCompare(a.date)), [contributions]);
  const total = useMemo(() => contributions.reduce((s, c) => s + c.amount, 0), [contributions]);

  const openCreate = () => {
    setForm({ goal_id: selectedGoal || "", contribution_date: new Date().toISOString().split("T")[0], contribution_amount: 0, contribution_type: "manual", notes: "" });
    setEditingId(null);
    setShowModal(true);
  };
  const openEdit = (c: Contribution) => {
    setForm({ goal_id: c.goalId, contribution_date: c.date, contribution_amount: c.amount, contribution_type: c.type, notes: c.notes });
    setEditingId(c.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingId && !form.goal_id) return showToast("Select a goal", "info");
    if (!form.contribution_amount || form.contribution_amount <= 0) return showToast("Enter a valid amount", "info");
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/goal/contributions/${editingId}`, {
          contribution_date: form.contribution_date,
          contribution_amount: form.contribution_amount,
          contribution_type: form.contribution_type,
          notes: form.notes,
        });
      } else {
        await api.post("/goal/contributions", {
          goal_id: form.goal_id,
          contribution_date: form.contribution_date,
          contribution_amount: form.contribution_amount,
          contribution_type: form.contribution_type,
          notes: form.notes,
        });
      }
      showToast(`Contribution ${editingId ? "updated" : "created"}!`, "success");
      setShowModal(false);
      await load(selectedGoal);
    } catch (err) {
      showToast(errMessage(err, "Couldn't save contribution."), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/goal/contributions/${toDelete.id}`);
      showToast("Contribution deleted!", "success");
      setShowDelete(false);
      setToDelete(null);
      await load(selectedGoal);
    } catch (err) {
      showToast(errMessage(err, "Couldn't delete contribution."), "error");
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
          <span>›</span><span className="text-gray-900 font-medium">Contributions</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Contributions</h2>
            <p className="text-sm text-gray-500 mt-0.5">Deposits towards your goals · total {money(total)}</p>
          </div>
          <button onClick={openCreate} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700" title="Add Contribution"><Plus className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Goal:</span>
          <select value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white min-w-[220px]">
            <option value="">All goals</option>
            {goals.map((g) => (<option key={g._id} value={g._id}>{g.goal_name}</option>))}
          </select>
          <button onClick={() => load(selectedGoal)} className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Refresh</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Goal</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Notes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-16"><div className="flex items-center justify-center gap-2 text-gray-500"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading…</span></div></td></tr>
              ) : loadError ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-red-600">{loadError}</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No contributions found.</td></tr>
              ) : (
                sorted.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{c.date}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><PiggyBank className="w-4 h-4 text-gray-400" /><span className="text-gray-900">{goalName(c.goalId)}</span></div></td>
                    <td className="px-4 py-3 text-right font-medium text-green-600">{money(c.amount)}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{c.type}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{c.notes || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setToDelete(c); setShowDelete(true); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? "Edit Contribution" : "Add Contribution"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal *</label>
                  <select className={inputCls} value={form.goal_id} onChange={(e) => setForm({ ...form, goal_id: e.target.value })}>
                    <option value="">Select goal</option>
                    {goals.map((g) => (<option key={g._id} value={g._id}>{g.goal_name}</option>))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="date" className={`${inputCls} pl-10`} value={form.contribution_date} onChange={(e) => setForm({ ...form, contribution_date: e.target.value })} /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label><input type="number" min={0} step="0.01" className={inputCls} value={form.contribution_amount} onChange={(e) => setForm({ ...form, contribution_amount: parseFloat(e.target.value) || 0 })} /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className={inputCls} value={form.contribution_type} onChange={(e) => setForm({ ...form, contribution_type: e.target.value })}>
                  {TYPES.map((t) => (<option key={t} value={t} className="capitalize">{t}</option>))}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea rows={2} className={inputCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} disabled={saving} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm disabled:opacity-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center gap-2 disabled:opacity-50">{saving && <Loader2 className="w-4 h-4 animate-spin" />}{editingId ? "Save Changes" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {showDelete && toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"><Trash2 className="w-8 h-8 text-red-600" /></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Contribution</h3>
              <p className="text-gray-500 mb-6">Delete this {money(toDelete.amount)} contribution? This action cannot be undone.</p>
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
