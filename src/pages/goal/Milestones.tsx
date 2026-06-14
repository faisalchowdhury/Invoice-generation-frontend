/**
 * File: src/pages/goal/Milestones.tsx
 * Goal Milestones — goal-scoped list, create/edit modal, delete.
 *
 * Endpoints (under /goal):
 *   GET    milestones?goal_id=&status=
 *   GET    milestones/:id
 *   POST   milestones
 *   PUT    milestones/:id
 *   DELETE milestones/:id
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
  Flag,
  Loader2,
} from "lucide-react";

interface Milestone {
  id: string;
  goalId: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  status: string;
}
interface ApiMilestone {
  _id: string;
  goal_id?: string | { _id: string };
  milestone_name?: string;
  target_amount?: number;
  target_date?: string;
  status?: string;
}
interface ApiGoal { _id: string; goal_name?: string }

const STATUSES = ["pending", "achieved", "overdue"];
const errMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.message ? err.message : fallback;
const refId = (v: any): string => (typeof v === "object" && v ? v._id : (v ?? ""));
const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : "");
const money = (n: number) =>
  `$${(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const mapApi = (m: ApiMilestone): Milestone => ({
  id: m._id,
  goalId: refId(m.goal_id),
  name: m.milestone_name ?? "",
  targetAmount: m.target_amount ?? 0,
  targetDate: toDateInput(m.target_date),
  status: (m.status ?? "pending").toLowerCase(),
});

const statusColor = (s: string) => {
  switch (s) {
    case "achieved": return "bg-green-100 text-green-700";
    case "overdue": return "bg-red-100 text-red-700";
    default: return "bg-yellow-100 text-yellow-700";
  }
};

export const Milestones: React.FC = () => {
  const navigate = useNavigate();

  const [goals, setGoals] = useState<ApiGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ milestone_name: "", target_amount: 0, target_date: "", status: "pending" });
  const [saving, setSaving] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState<Milestone | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadGoals = useCallback(async () => {
    try {
      const data = await api.get<ApiGoal[]>("/goal/goals", { params: { page: 1, limit: 1000 } });
      if (Array.isArray(data)) {
        setGoals(data);
        if (data[0]) setSelectedGoal(data[0]._id);
      }
    } catch {
      /* degrade */
    }
  }, []);

  const loadMilestones = useCallback(async (goalId: string) => {
    if (!goalId) { setMilestones([]); return; }
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<ApiMilestone[]>("/goal/milestones", { params: { goal_id: goalId } });
      setMilestones(Array.isArray(data) ? data.map(mapApi) : []);
    } catch (err) {
      const m = errMessage(err, "Couldn't load milestones.");
      setLoadError(m);
      showToast(m, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGoals(); }, [loadGoals]);
  useEffect(() => { if (selectedGoal) loadMilestones(selectedGoal); }, [selectedGoal, loadMilestones]);

  const sorted = useMemo(() => [...milestones].sort((a, b) => a.targetDate.localeCompare(b.targetDate)), [milestones]);

  const openCreate = () => {
    if (!selectedGoal) return showToast("Select a goal first", "info");
    setForm({ milestone_name: "", target_amount: 0, target_date: "", status: "pending" });
    setEditingId(null);
    setShowModal(true);
  };
  const openEdit = (m: Milestone) => {
    setForm({ milestone_name: m.name, target_amount: m.targetAmount, target_date: m.targetDate, status: m.status });
    setEditingId(m.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.milestone_name.trim()) return showToast("Please enter a milestone name", "info");
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/goal/milestones/${editingId}`, {
          milestone_name: form.milestone_name.trim(),
          target_amount: form.target_amount,
          target_date: form.target_date,
          status: form.status,
        });
      } else {
        await api.post("/goal/milestones", {
          goal_id: selectedGoal,
          milestone_name: form.milestone_name.trim(),
          target_amount: form.target_amount,
          target_date: form.target_date,
          status: form.status,
        });
      }
      showToast(`Milestone ${editingId ? "updated" : "created"}!`, "success");
      setShowModal(false);
      await loadMilestones(selectedGoal);
    } catch (err) {
      showToast(errMessage(err, "Couldn't save milestone."), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/goal/milestones/${toDelete.id}`);
      showToast("Milestone deleted!", "success");
      setShowDelete(false);
      setToDelete(null);
      await loadMilestones(selectedGoal);
    } catch (err) {
      showToast(errMessage(err, "Couldn't delete milestone."), "error");
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
          <span>›</span><span className="text-gray-900 font-medium">Milestones</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
            <p className="text-sm text-gray-500 mt-0.5">Checkpoints along a goal</p>
          </div>
          <button onClick={openCreate} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700" title="Create Milestone"><Plus className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Goal:</span>
          <select value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white min-w-[220px]">
            <option value="">Select goal</option>
            {goals.map((g) => (<option key={g._id} value={g._id}>{g.goal_name}</option>))}
          </select>
          <button onClick={() => loadMilestones(selectedGoal)} className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Refresh</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Milestone</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Target Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Target Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-16"><div className="flex items-center justify-center gap-2 text-gray-500"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading…</span></div></td></tr>
              ) : loadError ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-red-600">{loadError}</td></tr>
              ) : !selectedGoal ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">Select a goal to view its milestones.</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No milestones found.</td></tr>
              ) : (
                sorted.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Flag className="w-4 h-4 text-gray-400" /><span className="font-medium text-gray-900">{m.name}</span></div></td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{money(m.targetAmount)}</td>
                    <td className="px-4 py-3 text-gray-600">{m.targetDate || "—"}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(m.status)}`}>{m.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setToDelete(m); setShowDelete(true); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? "Edit Milestone" : "Create Milestone"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Milestone Name *</label><input className={inputCls} value={form.milestone_name} onChange={(e) => setForm({ ...form, milestone_name: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label><input type="number" min={0} step="0.01" className={inputCls} value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: parseFloat(e.target.value) || 0 })} /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="date" className={`${inputCls} pl-10`} value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => (<option key={s} value={s} className="capitalize">{s}</option>))}
                </select>
              </div>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Milestone</h3>
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
